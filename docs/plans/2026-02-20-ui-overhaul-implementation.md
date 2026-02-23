# UI Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dramatically overhaul the public-facing UI from roundy/segmented card-based design to a minimalist, linear, editorial-flow aesthetic.

**Architecture:** Restyle globals.css tokens first (radius, shadows, animations), then restyle base UI components (Button, Card, Input, Select), then rework each page/component from inside-out. No new libraries — restyle existing shadcn/ui + Tailwind.

**Tech Stack:** Next.js, Tailwind CSS v4, shadcn/ui, Framer Motion, Playfair Display + Inter fonts.

---

### Task 1: Restyle Global Design Tokens

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Update radius base**

In `:root`, change:
```css
--radius: 0.5rem;
```
to:
```css
--radius: 0.125rem;
```

**Step 2: Replace shadow tokens**

In `:root`, replace:
```css
--shadow-card: 0 4px 24px -4px hsl(220 20% 10% / 0.08);
--shadow-card-hover: 0 12px 40px -8px hsl(220 20% 10% / 0.15);
--shadow-gold: 0 4px 20px -4px hsl(40 60% 45% / 0.3);
```
with:
```css
--shadow-subtle: 0 1px 2px hsl(220 20% 10% / 0.05);
```

**Step 3: Delete gradient tokens**

In `:root`, delete these two lines:
```css
--gradient-gold: linear-gradient(135deg, hsl(40 60% 45%), hsl(40 70% 55%));
--gradient-dark: linear-gradient(135deg, hsl(220 20% 8%), hsl(220 20% 15%));
```

**Step 4: Delete gradient utility classes**

Delete `.bg-gradient-gold`, `.text-gradient-gold`, `.shadow-card`, `.shadow-card-hover`, `.shadow-gold` utility classes.

**Step 5: Remove bouncy easing tokens**

In `@theme inline`, delete:
```css
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-snap: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```
Keep `--ease-smooth`.

**Step 6: Strip playful animations**

Delete these keyframes + their utility classes entirely:
- `card-lift` keyframe
- `gentle-pulse` keyframe + `.animate-gentle-pulse`
- `heart-beat` keyframe + `.animate-heart-beat`
- `bounce-in` keyframe + `.animate-bounce-in`
- `wobble` keyframe + `.animate-wobble`
- `float` keyframe + `.animate-float`
- `toggle-slide` keyframe
- `img-zoom` keyframe
- `badge-pulse-ring` keyframe + `.badge-pulse`
- `check-tick` keyframe
- `text-shine` keyframe + `.text-shine`

Keep: `shimmer`, `fade-in`, `slide-in-right`, `scale-in`, `spin-smooth`, stagger delays.

**Step 7: Add slide-up animation**

Add after the `fade-in` animation:
```css
@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s var(--ease-smooth) forwards;
}
```

**Step 8: Simplify interaction classes**

Delete `.btn-press` (and its `:active` rule).

Replace `.card-hover-lift` with a subtle hover:
```css
.card-hover-subtle {
  transition: background-color 0.2s var(--ease-smooth);
}
.card-hover-subtle:hover {
  background-color: hsl(40 10% 94% / 0.5);
}
```

Tone down `.img-hover-zoom img` hover from `scale(1.05)` to `scale(1.03)`.

Delete `.icon-bounce`.

Delete `.input-glow`.

Replace `.shadow-card` references in the `nav-link-hover` `::before` — keep `border-radius: 1px` but change to `border-radius: 0`.

Update `.skeleton` to use `border-radius: 2px` instead of `4px`.

**Step 9: Update reduced motion section**

Remove references to deleted animation classes in `@media (prefers-reduced-motion: reduce)`:
- Remove `.animate-gentle-pulse`
- Remove `.animate-float`
Keep `.animate-shimmer`, `.animate-spin-smooth`.

**Step 10: Commit**

```bash
git add src/app/globals.css
git commit -m "style: overhaul global tokens — sharp radius, flat shadows, strip gradients/bouncy animations"
```

---

