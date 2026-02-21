-- Seed: Northview Homez property listing
-- Source: Northview Homez brochure (PBRERA-SAS79-PR0848)

-- 1. Builder
INSERT INTO builders (id, name, slug, description, website)
VALUES (
  'b0000001-0001-0001-0001-000000000001',
  'KG Enterprises (Northview Group)',
  'kg-enterprises-northview-group',
  'KG Enterprises, operating under the Northview Group brand, is a real estate developer based in Zirakpur, Punjab. They specialize in ultra-luxury residential projects along the Ambala-Chandigarh National Highway corridor.',
  'https://www.northviewhomez.com'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Project
INSERT INTO projects (
  id, slug, name, description, tagline, status, property_type,
  price_on_request, address, city, locality, pincode,
  location,
  total_units, available_units,
  rera_id, builder_id,
  vastu_compliant, gated_community,
  meta_title, meta_description,
  highlights, specifications, parking, points_of_interest,
  project_details_extra, location_advantages,
  published_at
) VALUES (
  'a0000001-0001-0001-0001-000000000002',
  'northview-homez-zirakpur',
  'Northview Homez',
  'Northview Homez is an ultra-luxury residential project offering spacious 3BHK apartments and exclusive sky villas in Zirakpur, Punjab. Located directly on the Ambala-Chandigarh National Highway, the project features 4 towers built using advanced Mivan construction technology — ensuring earthquake resistance, uniform quality, and durability. With panoramic Shivalik Hills views, wide balconies, a grand gated entrance, exclusive clubhouse, and double basement parking, Northview Homez delivers a modern lifestyle where elegance meets convenience.',
  'Gateway of Chandigarh',
  'ongoing',
  'apartment',
  true,
  'Ambala - Chandigarh National Highway, Zirakpur',
  'Zirakpur',
  'Ambala-Chandigarh Highway',
  '140201',
  ST_SetSRID(ST_MakePoint(76.8520, 30.6280), 4326)::geography,
  157, 157,
  'PBRERA-SAS79-PR0848',
  'b0000001-0001-0001-0001-000000000001',
  true,
  true,
  'Northview Homez - Ultra Luxury 3BHK & Sky Villas in Zirakpur | PerfectGhar.in',
  'Ultra luxury 3BHK apartments and sky villas on Ambala-Chandigarh NH, Zirakpur. 4 towers, Mivan construction, Shivalik Hills view. RERA: PBRERA-SAS79-PR0848.',

  -- highlights
  '[
    {"text": "145 Ultra Luxury 3BHK Flats", "icon_id": null, "icon_name": "building-2"},
    {"text": "12 Ultra Luxury Sky-Villas", "icon_id": null, "icon_name": "building"},
    {"text": "Exclusive Clubhouse", "icon_id": null, "icon_name": "home"},
    {"text": "2 Flats per Floor in Tower A & B", "icon_id": null, "icon_name": "layers"},
    {"text": "4 Flats per Floor in Tower C & D", "icon_id": null, "icon_name": "layers"},
    {"text": "High Speed Lifts in Every Tower", "icon_id": null, "icon_name": "arrow-up-down"},
    {"text": "Double Staircase in Each Tower", "icon_id": null, "icon_name": "arrow-up-right"},
    {"text": "Every Apartment has the Widest Balcony", "icon_id": null, "icon_name": "fence"},
    {"text": "Built with Advanced Mivan Technology", "icon_id": null, "icon_name": "shield"},
    {"text": "Direct Entry from National Highway", "icon_id": null, "icon_name": "map-pin"},
    {"text": "Perfect Shivalik Hills View", "icon_id": null, "icon_name": "eye"},
    {"text": "Earthquake Resistant Construction", "icon_id": null, "icon_name": "badge-check"}
  ]'::jsonb,

  -- specifications (key-value with icon)
  '[
    {"label": "Living/Dining Flooring", "value": "Premium Quality Vitrified Tiles", "icon_id": null, "icon_name": "layers"},
    {"label": "Doors", "value": "Laminated Flush Doors", "icon_id": null, "icon_name": "door-open"},
    {"label": "Walls", "value": "Emulsion Paint", "icon_id": null, "icon_name": "paintbrush"},
    {"label": "Windows", "value": "UPVC / CFFS PVC", "icon_id": null, "icon_name": "app-window"},
    {"label": "Switches", "value": "Branded Modular Switches", "icon_id": null, "icon_name": "toggle-right"},
    {"label": "Bedroom Wardrobes", "value": "Elegant Wardrobe of Best Quality", "icon_id": null, "icon_name": "shirt"},
    {"label": "AC Provision", "value": "Split AC provision in Living & Bedrooms", "icon_id": null, "icon_name": "snowflake"},
    {"label": "Washroom Flooring", "value": "Premium Vitrified / Anti-Skid Tiles", "icon_id": null, "icon_name": "grid-3x3"},
    {"label": "Washroom Walls", "value": "Premium Wall Tiles (Full Ceiling Height)", "icon_id": null, "icon_name": "square"},
    {"label": "CP Fittings", "value": "Jaquar / Kohler or Equivalent", "icon_id": null, "icon_name": "droplets"},
    {"label": "Kitchen Sink", "value": "Branded Double Bowl Stainless Steel", "icon_id": null, "icon_name": "droplet"},
    {"label": "Kitchen Walls", "value": "Premium Tiles 2ft above counter + Emulsion", "icon_id": null, "icon_name": "cooking-pot"},
    {"label": "Balcony Flooring", "value": "Premium Quality Vitrified Tiles", "icon_id": null, "icon_name": "fence"},
    {"label": "External Finish", "value": "Exterior Emulsion Weather Proof Paint", "icon_id": null, "icon_name": "paintbrush"},
    {"label": "Plumbing", "value": "GI / CPVC / UPVC Internal Plumbing", "icon_id": null, "icon_name": "droplets"},
    {"label": "Staircase Flooring", "value": "Granite / Premium Tiles", "icon_id": null, "icon_name": "arrow-up-right"},
    {"label": "Connectivity", "value": "DTH & Broadband Provision", "icon_id": null, "icon_name": "zap"}
  ]'::jsonb,

  -- parking
  '{"types": ["stilt", "basement"], "basement_levels": 2, "guest_parking": true, "allotment": null}'::jsonb,

  -- points_of_interest
  '[
    {"name": "Chandigarh International Airport", "category": "transport", "distance_value": 10, "distance_unit": "min"},
    {"name": "Chandigarh Railway Station", "category": "transport", "distance_value": 15, "distance_unit": "min"},
    {"name": "Bus Stand", "category": "transport", "distance_value": 5, "distance_unit": "min"},
    {"name": "Schools", "category": "education", "distance_value": 5, "distance_unit": "min"},
    {"name": "Banks", "category": "notable", "distance_value": 2, "distance_unit": "min"},
    {"name": "Hospitals", "category": "healthcare", "distance_value": 5, "distance_unit": "min"},
    {"name": "Elante Mall", "category": "shopping", "distance_value": 15, "distance_unit": "min"},
    {"name": "KFC / McDonald''s", "category": "food", "distance_value": 1, "distance_unit": "min"},
    {"name": "D.Mart / Decathlon", "category": "shopping", "distance_value": 1, "distance_unit": "min"},
    {"name": "Multiplex", "category": "lifestyle", "distance_value": 1, "distance_unit": "min"},
    {"name": "Starbucks", "category": "food", "distance_value": 1, "distance_unit": "min"},
    {"name": "St. Xavier''s International School", "category": "education", "distance_value": 3, "distance_unit": "min"},
    {"name": "Alchemist Hospital", "category": "healthcare", "distance_value": 8, "distance_unit": "min"},
    {"name": "IT City Mohali / Infosys", "category": "notable", "distance_value": 20, "distance_unit": "min"},
    {"name": "Amity University", "category": "education", "distance_value": 15, "distance_unit": "min"},
    {"name": "Chattbir Zoo", "category": "lifestyle", "distance_value": 10, "distance_unit": "min"}
  ]'::jsonb,

  -- project_details_extra
  '{"totalTowers": 4, "totalUnits": 157, "floors": 14, "constructionStatus": "Under Construction (Mivan Technology)", "facingOptions": ["North", "South", "East", "West"]}'::jsonb,

  -- location_advantages (legacy, keeping for backward compat)
  '{"airportKm": 15, "schoolsKm": 2, "hospitalsKm": 3, "marketKm": 1}'::jsonb,

  NOW()
);

