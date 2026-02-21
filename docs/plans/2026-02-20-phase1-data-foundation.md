# Phase 1: Data Foundation + Quick Wins — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add all Phase 1 data model fields (icons, tagline, highlights, specs, towers, config extensions, flexible POIs, parking) + quick frontend wins (sort, per-sqft display).

**Architecture:** Sequential SQL migrations to add new tables/columns to Supabase PostgreSQL. TypeScript type updates. Admin form extensions using existing React Hook Form + shadcn/ui pattern. Public display sections on property detail page. No new API routes needed — everything flows through existing server actions.

**Tech Stack:** Next.js 16, Supabase (PostgreSQL), TypeScript, React Hook Form, Zod, shadcn/ui, Lucide React

---

## Task 1: DB Migration — Icons Table + Seed Data

**Files:**
- Create: `supabase/migrations/00012_icons_table.sql`

**Step 1: Write migration**

```sql
-- Icons table: reusable icon library for specs, highlights, etc.
CREATE TABLE IF NOT EXISTS icons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,              -- display name: "Flooring"
  lucide_name TEXT NOT NULL,       -- lucide-react icon name: "layers"
  category TEXT,                   -- grouping: "construction", "rooms", "general"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: public read, admin write
ALTER TABLE icons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view icons"
  ON icons FOR SELECT USING (true);

CREATE POLICY "Admins can manage icons"
  ON icons FOR ALL
  USING (is_admin());

-- Seed with real-estate-relevant Lucide icons
INSERT INTO icons (name, lucide_name, category) VALUES
  -- Construction & Materials
  ('Flooring', 'layers', 'construction'),
  ('Walls', 'square', 'construction'),
  ('Paint', 'paintbrush', 'construction'),
  ('Tiles', 'grid-3x3', 'construction'),
  ('Cement', 'box', 'construction'),
  ('Steel', 'shield', 'construction'),
  ('Wood', 'tree-pine', 'construction'),
  ('Glass', 'panel-top', 'construction'),
  -- Rooms
  ('Bedroom', 'bed-double', 'rooms'),
  ('Bathroom', 'bath', 'rooms'),
  ('Kitchen', 'cooking-pot', 'rooms'),
  ('Living Room', 'sofa', 'rooms'),
  ('Balcony', 'fence', 'rooms'),
  ('Staircase', 'arrow-up-right', 'rooms'),
  ('Parking', 'car', 'rooms'),
  -- Fittings & Fixtures
  ('Doors', 'door-open', 'fittings'),
  ('Windows', 'app-window', 'fittings'),
  ('Switches', 'toggle-right', 'fittings'),
  ('Plumbing', 'droplets', 'fittings'),
  ('Electrical', 'zap', 'fittings'),
  ('AC', 'snowflake', 'fittings'),
  ('Wardrobe', 'shirt', 'fittings'),
  ('Chimney', 'wind', 'fittings'),
  ('Sink', 'droplet', 'fittings'),
  -- General
  ('Elevator', 'arrow-up-down', 'general'),
  ('Security', 'lock', 'general'),
  ('Fire Safety', 'flame', 'general'),
  ('Power', 'plug-zap', 'general'),
  ('Water', 'waves', 'general'),
  ('Garden', 'flower-2', 'general'),
  ('View', 'eye', 'general'),
  ('Location', 'map-pin', 'general'),
  ('Quality', 'badge-check', 'general'),
  ('Price', 'indian-rupee', 'general'),
  ('Area', 'ruler', 'general'),
  ('Building', 'building-2', 'general'),
  ('Tower', 'building', 'general'),
  ('Home', 'home', 'general'),
  ('Star', 'star', 'general'),
  ('Check', 'circle-check', 'general');
```

**Step 2: Apply migration**

Run: `npx supabase db push` (or apply via Supabase dashboard)
Expected: Table created, 40 icons seeded.

**Step 3: Commit**

