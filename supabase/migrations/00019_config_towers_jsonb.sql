-- Migration: Replace tower_id FK on configurations with towers JSONB column
-- Stores per-tower data (name, floor range) directly, eliminating config row duplication

-- 1. Add towers JSONB column (array of {name, floor_from, floor_to})
ALTER TABLE configurations ADD COLUMN IF NOT EXISTS towers JSONB DEFAULT '[]';

-- 2. Migrate existing tower_id data: build JSONB from tower_id + towers table
UPDATE configurations c
SET towers = jsonb_build_array(
  jsonb_build_object(
    'name', t.name,
    'floor_from', c.floor_from,
    'floor_to', c.floor_to
  )
)
FROM towers t
WHERE c.tower_id = t.id AND c.tower_id IS NOT NULL;

-- 3. Consolidate duplicate configs: merge towers JSONB for rows with same
-- (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label)
-- Keep the row with the lowest id, aggregate towers from all duplicates
WITH dupes AS (
  SELECT
    project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label,
    MIN(id) AS keeper_id,
    jsonb_agg(elem) AS merged_towers
  FROM configurations,
    LATERAL jsonb_array_elements(towers) AS elem
  GROUP BY project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label
  HAVING COUNT(*) > 1
)
UPDATE configurations c
SET towers = d.merged_towers
FROM dupes d
WHERE c.id = d.keeper_id
  AND c.project_id = d.project_id
  AND c.config_name IS NOT DISTINCT FROM d.config_name
  AND c.bedrooms IS NOT DISTINCT FROM d.bedrooms
  AND c.carpet_area_sqft IS NOT DISTINCT FROM d.carpet_area_sqft;

-- 4. Delete the duplicate rows (non-keepers)
WITH dupes AS (
  SELECT
    project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label,
    MIN(id) AS keeper_id
  FROM configurations
  GROUP BY project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label
  HAVING COUNT(*) > 1
)
DELETE FROM configurations c
USING dupes d
WHERE c.project_id = d.project_id
  AND c.config_name IS NOT DISTINCT FROM d.config_name
  AND c.bedrooms IS NOT DISTINCT FROM d.bedrooms
  AND c.carpet_area_sqft IS NOT DISTINCT FROM d.carpet_area_sqft
  AND c.id != d.keeper_id;

-- 5. Drop old columns
ALTER TABLE configurations DROP COLUMN IF EXISTS tower_id;
ALTER TABLE configurations DROP COLUMN IF EXISTS floor_from;
ALTER TABLE configurations DROP COLUMN IF EXISTS floor_to;
DROP INDEX IF EXISTS idx_configurations_tower_id;
