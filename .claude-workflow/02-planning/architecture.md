# Estate Pulse - Technical Architecture

**Version:** 1.0
**Date:** 2026-01-16
**Stack:** Next.js 16 (App Router), TypeScript, Supabase, Cloudinary, Google Maps

---

## 1. Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no layout nesting)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts     # OAuth callback
│   ├── (main)/                   # Main app with shared layout
│   │   ├── layout.tsx            # Header + Footer
│   │   ├── page.tsx              # Homepage
│   │   ├── properties/
│   │   │   ├── page.tsx          # List view (SSR)
│   │   │   └── [slug]/page.tsx   # Detail (SSG + ISR)
│   │   ├── map/page.tsx          # Full map view
│   │   ├── saved/page.tsx        # User favorites (protected)
│   │   ├── compare/page.tsx      # Comparison (P2)
│   │   └── builders/
│   │       └── [slug]/page.tsx   # Builder profile (P2)
│   ├── admin/                    # Admin routes (protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   ├── properties/
│   │   └── inquiries/
│   ├── api/                      # Route handlers
│   │   ├── properties/
│   │   │   └── route.ts          # GET /api/properties
│   │   ├── favorites/
│   │   │   └── route.ts          # POST/DELETE
│   │   ├── inquiries/
│   │   │   └── route.ts          # POST
│   │   └── auth/
│   │       └── callback/route.ts # Supabase auth callback
│   ├── sitemap.ts                # Dynamic sitemap
│   ├── robots.ts                 # Robots.txt
│   ├── globals.css
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/
│   │   ├── Header.tsx            # Client (auth state)
│   │   ├── Footer.tsx            # Server
│   │   └── MobileNav.tsx         # Client
│   ├── property/
│   │   ├── PropertyCard.tsx      # Server
│   │   ├── PropertyGrid.tsx      # Client (interaction)
│   │   ├── PropertyFilters.tsx   # Client (URL state)
│   │   ├── PropertyGallery.tsx   # Client (lightbox)
│   │   ├── PriceDisplay.tsx      # Server (auth check)
│   │   └── InquiryForm.tsx       # Client (form)
│   ├── map/
│   │   ├── PropertyMap.tsx       # Client (Google Maps)
│   │   ├── MapMarker.tsx         # Client
│   │   ├── MarkerCluster.tsx     # Client
│   │   └── MapListToggle.tsx     # Client
│   ├── auth/
│   │   ├── LoginForm.tsx         # Client
│   │   ├── SignupForm.tsx        # Client
│   │   ├── AuthModal.tsx         # Client
│   │   └── AuthProvider.tsx      # Client (context)
│   └── compare/                  # P2
│       ├── CompareTable.tsx
│       └── CompareBar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client (cookies)
│   │   └── middleware.ts         # Session refresh
│   ├── queries/
│   │   ├── projects.ts           # Project CRUD
│   │   ├── favorites.ts          # User favorites
│   │   ├── inquiries.ts          # Lead capture
│   │   └── builders.ts           # Builder data
│   ├── cloudinary.ts             # Image URL helpers
│   ├── format.ts                 # Price/date formatters
│   ├── utils.ts                  # cn(), slugify()
│   └── constants.ts              # Cities, property types
├── hooks/
│   ├── useAuth.ts                # Auth context hook
│   ├── useFavorites.ts           # Optimistic favorites
│   ├── useFilters.ts             # URL search params
│   └── useMap.ts                 # Google Maps state
├── types/
│   └── database.ts               # TypeScript types
└── middleware.ts                 # Route protection
```

---

## 2. API Design

### Data Fetching Patterns

**Pattern 1: Server Components (Primary)**
```typescript
// src/app/properties/page.tsx
export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams;
  const filters = parseFilters(params);

  // Direct Supabase query - no API route needed
  const projects = await getProjects(filters);
  const user = await getUser(); // From server client

  return <PropertyGrid projects={projects} showPrice={!!user} />;
}
```

**Pattern 2: Route Handlers (Mutations)**
```typescript
// src/app/api/favorites/route.ts
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { projectId } = await request.json();

  const { error } = await supabase
    .from('saved_properties')
    .insert({ user_id: user.id, project_id: projectId });

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ success: true });
}
```

**Pattern 3: Client-Side Fetching (Maps)**
```typescript
// For real-time map interactions
// src/hooks/useMapProjects.ts
export function useMapProjects(bounds: LatLngBounds) {
  return useSWR(
    bounds ? ['map-projects', bounds] : null,
    () => fetchProjectsInBounds(bounds),
    { revalidateOnFocus: false }
  );
}
```

### API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/properties` | GET | No | List/filter (fallback for client) |
| `/api/favorites` | POST/DELETE | Yes | Save/unsave property |
| `/api/inquiries` | POST | Yes | Submit inquiry |
| `/api/compare` | GET/POST | Yes | Manage comparison (P2) |
| `/api/auth/callback` | GET | No | OAuth redirect handler |