```bash
git add supabase/migrations/00012_icons_table.sql
git commit -m "feat: add icons table with seed data for specs/highlights"
```

---

## Task 2: DB Migration — Projects New Columns

**Files:**
- Create: `supabase/migrations/00013_project_new_fields.sql`

Adds: `tagline`, `highlights`, `specifications`, `parking` to projects table.

**Step 1: Write migration**

```sql
-- New project-level fields for Phase 1

-- Tagline: short marketing line shown under project name
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tagline TEXT;

-- Highlights: ordered list of USPs [{text, icon_id}]
-- Example: [{"text": "12 Ultra Luxury Sky-Villas", "icon_id": "uuid"}, ...]
ALTER TABLE projects ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

-- Specifications: key-value pairs with icons [{label, value, icon_id}]
-- Example: [{"label": "Flooring", "value": "Premium Vitrified Tiles", "icon_id": "uuid"}, ...]
ALTER TABLE projects ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '[]'::jsonb;

-- Parking: structured parking info
-- Example: {"types": ["stilt", "basement", "open"], "basement_levels": 2, "guest_parking": true, "allotment": "1 covered + 1 open per unit"}
ALTER TABLE projects ADD COLUMN IF NOT EXISTS parking JSONB;
```

**Step 2: Apply migration**

Run: `npx supabase db push`
Expected: 4 new columns on projects table.

**Step 3: Commit**

```bash
git add supabase/migrations/00013_project_new_fields.sql
git commit -m "feat: add tagline, highlights, specifications, parking columns to projects"
```

---

## Task 3: DB Migration — Towers Table

**Files:**
- Create: `supabase/migrations/00014_towers_table.sql`

**Step 1: Write migration**

```sql
-- Towers table: per-tower data for multi-tower projects
CREATE TABLE IF NOT EXISTS towers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                -- "Tower A", "Wing B"
  floor_from INT,                    -- starting floor number
  floor_to INT,                      -- ending floor number
  units_per_floor INT,               -- units on each floor
  lifts_count INT,                   -- number of lifts
  lift_type TEXT,                     -- "standard", "high-speed"
  staircase_info TEXT,               -- e.g., "Double staircase"
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_towers_project_id ON towers(project_id);

-- RLS
ALTER TABLE towers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view towers"
  ON towers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = towers.project_id
        AND projects.published_at IS NOT NULL
        AND projects.deleted_at IS NULL
    )
  );

CREATE POLICY "Admins can manage towers"
  ON towers FOR ALL
  USING (is_admin());

-- Grant anon SELECT
GRANT SELECT ON towers TO anon;
GRANT ALL ON towers TO authenticated;
```

**Step 2: Apply migration**

Run: `npx supabase db push`
Expected: towers table created with RLS.

**Step 3: Commit**

```bash
git add supabase/migrations/00014_towers_table.sql
git commit -m "feat: add towers table for per-tower project data"
```

---

## Task 4: DB Migration — Configurations Extensions

**Files:**
- Create: `supabase/migrations/00015_configurations_extensions.sql`

Adds: area fields, tower FK, floor range, type label.

**Step 1: Write migration**

```sql
-- Extended area fields
ALTER TABLE configurations ADD COLUMN IF NOT EXISTS balcony_area_sqft INT;
ALTER TABLE configurations ADD COLUMN IF NOT EXISTS covered_area_sqft INT;
ALTER TABLE configurations ADD COLUMN IF NOT EXISTS super_area_sqft INT;

-- Tower association
ALTER TABLE configurations ADD COLUMN IF NOT EXISTS tower_id UUID REFERENCES towers(id) ON DELETE SET NULL;

-- Floor range
ALTER TABLE configurations ADD COLUMN IF NOT EXISTS floor_from INT;
ALTER TABLE configurations ADD COLUMN IF NOT EXISTS floor_to INT;

-- Type label (e.g., "Type A", "Type B")
ALTER TABLE configurations ADD COLUMN IF NOT EXISTS type_label TEXT;

CREATE INDEX idx_configurations_tower_id ON configurations(tower_id);
```

