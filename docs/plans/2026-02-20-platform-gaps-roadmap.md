
# Platform Gaps Roadmap
**Date:** 2026-02-20
**Sources:** Truva competitive analysis, Northview Homez brochure gap analysis
**Context:** PerfectGhar deals with full builder projects (multi-tower, multi-config), not single-unit resales like Truva. Roadmap accounts for this.

---

## How This Is Organized

Gaps from both analyses are deduplicated and merged into a single list, then grouped into 5 phases. Each phase is roughly a sprint. Phase 1 has the highest impact-to-effort ratio.

Legend: `[T]` = from Truva analysis, `[B]` = from brochure analysis, `[TB]` = both

---

## Phase 1 — Data Foundation + Quick Wins

These are either pure data-model additions (unlock richer listings) or trivial frontend wins. Do these first because everything downstream depends on having the data.

### 1.1 Project Highlights / USPs `[TB]`
- **What:** Repeatable ordered list of punchy selling points per project
- **Why:** Both Truva ("Top reasons to love this home") and brochures ("12 Ultra Luxury Sky-Villas") rely on this heavily. Currently only freeform `description`
- **Work:** Add `highlights` JSONB array to projects table. Admin form: repeater input. Detail page: icon + text cards section
- **Effort:** Small

### 1.2 Tagline / Subtitle `[B]`
- **What:** Short marketing line (~100 chars) displayed under project name
- **Why:** Every brochure has taglines ("Gateway of Chandigarh"). Cards and hero look flat without one
- **Work:** Add `tagline` text field to projects table. Show on cards + detail hero
- **Effort:** Tiny

### 1.3 Per Sq Ft Price Display `[T]`
- **What:** Show price/sqft on cards and detail page
- **Why:** Standard comparison metric in Indian RE. Field `price_per_sqft` already exists in DB
- **Work:** Frontend-only — display existing field on property cards + detail page. Auto-calc from config data if not manually set
- **Effort:** Tiny

### 1.4 Floor Plan Area Breakdown `[B]`
- **What:** Add balcony_area_sqft, covered_area_sqft, super_area_sqft to configurations
- **Why:** Brochures always show 4 area types. Buyers expect this. We only store carpet + built-up
- **Work:** DB migration + admin form fields + detail page display
- **Effort:** Small

### 1.5 Tower-Level Data Model `[B]`
- **What:** `towers` table — name, floor_count, floor_range, units_per_floor, lifts, staircase info
- **Why:** Multi-tower projects are our bread and butter. Can't represent "Tower A: floors 1-7, 2 units/floor" today
- **Work:** New table + admin UI for tower CRUD + link configs to towers
- **Effort:** Medium

### 1.6 Config-to-Tower + Floor Mapping `[B]`
- **What:** Link each configuration to tower(s) + floor range + type label
- **Why:** "3BHK Type A, Tower A&B, Floors 1-7" is how buyers think. Depends on 1.5
- **Work:** FK or M2M to towers, floor_from/floor_to, type_label fields on configs
- **Effort:** Small (after 1.5)

### 1.7 Technical Specifications `[B]`
- **What:** Room-by-room material specs (flooring, fittings, fixtures, provisions)
- **Why:** Every brochure has a full page of specs. Zero fields for this today. Serious buyers care deeply
- **Work:** `specifications` JSONB on projects — keyed by room category. Admin: nested form. Detail page: collapsible table
- **Effort:** Medium

### 1.8 Sort Options on Listings `[T]`
- **What:** Sort dropdown: Price low-high, high-low, newest, possession date
- **Why:** Trivial to implement, huge usability gap. Every property portal has this
- **Work:** Frontend dropdown + Supabase order_by param
- **Effort:** Tiny

### 1.9 Flexible Proximity / POIs `[TB]`
- **What:** Replace hardcoded 5-key location_advantages with flexible array of {name, category, distance, unit}
- **Why:** Truva shows categorized nearby places with distances. Brochures list 8+ landmarks. Current hardcoded keys are limiting
- **Work:** DB migration (new JSONB structure or related table), admin repeater, detail page with category tabs + map markers
- **Effort:** Medium

### 1.10 Parking Details `[B]`
- **What:** Parking types (stilt, basement, open, covered), basement levels, guest parking, allotment per unit
- **Why:** Universally present in brochures, commonly asked by buyers. Zero fields today
- **Work:** `parking` JSONB on projects. Admin form. Detail page section
- **Effort:** Small

---

## Phase 2 — Property Detail Page Overhaul

With Phase 1 data in place, the detail page needs a major upgrade to actually display it all.

### 2.1 Tabbed Detail Page Layout `[T]`
- **What:** Replace single scroll with horizontal tabs: About, Specs, Floor Plans, Location, Pricing, Gallery
- **Why:** Truva uses 8 tabs. Our page will be very long with Phase 1 data added. Tabs improve navigation
- **Work:** Refactor PropertyDetail into tabbed layout. Redistribute existing sections + new Phase 1 sections
- **Effort:** Medium