---

## 3. Component Architecture

### Server vs Client Decision Matrix

| Component | Type | Reason |
|-----------|------|--------|
| `PropertyCard` | Server | Static data, SEO |
| `PropertyGrid` | Client | Interaction (hover, favorites) |
| `PropertyFilters` | Client | URL state management |
| `PropertyMap` | Client | Google Maps SDK |
| `PriceDisplay` | Server | Auth check at server |
| `Header` | Client | Auth state listener |
| `InquiryForm` | Client | Form handling |
| `PropertyGallery` | Client | Lightbox interaction |

### State Management

**No global state library needed.** Use:

1. **URL State** - Filters, pagination via `useSearchParams`
2. **Server State** - Supabase queries via Server Components
3. **Auth State** - Supabase `onAuthStateChange` in context
4. **Local State** - Component-level `useState` for UI

```typescript
// src/components/auth/AuthProvider.tsx
'use client';
export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
```

---

## 4. Authentication Flow

### Supabase Auth Integration

```
                    ┌─────────────────┐
                    │   Login Page    │
                    └────────┬────────┘
                             │
            ┌────────────────┴────────────────┐
            │                                 │
    ┌───────▼───────┐               ┌────────▼────────┐
    │  Email/Pass   │               │  Google OAuth   │
    └───────┬───────┘               └────────┬────────┘
            │                                 │
            │                     supabase.auth.signInWithOAuth
            │                                 │
            │                     ┌───────────▼───────────┐
            │                     │ /api/auth/callback    │
            │                     │ (exchange code)       │
            │                     └───────────┬───────────┘
            │                                 │
            └─────────────┬───────────────────┘
                          │
              ┌───────────▼───────────┐
              │  Middleware runs      │
              │  - Refresh session    │
              │  - Set cookies        │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │  Redirect to origin   │
              │  or /properties       │
              └───────────────────────┘
```

### Route Protection (Middleware)

```typescript
// src/lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  // ... existing refresh logic ...

  const protectedRoutes = ['/saved', '/compare', '/profile'];
  const adminRoutes = ['/admin'];

  const isProtected = protectedRoutes.some(r =>
    request.nextUrl.pathname.startsWith(r)
  );
  const isAdmin = adminRoutes.some(r =>
    request.nextUrl.pathname.startsWith(r)
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdmin) {
    // Check admin_users table
    const { data: admin } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user?.id)
      .single();

    if (!admin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}
```

### Price-Gate Logic

```typescript
// src/components/property/PriceDisplay.tsx
// SERVER COMPONENT - auth check happens at build/request time

import { createClient } from '@/lib/supabase/server';

export async function PriceDisplay({
  priceMin,
  priceMax,
  priceOnRequest
}: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-blue-600">
          Login to see price
        </span>
        <Lock className="w-4 h-4 text-blue-600" />
      </div>
    );
  }

  return (
    <span className="text-lg font-semibold">
      {formatPriceRange(priceMin, priceMax, priceOnRequest)}
    </span>
  );
}
```

---

## 5. Google Maps Integration

### Setup

```typescript
// src/components/map/PropertyMap.tsx
'use client';

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

export function PropertyMap({ projects, center, zoom = 12 }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        <MarkerCluster projects={projects} />
      </Map>
    </APIProvider>
  );
}
```

### Marker Clustering

```typescript
// src/components/map/MarkerCluster.tsx
'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useEffect, useRef } from 'react';

export function MarkerCluster({ projects }) {
  const map = useMap();
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;

    const markers = projects.map(p => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: p.location.lat, lng: p.location.lng },
        map,
      });
      marker.addListener('click', () => {
        // Show info window or navigate
      });
      return marker;
    });

    clusterer.current = new MarkerClusterer({ map, markers });

    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [map, projects]);

  return null;
}
```

### Map/List Toggle

```typescript
// src/app/properties/page.tsx
// URL param: ?view=map or ?view=list (default)

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams;
  const view = params.view || 'list';
  const projects = await getProjects(parseFilters(params));

  return (
    <div>
      <MapListToggle currentView={view} />
      {view === 'map' ? (
        <PropertyMap projects={projects} center={TRICITY_CENTER} />
      ) : (
        <PropertyGrid projects={projects} />
      )}
    </div>
  );
}
```