**Step 2: Apply migration**

Run: `npx supabase db push`
Expected: 6 new columns on configurations table.

**Step 3: Commit**

```bash
git add supabase/migrations/00015_configurations_extensions.sql
git commit -m "feat: extend configurations with area fields, tower FK, floor range"
```

---

## Task 5: DB Migration — Flexible POIs

**Files:**
- Create: `supabase/migrations/00016_flexible_pois.sql`

Replaces the hardcoded 5-key `location_advantages` JSONB with a flexible `points_of_interest` JSONB array. Keeps the old column for backward compat during transition.

**Step 1: Write migration**

```sql
-- Flexible points of interest array
-- Example: [{"name": "Elante Mall", "category": "shopping", "distance_value": 5.5, "distance_unit": "km"}, ...]
-- Categories: transport, education, healthcare, shopping, food, lifestyle, notable
ALTER TABLE projects ADD COLUMN IF NOT EXISTS points_of_interest JSONB DEFAULT '[]'::jsonb;
```

**Step 2: Apply migration**

Run: `npx supabase db push`
Expected: New column on projects table. Old `location_advantages` column still exists (will migrate data later).

**Step 3: Commit**

```bash
git add supabase/migrations/00016_flexible_pois.sql
git commit -m "feat: add flexible points_of_interest JSONB column"
```

---

## Task 6: Update TypeScript Types

**Files:**
- Modify: `src/types/database.ts`

**Step 1: Add new types and update interfaces**

Add these new interfaces and update existing ones:

```typescript
// New interfaces to add:

export interface Icon {
  id: string;
  name: string;
  lucide_name: string;
  category: string | null;
}

export interface Tower {
  id: string;
  project_id: string;
  name: string;
  floor_from: number | null;
  floor_to: number | null;
  units_per_floor: number | null;
  lifts_count: number | null;
  lift_type: string | null;
  staircase_info: string | null;
  sort_order: number;
}

export interface ProjectHighlight {
  text: string;
  icon_id: string | null;
}

export interface ProjectSpecification {
  label: string;
  value: string;
  icon_id: string | null;
}

export interface ProjectParking {
  types: string[];           // ["stilt", "basement", "open", "covered"]
  basement_levels: number | null;
  guest_parking: boolean;
  allotment: string | null;  // "1 covered + 1 open per unit"
}

export interface PointOfInterest {
  name: string;
  category: string;  // "transport" | "education" | "healthcare" | "shopping" | "food" | "lifestyle" | "notable"
  distance_value: number;
  distance_unit: string;  // "km" | "min"
}
```

Update `Project` interface — add these fields:
```typescript
  tagline: string | null;
  highlights: ProjectHighlight[];
  specifications: ProjectSpecification[];
  parking: ProjectParking | null;
  points_of_interest: PointOfInterest[];
  // Joined relations (add):
  towers?: Tower[];
```

Update `Configuration` interface — add these fields:
```typescript
  balcony_area_sqft: number | null;
  covered_area_sqft: number | null;
  super_area_sqft: number | null;
  tower_id: string | null;
  floor_from: number | null;
  floor_to: number | null;
  type_label: string | null;
  // Joined relation:
  tower?: Tower;
```

Add to `ProjectFilters`:
```typescript
  sort?: "price_asc" | "price_desc" | "newest" | "possession";
```

