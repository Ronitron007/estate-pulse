const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

interface ImageOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "thumb" | "scale";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}

export function getCloudinaryUrl(
  publicId: string,
  options: ImageOptions = {}
): string {
  const {
    width = 800,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  const transforms = [
    `w_${width}`,
    height && `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

// Presets for common use cases
export const imagePresets = {
  thumbnail: { width: 300, height: 225, crop: "fill" as const },
  card: { width: 600, height: 450, crop: "fill" as const },
  hero: { width: 1600, height: 800, crop: "fill" as const },
  gallery: { width: 1200, height: 800, crop: "fit" as const },
  og: { width: 1200, height: 630, crop: "fill" as const },
  avatar: { width: 100, height: 100, crop: "fill" as const },
} as const;

export function getImageWithPreset(
  publicId: string,
  preset: keyof typeof imagePresets
): string {
  return getCloudinaryUrl(publicId, imagePresets[preset]);
}

// Get blur placeholder URL (low quality, tiny image)
export function getBlurPlaceholder(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 10,
    quality: 10,
    format: "auto",
  });
}

// Get responsive srcset
export function getResponsiveSrcSet(
  publicId: string,
  widths: number[] = [320, 640, 960, 1280, 1600]
): string {
  return widths
    .map((w) => `${getCloudinaryUrl(publicId, { width: w })} ${w}w`)
    .join(", ");
}
