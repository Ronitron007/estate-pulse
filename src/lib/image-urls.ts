const rawCdnUrl = (process.env.NEXT_PUBLIC_CDN_URL || "cdn.aglaghar.com").trim();
const CDN_URL = rawCdnUrl.startsWith("http") ? rawCdnUrl : `https://${rawCdnUrl}`;

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