### Task 2: Restyle Base UI Components

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/input.tsx`
- Modify: `src/components/ui/select.tsx`

**Step 1: Restyle Button**

In `button.tsx`, replace the base cva string (line 9) with:
```
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
```

Key changes: `rounded-md` → `rounded-sm`, removed `active:scale-[0.97] hover:scale-[1.02]`, `transition-all` → `transition-colors`.

In variant `default`, remove `hover:shadow-md`:
```
"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
```

In variant `destructive`, remove `hover:shadow-md`:
```
"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
```

In variant `outline`, remove `hover:shadow-sm`:
```
"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
```

In variant `secondary`, remove `hover:shadow-sm`:
```
"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80"
```

In size `sm`, change `rounded-md` → `rounded-sm`.
In size `lg`, change `rounded-md` → `rounded-sm`.

**Step 2: Restyle Card**

In `card.tsx`, replace the Card className (line 10-13) with:
```tsx
className={cn(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-sm border py-6",
  className
)}
```

Removed: `rounded-xl`, `shadow-sm`, all hover/transition classes.

**Step 3: Restyle Input**

In `input.tsx`, replace the className (line 12-20) with:
```tsx
className={cn(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  "transition-colors duration-200",
  "focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[2px]",
  "hover:border-ring/50",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  className
)}
```

Key changes: `rounded-md` → `rounded-sm`, `transition-all` → `transition-colors`, ring `[3px]` → `[2px]`, ring opacity `ring/50` → `ring/30`, removed `focus-visible:shadow-[0_0_0_4px...]` glow.

**Step 4: Restyle Select**

In `select.tsx`, for `SelectTrigger` (line 40), change `rounded-md` → `rounded-sm`.

For `SelectContent` (line 65), change `rounded-md` → `rounded-sm`.

**Step 5: Commit**

```bash
git add src/components/ui/button.tsx src/components/ui/card.tsx src/components/ui/input.tsx src/components/ui/select.tsx
git commit -m "style: restyle base UI components — sharp corners, flat, no hover-lift"
```

---

### Task 3: Restyle Property Listing Page (Full-Width Rows)

**Files:**
- Modify: `src/components/property/PropertyCard.tsx` — complete rewrite to horizontal row
- Modify: `src/components/property/PropertyGrid.tsx` — stack rows instead of grid
- Modify: `src/app/(main)/properties/page.tsx` — minor layout tweaks
- Modify: `src/components/property/PropertyFilters.tsx` — sharp corners
- Modify: `src/components/property/SortDropdown.tsx` — sharp corners

**Step 1: Rewrite PropertyCard as horizontal row**

Replace `PropertyCard` component body in `src/components/property/PropertyCard.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Building2, Calendar, Home, Heart } from "lucide-react";
import { formatPrice, formatPriceRange, formatDate } from "@/lib/format";
import { useFavorites } from "@/components/auth/FavoritesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/image-urls";
import type { Project } from "@/types/database";

interface PropertyCardProps {
  project: Project;
  index?: number;
}

