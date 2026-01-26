# GCP Image Pipeline Design

Replacing Cloudinary with GCP-native image handling: Cloud Storage + Cloud Functions + Cloud CDN.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Admin Upload   │────▶│   GCS Bucket    │────▶│ Cloud Function  │
│  (Next.js API)  │     │  /properties/   │     │ (resize trigger)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                        │
                               ▼                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │    Cloud CDN    │     │  Write variants │
                        │   (edge cache)  │◀────│  back to GCS    │
                        └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │     Browser     │
                        └─────────────────┘
```

## Image Variants

| Variant | Dimensions | Use Case |
|---------|------------|----------|
| thumbnail | 300×225 | Property cards, grid views |
| card | 600×450 | Search results, larger cards |
| hero | 1600×800 | Property detail hero, banners |

Output format: WebP (quality 80-85)

## Bucket Structure

```
properties/
  godrej-avenue-eleven/
    img-a1b2c3-original.jpg
    img-a1b2c3-thumbnail.webp
    img-a1b2c3-card.webp
    img-a1b2c3-hero.webp
    img-d4e5f6-original.jpg
    img-d4e5f6-thumbnail.webp
    ...
```

- Slug is immutable once set
- Original preserved, variants generated
- UUID prevents filename collisions

## Cloud Function

**Trigger:** `google.cloud.storage.object.v1.finalized`

**Filter:** Only `properties/*/img-*-original.*`

**Runtime:** Node.js 20, 512MB memory

**Logic:**
1. Parse event, extract file path
2. Skip if not `-original` (avoid infinite loop)
3. Download original to /tmp
4. Generate 3 variants using Sharp
5. Upload variants to same folder as WebP
6. Cleanup /tmp

**Error handling:**
- 3 retries (built-in)
- Dead-letter on failure
- Original always preserved

## Cloud CDN

**Setup:**
1. External HTTP(S) load balancer
2. Backend bucket → GCS bucket
3. Enable Cloud CDN on backend
4. Cache TTL: 86400s (1 day)
5. Optional: custom domain + SSL

**Cost comparison (100GB/month):**

| | GCS Direct | Cloud CDN |
|---|------------|-----------|
| Egress | $12/mo | $2-8/mo |
| Latency | 100-300ms | 10-50ms |

CDN is cheaper and faster.

## Upload Flow

**Current:**
1. ImageUploader → `/api/upload` with fileName
2. API returns presigned URL: `properties/{timestamp}-{random}.ext`
3. Browser uploads to GCS
4. Stores path in `cloudinary_public_id`

**New:**
1. ImageUploader → `/api/upload` with fileName + slug
2. API returns presigned URL: `properties/{slug}/img-{uuid}-original.ext`
3. Browser uploads to GCS
4. Cloud Function generates variants
5. Stores base path in `image_path` (e.g., `properties/godrej-avenue-eleven/img-a1b2c3`)

## URL Helper

New `src/lib/image-urls.ts`:

```typescript
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL ||
  `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GCP_BUCKET_NAME}`;

type Variant = 'original' | 'thumbnail' | 'card' | 'hero';

export function getImageUrl(basePath: string, variant: Variant = 'card'): string {
  const ext = variant === 'original' ? 'jpg' : 'webp';
  return `${CDN_URL}/${basePath}-${variant}.${ext}`;
}
```

## DB Migration

Rename column:
```sql
ALTER TABLE project_images
RENAME COLUMN cloudinary_public_id TO image_path;
```

## Migration Script

One-time Cloudinary → GCS migration:

1. Fetch all existing `cloudinary_public_id` from DB
2. For each image:
   - Download original from Cloudinary
   - Get project slug from DB join
   - Upload to GCS: `properties/{slug}/img-{uuid}-original.{ext}`
   - Cloud Function auto-generates variants
   - Update DB with new `image_path`
3. Verify all images accessible
4. Log failures for manual review

## Implementation Checklist

### GCP Infrastructure
- [ ] Cloud Function: image resizer with Sharp
- [ ] Cloud Function: deploy with GCS trigger
- [ ] Cloud CDN: create load balancer + backend bucket
- [ ] Cloud CDN: configure cache rules
- [ ] Cloud CDN: optional custom domain

### Codebase Changes
- [ ] DB migration: rename column
- [ ] New: `src/lib/image-urls.ts`
- [ ] Update: `/api/upload` - accept slug param
- [ ] Update: `ImageUploader.tsx` - pass slug, use new URLs
- [ ] Update: `PropertyCard.tsx` - use getImageUrl
- [ ] Update: `PropertyGallery.tsx` - use getImageUrl
- [ ] Update: property detail page - use getImageUrl
- [ ] Delete: `src/lib/cloudinary.ts`
- [ ] Remove: Cloudinary env vars from .env.example

### Migration
- [ ] Migration script: Cloudinary → GCS
- [ ] Run migration on existing images
- [ ] Verify all images load correctly
- [ ] Update any hardcoded Cloudinary URLs

## Unresolved Questions

- Custom domain for CDN or use default GCS/CDN URL?
- Keep Cloudinary account as backup or delete after verified migration?
