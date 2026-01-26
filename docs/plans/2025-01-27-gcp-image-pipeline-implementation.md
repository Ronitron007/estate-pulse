# GCP Image Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Cloudinary with GCP Cloud Storage + Cloud Functions + Cloud CDN for image handling.

**Architecture:** Images upload to GCS, trigger Cloud Function to generate 3 variants (thumbnail, card, hero), serve via Cloud CDN. One-time migration moves existing Cloudinary images to GCS.

**Tech Stack:** GCP Cloud Functions (Node.js 20, Sharp), Cloud Storage, Cloud CDN, Supabase (PostgreSQL), Next.js 14

---

## Task 1: Create Image URL Helper

**Files:**
- Create: `src/lib/image-urls.ts`
- Delete: `src/lib/cloudinary.ts` (after all references updated)

**Step 1: Create the new image URL helper**

Create `src/lib/image-urls.ts`:

```typescript
const CDN_URL =
  process.env.NEXT_PUBLIC_CDN_URL ||
  `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCP_BUCKET_NAME}`;

export type ImageVariant = "original" | "thumbnail" | "card" | "hero";

/**
 * Get URL for an image variant.
 * @param basePath - Base path without variant suffix (e.g., "properties/godrej-avenue/img-abc123")
 * @param variant - Image variant: original, thumbnail (300x225), card (600x450), hero (1600x800)
 */
export function getImageUrl(
  basePath: string,
  variant: ImageVariant = "card"
): string {
  if (!basePath) return "";
  const ext = variant === "original" ? "jpg" : "webp";
  return `${CDN_URL}/${basePath}-${variant}.${ext}`;
}

/**
 * Get the base path from a full image path.
 * Strips variant suffix if present.
 */
export function getBasePath(fullPath: string): string {
  return fullPath.replace(/-(original|thumbnail|card|hero)\.(jpg|jpeg|png|webp)$/i, "");
}
```

**Step 2: Verify file created**

Run: `cat src/lib/image-urls.ts`
Expected: File contents shown

**Step 3: Commit**

```bash
git add src/lib/image-urls.ts
git commit -m "feat: add GCS image URL helper"
```

---

## Task 2: DB Migration - Rename Column

**Files:**
- Create: `supabase/migrations/00005_rename_cloudinary_to_image_path.sql`
- Modify: `src/types/database.ts:62-66`

**Step 1: Create migration file**

Create `supabase/migrations/00005_rename_cloudinary_to_image_path.sql`:

```sql
-- Rename cloudinary_public_id to image_path in project_images table
ALTER TABLE project_images
RENAME COLUMN cloudinary_public_id TO image_path;

-- Add comment explaining the field
COMMENT ON COLUMN project_images.image_path IS 'Base path in GCS bucket (e.g., properties/slug/img-uuid). Variants derived by appending -thumbnail, -card, -hero.';
```

**Step 2: Update TypeScript types**

Modify `src/types/database.ts`, change line 65:

```typescript
// Before:
cloudinary_public_id: string;

// After:
image_path: string;
```

**Step 3: Run migration locally**

Run: `npx supabase db push`
Expected: Migration applied successfully

**Step 4: Commit**

```bash
git add supabase/migrations/00005_rename_cloudinary_to_image_path.sql src/types/database.ts
git commit -m "chore(db): rename cloudinary_public_id to image_path"
```

---

## Task 3: Update Upload API

**Files:**
- Modify: `src/app/api/upload/route.ts`
- Modify: `src/lib/gcp-storage.ts`

**Step 1: Update gcp-storage.ts to accept slug**

Modify `src/lib/gcp-storage.ts`:

```typescript
import { Storage, Bucket } from "@google-cloud/storage";
import { randomUUID } from "crypto";

let _storage: Storage | null = null;
let _bucket: Bucket | null = null;

function getBucket(): Bucket {
  if (!_bucket) {
    if (!process.env.GCP_BUCKET_NAME) {
      throw new Error("GCP_BUCKET_NAME environment variable is required");
    }
    _storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
    });
    _bucket = _storage.bucket(process.env.GCP_BUCKET_NAME);
  }
  return _bucket;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  fileName: string;
  basePath: string;
}

export async function generatePresignedUploadUrl(
  originalFileName: string,
  contentType: string,
  slug: string
): Promise<PresignedUrlResponse> {
  const ext = originalFileName.split(".").pop() || "jpg";
  const uuid = randomUUID().slice(0, 8);
  const basePath = `properties/${slug}/img-${uuid}`;
  const fileName = `${basePath}-original.${ext}`;

  const file = getBucket().file(fileName);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;

  return { uploadUrl, publicUrl, fileName, basePath };
}

export function getPublicUrl(fileName: string): string {
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;
}
```

