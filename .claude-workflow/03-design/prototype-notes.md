# Estate Pulse - Prototype Scaffolding Notes

**Date:** 2026-01-16
**Phase:** Scaffolding complete

---

## Files Created vs Already Existed

### Already Existed (Before Scaffolding)
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx (root)
│   ├── page.tsx (homepage)
│   ├── favicon.ico
│   └── properties/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── layout/
│   │   └── Header.tsx
│   └── property/
│       ├── PropertyCard.tsx
│       ├── PropertyGrid.tsx
│       └── PropertyFilters.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── queries/
│   │   └── projects.ts
│   ├── format.ts
│   └── utils.ts
├── types/
│   └── database.ts
└── middleware.ts
```

### Created During Scaffolding
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── map/page.tsx
│   │   └── saved/page.tsx
│   ├── api/
│   │   ├── properties/route.ts
│   │   ├── favorites/route.ts
│   │   ├── inquiries/route.ts
│   │   └── auth/callback/route.ts
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── loading.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── property/
│   │   ├── PropertyGallery.tsx
│   │   ├── PriceDisplay.tsx
│   │   └── InquiryForm.tsx
│   ├── map/
│   │   ├── PropertyMap.tsx
│   │   ├── MarkerCluster.tsx
│   │   ├── MapMarker.tsx
│   │   └── MapListToggle.tsx
│   └── auth/
│       ├── AuthProvider.tsx
│       ├── LoginForm.tsx
│       ├── SignupForm.tsx
│       └── AuthModal.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useFavorites.ts
│   ├── useFilters.ts
│   └── useMap.ts
└── lib/
    ├── queries/
    │   ├── favorites.ts
    │   └── inquiries.ts
    ├── cloudinary.ts
    └── constants.ts
```

---

## Component Hierarchy

```
RootLayout (src/app/layout.tsx)
├── Header (client - auth state)
│   └── MobileNav (client - drawer)
├── [Route Content]
│   ├── HomePage
│   │   ├── PropertyGrid (client)
│   │   │   └── PropertyCard (server)
│   │   └── Footer (server)
│   ├── PropertiesPage
│   │   ├── PropertyFilters (client)
│   │   └── PropertyGrid (client)
│   ├── PropertyDetailPage
│   │   ├── PropertyGallery (client)
│   │   ├── PriceDisplay (server - auth check)
│   │   └── InquiryForm (client)
│   ├── MapPage
│   │   ├── PropertyMap (client - Google Maps)
│   │   │   └── MarkerCluster (client)
│   │   └── MapListToggle (client)
│   ├── SavedPage (protected)
│   │   └── PropertyGrid (client)
│   ├── LoginPage
│   │   └── LoginForm (client)
│   └── SignupPage
│       └── SignupForm (client)
└── Footer (server)
```

---

## Data Flow Patterns

### 1. Server Component Pattern (Primary)
Used for: Property listings, detail pages, saved page
```
Page (RSC) -> lib/queries/* -> Supabase Server Client -> DB
          -> Pass data to Client components as props
```

### 2. Route Handler Pattern (Mutations)
Used for: Favorites, Inquiries
```
Client Component -> fetch('/api/*') -> Route Handler -> Supabase -> DB
                                                     -> Response
```

### 3. URL State Pattern (Filters)
Used for: Search filters, pagination
```
Client Component -> useSearchParams/useRouter -> URL change
                 -> Server Component re-renders with new params
```

### 4. Auth State Pattern
Used for: Header, protected routes
```
Supabase onAuthStateChange -> AuthProvider Context -> useAuth hook
                           -> Components re-render
```

---

## Server vs Client Components

| Component | Type | Reason |
|-----------|------|--------|
| PropertyCard | Server | Static content, SEO |
| PropertyGrid | Client | Interaction handlers |
| PropertyFilters | Client | URL state management |
| PropertyMap | Client | Google Maps SDK |
| PropertyGallery | Client | Lightbox interaction |
| PriceDisplay | Server | Auth check at server |
| InquiryForm | Client | Form handling |
| Header | Client | Auth state listener |
| Footer | Server | Static content |
| AuthModal | Client | Modal + form handling |

---

## Deviations from architecture.md

### Minor Changes
1. **Route groups**: Added (main) group for pages needing Header/Footer vs (auth) for auth pages
2. **Callback route**: Duplicated in both `/api/auth/callback` and `/(auth)/callback` for flexibility
3. **PriceDisplay**: Implemented as async Server Component (as documented)

### Not Yet Implemented (Deferred)
1. **Admin routes**: `/admin/*` - Using Supabase dashboard for MVP
2. **Compare feature**: `/compare` - P2 feature
3. **Builder profiles**: `/builders/[slug]` - P2 feature
4. **SWR for map**: Using simple state instead - can add SWR later for caching

---

## Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_ID=  # Optional for styled maps

# App
NEXT_PUBLIC_APP_URL=https://estatepulse.in
```

---

## Dependencies to Add

```bash
# Google Maps (if not installed)
npm install @vis.gl/react-google-maps

# Optional: SWR for client-side caching
npm install swr
```

---

## Known TODOs for Future

1. **PropertyCard**: Add favorite button with useFavorites hook
2. **PropertyGrid**: Wire up infinite scroll or pagination
3. **Header**: Integrate MobileNav component
4. **InquiryForm**: Add form validation with zod
5. **PropertyMap**: Add bounds-based fetching for large datasets
6. **AuthModal**: Add to root layout for global access
7. **Tests**: Add Vitest/Playwright for critical paths

---

## Quick Start

```bash
# Install deps
npm install

# Run dev
npm run dev

# Build
npm run build
```

**Project compiles and runs with:**
- Next.js 16 App Router
- TypeScript strict mode
- Supabase auth + database
- shadcn/ui components
- Tailwind CSS 4

---

*Last Updated: 2026-01-16*