export function PropertyCard({ project, index = 0 }: PropertyCardProps) {
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const isFavorited = isFavorite(project.id);

  const primaryImage = project.images?.find((img) => img.is_primary) || project.images?.[0];
  const minBedrooms = project.configurations?.length
    ? Math.min(...project.configurations.filter((c) => c.bedrooms).map((c) => c.bedrooms!))
    : null;
  const maxBedrooms = project.configurations?.length
    ? Math.max(...project.configurations.filter((c) => c.bedrooms).map((c) => c.bedrooms!))
    : null;

  const bedroomText =
    minBedrooms && maxBedrooms
      ? minBedrooms === maxBedrooms
        ? `${minBedrooms} BHK`
        : `${minBedrooms}-${maxBedrooms} BHK`
      : null;

  const statusColors: Record<string, string> = {
    upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    ongoing: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?redirectTo=${encodeURIComponent(`/properties/${project.slug}`)}`);
      return;
    }

    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 600);
    await toggleFavorite(project.id);
  };

  return (
    <Link
      href={`/properties/${project.slug}`}
      className="group flex flex-col sm:flex-row border-b border-border transition-colors duration-200 hover:bg-muted/50"
    >
      {/* Image */}
      <div className="relative sm:w-[45%] h-56 sm:h-auto overflow-hidden bg-muted">
        {primaryImage ? (
          <img
            src={getImageUrl(primaryImage.image_path, "card")}
            alt={primaryImage.alt_text || project.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Building2 className="w-12 h-12" />
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-colors duration-200 hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Details */}
      <div className="sm:w-[55%] p-5 sm:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-sm border ${
              statusColors[project.status] || statusColors.ongoing
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          {project.property_type && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-sm border border-border text-muted-foreground">
              {project.property_type.charAt(0).toUpperCase() + project.property_type.slice(1)}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-semibold text-foreground mb-1 line-clamp-1">
          {project.name}
        </h3>

        {project.builder && (
          <p className="text-sm text-muted-foreground mb-2">by {project.builder.name}</p>
        )}

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {project.locality ? `${project.locality}, ` : ""}
            {project.city}
          </span>
        </div>

        <p className="text-2xl font-bold text-foreground mb-1">
          {formatPriceRange(project.price_min, project.price_max, project.price_on_request)}
        </p>
        {project.price_per_sqft && (
          <p className="text-xs text-muted-foreground mb-3">{formatPrice(project.price_per_sqft)}/sqft</p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {bedroomText && (
            <div className="flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
              {bedroomText}
            </div>
          )}
          {project.possession_date && (
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {formatDate(project.possession_date)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Skeleton loader
export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row border-b border-border">
      <div className="sm:w-[45%] h-56 sm:h-48 skeleton" />
      <div className="sm:w-[55%] p-5 sm:p-8 space-y-3">
        <div className="h-4 w-20 skeleton" />
        <div className="h-6 w-2/3 skeleton" />
        <div className="h-4 w-1/2 skeleton" />
        <div className="h-7 w-1/3 skeleton" />
        <div className="flex gap-4">
          <div className="h-4 w-16 skeleton" />
          <div className="h-4 w-20 skeleton" />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Rewrite PropertyGrid as stacked rows**

Replace `PropertyGrid` in `src/components/property/PropertyGrid.tsx` with:

```tsx
"use client";

import { PropertyCard, PropertyCardSkeleton } from "./PropertyCard";
import { Home, Search } from "lucide-react";
import type { Project } from "@/types/database";

interface PropertyGridProps {
  projects: Project[];
  isLoading?: boolean;
}

export function PropertyGrid({ projects, isLoading = false }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-border border-t border-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground text-lg font-medium mb-2">No properties found</p>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      {projects.map((project) => (
        <PropertyCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Step 3: Update PropertyFilters — sharp corners**

In `src/components/property/PropertyFilters.tsx`, change the outer div:
```tsx
<div className="border-b border-border pb-4 mb-6">
```
(was `bg-white rounded-lg shadow p-4 mb-6`)

Change all `<select>` elements from `rounded-md` to `rounded-sm`:
```tsx
className="h-9 px-3 rounded-sm border border-input bg-background text-sm"
```
(was `h-10 px-3 rounded-md`)

**Step 4: Update SortDropdown — sharp corners**

In `src/components/property/SortDropdown.tsx`, change:
```tsx
className="px-3 py-1.5 text-sm border rounded-sm bg-background text-foreground"
```
(was `rounded-md bg-white text-gray-700`)

**Step 5: Update listing page layout**

In `src/app/(main)/properties/page.tsx`, change outer div:
```tsx
<div className="min-h-screen bg-background pt-16 md:pt-20">
```
(was `bg-gray-50`)

Change loading skeleton:
```tsx
<div className="w-24 h-9 bg-muted rounded-sm animate-pulse" />
```
(was `rounded-lg`)

**Step 6: Commit**

```bash
git add src/components/property/PropertyCard.tsx src/components/property/PropertyGrid.tsx src/components/property/PropertyFilters.tsx src/components/property/SortDropdown.tsx src/app/\(main\)/properties/page.tsx
git commit -m "style: listing page — full-width horizontal rows, sharp, no cards"
```

---

### Task 4: Restyle Property Detail Page

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`
- Modify: `src/components/property/SectionNav.tsx`
- Modify: `src/components/property/QuickCtaSidebar.tsx`
- Modify: `src/components/property/MobileCtaBar.tsx`
- Modify: `src/components/property/PointsOfInterest.tsx`
- Modify: `src/components/property/InvestmentInsights.tsx`
- Modify: `src/components/property/ProjectDetailStats.tsx`
- Modify: `src/components/property/InquiryForm.tsx`

**Step 1: Restyle SectionNav**

In `src/components/property/SectionNav.tsx`, replace the inner sticky div (line 87-115):
```tsx
<div className="border-b border-border">
  <div className="max-w-7xl mx-auto px-4">
    <div
      ref={tabsRef}
      className="flex gap-6 overflow-x-auto scrollbar-hide py-3 md:justify-start"
    >
      {sections.map((s) => {
        const isActive = activeId === s.id;
        return (
          <button
            key={s.id}
            ref={isActive ? activeTabRef : undefined}
            onClick={() => handleClick(s.id)}
            className={`relative whitespace-nowrap pb-3 text-sm font-medium transition-colors shrink-0 ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  </div>
</div>
```

Key changes: removed `bg-card/95 backdrop-blur-md shadow-sm`, removed `rounded-full` pills, active = full-width underline not centered dot, no bg fill on active.

**Step 2: Restyle detail page — remove Card wrappers**

In `src/app/(main)/properties/[slug]/page.tsx`, make these changes:

Hero: change height from `h-[400px]` to `h-[500px]`.

Change outer div from `bg-gray-50` to `bg-background`.

For Overview quick info, replace `<Card><CardContent>` with:
```tsx
<div className="py-6 border-b border-border">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    ...
  </div>
</div>
```

For Highlights, replace `<Card><CardHeader><CardTitle>` with:
```tsx
<div className="py-6 border-b border-border">
  <h3 className="font-display text-lg font-semibold mb-4">Project Highlights</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {project.highlights.map((h, i) => (
      <div key={i} className="flex items-start gap-3 py-2">
        <span className="text-primary mt-0.5">
          <DynamicIcon name={h.icon_name || "circle-check"} className="w-5 h-5" />
        </span>
        <span>{h.text}</span>
      </div>
    ))}
  </div>
</div>
```
(Removed `rounded-lg bg-gray-50` on items)

For About section, replace Card wrapper with:
```tsx
<div className="py-6 border-b border-border">
  <h3 className="font-display text-lg font-semibold mb-4">About this Project</h3>
  <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
</div>
```

For Amenities, replace Card wrapper with:
```tsx
<div className="py-6 border-b border-border">
  <h3 className="font-display text-lg font-semibold mb-4">Amenities</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    ...
  </div>
</div>
```

For Specifications, replace Card wrapper with:
```tsx
<div className="py-6 border-b border-border">
  <h3 className="font-display text-lg font-semibold mb-4">Specifications</h3>
  <div className="divide-y divide-border">
    ...
  </div>
</div>
```

For Parking, replace Card wrapper similarly.

For Location, replace Card wrapper with:
```tsx
<div className="py-6 border-b border-border">
  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
    <MapPin className="w-5 h-5" /> Location
  </h3>
  ...
</div>
```

Change map container from `rounded-lg` to `rounded-sm`.

For Gallery, replace Card wrapper and change `rounded-lg` → `rounded-sm` on images.

For 3D Walkthrough, change `rounded-xl` to `rounded-sm`, `rounded-lg` to `rounded-sm`.

Change main content spacing from `space-y-6` to `space-y-0` (border-b handles separation now).

**Step 3: Restyle sidebar**

In `src/components/property/QuickCtaSidebar.tsx`, change outer div:
```tsx
<div className="border-l border-border pl-6 space-y-4">
```
(was `rounded-xl border border-border bg-card p-5 space-y-4`)

Change WhatsApp button from `rounded-lg` to `rounded-sm`.
Change Schedule Visit button from `rounded-lg` to `rounded-sm`.

**Step 4: Restyle MobileCtaBar**

In `src/components/property/MobileCtaBar.tsx`, change buttons from `rounded-lg` to `rounded-sm`.

**Step 5: Restyle PointsOfInterest**

In `src/components/property/PointsOfInterest.tsx`, replace the Card wrapper with a plain div:
```tsx
<div className="py-6 border-b border-border">
  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
    <MapPin className="w-5 h-5" /> Nearby Places
  </h3>
  ...
</div>
```

Change category pills from `rounded-full` to `rounded-sm`.

**Step 6: Restyle InvestmentInsights**

In `src/components/property/InvestmentInsights.tsx`, change outer div:
```tsx
<div className="py-6 border-b border-border">
```
(was `rounded-xl border border-border bg-card p-6`)

**Step 7: Restyle ProjectDetailStats**

In `src/components/property/ProjectDetailStats.tsx`, change outer div:
```tsx
<div className="py-6 border-b border-border">
```
(was `rounded-xl border border-border bg-card p-6`)

**Step 8: Restyle InquiryForm**

In `src/components/property/InquiryForm.tsx`:
- Change error div from `rounded-lg` to `rounded-sm`
- Change submit button: replace `bg-gradient-gold hover:opacity-90 shadow-gold` with `bg-primary hover:bg-primary/90`
- Change success WhatsApp button from `rounded-lg` to `rounded-sm`

**Step 9: Commit**

```bash
git add src/app/\(main\)/properties/\[slug\]/page.tsx src/components/property/SectionNav.tsx src/components/property/QuickCtaSidebar.tsx src/components/property/MobileCtaBar.tsx src/components/property/PointsOfInterest.tsx src/components/property/InvestmentInsights.tsx src/components/property/ProjectDetailStats.tsx src/components/property/InquiryForm.tsx
git commit -m "style: detail page — remove card wrappers, flat sections, sharp corners"
```

---

### Task 5: Restyle Homepage Sections

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/FeaturedListings.tsx`
- Modify: `src/components/home/WhyChooseUs.tsx`
- Modify: `src/components/home/VirtualTourSection.tsx`
- Modify: `src/components/home/MarketInsights.tsx`
- Modify: `src/components/home/TestimonialsSection.tsx`
- Modify: `src/components/home/WhatsAppButton.tsx`
- Modify: `src/app/(main)/page.tsx`

**Step 1: Restyle Hero**

In `src/components/home/Hero.tsx`:

Replace gradient background:
```tsx
<div className="absolute inset-0 bg-[var(--charcoal)]" />
```
(was `bg-gradient-to-br from-[var(--charcoal)] via-...`)

Change badge from `rounded-full` to `rounded-sm`:
```tsx
<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm px-4 py-1.5 mb-6">
```

Change pulsing dot from `rounded-full animate-pulse` to just `rounded-full`:
```tsx
<span className="w-2 h-2 bg-primary rounded-full" />
```

Replace `text-gradient-gold` span with flat gold:
```tsx
<span className="text-primary">Chandigarh Tricity</span>
```
(was `text-gradient-gold`)

Replace CTA button `bg-gradient-gold shadow-gold` with `bg-primary`:
```tsx
className="bg-primary text-white px-8 py-4 rounded-sm font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
```

**Step 2: Restyle FeaturedListings**

In `src/components/home/FeaturedListings.tsx`:

The carousel still uses PropertyCard, which is now horizontal rows. Change the carousel item width to `min-w-full` so each featured listing takes full carousel width:
```tsx
className="min-w-full snap-start flex-shrink-0"
```
(was `min-w-[320px] max-w-[340px]`)

Or better: switch from horizontal scroll carousel to a stacked list showing 3-4 featured:
```tsx
<div className="space-y-0 border-t border-border">
  {projects.slice(0, 4).map((project, i) => (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.1 }}
    >
      <PropertyCard project={project} index={i} />
    </motion.div>
  ))}
</div>
```

Remove scroll buttons (ChevronLeft/ChevronRight) and scrollRef logic.

**Step 3: Restyle WhyChooseUs**

In `src/components/home/WhyChooseUs.tsx`:

Replace the card div for each item:
```tsx
className="text-center py-6"
```
(was `bg-card p-6 rounded-lg shadow-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all group text-center`)

Replace the icon container:
```tsx
<div className="w-14 h-14 bg-primary/10 flex items-center justify-center mx-auto mb-4">
  <usp.icon className="w-7 h-7 text-primary" />
</div>
```
(was `bg-gradient-gold rounded-lg ... group-hover:scale-110`)

**Step 4: Restyle VirtualTourSection**

In `src/components/home/VirtualTourSection.tsx`:

Replace bullet points — change `rounded-full bg-gradient-gold` to sharp:
```tsx
<div className="w-6 h-6 bg-primary flex items-center justify-center flex-shrink-0">
  <ArrowRight className="w-3 h-3 text-white" />
</div>
```

Replace CTA button:
```tsx
className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-primary/90 transition-colors"
```
(removed `bg-gradient-gold shadow-gold`)

Change video placeholder:
```tsx
<div className="aspect-video bg-charcoal-light border border-white/10 flex items-center justify-center relative overflow-hidden">
```
(removed `rounded-lg`)

Remove the gradient overlay inside:
Delete `<div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent" />`

**Step 5: Restyle MarketInsights**

In `src/components/home/MarketInsights.tsx`:

Replace card div:
```tsx
className="py-6 relative"
```
(was `bg-card p-6 rounded-lg shadow-card border border-border relative overflow-hidden`)

Replace badge:
```tsx
className="absolute top-0 right-0 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-sm border border-primary/20"
```
(was `rounded-full`)

Add `divide-x divide-border` to the grid and remove individual borders.

**Step 6: Restyle TestimonialsSection**

In `src/components/home/TestimonialsSection.tsx`:

Replace card div:
```tsx
className="py-6 border-b border-border last:border-0"
```
(was `bg-card p-6 rounded-lg shadow-card border border-border`)

Layout change: switch from 3-column grid to stacked list:
```tsx
<div className="max-w-2xl mx-auto divide-y divide-border">
```

**Step 7: Restyle WhatsAppButton**

In `src/components/home/WhatsAppButton.tsx`, change from round to sharp:
```tsx
className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[hsl(142,70%,40%)] hover:bg-[hsl(142,70%,35%)] flex items-center justify-center shadow-lg transition-colors"
```
(removed `rounded-full hover:shadow-xl group`)

Change icon: remove `group-hover:scale-110 transition-transform`.

**Step 8: Restyle homepage contact section**

In `src/app/(main)/page.tsx`, no changes needed — the InquiryForm was already restyled in Task 4.

**Step 9: Commit**

```bash
git add src/components/home/Hero.tsx src/components/home/FeaturedListings.tsx src/components/home/WhyChooseUs.tsx src/components/home/VirtualTourSection.tsx src/components/home/MarketInsights.tsx src/components/home/TestimonialsSection.tsx src/components/home/WhatsAppButton.tsx
git commit -m "style: homepage sections — flat charcoal hero, editorial testimonials, sharp everything"
```

---

### Task 6: Restyle Header + Footer + MobileNav

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/MobileNav.tsx`

**Step 1: Restyle Header**

In `src/components/layout/Header.tsx`:

Change the "View Properties" CTA button:
```tsx
className="bg-primary text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors"
```
(was `bg-gradient-gold ... rounded-sm`)

Change `shadow-card` on solid header to `shadow-subtle`:
```tsx
showSolid
  ? "bg-card/95 backdrop-blur-md border-b border-border"
  : "bg-transparent border-b border-transparent"
```
(removed `shadow-card`)

Change loading skeleton from `rounded` to `rounded-sm`:
```tsx
<div className="w-20 h-8 bg-muted rounded-sm animate-pulse" />
```

**Step 2: Footer is already clean**

Footer uses `bg-charcoal` with text links — no rounded elements to change. Just verify there are no `rounded-*` classes beyond `rounded-sm`. The footer is already fairly linear.

**Step 3: MobileNav adjustments**

In `src/components/layout/MobileNav.tsx`, this is already using full-screen overlay with text links — minimal changes needed. The SignUp button will inherit the new Button styles (rounded-sm, no scale).

**Step 4: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/layout/MobileNav.tsx
git commit -m "style: header/footer — remove gradient CTA, clean shadow"
```

---

### Task 7: Restyle AnimateIn + Cleanup Remaining References

**Files:**
- Modify: `src/components/ui/AnimateIn.tsx` — reduce motion intensity
- Grep and fix: any remaining `bg-gradient-gold`, `shadow-card`, `shadow-gold`, `rounded-lg`, `rounded-xl`, `rounded-full` (non-avatar), `animate-bounce-in`, `animate-float`, `animate-heart-beat` references across all public-facing components

**Step 1: Tone down AnimateIn**

In `src/components/ui/AnimateIn.tsx`, reduce the travel distance:
```tsx
const initial = {
  opacity: 0,
  y: direction === 'up' ? 8 : 0,
  x: direction === 'left' ? -12 : direction === 'right' ? 12 : 0,
};
```
(was y: 20, x: -24/24)

Change duration from 0.5 to 0.3:
```tsx
transition={{ duration: 0.3, delay, ease: [0.4, 0, 0.2, 1] }}
```

**Step 2: Global search and fix remaining old classes**

Run grep across `src/` (excluding admin/) for these classes and replace:
- `bg-gradient-gold` → `bg-primary`
- `shadow-card` → (remove or replace with `shadow-subtle` where needed)
- `shadow-gold` → (remove)
- `text-gradient-gold` → `text-primary`
- `animate-bounce-in` → `animate-slide-up` or remove
- `animate-float` → remove
- `animate-heart-beat` → remove
- `badge-pulse` → remove
- `rounded-xl` → `rounded-sm` (in non-admin components)
- `rounded-lg` → `rounded-sm` (in non-admin components, except where it's on a circular avatar)
- `rounded-full` → keep only on actual circles (avatars, dots), change to `rounded-sm` on pills/badges

**Step 3: Build check**

Run: `npm run build` (or `pnpm build`)
Expected: no build errors. Fix any broken references to deleted CSS classes.

**Step 4: Commit**

```bash
git add -A
git commit -m "style: cleanup — fix remaining old class references, tone down animations"
```

---

### Task 8: Visual QA + Final Polish

**Step 1: Start dev server and visually check each page**

Run: `npm run dev`

Check:
- `/` — homepage: hero, featured, why-us, virtual tour, market insights, testimonials, contact
- `/properties` — listing page: full-width rows, filters, sort
- `/properties/[any-slug]` — detail page: hero, section nav, content sections, sidebar
- `/saved` — saved page
- Mobile responsive on all above (resize to 375px)

**Step 2: Fix any visual issues found**

Common things to check:
- No remaining rounded-xl/rounded-lg on public pages
- No gradients visible
- No hover-lift shadows
- Section nav underline working correctly
- Sidebar border-l visible on desktop
- Mobile CTA bar sharp corners
- Forms have sharp inputs
- Buttons are flat, sharp

**Step 3: Final commit**

```bash
git add -A
git commit -m "style: visual QA fixes"
```

**Step 4: Push and open PR**

```bash
git push -u origin rohan/ui-overhaul
gh pr create --title "Dramatic UI overhaul — linear/editorial aesthetic" --body "$(cat <<'EOF'
## Summary
- Overhauled global design tokens: near-zero border radius, flat shadows, no gradients
- Restyled all base UI components (Button, Card, Input, Select) — sharp, minimal
- Property listing page: full-width horizontal rows replacing card grid
- Property detail page: removed Card wrappers, content flows with border-b separators
- Homepage: flat hero, editorial testimonials, sharp everything
- Header/Footer: removed gradient CTAs, clean shadows

## Test plan
- [ ] Visual check homepage on desktop + mobile
- [ ] Visual check listing page — rows layout, filters, sort
- [ ] Visual check detail page — section nav, content sections, sidebar
- [ ] Check dark mode still works
- [ ] No console errors or build warnings

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
