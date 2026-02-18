# Admin CRUD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add create/edit/delete operations for properties in admin panel, with GCP image upload, configurations editing, and amenities selection

**Architecture:** Server actions for mutations, React Hook Form + Zod for validation, GCP presigned URLs for direct client uploads. Edit page at `/admin/properties/[id]`, create at `/admin/properties/new`.

**Tech Stack:** Next.js 16 Server Actions, React Hook Form, Zod, Supabase, GCP Cloud Storage

---

## Task 1: Add Property Query Functions

**Files:**
- Modify: `src/lib/queries/admin.ts`

**Step 1: Add getProjectById function**

```typescript
// Add after getAdminProjects function (~line 133)

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      builder:builders(id, name),
      configurations(*),
      images:project_images(*),
      amenities:project_amenities(amenity:amenities(*))
    `)
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return {
    ...data,
    amenities: data.amenities?.map((pa: { amenity: unknown }) => pa.amenity) || [],
  } as Project;
}
```

**Step 2: Add getAllBuilders function**

```typescript
export async function getAllBuilders(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("builders")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error fetching builders:", error);
    return [];
  }

  return data || [];
}
```

**Step 3: Add getAllAmenities function**

```typescript
export async function getAllAmenities(): Promise<{ id: string; name: string; category: string | null }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("amenities")
    .select("id, name, category")
    .order("category")
    .order("name");

  if (error) {
    console.error("Error fetching amenities:", error);
    return [];
  }

  return data || [];
}
```

**Step 4: Commit**

```bash
git add src/lib/queries/admin.ts
git commit -m "feat(admin): add getProjectById, getAllBuilders, getAllAmenities queries"
```

---

## Task 2: Setup GCP Storage Presigned URL Generation

**Files:**
- Create: `src/lib/gcp-storage.ts`
- Create: `src/app/api/upload/route.ts`

**Step 1: Install GCP SDK**

```bash
npm install @google-cloud/storage
```

**Step 2: Create GCP storage utility**

```typescript
// src/lib/gcp-storage.ts
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  fileName: string;
}

export async function generatePresignedUploadUrl(
  originalFileName: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const ext = originalFileName.split(".").pop() || "jpg";
  const fileName = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const file = bucket.file(fileName);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;

  return { uploadUrl, publicUrl, fileName };
}

export function getPublicUrl(fileName: string): string {
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;
}
```

**Step 3: Create upload API route**

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/queries/admin";
import { generatePresignedUploadUrl } from "@/lib/gcp-storage";

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role === "viewer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, contentType } = await request.json();

  if (!fileName || !contentType) {
    return NextResponse.json({ error: "Missing fileName or contentType" }, { status: 400 });
  }

  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
  }

  try {
    const result = await generatePresignedUploadUrl(fileName, contentType);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
```

**Step 4: Add env vars to .env.local**

```
GCP_PROJECT_ID=your-project-id
GCP_BUCKET_NAME=estate-pulse-images
GCP_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

**Step 5: Commit**

```bash
git add src/lib/gcp-storage.ts src/app/api/upload/route.ts
git commit -m "feat(admin): add GCP presigned URL upload infrastructure"
```

---

## Task 3: Create Image Upload Component

**Files:**
- Create: `src/app/admin/properties/_components/ImageUploader.tsx`

**Step 1: Create uploader component**

```tsx
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProjectImage, ImageType } from "@/types/database";