### 2.2 Price Breakdown Section `[T]`
- **What:** Show: agreement value, per-sqft, what's included (ACs, fittings, etc.), other expenses (stamp duty, registration, maintenance)
- **Why:** #1 buyer question is "what's the total cost?" Currently show only min-max range
- **Work:** Add `price_inclusions` (array of strings) and `additional_costs` (JSONB) fields. Frontend section under Pricing tab
- **Effort:** Small

### 2.3 Image Gallery Upgrade `[T]`
- **What:** Large primary image + thumbnail strip, left/right nav, "Show All" lightbox, image tag overlays
- **Why:** Gallery is most-interacted element. Ours is basic single-image display
- **Work:** Frontend component rewrite. Add `tag` field on project_images for labels ("Amenities View", "Pool Area", etc.)
- **Effort:** Medium

### 2.4 Site Plan + Cluster Plan Display `[B]`
- **What:** Dedicated sections for site plan (project layout) and cluster plans (per-floor unit arrangement)
- **Why:** These are not regular gallery images — they need context and their own section
- **Work:** Add `site_plan` and `cluster_plan` to image_type enum. Dedicated UI sections on detail page
- **Effort:** Small

### 2.5 Construction Quality Section `[B]`
- **What:** Construction technology name + quality attributes list (earthquake resistant, mivan, etc.)
- **Why:** Key differentiator for under-construction projects. Zero fields today
- **Work:** `construction_quality` JSONB on projects. Admin form. Detail page section
- **Effort:** Small

### 2.6 Views / Orientation `[B]`
- **What:** Per-project or per-config view descriptions (hills, city skyline, garden, pool)
- **Why:** Major selling point. Distinct from compass-direction facing
- **Work:** `views` text array on projects or configs. Small admin + display change
- **Effort:** Tiny

### 2.7 Special Rooms in Configs `[B]`
- **What:** Structured `special_rooms` array on configs (store, pooja_room, servant_room, study, utility)
- **Why:** "3BHK + Store + Pooja Room" is a real product variant in Indian RE. Enables filtering
- **Work:** Array field on configs + admin checkboxes + filter support
- **Effort:** Small

---

## Phase 3 — Trust, Conversion + Key Features

Features that build trust and convert browsers into leads.

### 3.1 About / Team Page `[T]`
- **What:** Founder story, team grid with photos, company values, media logos
- **Why:** No about page = no trust. For high-value RE transactions, buyers need to know who's behind it
- **Work:** Static page. Needs content: founder story, team photos, values
- **Effort:** Small (code), Medium (content)

### 3.2 Trust Signal Architecture `[T]`
- **What:** Trust pillars below hero, "Featured In" media banner, verification badges on property cards
- **Why:** Truva leads with trust. Our hero is transactional. Trust signals are scattered
- **Work:** Homepage redesign — hero section + trust pillars + press logos. Badge component for cards
- **Effort:** Medium

### 3.3 Hero Section Redesign `[T]`
- **What:** Emotional lifestyle imagery, tagline, social proof (family count), credibility badges
- **Why:** Hero decides in 3 seconds if visitor stays. Ours sells numbers, not feelings
- **Work:** New hero component with lifestyle imagery + emotional copy + social proof
- **Effort:** Medium (needs photography/design assets)

### 3.4 Download Brochure PDF `[TB]`
- **What:** "Download Brochure" button on detail page. Admin uploads PDF per project
- **Why:** Present in both Truva and every brochure. Acts as lead magnet
- **Work:** `brochure_url` field on projects. Cloud storage upload in admin. Download button on detail page. Optional: gate behind name+phone form for lead capture
- **Effort:** Small

### 3.5 Video Tour Embed `[T]`
- **What:** Video walkthrough player on detail page
- **Why:** `video_url` field already exists in DB. Just needs frontend display
- **Work:** YouTube/Vimeo embed component on detail page. Admin already has the field
- **Effort:** Tiny

### 3.6 EMI / Loan Calculator `[T]`
- **What:** Frontend calculator: price, down payment %, rate, tenure -> monthly EMI, total interest
- **Why:** Pure frontend, no API cost. Extremely useful for buyers. Truva has loan assistance CTA
- **Work:** React component with sliders/inputs + EMI formula. Place in Pricing tab
- **Effort:** Small

### 3.7 Property Card Redesign `[T]`
- **What:** Inline image carousel, image tags, more info density (BHK, area, price/sqft, locality)
- **Why:** Cards are the primary browse interface. Ours show single image + minimal info
- **Work:** New card component with carousel + tags + richer data display
- **Effort:** Medium

---

## Phase 4 — Discovery + Engagement

Better filtering, more ways to engage, SEO foundations.

### 4.1 Advanced Filters `[T]`
- **What:** Price range slider, BHK toggles, bathroom filter, locality chips with counts
- **Why:** Current filters are basic dropdowns. These are standard in every property portal
- **Work:** New filter sidebar component. Backend: query params for range/multi-select filters
- **Effort:** Medium