**Step 2: Update upload API route**

Modify `src/app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/queries/admin";
import { generatePresignedUploadUrl } from "@/lib/gcp-storage";

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role === "viewer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, contentType, slug } = await request.json();

  if (!fileName || !contentType) {
    return NextResponse.json({ error: "Missing fileName or contentType" }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
  }

  try {
    const result = await generatePresignedUploadUrl(fileName, contentType, slug);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
```

**Step 3: Commit**

```bash
git add src/lib/gcp-storage.ts src/app/api/upload/route.ts
git commit -m "feat(api): update upload to use slug-based paths"
```

---

## Task 4: Update ImageUploader Component

**Files:**
- Modify: `src/app/admin/properties/_components/ImageUploader.tsx`

**Step 1: Update ImageUploader to accept and use slug**

Modify `src/app/admin/properties/_components/ImageUploader.tsx`:

```typescript
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/lib/image-urls";
import type { ProjectImage, ImageType } from "@/types/database";

interface ImageUploaderProps {
  projectId?: string;
  slug: string;
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
}

interface PendingUpload {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

export function ImageUploader({ projectId, slug, images, onChange }: ImageUploaderProps) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File): Promise<ProjectImage | null> => {
    const id = Math.random().toString(36).slice(2);
    const preview = URL.createObjectURL(file);

    setPending((p) => [...p, { id, file, preview, progress: 0 }]);

    try {
      // Get presigned URL with slug
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, slug }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");

      const { uploadUrl, basePath } = await res.json();

      // Upload to GCP
      setPending((p) => p.map((u) => (u.id === id ? { ...u, progress: 50 } : u)));

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      setPending((p) => p.filter((u) => u.id !== id));
      URL.revokeObjectURL(preview);

      return {
        id: `temp-${id}`,
        project_id: projectId || "",
        image_path: basePath,
        width: null,
        height: null,
        image_type: "exterior" as ImageType,
        alt_text: null,
        sort_order: images.length,
        is_primary: images.length === 0,
      };
    } catch (error) {
      setPending((p) => p.map((u) => (u.id === id ? { ...u, error: "Upload failed" } : u)));
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const newImages: ProjectImage[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const img = await uploadFile(file);
      if (img) newImages.push(img);
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
  }, [images, onChange, slug]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    if (newImages.length > 0 && !newImages.some((i) => i.is_primary)) {
      newImages[0].is_primary = true;
    }
    onChange(newImages);
  };

  const setPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(newImages);
  };

  const updateImageType = (index: number, imageType: ImageType) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], image_type: imageType };
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="text-muted-foreground">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Drop images here or click to upload</p>
            <p className="text-sm">PNG, JPG up to 10MB</p>
          </div>
        </label>
      </div>

      {/* Pending uploads */}
      {pending.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pending.map((p) => (
            <div key={p.id} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <img src={p.preview} alt="" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                {p.error ? (
                  <span className="text-sm text-red-500">{p.error}</span>
                ) : (
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <Card key={img.id} className={`relative overflow-hidden ${img.is_primary ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-0">
                <div className="aspect-[4/3] relative">
                  <img
                    src={getImageUrl(img.image_path, "thumbnail")}
                    alt={img.alt_text || ""}
                    className="w-full h-full object-cover"
                  />
                  {img.is_primary && (
                    <span className="absolute top-1 left-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
                <div className="p-2 space-y-2">
                  <select
                    value={img.image_type || "exterior"}
                    onChange={(e) => updateImageType(i, e.target.value as ImageType)}
                    className="w-full text-xs p-1 border rounded bg-background"
                  >
                    <option value="exterior">Exterior</option>
                    <option value="interior">Interior</option>
                    <option value="amenity">Amenity</option>
                    <option value="floor_plan">Floor Plan</option>
                    <option value="location">Location</option>
                  </select>
                  <div className="flex gap-1">
                    {!img.is_primary && (
                      <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => setPrimary(i)}>
                        Set Primary
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-xs h-7 text-red-500" onClick={() => removeImage(i)}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Update parent forms to pass slug prop**

Find and update all usages of ImageUploader to pass slug. Check property form files.

**Step 3: Commit**

```bash
git add src/app/admin/properties/_components/ImageUploader.tsx
git commit -m "feat(admin): update ImageUploader to use slug-based paths"
```

---

## Task 5: Update PropertyCard Component

**Files:**
- Modify: `src/components/property/PropertyCard.tsx`

**Step 1: Update to use getImageUrl**

In `src/components/property/PropertyCard.tsx`, update the import and image URL:

```typescript
// Add import at top:
import { getImageUrl } from "@/lib/image-urls";

// Change line 77 from:
src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_600,h_450,c_fill,f_auto,q_auto/${primaryImage.cloudinary_public_id}`}

// To:
src={getImageUrl(primaryImage.image_path, "card")}
```

**Step 2: Commit**

```bash
git add src/components/property/PropertyCard.tsx
git commit -m "feat: update PropertyCard to use GCS images"
```

---

## Task 6: Update PropertyGallery Component

**Files:**
- Modify: `src/components/property/PropertyGallery.tsx`

**Step 1: Update to use getImageUrl**

Replace `src/components/property/PropertyGallery.tsx`:

```typescript
"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/image-urls";
import type { ProjectImage } from "@/types/database";

interface PropertyGalleryProps {
  images: ProjectImage[];
  projectName: string;
}

export function PropertyGallery({ images, projectName }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
          >
            <img
              src={getImageUrl(image.image_path, "thumbnail")}
              alt={image.alt_text || `${projectName} image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {images.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          <div className="max-w-4xl max-h-[80vh] px-16">
            <img
              src={getImageUrl(images[currentIndex].image_path, "hero")}
              alt={images[currentIndex].alt_text || `${projectName} image ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>

          {images.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={goToNext}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/property/PropertyGallery.tsx
git commit -m "feat: update PropertyGallery to use GCS images"
```

---

## Task 7: Update Property Detail Page

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`

**Step 1: Update imports and image URLs**

Add import:
```typescript
import { getImageUrl } from "@/lib/image-urls";
```

Update hero image (line 65):
```typescript
// From:
src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1600,h_800,c_fill,f_auto,q_auto/${primaryImage.cloudinary_public_id}`}

// To:
src={getImageUrl(primaryImage.image_path, "hero")}
```

Update gallery images (line 229):
```typescript
// From:
src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_300,h_300,c_fill,f_auto,q_auto/${image.cloudinary_public_id}`}

// To:
src={getImageUrl(image.image_path, "thumbnail")}
```

**Step 2: Commit**

```bash
git add src/app/(main)/properties/[slug]/page.tsx
git commit -m "feat: update property detail page to use GCS images"
```

---

## Task 8: Update Queries (rename field references)

**Files:**
- Modify: `src/lib/queries/projects.ts`
- Modify: `src/app/admin/properties/actions.ts`

**Step 1: Update projects.ts**

Search for `cloudinary_public_id` and replace with `image_path` in select queries.

**Step 2: Update actions.ts**

Search for `cloudinary_public_id` and replace with `image_path` in insert/update operations.

**Step 3: Commit**

```bash
git add src/lib/queries/projects.ts src/app/admin/properties/actions.ts
git commit -m "refactor: update queries to use image_path field"
```

---

## Task 9: Create Cloud Function for Image Resizing

**Files:**
- Create: `cloud-functions/image-resizer/index.js`
- Create: `cloud-functions/image-resizer/package.json`

**Step 1: Create package.json**

Create `cloud-functions/image-resizer/package.json`:

```json
{
  "name": "image-resizer",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "@google-cloud/functions-framework": "^3.3.0",
    "@google-cloud/storage": "^7.7.0",
    "sharp": "^0.33.2"
  }
}
```

**Step 2: Create index.js**

Create `cloud-functions/image-resizer/index.js`:

```javascript
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

const storage = new Storage();

const VARIANTS = [
  { name: "thumbnail", width: 300, height: 225, quality: 80 },
  { name: "card", width: 600, height: 450, quality: 85 },
  { name: "hero", width: 1600, height: 800, quality: 85 },
];

exports.resizeImage = async (event, context) => {
  const file = event;
  const bucketName = file.bucket;
  const filePath = file.name;

  // Only process original images in properties folder
  if (!filePath.match(/^properties\/[^/]+\/img-[^/]+-original\.(jpg|jpeg|png|webp)$/i)) {
    console.log(`Skipping non-original file: ${filePath}`);
    return;
  }

  console.log(`Processing: ${filePath}`);

  const bucket = storage.bucket(bucketName);
  const basePath = filePath.replace(/-original\.(jpg|jpeg|png|webp)$/i, "");
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));

  try {
    // Download original
    await bucket.file(filePath).download({ destination: tempFilePath });
    console.log(`Downloaded to ${tempFilePath}`);

    // Generate variants
    for (const variant of VARIANTS) {
      const variantPath = `${basePath}-${variant.name}.webp`;
      const tempVariantPath = path.join(os.tmpdir(), `${variant.name}.webp`);

      await sharp(tempFilePath)
        .resize(variant.width, variant.height, { fit: "cover" })
        .webp({ quality: variant.quality })
        .toFile(tempVariantPath);

      await bucket.upload(tempVariantPath, {
        destination: variantPath,
        metadata: {
          contentType: "image/webp",
          cacheControl: "public, max-age=86400",
        },
      });

      console.log(`Created variant: ${variantPath}`);
      fs.unlinkSync(tempVariantPath);
    }

    // Cleanup
    fs.unlinkSync(tempFilePath);
    console.log(`Completed processing: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    throw error;
  }
};
```

**Step 3: Commit**

```bash
git add cloud-functions/
git commit -m "feat: add Cloud Function for image resizing"
```

---

## Task 10: Create Migration Script

**Files:**
- Create: `scripts/migrate-cloudinary-to-gcs.ts`

**Step 1: Create migration script**

Create `scripts/migrate-cloudinary-to-gcs.ts`:

```typescript
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
```

**Step 2: Commit**

```bash
git add scripts/migrate-cloudinary-to-gcs.ts
git commit -m "feat: add Cloudinary to GCS migration script"
```

---

## Task 11: Update .env.example

**Files:**
- Modify: `.env.example`

**Step 1: Update environment variables**

Remove Cloudinary vars, ensure GCP/CDN vars present:

```bash
# Remove these:
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=

# Keep/add these:
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=your-bucket-name
NEXT_PUBLIC_GCP_BUCKET_NAME=your-bucket-name
GCP_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: update env vars for GCS migration"
```

---

## Task 12: Delete Cloudinary Library

**Files:**
- Delete: `src/lib/cloudinary.ts`

**Step 1: Verify no remaining references**

Run: `grep -r "cloudinary" src/`
Expected: No matches (or only comments)

**Step 2: Delete file**

```bash
rm src/lib/cloudinary.ts
git add -A
git commit -m "chore: remove cloudinary library"
```

---

## Task 13: Deploy Cloud Function

**Manual steps (documented for reference):**

```bash
cd cloud-functions/image-resizer
npm install

gcloud functions deploy image-resizer \
  --runtime nodejs20 \
  --trigger-resource YOUR_BUCKET_NAME \
  --trigger-event google.storage.object.finalize \
  --entry-point resizeImage \
  --memory 512MB \
  --timeout 120s \
  --region us-central1
```

---

## Task 14: Setup Cloud CDN

**Manual steps (documented for reference):**

```bash
# Create backend bucket
gcloud compute backend-buckets create estate-pulse-images \
  --gcs-bucket-name=YOUR_BUCKET_NAME \
  --enable-cdn

# Create URL map
gcloud compute url-maps create estate-pulse-cdn \
  --default-backend-bucket=estate-pulse-images

# Create HTTPS proxy (requires SSL cert)
gcloud compute target-https-proxies create estate-pulse-https-proxy \
  --url-map=estate-pulse-cdn \
  --ssl-certificates=YOUR_SSL_CERT

# Create forwarding rule
gcloud compute forwarding-rules create estate-pulse-cdn-rule \
  --target-https-proxy=estate-pulse-https-proxy \
  --ports=443 \
  --global
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Create image URL helper |
| 2 | DB migration - rename column |
| 3 | Update upload API |
| 4 | Update ImageUploader component |
| 5 | Update PropertyCard component |
| 6 | Update PropertyGallery component |
| 7 | Update property detail page |
| 8 | Update queries (field references) |
| 9 | Create Cloud Function |
| 10 | Create migration script |
| 11 | Update .env.example |
| 12 | Delete cloudinary library |
| 13 | Deploy Cloud Function (manual) |
| 14 | Setup Cloud CDN (manual) |