**Step 2: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: update TS types for phase 1 fields"
```

---

## Task 7: Update Supabase Queries

**Files:**
- Modify: `src/lib/queries/projects.ts`

**Step 1: Add towers to project select + add sort support**

In `getProjects()`:
- Add `towers(*)` to the select join
- Add sort logic based on `filters.sort`
- Map towers in the transform

In `getProjectBySlug()`:
- Add `towers(*)` to the select join
- Map towers in the transform

Add new query:
```typescript
export async function getIcons(): Promise<Icon[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("icons")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching icons:", error);
    return [];
  }
  return data || [];
}
```

For sort, replace the hardcoded `.order("created_at", { ascending: false })` with:
```typescript
// Sort
switch (filters?.sort) {
  case "price_asc":
    query = query.order("price_min", { ascending: true, nullsFirst: false });
    break;
  case "price_desc":
    query = query.order("price_min", { ascending: false });
    break;
  case "possession":
    query = query.order("possession_date", { ascending: true, nullsFirst: false });
    break;
  case "newest":
  default:
    query = query.order("created_at", { ascending: false });
    break;
}
```

**Step 2: Commit**

```bash
git add src/lib/queries/projects.ts
git commit -m "feat: add towers join, sort support, icons query"
```

---

## Task 8: Admin — Property Form Schema Update

**Files:**
- Modify: `src/app/admin/properties/_components/property-schema.ts`

**Step 1: Add tagline to Zod schema**

Add to `propertyFormSchema`:
```typescript
tagline: z.string().optional(),
```

Add to `PropertyFormData` interface:
```typescript
tagline?: string;
highlights: ProjectHighlight[];
specifications: ProjectSpecification[];
parking: ProjectParking | null;
towers: Partial<Tower>[];
points_of_interest: PointOfInterest[];
```

Update `transformFormData` to include new fields (passed through as separate state, same pattern as images/configs/amenityIds).

Update `projectToFormValues` to hydrate new fields from project data.

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/property-schema.ts
git commit -m "feat: update property form schema for phase 1 fields"
```

---

## Task 9: Admin — HighlightsEditor Component

**Files:**
- Create: `src/app/admin/properties/_components/HighlightsEditor.tsx`

**Step 1: Build component**

Pattern matches existing `ConfigurationsEditor.tsx`. Repeater with text input + icon selector dropdown.

```typescript
// Props:
interface HighlightsEditorProps {
  highlights: ProjectHighlight[];
  icons: Icon[];
  onChange: (highlights: ProjectHighlight[]) => void;
}
```

