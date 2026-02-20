-- New project-level fields for Phase 1

-- Tagline: short marketing line shown under project name
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tagline TEXT;

-- Highlights: ordered list of USPs [{text, icon_id, icon_name}]
ALTER TABLE projects ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

-- Specifications: key-value pairs with icons [{label, value, icon_id, icon_name}]
ALTER TABLE projects ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '[]'::jsonb;

-- Parking: structured parking info
ALTER TABLE projects ADD COLUMN IF NOT EXISTS parking JSONB;
