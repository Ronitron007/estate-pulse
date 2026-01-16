-- Drop redundant index on builders.slug
-- Note: builders.slug is UNIQUE, so Postgres already has a unique index backing that constraint.
-- Keeping only the UNIQUE index avoids duplicate index maintenance cost.

DROP INDEX IF EXISTS idx_builders_slug;