Each row: text input + icon select dropdown (from icons table) + remove button.
Add button at bottom.

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/HighlightsEditor.tsx
git commit -m "feat: add HighlightsEditor admin component"
```

---

## Task 10: Admin — SpecificationsEditor Component

**Files:**
- Create: `src/app/admin/properties/_components/SpecificationsEditor.tsx`

**Step 1: Build component**

Same repeater pattern. Each row: label input + value input + icon select + remove button.

```typescript
interface SpecificationsEditorProps {
  specifications: ProjectSpecification[];
  icons: Icon[];
  onChange: (specs: ProjectSpecification[]) => void;
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/SpecificationsEditor.tsx
git commit -m "feat: add SpecificationsEditor admin component"
```

---

## Task 11: Admin — ParkingEditor Component

**Files:**
- Create: `src/app/admin/properties/_components/ParkingEditor.tsx`

**Step 1: Build component**

Checkbox group for parking types + number input for basement levels + checkbox for guest parking + text input for allotment description.

```typescript
interface ParkingEditorProps {
  parking: ProjectParking | null;
  onChange: (parking: ProjectParking | null) => void;
}
```

Parking type options: `["stilt", "basement", "open", "covered", "multi-level"]`

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/ParkingEditor.tsx
git commit -m "feat: add ParkingEditor admin component"
```

---

## Task 12: Admin — TowersEditor Component

**Files:**
- Create: `src/app/admin/properties/_components/TowersEditor.tsx`

**Step 1: Build component**

Repeater pattern. Each tower row: name, floor_from, floor_to, units_per_floor, lifts_count, lift_type select, staircase_info text.

```typescript
interface TowersEditorProps {
  towers: Partial<Tower>[];
  onChange: (towers: Partial<Tower>[]) => void;
}
```

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/TowersEditor.tsx
git commit -m "feat: add TowersEditor admin component"
```

---

## Task 13: Admin — POIsEditor Component

**Files:**
- Create: `src/app/admin/properties/_components/POIsEditor.tsx`

**Step 1: Build component**

Repeater with: name text input, category select, distance_value number, distance_unit select (km/min).

Later phase: will add Google Places API autocomplete. For now, manual entry.

```typescript
interface POIsEditorProps {
  pois: PointOfInterest[];
  onChange: (pois: PointOfInterest[]) => void;
}
```

Category options: `["transport", "education", "healthcare", "shopping", "food", "lifestyle", "notable"]`

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/POIsEditor.tsx
git commit -m "feat: add POIsEditor admin component"
```

---

## Task 14: Admin — Update ConfigurationsEditor

**Files:**
- Modify: `src/app/admin/properties/_components/ConfigurationsEditor.tsx`

**Step 1: Add new fields to each config row**

Add to the grid in each config row:
- `balcony_area_sqft` — number input, label "Balcony Area (sqft)"
- `covered_area_sqft` — number input, label "Covered Area (sqft)"
- `super_area_sqft` — number input, label "Super Area (sqft)"
- `tower_id` — select dropdown (requires towers list as prop)
- `floor_from` — number input
- `floor_to` — number input
- `type_label` — text input, placeholder "Type A"

Update props to accept towers list:
```typescript
interface ConfigurationsEditorProps {
  configurations: Partial<Configuration>[];
  towers: Partial<Tower>[];
  onChange: (configs: Partial<Configuration>[]) => void;
}
```

Update `addConfig` default to include new null fields.

**Step 2: Commit**

```bash
git add src/app/admin/properties/_components/ConfigurationsEditor.tsx
git commit -m "feat: extend ConfigurationsEditor with area fields, tower, floor range"
```

---

## Task 15: Admin — Wire Everything into PropertyForm

**Files:**
- Modify: `src/app/admin/properties/_components/PropertyForm.tsx`

**Step 1: Add imports and state for new editors**

Add state variables (same pattern as images/configs/amenityIds):
```typescript
const [highlights, setHighlights] = useState<ProjectHighlight[]>(initialData?.highlights || []);
const [specifications, setSpecifications] = useState<ProjectSpecification[]>(initialData?.specifications || []);
const [parking, setParking] = useState<ProjectParking | null>(initialData?.parking || null);
const [towers, setTowers] = useState<Partial<Tower>[]>(initialData?.towers || []);
const [pois, setPois] = useState<PointOfInterest[]>(initialData?.points_of_interest || []);
```

**Step 2: Add tagline field to Basic Info card**

After description textarea:
```tsx
<div className="space-y-2 sm:col-span-2">
  <Label htmlFor="tagline">Tagline</Label>
  <Input id="tagline" {...form.register("tagline")} placeholder="Short marketing line, e.g., 'Gateway of Chandigarh'" maxLength={100} />
</div>
```

**Step 3: Add new Card sections**

After Amenities card, add new cards for: Highlights, Specifications, Towers, Parking, Points of Interest. Each card wraps the corresponding editor component.

**Step 4: Update handleSubmit**

Pass new state to `transformFormData`:
```typescript
const fullData = transformFormData(data, images, configurations, amenityIds, highlights, specifications, parking, towers, pois);
```

**Step 5: Update PropertyFormProps to accept icons**

```typescript
interface PropertyFormProps {
  // ... existing props
  icons: Icon[];
}
```

**Step 6: Commit**

```bash
git add src/app/admin/properties/_components/PropertyForm.tsx
git commit -m "feat: wire phase 1 editors into PropertyForm"
```

---

## Task 16: Admin — Update Server Actions

**Files:**
- Modify: `src/app/admin/properties/actions.ts`

**Step 1: Save new project-level fields**

In both `createPropertyAction` and `updatePropertyAction`, add to the insert/update object:
```typescript
tagline: data.tagline || null,
highlights: data.highlights || [],
specifications: data.specifications || [],
parking: data.parking || null,
points_of_interest: data.points_of_interest || [],
```

**Step 2: Save towers (create action)**

After inserting the project, insert towers:
```typescript
if (data.towers.length > 0) {
  const towersToInsert = data.towers.map((tower, index) => ({
    project_id: projectId,
    name: tower.name!,
    floor_from: tower.floor_from ?? null,
    floor_to: tower.floor_to ?? null,
    units_per_floor: tower.units_per_floor ?? null,
    lifts_count: tower.lifts_count ?? null,
    lift_type: tower.lift_type || null,
    staircase_info: tower.staircase_info || null,
    sort_order: index,
  }));

  const { error: towersError } = await supabase
    .from("towers")
    .insert(towersToInsert);

  if (towersError) console.error("Error inserting towers:", towersError);
}
```

**Step 3: Save towers (update action)**

Same delete-then-insert pattern as configs:
```typescript
await supabase.from("towers").delete().eq("project_id", id);
// Then insert same as above
```

**Step 4: Update configs insert to include new fields**

In both create and update, add to configsToInsert map:
```typescript
balcony_area_sqft: config.balcony_area_sqft ?? null,
covered_area_sqft: config.covered_area_sqft ?? null,
super_area_sqft: config.super_area_sqft ?? null,
tower_id: config.tower_id || null,
floor_from: config.floor_from ?? null,
floor_to: config.floor_to ?? null,
type_label: config.type_label || null,
```

**Step 5: Commit**

```bash
git add src/app/admin/properties/actions.ts
git commit -m "feat: save phase 1 fields in create/update actions"
```

---

## Task 17: Admin — Pass Icons + Towers to Form Pages

**Files:**
- Modify: `src/app/admin/properties/new/page.tsx`
- Modify: `src/app/admin/properties/[id]/page.tsx`

**Step 1: Fetch icons in both pages**

Import and call `getIcons()` alongside existing data fetching (builders, cities, amenities). Pass `icons` prop to `PropertyForm`.

For the edit page, also fetch towers for the project and pass them as part of initialData.

**Step 2: Commit**

```bash
git add src/app/admin/properties/new/page.tsx src/app/admin/properties/\[id\]/page.tsx
git commit -m "feat: pass icons and towers data to admin property form"
```

---

## Task 18: Public — Sort Dropdown on Listings

**Files:**
- Modify: `src/app/(main)/properties/page.tsx`
- Create: `src/components/property/SortDropdown.tsx`

**Step 1: Build SortDropdown component**

Client component. Reads current `sort` from URL params, updates URL on change.

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "possession", label: "Possession Date" },
];
```

Renders a `<select>` styled with shadcn classes. On change, updates `?sort=` search param.

**Step 2: Add to listings page**

In `PropertiesContent`, pass `params.sort` to `getProjects(filters)`.
Add `<SortDropdown />` next to the property count text.

**Step 3: Commit**

```bash
git add src/components/property/SortDropdown.tsx src/app/\(main\)/properties/page.tsx
git commit -m "feat: add sort dropdown to listings page"
```

---

## Task 19: Public — Per Sq Ft Price on Cards + Detail

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx` (detail page quick info)
- Find and modify: property card component (likely `src/components/property/PropertyCard.tsx` or inside `PropertyGrid.tsx`)