---

## 6. Image Handling (Cloudinary)

### URL Generation Helper

```typescript
// src/lib/cloudinary.ts

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

interface ImageOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif';
}

export function getCloudinaryUrl(
  publicId: string,
  options: ImageOptions = {}
): string {
  const {
    width = 800,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  const transforms = [
    `w_${width}`,
    height && `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

// Presets for common use cases
export const imagePresets = {
  thumbnail: { width: 300, height: 225, crop: 'fill' },
  card: { width: 600, height: 450, crop: 'fill' },
  hero: { width: 1600, height: 800, crop: 'fill' },
  gallery: { width: 1200, height: 800, crop: 'fit' },
  og: { width: 1200, height: 630, crop: 'fill' }, // OpenGraph
} as const;
```

### Responsive Image Component

```typescript
// src/components/ui/CloudinaryImage.tsx

import Image from 'next/image';
import { getCloudinaryUrl, imagePresets } from '@/lib/cloudinary';

interface Props {
  publicId: string;
  alt: string;
  preset?: keyof typeof imagePresets;
  priority?: boolean;
  className?: string;
}

export function CloudinaryImage({ publicId, alt, preset = 'card', priority, className }: Props) {
  const { width, height } = imagePresets[preset];

  return (
    <Image
      src={getCloudinaryUrl(publicId, imagePresets[preset])}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL={getCloudinaryUrl(publicId, { width: 10, quality: 10 })}
    />
  );
}
```

### Next.js Config for Cloudinary

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },
};
```

---

## 7. SEO Strategy

### Dynamic Metadata

```typescript
// src/app/properties/[slug]/page.tsx

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: 'Property Not Found' };

  const ogImage = project.images?.[0]
    ? getCloudinaryUrl(project.images[0].cloudinary_public_id, imagePresets.og)
    : '/og-default.jpg';

  return {
    title: project.meta_title || `${project.name} in ${project.locality}, ${project.city}`,
    description: project.meta_description ||
      `${project.property_type} by ${project.builder?.name}. ${project.configurations?.length} configurations available.`,
    openGraph: {
      title: project.name,
      description: project.description?.slice(0, 200),
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://estatepulse.in/properties/${slug}`,
    },
  };
}
```

### Sitemap Generation

```typescript
// src/app/sitemap.ts

import { getProjectSlugs, getCities } from '@/lib/queries/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://estatepulse.in';

  const projectSlugs = await getProjectSlugs();
  const cities = await getCities();

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/map`, lastModified: new Date(), priority: 0.8 },
  ];

  const propertyPages = projectSlugs.map(slug => ({
    url: `${baseUrl}/properties/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const cityPages = cities.map(city => ({
    url: `${baseUrl}/properties?city=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [...staticPages, ...propertyPages, ...cityPages];
}
```

### Structured Data (JSON-LD)

```typescript
// src/components/seo/PropertyJsonLd.tsx

export function PropertyJsonLd({ project }: { project: Project }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.description,
    url: `https://estatepulse.in/properties/${project.slug}`,
    image: project.images?.[0]
      ? getCloudinaryUrl(project.images[0].cloudinary_public_id, imagePresets.og)
      : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.address,
      addressLocality: project.locality,
      addressRegion: project.city,
      postalCode: project.pincode,
      addressCountry: 'IN',
    },
    geo: project.location ? {
      '@type': 'GeoCoordinates',
      latitude: project.location.lat,
      longitude: project.location.lng,
    } : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: project.price_min ? project.price_min / 100 : undefined,
      availability: project.available_units > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

---

## 8. Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                     ┌──────────┴──────────┐
                     │                     │
              Initial Load            Client Actions
                     │                     │
                     ▼                     ▼
         ┌───────────────────┐   ┌─────────────────────┐
         │  Server Component │   │   Route Handler     │
         │  (RSC)            │   │   (POST/DELETE)     │
         │                   │   │                     │
         │  - getProjects()  │   │  - toggleFavorite() │
         │  - getUser()      │   │  - submitInquiry()  │
         └─────────┬─────────┘   └──────────┬──────────┘
                   │                        │
                   └──────────┬─────────────┘
                              │
                              ▼
                   ┌───────────────────┐
                   │   Supabase JS     │
                   │   (Server Client) │
                   │                   │
                   │  - RLS enforced   │
                   │  - Cookies auth   │
                   └─────────┬─────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │   Supabase        │
                   │   (Postgres)      │
                   │                   │
                   │  - PostGIS        │
                   │  - RLS policies   │
                   └───────────────────┘
```

### Query Flow Example

```typescript
// 1. User visits /properties?city=Chandigarh&type=apartment

// 2. Server Component parses params
const params = await searchParams;
const filters = {
  city: params.city,          // 'Chandigarh'
  property_type: params.type, // 'apartment'
};

// 3. Server query function
export async function getProjects(filters: ProjectFilters) {
  const supabase = await createClient();

  let query = supabase
    .from('projects')
    .select(`*, builder:builders(*), configurations(*), images:project_images(*)`)
    .not('published_at', 'is', null)
    .is('deleted_at', null);

  if (filters.city) query = query.ilike('city', `%${filters.city}%`);
  if (filters.property_type) query = query.eq('property_type', filters.property_type);

  return query;
}

// 4. RLS policy runs automatically
// "Public can view published projects" policy filters results

// 5. Data returned to Server Component
// 6. Server Component renders PropertyGrid
// 7. HTML streamed to browser
```

---

## 9. Caching Strategy

### Next.js Caching Tiers

| Data | Strategy | Revalidation |
|------|----------|--------------|
| Property list | ISR | 60 seconds |
| Property detail | SSG + ISR | On-demand |
| User favorites | No cache | Real-time |
| Map markers | SWR (client) | 5 minutes |
| Cities list | Static | Build time |
| Builder info | ISR | 1 hour |

### Implementation

```typescript
// Property list - ISR with 60s revalidation
// src/app/properties/page.tsx
export const revalidate = 60;

// Property detail - SSG + On-demand revalidation
// src/app/properties/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map(slug => ({ slug }));
}
export const dynamicParams = true; // Allow new slugs

// On-demand revalidation via admin
// src/app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { slug, secret } = await request.json();

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath(`/properties/${slug}`);
  revalidatePath('/properties');

  return NextResponse.json({ revalidated: true });
}
```

### Client-Side Caching (SWR for Maps)

```typescript
// src/hooks/useMapProjects.ts
import useSWR from 'swr';

