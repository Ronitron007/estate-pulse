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