-- 3. Towers
INSERT INTO towers (id, project_id, name, floor_from, floor_to, units_per_floor, lifts_count, lift_type, staircase_info, sort_order)
VALUES
  ('c0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000002', 'Tower A', 1, 7, 2, 2, 'high-speed', 'Double staircase', 0),
  ('c0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000002', 'Tower B', 1, 9, 2, 2, 'high-speed', 'Double staircase', 1),
  ('c0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000002', 'Tower C', 2, 14, 4, 3, 'high-speed', 'Double staircase', 2),
  ('c0000001-0001-0001-0001-000000000004', 'a0000001-0001-0001-0001-000000000002', 'Tower D', 2, 14, 4, 3, 'high-speed', 'Double staircase', 3);

-- 4. Configurations (6 types from brochure)

-- Type A: 3BHK with Store + Pooja Room — Tower A & B, Floors 1-7 / 1-9
INSERT INTO configurations (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, balcony_area_sqft, covered_area_sqft, super_area_sqft, tower_id, floor_from, floor_to, type_label)
VALUES
  ('a0000001-0001-0001-0001-000000000002', '3 BHK + Store + Pooja Room', 3, 3, 1454, 470, 1924, 2400, 'c0000001-0001-0001-0001-000000000001', 1, 7, 'Type A'),
  ('a0000001-0001-0001-0001-000000000002', '3 BHK + Store + Pooja Room', 3, 3, 1454, 470, 1924, 2400, 'c0000001-0001-0001-0001-000000000002', 1, 9, 'Type A');

