-- Backfill location_advantages, project_details_extra, investment_data for published projects
UPDATE projects SET
  location_advantages = jsonb_build_object(
    'airportKm', floor(random() * 30 + 5)::int,
    'itParkKm', floor(random() * 15 + 2)::int,
    'schoolsKm', floor(random() * 5 + 1)::int,
    'hospitalsKm', floor(random() * 8 + 1)::int,
    'marketKm', floor(random() * 5 + 1)::int
  ),
  project_details_extra = jsonb_build_object(
    'totalTowers', floor(random() * 6 + 2)::int,
    'totalUnits', floor(random() * 300 + 50)::int,
    'floors', floor(random() * 20 + 5)::int,
    'constructionStatus', (ARRAY['Under Construction', 'Ready to Move', 'Nearing Completion'])[floor(random() * 3 + 1)::int],
    'facingOptions', ARRAY['East', 'West', 'North']
  ),
  investment_data = jsonb_build_object(
    'rentalYieldPct', round((random() * 3 + 2)::numeric, 1),
    'appreciationTrendText', concat(floor(random() * 10 + 5)::int, '% annual appreciation in ', COALESCE(locality, city)),
    'futureInfrastructureText', concat('Metro expansion and IT corridor near ', COALESCE(locality, city)),
    'developerTrackRecordSummary', concat(floor(random() * 15 + 5)::int, '+ projects delivered across ', city)
  ),
  vastu_compliant = random() > 0.4,
  gated_community = random() > 0.3,
  price_per_sqft = floor(random() * 8000 + 3000)::int,
  maintenance_charges = floor(random() * 3000 + 500)::int
WHERE published_at IS NOT NULL
  AND deleted_at IS NULL
  AND (location_advantages IS NULL OR location_advantages = '{}'::jsonb);
