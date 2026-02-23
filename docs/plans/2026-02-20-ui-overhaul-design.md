# UI Overhaul Design — Linear/Editorial Aesthetic

**Date**: 2026-02-20
**Status**: Approved

## Direction

Dramatic overhaul. Move from roundy/segmented card-based UI to minimalist, linear, editorial-flow design. References: Linear, Compass, Sotheby's, Vercel Geist.

## Decisions

- Keep gold/charcoal color scheme
- Keep shadcn/ui (only lib, restyle it)
- Keep all homepage sections (restyle, don't cut)
- Listing page: full-width horizontal rows (image left, details right)
- Detail page: sidebar on desktop, sticky bar on mobile
- Serif headings (Playfair) stay, Inter body stays
- Admin pages: unchanged

## 1. Global Design Tokens (globals.css)

### Border Radius
- `--radius: 0.125rem` (2px base). Everything near-sharp.
- All radius scale vars recalculated from new base.

### Shadows
- Delete `--shadow-card`, `--shadow-card-hover`, `--shadow-gold`
- New: `--shadow-subtle: 0 1px 2px hsl(220 20% 10% / 0.05)`

### Gradients
- Delete `--gradient-gold`, `--gradient-dark`
- Exception: hero image dark overlay for text readability

### Animations — Strip
- DELETE: `bounce-in`, `heart-beat`, `wobble`, `float`, `icon-bounce`, `badge-pulse`, `gentle-pulse`
- DELETE: `--ease-bounce`, `--ease-snap`
- KEEP: `fade-in` (opacity 0->1, 200ms), `shimmer` (loading)
- NEW: `slide-up` (translateY 8px->0 + fade, 300ms)
- KEEP: `--ease-smooth`
- KEEP: `img-hover-zoom` (subtle, 1.03 not 1.05)
- DELETE: `card-hover-lift`, `card-lift`, `btn-press`
- RESTYLE: `stagger-*` delays stay but used with slide-up not bounce-in

### Typography
- Fonts unchanged (Playfair Display + Inter)
- Section labels: `tracking-[0.2em] uppercase text-xs font-medium`
- Increase heading/body size contrast

### Colors
- Keep all color tokens as-is
- Remove gradient tokens only

## 2. Property Listing Page (/properties)

### Layout: Full-Width Horizontal Rows
- Each property = one full-width row
- Left ~45%: image, sharp corners, 280px height, object-cover
- Right ~55%: name (Playfair text-xl), location (text-sm muted), price (text-2xl bold), specs row (BHK / sqft / possession), status badge (rounded-sm, border, no pill)
- Rows separated by `border-b border-border` — no gaps, no shadows
- Hover: `bg-muted/50` background tint, no lift
- Entire row = clickable link
- Filters: horizontal, sharp corners on all inputs/selects
- Sort bar: stays, restyled sharp

## 3. Property Detail Page (/properties/[slug])

### Hero
- Full-bleed image, edge-to-edge, 500px height
- Name + location overlaid bottom-left on subtle dark gradient overlay
- Price displayed prominently

### Section Nav
- Sticky. Remove background fill.
- Active tab = underline. Baseline = `border-b`.

### Content Layout
- Desktop: 2-column (content ~65%, sidebar ~35%)
- Mobile: single column + sticky bottom bar

### Content Sections
- No card wrappers. Each section = heading + content.
- Separated by `py-16` vertical spacing + optional `border-b`
- No box borders, no card shadows around sections

### Sidebar (Desktop)
- Slim: price + one gold CTA + phone number
- No card wrapper — content with `border-l` separator
- Sticky `top-20`

### Mobile CTA
- Sticky bottom bar: price + CTA button, sharp corners

## 4. Homepage Sections (all kept, all restyled)

### Hero
- Full-height dark background, flat charcoal (no gradient)
- CTA buttons: flat gold, sharp corners
- Stats row: cleaner spacing, no boxing

### FeaturedListings
- Carousel stays. Cards: sharp corners, border only, no shadow, no hover-lift

### WhyChooseUs
- 4-column grid. Remove card boxing per item.
- Just icon + text, separated by whitespace. No background/shadow per item.

### VirtualTour
- Editorial band: full-width image/video left, text right

### MarketInsights
- Remove card containers. Inline data with dividers.

### Testimonials
- Remove rounded cards. Quote mark + text + attribution.
- Separated by `border-b`. Editorial style.

### Contact/InquiryForm
- Full-width section, sharp inputs, flat gold submit

## 5. UI Base Components

### Button
- `rounded-sm` (2px). No scale-on-hover.
- Hover = subtle background shift only.
- Ghost: text only, underline on hover.

### Card
- `rounded-sm`, `border`, no shadow, no hover-lift.
- Used sparingly — most content flows free.

### Input
- `rounded-sm`, `border`.
- Focus: thin gold ring, no glow effect.

### Select
- `rounded-sm`. Sharp dropdown. No slide animation.

### PropertyCard (for featured/saved pages if still card-format)
- Sharp corners, border only, no shadow, no hover-lift.
- Image zoom stays (1.03 scale).

## 6. Header + Footer

### Header
- Fixed behavior stays. Remove rounded elements.
- Nav links: text, underline on hover/active.
- Auth: ghost button. CTA: flat gold, sharp.

### Footer
- Dark charcoal stays. Clean spacing. Sharp elements.

## 7. Scope Exclusions
- Admin pages: unchanged
- Auth pages: light restyle (sharp corners only)
- Map components: unchanged (Google Maps controls are external)