-- Type B: 3BHK with Pooja Room — Tower A
INSERT INTO configurations (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, balcony_area_sqft, covered_area_sqft, super_area_sqft, tower_id, floor_from, floor_to, type_label)
VALUES
  ('a0000001-0001-0001-0001-000000000002', '3 BHK + Pooja Room', 3, 3, 1385, 470, 1855, 2310, 'c0000001-0001-0001-0001-000000000001', 1, 7, 'Type B');

-- Type C: 3BHK with Pooja Room — Tower B
INSERT INTO configurations (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, balcony_area_sqft, covered_area_sqft, super_area_sqft, tower_id, floor_from, floor_to, type_label)
VALUES
  ('a0000001-0001-0001-0001-000000000002', '3 BHK + Pooja Room', 3, 3, 1359, 460, 1819, 2255, 'c0000001-0001-0001-0001-000000000002', 1, 9, 'Type C');

-- Type A (C&D): 3BHK with Store — Tower C & D
INSERT INTO configurations (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, balcony_area_sqft, covered_area_sqft, super_area_sqft, tower_id, floor_from, floor_to, type_label)
VALUES
  ('a0000001-0001-0001-0001-000000000002', '3 BHK + Store', 3, 3, 1418, 348, 1767, 2050, 'c0000001-0001-0001-0001-000000000003', 2, 14, 'Type A'),
  ('a0000001-0001-0001-0001-000000000002', '3 BHK + Store', 3, 3, 1418, 348, 1767, 2050, 'c0000001-0001-0001-0001-000000000004', 2, 14, 'Type A');

-- Type B (C&D): 3BHK with Store — Tower C & D
INSERT INTO configurations (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, balcony_area_sqft, covered_area_sqft, super_area_sqft, tower_id, floor_from, floor_to, type_label)
VALUES
  ('a0000001-0001-0001-0001-000000000002', '3 BHK + Store', 3, 3, 1374, 348, 1723, 1998, 'c0000001-0001-0001-0001-000000000003', 2, 14, 'Type B'),
  ('a0000001-0001-0001-0001-000000000002', '3 BHK + Store', 3, 3, 1374, 348, 1723, 1998, 'c0000001-0001-0001-0001-000000000004', 2, 14, 'Type B');

-- Type C (C&D): 3BHK Apartment — Tower C & D
INSERT INTO configurations (project_id, config_name, bedrooms, bathrooms, carpet_area_sqft, balcony_area_sqft, covered_area_sqft, super_area_sqft, tower_id, floor_from, floor_to, type_label)
VALUES
  ('a0000001-0001-0001-0001-000000000002', '3 BHK Apartment', 3, 3, 1200, 467, 1667, 1910, 'c0000001-0001-0001-0001-000000000003', 2, 14, 'Type C'),
  ('a0000001-0001-0001-0001-000000000002', '3 BHK Apartment', 3, 3, 1200, 467, 1667, 1910, 'c0000001-0001-0001-0001-000000000004', 2, 14, 'Type C');

-- 5. Amenities (link existing amenities)
INSERT INTO project_amenities (project_id, amenity_id)
SELECT 'a0000001-0001-0001-0001-000000000002', id FROM amenities WHERE name IN (
  'Clubhouse',
  'Children''s Play Area',
  'Garden',
  'Parking',
  '24/7 Security',
  'CCTV',
  'Power Backup',
  'Lift',
  'Fire Safety',
  'Basketball Court'
);
