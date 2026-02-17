import { Storage } from "@google-cloud/storage";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

// Config
const GCP_BUCKET = process.env.GCP_BUCKET_NAME || "property-listings-aglaghar";
const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const SUPABASE_URL = "https://mhtisovrdrzdorgppuuh.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const LOCAL_IMAGES_DIR = path.join(__dirname, "seed-images/tricity");

// Init clients
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: process.env.GCP_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY)
    : undefined,
});
const bucket = storage.bucket(GCP_BUCKET);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface ImageRecord {
  id: string;
  image_path: string;
  projects: { slug: string } | null;
}

async function uploadLocalFile(localPath: string, gcsPath: string): Promise<void> {
  await bucket.upload(localPath, {
    destination: gcsPath,
    metadata: {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=86400",
    },
  });
  console.log(`  Uploaded: ${gcsPath}`);
}

async function downloadFromUrl(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function uploadBuffer(buffer: Buffer, gcsPath: string): Promise<void> {
  const file = bucket.file(gcsPath);
  await file.save(buffer, {
    metadata: {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=86400",
    },
  });
  console.log(`  Uploaded: ${gcsPath}`);
}

async function migrateLocalImages(): Promise<void> {
  console.log("\n=== Migrating Local Images ===\n");

  // Get all local image files
  const propertyDirs = fs.readdirSync(LOCAL_IMAGES_DIR);

  for (const slug of propertyDirs) {
    const dirPath = path.join(LOCAL_IMAGES_DIR, slug);
    if (!fs.statSync(dirPath).isDirectory()) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".jpg"));
    console.log(`\n${slug}: ${files.length} images`);

    for (const file of files) {
      const localPath = path.join(dirPath, file);
      // File format: img-a1b2c3d4-original.jpg -> properties/slug/img-a1b2c3d4-original.jpg
      const gcsPath = `properties/${slug}/${file}`;

      try {
        await uploadLocalFile(localPath, gcsPath);
      } catch (err) {
        console.error(`  Failed: ${file}`, err);
      }
    }
  }
}

async function migrateCloudinaryImages(): Promise<void> {
  console.log("\n=== Migrating Cloudinary Images ===\n");

  // Fetch images still using cloudinary format
  const { data: images, error } = await supabase
    .from("project_images")
    .select("id, image_path, projects(slug)")
    .not("image_path", "like", "properties/%")
    .order("id");

  if (error) {
    console.error("Error fetching images:", error);
    return;
  }

  console.log(`Found ${images?.length || 0} Cloudinary images to migrate\n`);

  for (const img of (images as unknown as ImageRecord[]) || []) {
    const slug = img.projects?.slug;
    if (!slug) {
      console.log(`Skipping ${img.id}: no slug`);
      continue;
    }

    console.log(`\n${slug} | ${img.image_path}`);

    // Try Cloudinary first
    const cloudinaryUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${img.image_path}`;
    let buffer = await downloadFromUrl(cloudinaryUrl);

    if (!buffer) {
      console.log("  Cloudinary failed, trying web search...");
      // Try to find image via web search (placeholder - would need actual scraping)
      // For now, skip these
      console.log("  Skipping - no source available");
      continue;
    }

    // Upload to GCS
    const uuid = randomUUID().slice(0, 8);
    const newBasePath = `properties/${slug}/img-${uuid}`;
    const gcsPath = `${newBasePath}-original.jpg`;

    try {
      await uploadBuffer(buffer, gcsPath);

      // Update DB
      const { error: updateErr } = await supabase
        .from("project_images")
        .update({ image_path: newBasePath })
        .eq("id", img.id);

      if (updateErr) {
        console.error(`  DB update failed:`, updateErr);
      } else {
        console.log(`  DB updated: ${img.image_path} -> ${newBasePath}`);
      }
    } catch (err) {
      console.error(`  Upload failed:`, err);
    }
  }
}

async function main() {
  console.log("Starting image migration to GCS...");
  console.log(`Bucket: ${GCP_BUCKET}`);

  // Step 1: Upload local images
  await migrateLocalImages();

  // Step 2: Migrate Cloudinary images
  await migrateCloudinaryImages();

  console.log("\n=== Migration Complete ===");
}

main().catch(console.error);
