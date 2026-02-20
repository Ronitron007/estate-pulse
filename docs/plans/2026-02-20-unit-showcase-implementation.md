# Unit Showcase Carousel — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Tower Details cards + Unit Configurations table with a single Framer Motion carousel where each slide shows one unit config with full-width floor plan, specs, and tower info.

**Architecture:** Single `UnitShowcase` client component with pill nav, arrow nav, animated slides via `AnimatePresence`, and a lightbox modal. No new dependencies — uses framer-motion (already installed).

**Tech Stack:** React 19, Framer Motion, Tailwind CSS, Lucide icons, existing `getImageUrl()` CDN helper.

---

### Task 1: Create FloorPlanLightbox component

**Files:**
- Create: `src/components/property/FloorPlanLightbox.tsx`

**Context:** This is a reusable lightbox for floor plan images. Reference `src/components/property/PropertyGallery.tsx` for the existing lightbox pattern (lines 57-102). This version uses framer-motion for animations instead of plain conditionals.

**Step 1: Create the component**

Create `src/components/property/FloorPlanLightbox.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloorPlanLightboxProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

export function FloorPlanLightbox({ src, alt, open, onClose }: FloorPlanLightboxProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
          <motion.img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/property/FloorPlanLightbox.tsx
git commit -m "feat: add FloorPlanLightbox component"
```

---

### Task 2: Create UnitShowcase component

**Files:**
- Create: `src/components/property/UnitShowcase.tsx`

**Context:**
- Types: `Configuration` and `Tower` from `src/types/database.ts`
- Formatters: `formatArea`, `formatPriceRange` from `src/lib/format.ts`
  - `formatPriceRange(min, max, onRequest)` — for configs, call as `formatPriceRange(config.price, null, false)`
  - `formatArea(sqft)` — returns `"850 sq.ft"` or `""` if null