**Step 1: Add per-sqft to Quick Info card on detail page**

In the Quick Info grid (4-column), either add a 5th item or replace the "Units" column when not available. Show `price_per_sqft` formatted as "X/sqft".

```tsx
{project.price_per_sqft && (
  <div>
    <p className="text-sm text-gray-500">Price / Sq Ft</p>
    <p className="font-semibold">{formatPrice(project.price_per_sqft)}/sqft</p>
  </div>
)}
```

**Step 2: Add per-sqft to property cards**

Show below price range if available.

**Step 3: Commit**

```bash
git add src/app/\(main\)/properties/\[slug\]/page.tsx src/components/property/PropertyCard.tsx
git commit -m "feat: display per-sqft price on cards and detail page"
```

---

## Task 20: Public — Highlights Section on Detail Page

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`

**Step 1: Add Highlights section**

After the Quick Info card, before Location. Only render if `project.highlights?.length > 0`.

Display as a grid of cards, each with icon (from Lucide by looking up icon name) + text.

Note: Need to join icons data or store `lucide_name` directly in the highlight. Simplest approach: store `icon_id` in highlight, fetch icons in the page query, and look up the lucide name. Alternatively, denormalize and store `lucide_name` directly in the JSONB.

**Decision: denormalize** — store `icon_id` AND `icon_name` (lucide_name) in the JSONB highlight objects. The admin form populates both from the icons dropdown. This avoids a join on the public page.

Update `ProjectHighlight` type:
```typescript
export interface ProjectHighlight {
  text: string;
  icon_id: string | null;
  icon_name: string | null;  // lucide_name, denormalized
}
```

Then render:
```tsx
{project.highlights?.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle>Project Highlights</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {project.highlights.map((h, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
            {/* Render Lucide icon dynamically */}
            <span className="text-primary">{/* icon */}</span>
            <span>{h.text}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

For dynamic Lucide icon rendering, create a small helper component `DynamicIcon`:
```typescript
// src/components/ui/DynamicIcon.tsx
import { icons } from "lucide-react";

export function DynamicIcon({ name, ...props }: { name: string } & React.SVGProps<SVGSVGElement>) {
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) return null;
  return <Icon {...props} />;
}
```

**Step 2: Commit**

```bash
git add src/components/ui/DynamicIcon.tsx src/app/\(main\)/properties/\[slug\]/page.tsx
git commit -m "feat: display project highlights on detail page"
```

---

## Task 21: Public — Specifications Section on Detail Page

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`

**Step 1: Add Specifications section**

After Highlights. Same denormalization approach for icon names.

Render as a two-column table: icon + label | value.

```tsx
{project.specifications?.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle>Specifications</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="divide-y">
        {project.specifications.map((spec, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-gray-600">
              <DynamicIcon name={spec.icon_name || "circle"} className="w-4 h-4" />
              <span>{spec.label}</span>
            </div>
            <span className="font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

**Step 2: Commit**

```bash
git add src/app/\(main\)/properties/\[slug\]/page.tsx
git commit -m "feat: display specifications on detail page"
```

---

## Task 22: Public — Towers Section on Detail Page

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`

**Step 1: Add Towers section**

After Project Details card. Render tower cards in a grid.

```tsx
{project.towers?.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle>Tower Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {project.towers.map((tower) => (
          <div key={tower.id} className="p-4 rounded-lg border bg-gray-50">
            <h4 className="font-semibold mb-2">{tower.name}</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {tower.floor_from != null && tower.floor_to != null && (
                <p>Floors: {tower.floor_from} to {tower.floor_to}</p>
              )}
              {tower.units_per_floor && <p>{tower.units_per_floor} units per floor</p>}
              {tower.lifts_count && <p>{tower.lifts_count} {tower.lift_type || ""} lifts</p>}
              {tower.staircase_info && <p>{tower.staircase_info}</p>}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

**Step 2: Commit**

```bash
git add src/app/\(main\)/properties/\[slug\]/page.tsx
git commit -m "feat: display tower details on detail page"
```

---

## Task 23: Public — Enhanced Configurations Table

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`

**Step 1: Expand configs table**

Update the configurations table to show:
- Type label (if present)
- Config name / BHK
- Tower name (if tower_id linked)
- Floor range
- Carpet area (existing)
- Super area (if available)
- Price (existing)

Add columns to the `<table>` for the new fields. Only show columns if at least one config has data for them.

**Step 2: Commit**

```bash
git add src/app/\(main\)/properties/\[slug\]/page.tsx
git commit -m "feat: enhance configurations table with area fields, tower, floor range"
```

---

## Task 24: Public — Parking Section on Detail Page

**Files:**
- Modify: `src/app/(main)/properties/[slug]/page.tsx`

**Step 1: Add Parking section**

After Towers, before Amenities. Only render if `project.parking` is not null.

```tsx
{project.parking && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Car className="w-5 h-5" />
        Parking
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        {project.parking.types?.length > 0 && (
          <div>
            <p className="text-sm text-gray-500">Parking Types</p>
            <p className="font-medium capitalize">{project.parking.types.join(", ")}</p>
          </div>
        )}
        {project.parking.basement_levels && (
          <div>
            <p className="text-sm text-gray-500">Basement Levels</p>
            <p className="font-medium">{project.parking.basement_levels}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Guest Parking</p>
          <p className="font-medium">{project.parking.guest_parking ? "Yes" : "No"}</p>
        </div>
        {project.parking.allotment && (
          <div>
            <p className="text-sm text-gray-500">Per Unit Allotment</p>
            <p className="font-medium">{project.parking.allotment}</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

**Step 2: Commit**

```bash
git add src/app/\(main\)/properties/\[slug\]/page.tsx
git commit -m "feat: display parking details on detail page"
```

---

## Task 25: Public — Flexible POIs Section on Detail Page

**Files:**
- Create: `src/components/property/PointsOfInterest.tsx`
- Modify: `src/app/(main)/properties/[slug]/page.tsx`

**Step 1: Build POIs component**

Category-based tabs or toggles showing nearby places with distances. Replace or augment existing `LocationAdvantages` component.

```typescript
interface PointsOfInterestProps {
  pois: PointOfInterest[];
}
```

Group POIs by category. Show category toggle buttons at top. List matching POIs with distance badges.

**Step 2: Wire into detail page**

Replace the `LocationAdvantages` section with the new `PointsOfInterest` when `points_of_interest` has data. Fall back to old `LocationAdvantages` when only old data exists.

**Step 3: Commit**

```bash
git add src/components/property/PointsOfInterest.tsx src/app/\(main\)/properties/\[slug\]/page.tsx
git commit -m "feat: display flexible POIs with category tabs on detail page"
```

---

## Task 26: Verify Build + Final Commit

**Step 1: Run build**

```bash
npm run build
```

Fix any TypeScript errors.

**Step 2: Manual verification**

- Visit admin /properties/new — verify all new form sections render
- Create a test property with highlights, specs, towers, parking, POIs
- Visit the public detail page — verify all new sections display
- Visit listings page — verify sort dropdown works
- Verify per-sqft shows on cards

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve build issues from phase 1"
```

---

## Dependency Graph

```
Task 1 (icons) ─────────────────────────────────┐
Task 2 (project cols) ──────────────────────────┤
Task 3 (towers) ─────┬──────────────────────────┤
Task 4 (config ext) ──┘                         ├─ Task 6 (types) ─── Task 7-8 (schema + admin components)
Task 5 (POIs) ───────────────────────────────────┘         │
                                                           ├─ Tasks 9-14 (admin editors)
                                                           ├─ Task 15 (wire form)
                                                           ├─ Task 16 (actions)
                                                           ├─ Task 17 (pass data)
                                                           └─ Tasks 18-25 (public display)
                                                                    │
                                                              Task 26 (verify)
```

**Parallelizable groups:**
- Tasks 1-5 (migrations) — independent, can all run in one batch
- Tasks 9-14 (admin editor components) — independent of each other
- Tasks 18-25 (public display sections) — mostly independent of each other

---

## Unresolved Questions

1. DynamicIcon: `lucide-react` `icons` object may increase bundle size if tree-shaking fails — verify or use lazy import?
2. Denormalize icon_name in highlights/specs JSONB or join at query time?
  - Plan assumes denormalize (simpler, no join). Tradeoff: icon rename requires data migration
