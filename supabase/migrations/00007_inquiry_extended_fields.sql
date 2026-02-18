-- Extend inquiries table for richer lead capture
ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS budget         TEXT,
  ADD COLUMN IF NOT EXISTS timeline       TEXT,
  ADD COLUMN IF NOT EXISTS property_title TEXT,
  ADD COLUMN IF NOT EXISTS notes          TEXT;

-- Extend status constraint to include site visit and negotiation stages
ALTER TABLE inquiries
  DROP CONSTRAINT IF EXISTS inquiries_status_check;

ALTER TABLE inquiries
  ADD CONSTRAINT inquiries_status_check CHECK (
    status IN (
      'new',
      'contacted',
      'site_visit_scheduled',
      'site_visit_done',
      'negotiation',
      'qualified',
      'converted',
      'closed',
      'lost'
    )
  );
