-- Add rich detail fields to projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS booking_amount          BIGINT,
  ADD COLUMN IF NOT EXISTS maintenance_charges     INTEGER,
  ADD COLUMN IF NOT EXISTS price_per_sqft          INTEGER,
  ADD COLUMN IF NOT EXISTS vastu_compliant         BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gated_community         BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS matterport_url          TEXT,
  ADD COLUMN IF NOT EXISTS video_url               TEXT,
  ADD COLUMN IF NOT EXISTS location_advantages     JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS project_details_extra   JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS investment_data         JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN projects.location_advantages IS 'JSONB: { airportKm, itParkKm, schoolsKm, hospitalsKm, marketKm }';
COMMENT ON COLUMN projects.project_details_extra IS 'JSONB: { totalTowers, totalUnits, floors, constructionStatus, facingOptions }';
COMMENT ON COLUMN projects.investment_data IS 'JSONB: { rentalYieldPct, appreciationTrendText, futureInfrastructureText, developerTrackRecordSummary }';
