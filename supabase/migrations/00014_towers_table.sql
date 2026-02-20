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
