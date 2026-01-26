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
