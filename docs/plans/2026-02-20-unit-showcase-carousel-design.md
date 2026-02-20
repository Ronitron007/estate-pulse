# Unit Showcase Carousel Design

**Date**: 2026-02-20
**Status**: Approved

## Goal

Replace the dated Tower Details cards + Unit Configurations table with a single combined carousel component. Each slide = one unit configuration with full-width floor plan image, specs, and tower info.

## Approach

Framer Motion carousel (no new deps). Already have framer-motion installed.

## Component Structure

```
UnitShowcase (replaces Tower Details + Unit Configurations)
├── SectionHeader ("Unit Plans & Configurations")
├── PillNav (config pills: "2BHK Type A", "3BHK - Tower Iris", etc.)
├── CarouselContainer (framer-motion AnimatePresence)
│   └── ConfigSlide (one per config)
│       ├── FloorPlanImage (full-width CldImage, click-to-expand)
│       ├── SpecsBar (key stats row below image)
│       └── TowerBadge (tower name + tower-level specs)
├── ArrowNav (left/right chevrons overlaid on carousel)
└── FloorPlanLightbox (framer-motion modal for expanded floor plan)
```

## Slide Layout

```
┌──────────────────────────────────────────┐
│  ┌─────────┐  2BHK Type A  │ Tower Iris  │  ← Header bar
│  │ bed/bath │  Floors 5-22  │ 25 floors   │
│  └─────────┘               │             │
├──────────────────────────────────────────┤
│                                          │
│         [Full-width Floor Plan]          │  ← CldImage, click to expand
│         (aspect-ratio ~4:3)              │
│                                          │
├──────────────────────────────────────────┤
│  Carpet     Super      Price     Balcony │  ← Specs bar
│  850 sqft   1100 sqft  ₹85L     120sqft │
└──────────────────────────────────────────┘
```

## Carousel Mechanics

- `AnimatePresence mode="wait"` for slide transitions
- Horizontal slide + fade animation (direction-aware)
- `drag="x"` on slide with `onDragEnd` threshold for swipe
- Keyboard: left/right arrow keys navigate

## Pill Navigation

- Horizontal scrollable row of pill buttons above carousel
- Active pill: solid fill. Others: outlined
- Click pill → jump to config slide
- Auto-scroll active pill into view

## Lightbox

- Framer-motion overlay with backdrop blur
- `layoutId` for smooth expand/collapse from thumbnail
- Close: X button, click outside, Escape key

## Data Grouping

- Configs displayed in DB order (tower sort_order, then config order)
- Pill label: `config_name || "{bedrooms}BHK"`, append tower name if tower exists
- Tower-level specs (lifts, staircase, units/floor) shown in slide's tower badge

## Empty/Fallback States

- No floor plan → styled placeholder "Floor plan coming soon"
- No configurations → section not rendered
- Single config → carousel structure but hide arrows and pills

## Files Affected

- `src/app/(main)/properties/[slug]/page.tsx` — remove Tower Details + Unit Configurations, add UnitShowcase
- `src/components/property/UnitShowcase.tsx` — new component (carousel + slides)
- `src/components/property/FloorPlanLightbox.tsx` — new component (modal)