export function useMapProjects() {
  return useSWR(
    'map-projects',
    () => fetch('/api/properties?fields=id,slug,name,location').then(r => r.json()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );
}
```

---

## 10. Error Handling

### Error Boundary Structure

```
app/
├── error.tsx           # Global error boundary
├── not-found.tsx       # Global 404
├── properties/
│   ├── error.tsx       # Properties-specific errors
│   └── [slug]/
│       └── not-found.tsx # Property 404
└── admin/
    └── error.tsx       # Admin-specific errors
```

### Global Error Boundary

```typescript
// src/app/error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          We encountered an error loading this page.
        </p>
        <Button onClick={reset}>Try again</Button>
      </Card>
    </div>
  );
}
```

### Loading States

```typescript
// src/app/properties/loading.tsx
export default function PropertiesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}
```

### API Error Handling Pattern

```typescript
// src/lib/queries/projects.ts
export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await buildProjectQuery(supabase, filters);

    if (error) {
      console.error('Supabase error:', error);
      return []; // Graceful fallback
    }

    return transformProjects(data);
  } catch (e) {
    console.error('Unexpected error:', e);
    return [];
  }
}
```

---

## Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # Server-only

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx         # Server-only
CLOUDINARY_API_SECRET=xxx      # Server-only

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=xxx
NEXT_PUBLIC_GOOGLE_MAPS_ID=xxx # For styled maps

# App
NEXT_PUBLIC_APP_URL=https://estatepulse.in
REVALIDATE_SECRET=xxx          # On-demand ISR
```

---

## Deployment Checklist

- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Supabase project linked
- [ ] Google Maps API key restricted to domain
- [ ] Cloudinary unsigned upload preset (if needed)
- [ ] Custom domain configured
- [ ] Analytics (Vercel Analytics or Plausible)
- [ ] Error tracking (Sentry optional)

---

## Critical Files Reference

| File | Purpose |
|------|---------|
| `src/lib/supabase/middleware.ts` | Route protection, auth state |
| `src/lib/queries/projects.ts` | Core data fetching patterns |
| `src/types/database.ts` | TypeScript types for Supabase |
| `src/components/property/PropertyCard.tsx` | Price-gating, Cloudinary pattern |
| `supabase/migrations/00001_initial_schema.sql` | Table structures, RLS policies |

---

## Unresolved Questions

1. `@vis.gl/react-google-maps` vs `@react-google-maps/api` - preference?
2. Compare feature (P2) - session storage or DB for anon users?
3. Admin: Custom CRUD or Supabase dashboard until Phase 2?
4. WhatsApp opt-in: Single checkbox or per-notification prefs?

---

*Version: 1.0 | Last Updated: 2026-01-16*
