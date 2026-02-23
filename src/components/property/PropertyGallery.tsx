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
            className="relative aspect-square rounded-sm overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
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
