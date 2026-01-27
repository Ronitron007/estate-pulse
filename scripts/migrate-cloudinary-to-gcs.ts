import { createClient } from "@supabase/supabase-js";
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
});
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

const CLOUDINARY_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadToGCS(buffer: Buffer, path: string, contentType: string): Promise<void> {
  const file = bucket.file(path);
  await file.save(buffer, {
    metadata: { contentType, cacheControl: "public, max-age=86400" },
  });
}

async function migrateImages() {
  console.log("Fetching images from database...");

  const { data: images, error } = await supabase
    .from("project_images")
    .select("id, image_path, projects(slug)")
    .order("id");

  if (error) {
    console.error("Error fetching images:", error);
    return;
  }

  console.log(`Found ${images?.length || 0} images to migrate`);

  for (const img of images || []) {
    const oldPath = img.image_path;
    const slug = (img.projects as any)?.slug;

    if (!slug) {
      console.log(`Skipping ${img.id}: no slug found`);
      continue;
    }

    // Skip if already migrated (has properties/ prefix)
    if (oldPath.startsWith("properties/")) {
      console.log(`Skipping ${img.id}: already migrated`);
      continue;
    }

    try {
      // Download from Cloudinary
      const cloudinaryUrl = `${CLOUDINARY_BASE}/${oldPath}`;
      console.log(`Downloading: ${cloudinaryUrl}`);
      const buffer = await downloadImage(cloudinaryUrl);

      // Upload to GCS
      const uuid = randomUUID().slice(0, 8);
      const ext = oldPath.split(".").pop() || "jpg";
      const newBasePath = `properties/${slug}/img-${uuid}`;
      const newPath = `${newBasePath}-original.${ext}`;

      console.log(`Uploading to: ${newPath}`);
      await uploadToGCS(buffer, newPath, `image/${ext === "jpg" ? "jpeg" : ext}`);

      // Update database
      const { error: updateError } = await supabase
        .from("project_images")
        .update({ image_path: newBasePath })
        .eq("id", img.id);

      if (updateError) {
        console.error(`Failed to update ${img.id}:`, updateError);
      } else {
        console.log(`Migrated ${img.id}: ${oldPath} -> ${newBasePath}`);
      }
    } catch (err) {
      console.error(`Error migrating ${img.id}:`, err);
    }
  }

  console.log("Migration complete!");
}

migrateImages();