- Images: `getImageUrl(basePath, variant)` from `src/lib/image-urls.ts`
  - Floor plan path stored in `config.floor_plan_cloudinary_id` (it's a CDN path, not a Cloudinary ID despite the name)
  - Use `"card"` variant for the slide image, `"hero"` variant for lightbox
- Icons: Use Lucide — `BedDouble`, `Bath`, `Building2`, `Layers`, `Maximize`, `ChevronLeft`, `ChevronRight`
- The component is `"use client"` because it has state and animations

**Step 1: Create the component**

Create `src/components/property/UnitShowcase.tsx`. This is a large component — here's the full implementation:

```tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BedDouble, Bath, Building2, Layers, Maximize } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloorPlanLightbox } from "./FloorPlanLightbox";
import { formatArea, formatPriceRange } from "@/lib/format";
import { getImageUrl } from "@/lib/image-urls";
import type { Configuration, Tower } from "@/types/database";

interface UnitShowcaseProps {
  configurations: Configuration[];
  towers?: Tower[];
}

function getConfigLabel(config: Configuration): string {
  const name = config.config_name || (config.bedrooms ? `${config.bedrooms} BHK` : "Unit");
  if (config.tower?.name) return `${name} — ${config.tower.name}`;
  return name;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export function UnitShowcase({ configurations, towers }: UnitShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);

  const config = configurations[activeIndex];
  const tower = config?.tower || (config?.tower_id ? towers?.find((t) => t.id === config.tower_id) : undefined);
  const showNav = configurations.length > 1;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  const goNext = useCallback(() => {
    if (activeIndex < configurations.length - 1) goTo(activeIndex + 1);
  }, [activeIndex, configurations.length, goTo]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Auto-scroll active pill into view
  useEffect(() => {
    if (!pillsRef.current) return;
    const activePill = pillsRef.current.children[activeIndex] as HTMLElement;
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

  if (!configurations.length) return null;

  const floorPlanSrc = config.floor_plan_cloudinary_id
    ? getImageUrl(config.floor_plan_cloudinary_id, "card")
    : null;
  const floorPlanHero = config.floor_plan_cloudinary_id
    ? getImageUrl(config.floor_plan_cloudinary_id, "hero")
    : null;

  // Collect specs that have data
  const specs: { label: string; value: string }[] = [];
  if (config.carpet_area_sqft) specs.push({ label: "Carpet", value: formatArea(config.carpet_area_sqft) });
  if (config.super_area_sqft) specs.push({ label: "Super Area", value: formatArea(config.super_area_sqft) });
  if (config.built_up_area_sqft) specs.push({ label: "Built-up", value: formatArea(config.built_up_area_sqft) });
  if (config.balcony_area_sqft) specs.push({ label: "Balcony", value: formatArea(config.balcony_area_sqft) });
  if (config.price) specs.push({ label: "Price", value: `₹${formatPriceRange(config.price, null, false)}` });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Unit Plans & Configurations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pill Navigation */}
        {showNav && (
          <div ref={pillsRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {configurations.map((c, i) => (
              <button
                key={c.id}
                onClick={() => goTo(i)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  i === activeIndex
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {getConfigLabel(c)}
              </button>
            ))}
          </div>
        )}

        {/* Carousel */}
        <div className="relative overflow-hidden rounded-xl">
          {/* Arrow buttons */}
          {showNav && activeIndex > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full h-9 w-9 p-0"
              onClick={goPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          {showNav && activeIndex < configurations.length - 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full h-9 w-9 p-0"
              onClick={goNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={config.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              drag={showNav ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) goNext();
                else if (info.offset.x > 50) goPrev();
              }}
            >
              {/* Header bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 px-1">
                <h4 className="text-lg font-semibold">
                  {config.config_name || (config.bedrooms ? `${config.bedrooms} BHK` : "Unit")}
                </h4>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {config.bedrooms != null && (
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-4 h-4" /> {config.bedrooms}
                    </span>
                  )}
                  {config.bathrooms != null && (
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" /> {config.bathrooms}
                    </span>
                  )}
                  {config.floor_from != null && config.floor_to != null && (
                    <span>Floors {config.floor_from}–{config.floor_to}</span>
                  )}
                </div>
                {tower && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <Building2 className="w-3.5 h-3.5" />
                    {tower.name}
                    {tower.floor_from != null && tower.floor_to != null && (
                      <span className="text-blue-500 ml-1">· {tower.floor_to - tower.floor_from + 1} floors</span>
                    )}
                  </span>
                )}
              </div>

              {/* Floor Plan Image */}
              {floorPlanSrc ? (
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="relative w-full group cursor-zoom-in"
                >
                  <img
                    src={floorPlanSrc}
                    alt={`Floor plan — ${getConfigLabel(config)}`}
                    className="w-full rounded-lg object-contain bg-gray-50 border"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                    <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium shadow">
                      <Maximize className="w-4 h-4" /> View Full Size
                    </span>
                  </div>
                </button>
              ) : (
                <div className="w-full aspect-[4/3] rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Floor plan coming soon</p>
                </div>
              )}

              {/* Specs bar */}
              {specs.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4 px-1">
                  {specs.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs text-gray-500">{s.label}</p>
                      <p className="text-sm font-semibold">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tower details (secondary info) */}
              {tower && (tower.lifts_count || tower.staircase_info || tower.units_per_floor) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 px-1 text-xs text-gray-500">
                  {tower.units_per_floor && <span>{tower.units_per_floor} units/floor</span>}
                  {tower.lifts_count && (
                    <span>
                      {tower.lifts_count} {tower.lift_type || ""} lift{tower.lifts_count > 1 ? "s" : ""}
                    </span>
                  )}
                  {tower.staircase_info && <span>{tower.staircase_info}</span>}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide counter */}
        {showNav && (
          <p className="text-center text-xs text-gray-400">
            {activeIndex + 1} / {configurations.length}
          </p>
        )}
      </CardContent>

      {/* Lightbox */}
      {floorPlanHero && (
        <FloorPlanLightbox
          src={floorPlanHero}
          alt={`Floor plan — ${getConfigLabel(config)}`}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </Card>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/property/UnitShowcase.tsx
git commit -m "feat: add UnitShowcase carousel component"
```

---

### Task 3: Wire UnitShowcase into the property detail page

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`

**Context:** The page currently renders:
- Tower Details section at lines 279-304 (Card with tower cards grid)
- Unit Configurations section at lines 362-416 (Card with table)

Both need to be replaced with a single `<UnitShowcase>` component. The section should appear where Tower Details currently sits.

**Step 1: Replace Tower Details + Unit Configurations with UnitShowcase**

In `src/app/(main)/properties/[slug]/page.tsx`:

1. Add import at top (near other property component imports ~line 12):
```tsx
import { UnitShowcase } from "@/components/property/UnitShowcase";
```

2. Remove the `Home` import from lucide (line 4) if it's only used by Unit Configurations section. Keep `Car` and others.

3. Replace the Tower Details block (lines 279-304) with:
```tsx
{project.configurations && project.configurations.length > 0 && (
  <AnimateIn delay={0.28}>
    <UnitShowcase
      configurations={project.configurations}
      towers={project.towers}
    />
  </AnimateIn>
)}
```

4. Delete the entire Unit Configurations block (lines 362-416) — the IIFE that renders the table.

**Step 2: Verify the build compiles**

Run: `npx next build` (or `npm run dev` and check the page)
Expected: No TypeScript errors, page renders with new carousel

**Step 3: Commit**

```bash
git add src/app/(main)/properties/[slug]/page.tsx
git commit -m "feat: replace tower details + unit configs with UnitShowcase carousel"
```

---

### Task 4: Add scrollbar-hide utility

**Files:**
- Check: `src/app/globals.css` (or wherever Tailwind base styles live)

**Context:** The pill nav uses `scrollbar-hide` class for clean horizontal scrolling. Need to ensure this utility exists.

**Step 1: Add scrollbar-hide if missing**

Check if `scrollbar-hide` is already defined in the CSS. If not, add to the global CSS:

```css
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

**Step 2: Commit (if changed)**

```bash
git add src/app/globals.css
git commit -m "feat: add scrollbar-hide utility"
```

---

### Task 5: Visual QA and polish

**Files:**
- Possibly modify: `src/components/property/UnitShowcase.tsx`

**Step 1: Test with real data**

Open the property detail page in the browser for a project that has:
- Multiple configurations
- Configurations linked to towers
- At least one config with `floor_plan_cloudinary_id` set

Verify:
- Pill nav scrolls, active pill highlights
- Arrow nav works (left/right)
- Swipe gesture works on mobile
- Keyboard arrow keys navigate
- Floor plan click opens lightbox
- Lightbox closes on Escape, click outside, X button
- Specs bar shows only available data
- Tower badge shows tower info
- Single-config projects hide pills and arrows
- Configs without floor plans show placeholder

**Step 2: Test empty states**

- Project with no configurations → section should not render
- Config with no floor plan → shows "Floor plan coming soon" placeholder
- Config with no tower → no tower badge shown

**Step 3: Fix any issues found, commit**

```bash
git add -A
git commit -m "fix: UnitShowcase visual polish"
```

---

## Unresolved Questions

- `floor_plan_cloudinary_id` — do any configs currently have this field populated in the DB? If not, the floor plan images will all show placeholders until data is seeded.
- Should the `Home` icon import be removed from page.tsx or is it used elsewhere on that page?