### 4.2 Schedule a Visit `[T]`
- **What:** Dedicated "Schedule Visit" CTA with date/time preference
- **Why:** Visit scheduling is distinct from general inquiry. Truva separates them
- **Work:** Variant of inquiry form with date/time fields. Separate CTA button
- **Effort:** Small

### 4.3 Contextual CTAs `[T]`
- **What:** Place relevant CTAs inside content sections — loan help near pricing, visit near gallery, etc.
- **Why:** Truva places CTAs contextually. Ours are limited to floating WhatsApp + generic form
- **Work:** CTA components placed within each detail page tab/section
- **Effort:** Small

### 4.4 Testimonials Carousel `[T]`
- **What:** Named quotes with bold headlines, prev/next navigation, customer photos
- **Why:** Current testimonials section is flat. Carousel with bold headlines is more impactful
- **Work:** Carousel component upgrade
- **Effort:** Small

### 4.5 Sticky Mobile CTA Bar `[T]`
- **What:** Fixed bottom bar with call/WhatsApp/inquiry buttons while scrolling property details
- **Why:** Mobile users lose CTAs as they scroll. Sticky bar keeps conversion always accessible
- **Work:** Fixed position component, visible only on mobile, on detail pages
- **Effort:** Tiny

### 4.6 Builder Address + Contact `[B]`
- **What:** Add address, city, state, pincode, phone, email to builders table
- **Why:** Buyers want to know where the builder is based. Currently missing
- **Work:** DB migration + admin form + display on builder pages
- **Effort:** Tiny

### 4.7 Share Property `[T]`
- **What:** Share button with Web Share API + WhatsApp + copy URL
- **Why:** Easy to add, enables organic distribution
- **Work:** Share button component on detail page
- **Effort:** Tiny

---

## Phase 5 — Differentiation + SEO

Longer-term investments for organic growth and competitive moat.

### 5.1 Township / Locality Pages `[T]`
- **What:** `/localities/[slug]` pages aggregating properties by area/society
- **Why:** People search "flats in Oberoi Garden City". Huge SEO value
- **Work:** New page template + locality data model + auto-aggregation from property locations
- **Effort:** Medium

### 5.2 Blog `[T]`
- **What:** Blog section for home buying tips, area guides, market trends
- **Why:** SEO engine. Truva has external blog. Can use MDX or headless CMS
- **Work:** MDX blog setup in Next.js or Sanity/Contentful integration
- **Effort:** Medium

### 5.3 Sell Your House Page `[T]`
- **What:** Marketing page for sellers with value props, process, testimonials, valuation form
- **Why:** Opens a new revenue channel. Depends on business model decision
- **Work:** Static marketing page + valuation form
- **Effort:** Small (code), requires business decision

### 5.4 3D Virtual Tours `[T]`
- **What:** Matterport-style 3D tour embed
- **Why:** `matterport_url` field already exists. Just needs frontend
- **Work:** iFrame embed on detail page when URL present
- **Effort:** Tiny (code), requires 3D scan content

### 5.5 Vastu / Facing Direction `[T]`
- **What:** Basic directional info (N/S/E/W facing) per unit or per config
- **Why:** Important in Indian market. Simplified version of Truva's full vastu chart
- **Work:** `facing` enum on configs. Display on detail page
- **Effort:** Tiny

### 5.6 Footer Redesign `[T]`
- **What:** Buyer/seller segmented links, locality links, blog link, structured contact info
- **Why:** Footer is underutilized SEO + navigation asset
- **Work:** Footer component redesign
- **Effort:** Small

### 5.7 Lead Magnet Downloads `[T]`
- **What:** Gated downloadable content (brochures, area guides) behind name+phone form
- **Why:** Lead capture mechanism. Brochure download from 3.4 is the first one
- **Work:** Gating UI component + lead storage
- **Effort:** Small

### 5.8 Careers Page `[T]`
- **What:** Company values + open positions
- **Why:** Low priority but easy. Builds brand
- **Work:** Static section on about page
- **Effort:** Tiny

---

## Our Existing Advantages (Preserve + Promote)

Things we have that Truva doesn't:
1. **Map view** (`/map`) for spatial browsing
2. **User accounts + saved properties** (Truva has no login)
3. **Text search** (Truva is filter-only)
4. **Multi-city support** (Truva is Mumbai-only)
5. **Full admin CMS** for property management
6. **Google OAuth login**

These should be prominently featured in marketing and not regressed during the roadmap work.

---

## Unresolved Questions

1. Towers table or JSONB? Separate table gives more flexibility but more admin complexity
-  Yes we can have it
2. Specs: full room-by-room structured model vs simpler key-value pairs?
- Key-value pairs with icon field. New icons table prefilled with available Lucide icons
3. POIs: Google Places API auto-populate or manual entry only?
- We will use Places API
4. Brochure PDF: auto-generate from data or admin-upload only?
- Admin upload
5. Lead gating: gate brochure downloads behind form or keep ungated for UX?
- No gating of brochures for now
6. Sell page: is resale part of the business model or not?
- no resale 
7. Hero redesign: have lifestyle photography/design assets available?
- we are fine currently
8. Trust signals: have press/media mentions to display?
- nothing so far


