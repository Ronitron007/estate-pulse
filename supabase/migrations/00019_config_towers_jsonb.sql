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
-- Pick one keeper per group via DISTINCT ON, aggregate all towers into it, delete rest

-- 3a. Identify keepers (first id::text per group) and collect merged towers
WITH keepers AS (
  SELECT DISTINCT ON (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label)
    id AS keeper_id,
    project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label
  FROM configurations
  ORDER BY project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label, id::text
),
merged AS (
  SELECT
    k.keeper_id,
    jsonb_agg(elem) AS merged_towers
  FROM keepers k
  JOIN configurations c
    ON c.project_id = k.project_id
    AND c.config_name IS NOT DISTINCT FROM k.config_name
    AND c.bedrooms IS NOT DISTINCT FROM k.bedrooms
    AND c.bathrooms IS NOT DISTINCT FROM k.bathrooms
    AND c.carpet_area_sqft IS NOT DISTINCT FROM k.carpet_area_sqft
    AND c.type_label IS NOT DISTINCT FROM k.type_label,
  LATERAL jsonb_array_elements(c.towers) AS elem
  GROUP BY k.keeper_id
)
UPDATE configurations c
SET towers = m.merged_towers
FROM merged m
WHERE c.id = m.keeper_id;

-- 3b. Delete non-keeper duplicates
WITH keepers AS (
  SELECT DISTINCT ON (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label)
    id AS keeper_id,
    project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label
  FROM configurations
  ORDER BY project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, type_label, id::text
)
DELETE FROM configurations c
USING keepers k
WHERE c.project_id = k.project_id
  AND c.config_name IS NOT DISTINCT FROM k.config_name
  AND c.bedrooms IS NOT DISTINCT FROM k.bedrooms
  AND c.bathrooms IS NOT DISTINCT FROM k.bathrooms
  AND c.carpet_area_sqft IS NOT DISTINCT FROM k.carpet_area_sqft
  AND c.type_label IS NOT DISTINCT FROM k.type_label
  AND c.id != k.keeper_id;

-- 5. Drop old columns
ALTER TABLE configurations DROP COLUMN IF EXISTS tower_id;
ALTER TABLE configurations DROP COLUMN IF EXISTS floor_from;
ALTER TABLE configurations DROP COLUMN IF EXISTS floor_to;
DROP INDEX IF EXISTS idx_configurations_tower_id;