interface ImageUploaderProps {
  projectId?: string;
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

export function ImageUploader({ projectId, images, onChange }: ImageUploaderProps) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File): Promise<ProjectImage | null> => {
    const id = Math.random().toString(36).slice(2);
    const preview = URL.createObjectURL(file);

    setPending((p) => [...p, { id, file, preview, progress: 0 }]);

    try {
      // Get presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");

      const { uploadUrl, publicUrl, fileName } = await res.json();

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
        cloudinary_public_id: fileName, // Storing GCP path in this field
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
  }, [images, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    // Reassign primary if needed
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
                    src={`https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCP_BUCKET_NAME}/${img.cloudinary_public_id}`}
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

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/ImageUploader.tsx
git commit -m "feat(admin): add ImageUploader component with GCP presigned upload"
```

---

## Task 4: Create Configurations Editor Component

**Files:**
- Create: `src/app/admin/properties/_components/ConfigurationsEditor.tsx`

**Step 1: Create editor component**

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Configuration } from "@/types/database";

interface ConfigurationsEditorProps {
  configurations: Partial<Configuration>[];
  onChange: (configs: Partial<Configuration>[]) => void;
}

export function ConfigurationsEditor({ configurations, onChange }: ConfigurationsEditorProps) {
  const addConfig = () => {
    onChange([
      ...configurations,
      {
        id: `temp-${Date.now()}`,
        bedrooms: null,
        bathrooms: null,
        config_name: "",
        carpet_area_sqft: null,
        built_up_area_sqft: null,
        price: null,
      },
    ]);
  };

  const updateConfig = (index: number, field: keyof Configuration, value: any) => {
    const newConfigs = [...configurations];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    onChange(newConfigs);
  };

  const removeConfig = (index: number) => {
    const newConfigs = [...configurations];
    newConfigs.splice(index, 1);
    onChange(newConfigs);
  };

  return (
    <div className="space-y-4">
      {configurations.map((config, i) => (
        <div key={config.id || i} className="p-4 border rounded-lg space-y-4 relative">
          <button
            type="button"
            onClick={() => removeConfig(i)}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Config Name</Label>
              <Input
                value={config.config_name || ""}
                onChange={(e) => updateConfig(i, "config_name", e.target.value)}
                placeholder="e.g., 2 BHK Compact"
              />
            </div>

            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Input
                type="number"
                value={config.bedrooms ?? ""}
                onChange={(e) => updateConfig(i, "bedrooms", e.target.value ? Number(e.target.value) : null)}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input
                type="number"
                value={config.bathrooms ?? ""}
                onChange={(e) => updateConfig(i, "bathrooms", e.target.value ? Number(e.target.value) : null)}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label>Carpet Area (sqft)</Label>
              <Input
                type="number"
                value={config.carpet_area_sqft ?? ""}
                onChange={(e) => updateConfig(i, "carpet_area_sqft", e.target.value ? Number(e.target.value) : null)}
                placeholder="850"
              />
            </div>

            <div className="space-y-2">
              <Label>Built-up Area (sqft)</Label>
              <Input
                type="number"
                value={config.built_up_area_sqft ?? ""}
                onChange={(e) => updateConfig(i, "built_up_area_sqft", e.target.value ? Number(e.target.value) : null)}
                placeholder="1100"
              />
            </div>

            <div className="space-y-2">
              <Label>Price (INR)</Label>
              <Input
                type="number"
                value={config.price ?? ""}
                onChange={(e) => updateConfig(i, "price", e.target.value ? Number(e.target.value) : null)}
                placeholder="5500000"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addConfig}>
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Configuration
      </Button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/ConfigurationsEditor.tsx
git commit -m "feat(admin): add ConfigurationsEditor component"
```

---

## Task 5: Create Amenities Selector Component

**Files:**
- Create: `src/app/admin/properties/_components/AmenitiesSelector.tsx`

**Step 1: Create selector component**

```tsx
"use client";

import { useMemo } from "react";
import type { Amenity } from "@/types/database";

interface AmenitiesSelectorProps {
  allAmenities: { id: string; name: string; category: string | null }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function AmenitiesSelector({ allAmenities, selected, onChange }: AmenitiesSelectorProps) {
  // Group amenities by category
  const grouped = useMemo(() => {
    const groups: Record<string, typeof allAmenities> = {};
    allAmenities.forEach((a) => {
      const cat = a.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(a);
    });
    return groups;
  }, [allAmenities]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const toggleCategory = (category: string) => {
    const categoryIds = grouped[category].map((a) => a.id);
    const allSelected = categoryIds.every((id) => selected.includes(id));

    if (allSelected) {
      onChange(selected.filter((id) => !categoryIds.includes(id)));
    } else {
      const newSelected = new Set([...selected, ...categoryIds]);
      onChange(Array.from(newSelected));
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, amenities]) => {
        const categoryIds = amenities.map((a) => a.id);
        const selectedCount = categoryIds.filter((id) => selected.includes(id)).length;
        const allSelected = selectedCount === categoryIds.length;

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  allSelected ? "bg-primary border-primary" : selectedCount > 0 ? "bg-primary/50 border-primary" : "border-muted-foreground/50"
                }`}
              >
                {(allSelected || selectedCount > 0) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="font-medium text-sm">{category}</span>
              <span className="text-xs text-muted-foreground">({selectedCount}/{categoryIds.length})</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pl-6">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                    selected.includes(amenity.id)
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(amenity.id)}
                    onChange={() => toggle(amenity.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      selected.includes(amenity.id) ? "bg-primary border-primary" : "border-muted-foreground/50"
                    }`}
                  >
                    {selected.includes(amenity.id) && (
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      {allAmenities.length === 0 && (
        <p className="text-sm text-muted-foreground">No amenities available</p>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/AmenitiesSelector.tsx
git commit -m "feat(admin): add AmenitiesSelector component"
```

---

## Task 6: Create Property Form Schema

**Files:**
- Create: `src/app/admin/properties/_components/property-schema.ts`

**Step 1: Create Zod schema with images, configs, amenities**

```typescript
import { z } from "zod";
import type { Project, Configuration, ProjectImage } from "@/types/database";

export const propertyFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  status: z.enum(["upcoming", "ongoing", "completed"]),
  property_type: z.enum(["apartment", "villa", "plot", "commercial", "penthouse"]).nullable(),
  price_min: z.coerce.number().nullable(),
  price_max: z.coerce.number().nullable(),
  price_on_request: z.boolean().default(false),
  address: z.string().optional(),
  city: z.string().min(2, "City required"),
  locality: z.string().optional(),
  pincode: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  total_units: z.coerce.number().nullable(),
  available_units: z.coerce.number().nullable(),
  possession_date: z.string().optional(),
  rera_id: z.string().optional(),
  builder_id: z.string().nullable(),
  published: z.boolean().default(false),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export interface PropertyFormData extends PropertyFormValues {
  images: Partial<ProjectImage>[];
  configurations: Partial<Configuration>[];
  amenityIds: string[];
}

export function projectToFormData(project: Project): PropertyFormData {
  return {
    name: project.name || "",
    slug: project.slug || "",
    description: project.description || "",
    status: project.status || "upcoming",
    property_type: project.property_type || null,
    price_min: project.price_min,
    price_max: project.price_max,
    price_on_request: project.price_on_request || false,
    address: project.address || "",
    city: project.city || "",
    locality: project.locality || "",
    pincode: project.pincode || "",
    lat: project.location?.lat,
    lng: project.location?.lng,
    total_units: project.total_units,
    available_units: project.available_units,
    possession_date: project.possession_date || "",
    rera_id: project.rera_id || "",
    builder_id: project.builder_id,
    published: !!project.published_at,
    images: project.images || [],
    configurations: project.configurations || [],
    amenityIds: project.amenities?.map((a) => a.id) || [],
  };
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/property-schema.ts
git commit -m "feat(admin): add property form Zod schema with related data"
```

---

## Task 7: Create Property Form Component

**Files:**
- Create: `src/app/admin/properties/_components/PropertyForm.tsx`

**Step 1: Create full form with all sections**

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "./ImageUploader";
import { ConfigurationsEditor } from "./ConfigurationsEditor";
import { AmenitiesSelector } from "./AmenitiesSelector";
import { propertyFormSchema, type PropertyFormValues, type PropertyFormData } from "./property-schema";
import type { Configuration, ProjectImage } from "@/types/database";

interface PropertyFormProps {
  initialData?: PropertyFormData;
  projectId?: string;
  builders: { id: string; name: string }[];
  cities: string[];
  amenities: { id: string; name: string; category: string | null }[];
  onSubmit: (data: PropertyFormData) => Promise<{ success: boolean; error?: string }>;
  onDelete?: () => Promise<{ success: boolean; error?: string }>;
}

export function PropertyForm({
  initialData,
  projectId,
  builders,
  cities,
  amenities,
  onSubmit,
  onDelete,
}: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Separate state for related data (not in react-hook-form)
  const [images, setImages] = useState<Partial<ProjectImage>[]>(initialData?.images || []);
  const [configurations, setConfigurations] = useState<Partial<Configuration>[]>(initialData?.configurations || []);
  const [amenityIds, setAmenityIds] = useState<string[]>(initialData?.amenityIds || []);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      status: "upcoming",
      property_type: null,
      price_min: null,
      price_max: null,
      price_on_request: false,
      address: "",
      city: "",
      locality: "",
      pincode: "",
      total_units: null,
      available_units: null,
      possession_date: "",
      rera_id: "",
      builder_id: null,
      published: false,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    setError(null);
    startTransition(async () => {
      const fullData: PropertyFormData = {
        ...data,
        images: images as Partial<ProjectImage>[],
        configurations,
        amenityIds,
      };
      const result = await onSubmit(fullData);
      if (result.success) {
        router.push("/admin/properties");
        router.refresh();
      } else {
        setError(result.error || "Failed to save");
      }
    });
  });

  const handleDelete = () => {
    if (!onDelete || !confirm("Delete this property? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await onDelete();
      if (result.success) {
        router.push("/admin/properties");
        router.refresh();
      } else {
        setError(result.error || "Failed to delete");
      }
    });
  };

  const generateSlug = () => {
    const name = form.getValues("name");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    form.setValue("slug", slug);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...form.register("name")} onBlur={() => !initialData && generateSlug()} />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...form.register("slug")} />
            {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea id="description" {...form.register("description")} rows={3} className="w-full px-3 py-2 border rounded-md bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <select id="status" {...form.register("status")} className="w-full px-3 py-2 border rounded-md bg-background">
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="property_type">Property Type</Label>
            <select id="property_type" {...form.register("property_type")} className="w-full px-3 py-2 border rounded-md bg-background">
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
              <option value="penthouse">Penthouse</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="builder_id">Builder</Label>
            <select id="builder_id" {...form.register("builder_id")} className="w-full px-3 py-2 border rounded-md bg-background">
              <option value="">Select builder</option>
              {builders.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader projectId={projectId} images={images as ProjectImage[]} onChange={setImages} />
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...form.register("address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" {...form.register("city")} list="cities" />
            <datalist id="cities">{cities.map((c) => <option key={c} value={c} />)}</datalist>
            {form.formState.errors.city && <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="locality">Locality</Label>
            <Input id="locality" {...form.register("locality")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" {...form.register("pincode")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input id="lat" type="number" step="any" {...form.register("lat")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lng">Longitude</Label>
            <Input id="lng" type="number" step="any" {...form.register("lng")} />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing & Units</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price_min">Min Price (INR)</Label>
            <Input id="price_min" type="number" {...form.register("price_min")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price_max">Max Price (INR)</Label>
            <Input id="price_max" type="number" {...form.register("price_max")} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="price_on_request" {...form.register("price_on_request")} />
            <Label htmlFor="price_on_request">Price on Request</Label>
          </div>
          <div />
          <div className="space-y-2">
            <Label htmlFor="total_units">Total Units</Label>
            <Input id="total_units" type="number" {...form.register("total_units")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available_units">Available Units</Label>
            <Input id="available_units" type="number" {...form.register("available_units")} />
          </div>
        </CardContent>
      </Card>

      {/* Configurations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurations</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationsEditor configurations={configurations} onChange={setConfigurations} />
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <AmenitiesSelector allAmenities={amenities} selected={amenityIds} onChange={setAmenityIds} />
        </CardContent>
      </Card>

      {/* Additional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="possession_date">Possession Date</Label>
            <Input id="possession_date" type="date" {...form.register("possession_date")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rera_id">RERA ID</Label>
            <Input id="rera_id" {...form.register("rera_id")} />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" id="published" {...form.register("published")} />
            <Label htmlFor="published">Published (visible to public)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {onDelete && (
            <Button type="button" variant="outline" onClick={handleDelete} disabled={isPending}>
              Delete Property
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : projectId ? "Update Property" : "Create Property"}
          </Button>
        </div>
      </div>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/PropertyForm.tsx
git commit -m "feat(admin): add PropertyForm with images, configs, amenities"
```

---

## Task 8: Create Server Actions for Properties

**Files:**
- Create: `src/app/admin/properties/actions.ts`

**Step 1: Create server actions with related data handling**

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/queries/admin";
import type { PropertyFormData } from "./_components/property-schema";

export async function createPropertyAction(
  data: PropertyFormData
): Promise<{ success: boolean; error?: string; id?: string }> {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role === "viewer") {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();

  // 1. Create project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      status: data.status,
      property_type: data.property_type,
      price_min: data.price_min,
      price_max: data.price_max,
      price_on_request: data.price_on_request,
      address: data.address || null,
      city: data.city,
      locality: data.locality || null,
      pincode: data.pincode || null,
      location: data.lat && data.lng ? { lat: data.lat, lng: data.lng } : null,
      total_units: data.total_units,
      available_units: data.available_units,
      possession_date: data.possession_date || null,
      rera_id: data.rera_id || null,
      builder_id: data.builder_id,
      published_at: data.published ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (projectError) {
    console.error("Error creating property:", projectError);
    if (projectError.code === "23505") return { success: false, error: "Slug already exists" };
    return { success: false, error: "Failed to create property" };
  }

  const projectId = project.id;

  // 2. Insert images
  if (data.images.length > 0) {
    const imagesToInsert = data.images.map((img, i) => ({
      project_id: projectId,
      cloudinary_public_id: img.cloudinary_public_id,
      image_type: img.image_type || "exterior",
      sort_order: i,
      is_primary: img.is_primary || i === 0,
    }));
    await supabase.from("project_images").insert(imagesToInsert);
  }

  // 3. Insert configurations
  if (data.configurations.length > 0) {
    const configsToInsert = data.configurations.map((c) => ({
      project_id: projectId,
      config_name: c.config_name || null,
      bedrooms: c.bedrooms,
      bathrooms: c.bathrooms,
      carpet_area_sqft: c.carpet_area_sqft,
      built_up_area_sqft: c.built_up_area_sqft,
      price: c.price,
    }));
    await supabase.from("configurations").insert(configsToInsert);
  }

  // 4. Insert amenities
  if (data.amenityIds.length > 0) {
    const amenitiesToInsert = data.amenityIds.map((amenityId) => ({
      project_id: projectId,
      amenity_id: amenityId,
    }));
    await supabase.from("project_amenities").insert(amenitiesToInsert);
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  return { success: true, id: projectId };
}

export async function updatePropertyAction(
  id: string,
  data: PropertyFormData
): Promise<{ success: boolean; error?: string }> {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role === "viewer") {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();

  // Get current published state
  const { data: current } = await supabase.from("projects").select("published_at").eq("id", id).single();
  let published_at = current?.published_at;
  if (data.published && !published_at) published_at = new Date().toISOString();
  else if (!data.published) published_at = null;

  // 1. Update project
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      status: data.status,
      property_type: data.property_type,
      price_min: data.price_min,
      price_max: data.price_max,
      price_on_request: data.price_on_request,
      address: data.address || null,
      city: data.city,
      locality: data.locality || null,
      pincode: data.pincode || null,
      location: data.lat && data.lng ? { lat: data.lat, lng: data.lng } : null,
      total_units: data.total_units,
      available_units: data.available_units,
      possession_date: data.possession_date || null,
      rera_id: data.rera_id || null,
      builder_id: data.builder_id,
      published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    console.error("Error updating property:", updateError);
    if (updateError.code === "23505") return { success: false, error: "Slug already exists" };
    return { success: false, error: "Failed to update property" };
  }

  // 2. Replace images (delete old, insert new)
  await supabase.from("project_images").delete().eq("project_id", id);
  if (data.images.length > 0) {
    const imagesToInsert = data.images.map((img, i) => ({
      project_id: id,
      cloudinary_public_id: img.cloudinary_public_id,
      image_type: img.image_type || "exterior",
      sort_order: i,
      is_primary: img.is_primary || i === 0,
    }));
    await supabase.from("project_images").insert(imagesToInsert);
  }

  // 3. Replace configurations
  await supabase.from("configurations").delete().eq("project_id", id);
  if (data.configurations.length > 0) {
    const configsToInsert = data.configurations.map((c) => ({
      project_id: id,
      config_name: c.config_name || null,
      bedrooms: c.bedrooms,
      bathrooms: c.bathrooms,
      carpet_area_sqft: c.carpet_area_sqft,
      built_up_area_sqft: c.built_up_area_sqft,
      price: c.price,
    }));
    await supabase.from("configurations").insert(configsToInsert);
  }

  // 4. Replace amenities
  await supabase.from("project_amenities").delete().eq("project_id", id);
  if (data.amenityIds.length > 0) {
    const amenitiesToInsert = data.amenityIds.map((amenityId) => ({
      project_id: id,
      amenity_id: amenityId,
    }));
    await supabase.from("project_amenities").insert(amenitiesToInsert);
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath(`/properties/${data.slug}`);
  return { success: true };
}

export async function deletePropertyAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== "admin") {
    return { success: false, error: "Only admins can delete properties" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  if (error) {
    console.error("Error deleting property:", error);
    return { success: false, error: "Failed to delete property" };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  return { success: true };
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/actions.ts
git commit -m "feat(admin): add server actions with images, configs, amenities"
```

---

## Task 9: Create New Property Page

**Files:**
- Create: `src/app/admin/properties/new/page.tsx`

**Step 1: Create page**

```tsx
import { getUniqueCities, getAllBuilders, getAllAmenities } from "@/lib/queries/admin";
import { PropertyForm } from "../_components/PropertyForm";
import { createPropertyAction } from "../actions";

export default async function NewPropertyPage() {
  const [cities, builders, amenities] = await Promise.all([
    getUniqueCities(),
    getAllBuilders(),
    getAllAmenities(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Property</h1>
        <p className="text-muted-foreground">Create a new property listing</p>
      </div>
      <PropertyForm
        builders={builders}
        cities={cities}
        amenities={amenities}
        onSubmit={createPropertyAction}
      />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/new/page.tsx
git commit -m "feat(admin): add new property page"
```

---

## Task 10: Create Edit Property Page

**Files:**
- Create: `src/app/admin/properties/[id]/page.tsx`

**Step 1: Create page**

```tsx
import { notFound } from "next/navigation";
import { getProjectById, getUniqueCities, getAllBuilders, getAllAmenities } from "@/lib/queries/admin";
import { PropertyForm } from "../_components/PropertyForm";
import { projectToFormData } from "../_components/property-schema";
import { updatePropertyAction, deletePropertyAction } from "../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;

  const [project, cities, builders, amenities] = await Promise.all([
    getProjectById(id),
    getUniqueCities(),
    getAllBuilders(),
    getAllAmenities(),
  ]);

  if (!project) notFound();

  const handleSubmit = async (data: any) => {
    "use server";
    return updatePropertyAction(id, data);
  };

  const handleDelete = async () => {
    "use server";
    return deletePropertyAction(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <p className="text-muted-foreground">Update {project.name}</p>
      </div>
      <PropertyForm
        initialData={projectToFormData(project)}
        projectId={id}
        builders={builders}
        cities={cities}
        amenities={amenities}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/[id]/page.tsx
git commit -m "feat(admin): add edit property page"
```

---

## Task 11: Add "New Property" Button to List Page

**Files:**
- Modify: `src/app/admin/properties/page.tsx:26-33`

**Step 1: Add button in header**

Find this section (lines 26-33):
```tsx
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            Manage all properties in the system
          </p>
        </div>
```

Replace with:
```tsx
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            Manage all properties in the system
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </Link>
        </Button>
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/page.tsx
git commit -m "feat(admin): add new property button to list"
```

---

## Task 12: Add Environment Variables

**Files:**
- Modify: `.env.local` (manual)
- Create: `.env.example` (update)

**Step 1: Add GCP vars to .env.example**

```
# GCP Storage
GCP_PROJECT_ID=your-gcp-project-id
GCP_BUCKET_NAME=estate-pulse-images
GCP_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
NEXT_PUBLIC_GCP_BUCKET_NAME=estate-pulse-images
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add GCP env vars to example"
```

---

## Task 13: Manual Testing

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Test full create flow**

1. Go to `/admin/properties`
2. Click "Add Property"
3. Fill basic info
4. Upload 2-3 images
5. Add 2 configurations (2BHK, 3BHK)
6. Select 5+ amenities
7. Submit

**Step 3: Verify in database**

Check Supabase:
- `projects` has new row
- `project_images` has image rows
- `configurations` has config rows
- `project_amenities` has amenity links

**Step 4: Test edit flow**

1. Click Edit on created property
2. Add another image
3. Remove a configuration
4. Toggle some amenities
5. Submit and verify changes

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat(admin): complete property CRUD with images, configs, amenities"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Query functions | `admin.ts` |
| 2 | GCP presigned URLs | `gcp-storage.ts`, `api/upload` |
| 3 | Image uploader | `ImageUploader.tsx` |
| 4 | Configs editor | `ConfigurationsEditor.tsx` |
| 5 | Amenities selector | `AmenitiesSelector.tsx` |
| 6 | Zod schema | `property-schema.ts` |
| 7 | Form component | `PropertyForm.tsx` |
| 8 | Server actions | `actions.ts` |
| 9 | New page | `new/page.tsx` |
| 10 | Edit page | `[id]/page.tsx` |
| 11 | Add button | `page.tsx` |
| 12 | Env vars | `.env.example` |
| 13 | Testing | manual |

---

## Env Vars Needed

```
GCP_PROJECT_ID=
GCP_BUCKET_NAME=
GCP_SERVICE_ACCOUNT_KEY=
NEXT_PUBLIC_GCP_BUCKET_NAME=
```

---

## Unresolved Questions

- GCP bucket already created?
- GCP service account has Storage Object Admin role?
- CORS configured on bucket for client uploads?
