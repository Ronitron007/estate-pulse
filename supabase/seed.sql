-- Seed data for Estate Pulse
-- Generated from real estate listings + synthetic data

-- =============================================
-- BUILDERS
-- =============================================
INSERT INTO builders (id, name, slug, description, website, established_year) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51', 'Godrej Properties', 'godrej-properties', 'One of India''s leading real estate developers with a legacy of trust and quality construction.', 'https://www.godrejproperties.com', 1990),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c52', 'Lodha Group', 'lodha-group', 'Premium real estate developer known for luxury residences and world-class amenities.', 'https://www.lodhagroup.com', 1980),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c53', 'Hiranandani Developers', 'hiranandani-developers', 'Pioneers in township development with integrated living spaces.', 'https://www.hiranandani.com', 1978),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c54', 'Oberoi Realty', 'oberoi-realty', 'Ultra-luxury developer with iconic projects across Mumbai.', 'https://www.oberoirealty.com', 1998),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c55', 'Prestige Group', 'prestige-group', 'South India''s largest real estate developer with pan-India presence.', 'https://www.prestigeconstructions.com', 1986),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56', 'DLF Limited', 'dlf-limited', 'India''s largest real estate company by market capitalization.', 'https://www.dlf.in', 1946),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c57', 'Sobha Limited', 'sobha-limited', 'Known for quality construction and backward integration.', 'https://www.sobha.com', 1995),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c58', 'Brigade Group', 'brigade-group', 'Leading developer in Bangalore with diversified portfolio.', 'https://www.brigadegroup.com', 1986);

-- =============================================
-- PROJECTS (Properties)
-- =============================================

-- Mumbai Projects
INSERT INTO projects (id, slug, name, description, status, price_min, price_max, price_on_request, address, city, locality, pincode, location, property_type, total_units, available_units, possession_date, rera_id, builder_id, published_at) VALUES
  -- Godrej Avenue Eleven - Mahalaxmi
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', 'godrej-avenue-eleven', 'Godrej Avenue Eleven', 'Luxury residences in the heart of South Mumbai with stunning views of the racecourse. Features Olympic-length swimming pool, expansive decks, and low-density living.', 'ongoing', 1185000000, 1761000000, false, 'Mahalaxmi Racecourse, Dr. E Moses Road', 'Mumbai', 'Mahalaxmi', '400034', ST_SetSRID(ST_MakePoint(72.8197, 18.9834), 4326), 'apartment', 200, 45, '2028-12-31', 'P51800028732', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51', NOW()),

  -- Godrej Horizon - Wadala
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', 'godrej-horizon', 'Godrej Horizon', 'Spacious apartments with panoramic views of Eastern Bay and Mumbai skyline. Features private decks and 1.32-acre sky lounge.', 'ongoing', 394000000, 744000000, false, 'Wadala East, Antop Hill', 'Mumbai', 'Wadala', '400037', ST_SetSRID(ST_MakePoint(72.8656, 19.0178), 4326), 'apartment', 350, 120, '2028-05-31', 'P51800032145', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51', NOW()),

  -- Godrej Reserve - Kandivali
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', 'godrej-reserve', 'Godrej Reserve', 'Resort-style living with 2.42 hectares of lush open spaces. Elegantly built apartments with expansive decks and exclusive amenities.', 'upcoming', 233000000, 727000000, false, 'Western Express Highway, Kandivali East', 'Mumbai', 'Kandivali East', '400101', ST_SetSRID(ST_MakePoint(72.8697, 19.2047), 4326), 'apartment', 500, 500, '2030-06-30', 'P51800045678', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51', NOW()),

  -- Lodha Divino - Matunga
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', 'lodha-divino', 'Lodha Divino', 'Luxurious estate on 10 acres with 70% open space. 15 minutes drive to BKC and Lower Parel. Features Gymkhana-inspired clubhouse of 35,000+ sq ft.', 'ongoing', 337000000, 1239000000, false, 'Matunga West, Near Five Gardens', 'Mumbai', 'Matunga', '400016', ST_SetSRID(ST_MakePoint(72.8421, 19.0275), 4326), 'apartment', 280, 85, '2027-12-31', 'P51800029876', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c52', NOW()),

  -- Lodha Bellevue - Mahalaxmi
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', 'lodha-bellevue', 'Lodha Bellevue', 'Ultra-luxury tower with unobstructed sea views. World-class amenities including infinity pool, private theatre, and concierge services.', 'ongoing', 518000000, 1051000000, false, 'Dr. Annie Besant Road, Mahalaxmi', 'Mumbai', 'Mahalaxmi', '400034', ST_SetSRID(ST_MakePoint(72.8234, 18.9912), 4326), 'penthouse', 120, 28, '2026-06-30', 'P51800027654', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c52', NOW()),

  -- Hiranandani Fortune City - Panvel
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', 'hiranandani-fortune-city', 'Hiranandani Fortune City', 'Integrated township with 90,000+ sq ft Club Royale. 80% open spaces and 5.3-acre landscaped area with 80+ active-life amenities.', 'completed', 131000000, 365000000, false, 'Old Mumbai-Pune Highway, Panvel', 'Mumbai', 'Panvel', '410206', ST_SetSRID(ST_MakePoint(73.1089, 18.9894), 4326), 'apartment', 1200, 180, '2024-02-28', 'P52000018234', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c53', NOW()),

  -- Oberoi Sky City - Borivali
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', 'oberoi-sky-city', 'Oberoi Sky City', 'Premium high-rise living with spectacular city views. Features rooftop infinity pool and landscaped podium gardens.', 'ongoing', 285000000, 580000000, false, 'Western Express Highway, Borivali East', 'Mumbai', 'Borivali', '400066', ST_SetSRID(ST_MakePoint(72.8567, 19.2321), 4326), 'apartment', 450, 165, '2027-09-30', 'P51800034567', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c54', NOW()),

-- Bangalore Projects
  -- Prestige City - Sarjapur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 'prestige-city-sarjapur', 'Prestige City', 'Massive integrated township spread across 180 acres. Multiple towers with varied configurations and world-class amenities.', 'ongoing', 85000000, 245000000, false, 'Sarjapur Road, Near Wipro Corporate Office', 'Bangalore', 'Sarjapur', '562125', ST_SetSRID(ST_MakePoint(77.7712, 12.8589), 4326), 'apartment', 2500, 890, '2028-03-31', 'PRM/KA/RERA/1251/446/PR/171015/000934', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c55', NOW()),

  -- Sobha Dream Acres - Panathur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', 'sobha-dream-acres', 'Sobha Dream Acres', 'Thoughtfully designed homes with Sobha''s signature quality. Features extensive landscaping and modern amenities.', 'completed', 65000000, 125000000, false, 'Panathur Road, Near Marathahalli', 'Bangalore', 'Panathur', '560103', ST_SetSRID(ST_MakePoint(77.7234, 12.9456), 4326), 'apartment', 800, 45, '2024-08-31', 'PRM/KA/RERA/1251/309/PR/170808/001987', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c57', NOW()),

  -- Brigade Eldorado - Bagalur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', 'brigade-eldorado', 'Brigade Eldorado', 'Premium apartments near the international airport. Features club with Olympic-size pool and tennis courts.', 'upcoming', 75000000, 165000000, false, 'Bagalur Road, Near Kempegowda International Airport', 'Bangalore', 'Bagalur', '562149', ST_SetSRID(ST_MakePoint(77.6234, 13.1567), 4326), 'apartment', 600, 600, '2029-12-31', 'PRM/KA/RERA/1251/446/PR/231201/002345', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c58', NOW()),

-- Delhi NCR Projects
  -- DLF The Arbour - Gurgaon
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', 'dlf-the-arbour', 'DLF The Arbour', 'Ultra-luxury independent floors in DLF Phase 5. Private elevator, terrace garden, and exclusive club access.', 'ongoing', 450000000, 950000000, false, 'DLF Phase 5, Near Golf Course Road', 'Gurgaon', 'DLF Phase 5', '122009', ST_SetSRID(ST_MakePoint(77.0932, 28.4456), 4326), 'villa', 85, 22, '2026-12-31', 'RC/REP/HARERA/GGM/2023/1456', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56', NOW()),

  -- DLF The Camellias - Gurgaon
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', 'dlf-the-camellias', 'DLF The Camellias', 'India''s most expensive residential address. Ultra-luxury apartments with private pools, butler service, and 7-star amenities.', 'completed', 1500000000, 4500000000, true, 'Golf Course Road, DLF Phase 5', 'Gurgaon', 'Golf Course Road', '122009', ST_SetSRID(ST_MakePoint(77.1012, 28.4389), 4326), 'penthouse', 50, 3, '2023-06-30', 'RC/REP/HARERA/GGM/2019/0234', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56', NOW()),

-- Hyderabad Projects
  -- Prestige High Fields - Gachibowli
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', 'prestige-high-fields', 'Prestige High Fields', 'Premium apartments near Financial District. Features rooftop infinity pool with city views and state-of-the-art fitness center.', 'ongoing', 95000000, 285000000, false, 'Nanakramguda Road, Near Financial District', 'Hyderabad', 'Gachibowli', '500032', ST_SetSRID(ST_MakePoint(78.3567, 17.4234), 4326), 'apartment', 380, 145, '2027-06-30', 'P02400003456', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c55', NOW()),

  -- Sobha Neopolis - Kokapet
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', 'sobha-neopolis', 'Sobha Neopolis', 'Thoughtfully designed 3 and 4 BHK apartments with premium specifications. Near Outer Ring Road for easy connectivity.', 'upcoming', 115000000, 235000000, false, 'Kokapet Main Road, Near ORR Junction', 'Hyderabad', 'Kokapet', '500075', ST_SetSRID(ST_MakePoint(78.3123, 17.3789), 4326), 'apartment', 420, 420, '2029-09-30', 'P02400004567', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c57', NOW()),

-- Pune Projects
  -- Godrej Woodsville - Hinjewadi
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', 'godrej-woodsville', 'Godrej Woodsville', 'Modern apartments surrounded by greenery. Walking distance to IT parks with excellent connectivity.', 'ongoing', 75000000, 185000000, false, 'Hinjewadi Phase 3, Near Rajiv Gandhi Infotech Park', 'Pune', 'Hinjewadi', '411057', ST_SetSRID(ST_MakePoint(73.7012, 18.5678), 4326), 'apartment', 550, 210, '2027-03-31', 'P52100028765', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51', NOW());

-- =============================================
-- CONFIGURATIONS (BHK variants)
-- =============================================
INSERT INTO configurations (id, project_id, bedrooms, bathrooms, config_name, carpet_area_sqft, built_up_area_sqft, price) VALUES
  -- Godrej Avenue Eleven
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', 3, 3, '3 BHK Premium', 1450, 1850, 1185000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', 4, 4, '4 BHK Luxury', 2100, 2650, 1761000000),

  -- Godrej Horizon
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', 2, 2, '2 BHK Compact', 850, 1100, 394000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', 3, 3, '3 BHK Spacious', 1250, 1580, 744000000),

  -- Godrej Reserve
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', 2, 2, '2 BHK', 780, 1020, 233000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', 3, 3, '3 BHK', 1100, 1420, 445000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', 4, 4, '4 BHK Grande', 1650, 2100, 727000000),

  -- Lodha Divino
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', 2, 2, '2 BHK', 920, 1180, 337000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', 3, 3, '3 BHK', 1380, 1750, 685000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', 4, 5, '4 BHK Duplex', 2200, 2800, 1239000000),

  -- Lodha Bellevue
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', 3, 4, '3 BHK Sea View', 1850, 2350, 518000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', 4, 5, '4 BHK Penthouse', 3200, 4100, 1051000000),

  -- Hiranandani Fortune City
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', 2, 2, '2 BHK', 650, 850, 131000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', 3, 2, '3 BHK', 920, 1180, 225000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', 4, 3, '4 BHK', 1350, 1720, 365000000),

  -- Oberoi Sky City
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c16', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', 2, 2, '2 BHK', 780, 1000, 285000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c17', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', 3, 3, '3 BHK', 1150, 1450, 425000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c18', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', 4, 4, '4 BHK Premium', 1680, 2100, 580000000),

  -- Prestige City Sarjapur
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c19', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 1, 1, '1 BHK Studio', 480, 620, 85000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c20', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 2, 2, '2 BHK', 720, 920, 125000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 3, 3, '3 BHK', 1080, 1380, 185000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 4, 4, '4 BHK Villa', 1650, 2100, 245000000),

  -- Sobha Dream Acres
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', 2, 2, '2 BHK', 680, 880, 65000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', 3, 2, '3 BHK', 980, 1250, 95000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', 3, 3, '3 BHK Premium', 1150, 1450, 125000000),

  -- Brigade Eldorado
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', 2, 2, '2 BHK', 720, 920, 75000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', 3, 3, '3 BHK', 1050, 1340, 120000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', 4, 4, '4 BHK', 1480, 1880, 165000000),

  -- DLF The Arbour
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', 4, 5, '4 BHK Independent Floor', 3200, 4100, 450000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', 5, 6, '5 BHK Villa', 4500, 5800, 950000000),

  -- DLF The Camellias
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', 4, 5, '4 BHK Ultra Luxury', 5500, 7200, 1500000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', 5, 7, '5 BHK Penthouse', 8500, 11000, 4500000000),

  -- Prestige High Fields
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', 2, 2, '2 BHK', 820, 1050, 95000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', 3, 3, '3 BHK', 1250, 1580, 175000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', 4, 4, '4 BHK', 1750, 2200, 285000000),

  -- Sobha Neopolis
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c36', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', 3, 3, '3 BHK', 1150, 1450, 115000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c37', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', 4, 4, '4 BHK Premium', 1650, 2080, 235000000),

  -- Godrej Woodsville
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c38', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', 2, 2, '2 BHK', 720, 920, 75000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c39', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', 3, 2, '3 BHK', 1020, 1300, 125000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c40', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', 3, 3, '3 BHK Premium', 1250, 1580, 185000000);

-- =============================================
-- PROJECT AMENITIES (Link projects to amenities)
-- =============================================

-- Get amenity IDs first, then link
DO $$
DECLARE
  swimming_pool_id UUID;
  gym_id UUID;
  clubhouse_id UUID;
  play_area_id UUID;
  garden_id UUID;
  parking_id UUID;
  security_id UUID;
  cctv_id UUID;
  power_backup_id UUID;
  lift_id UUID;
  intercom_id UUID;
  fire_safety_id UUID;
  jogging_track_id UUID;
  tennis_court_id UUID;
  basketball_court_id UUID;
  indoor_games_id UUID;
  library_id UUID;
  yoga_room_id UUID;
  spa_id UUID;
  cafeteria_id UUID;
BEGIN
  SELECT id INTO swimming_pool_id FROM amenities WHERE name = 'Swimming Pool';
  SELECT id INTO gym_id FROM amenities WHERE name = 'Gym';
  SELECT id INTO clubhouse_id FROM amenities WHERE name = 'Clubhouse';
  SELECT id INTO play_area_id FROM amenities WHERE name = 'Children''s Play Area';
  SELECT id INTO garden_id FROM amenities WHERE name = 'Garden';
  SELECT id INTO parking_id FROM amenities WHERE name = 'Parking';
  SELECT id INTO security_id FROM amenities WHERE name = '24/7 Security';
  SELECT id INTO cctv_id FROM amenities WHERE name = 'CCTV';
  SELECT id INTO power_backup_id FROM amenities WHERE name = 'Power Backup';
  SELECT id INTO lift_id FROM amenities WHERE name = 'Lift';
  SELECT id INTO intercom_id FROM amenities WHERE name = 'Intercom';
  SELECT id INTO fire_safety_id FROM amenities WHERE name = 'Fire Safety';
  SELECT id INTO jogging_track_id FROM amenities WHERE name = 'Jogging Track';
  SELECT id INTO tennis_court_id FROM amenities WHERE name = 'Tennis Court';
  SELECT id INTO basketball_court_id FROM amenities WHERE name = 'Basketball Court';
  SELECT id INTO indoor_games_id FROM amenities WHERE name = 'Indoor Games';
  SELECT id INTO library_id FROM amenities WHERE name = 'Library';
  SELECT id INTO yoga_room_id FROM amenities WHERE name = 'Yoga Room';
  SELECT id INTO spa_id FROM amenities WHERE name = 'Spa';
  SELECT id INTO cafeteria_id FROM amenities WHERE name = 'Cafeteria';

  -- Luxury projects (all amenities)
  INSERT INTO project_amenities (project_id, amenity_id) VALUES
    -- Godrej Avenue Eleven (luxury)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', tennis_court_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', yoga_room_id),

    -- Godrej Horizon
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', jogging_track_id),

    -- Godrej Reserve
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', jogging_track_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', tennis_court_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', basketball_court_id),

    -- Lodha Divino (luxury)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', tennis_court_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', indoor_games_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', cafeteria_id),

    -- Lodha Bellevue (ultra luxury)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', yoga_room_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', library_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', cafeteria_id),

    -- Hiranandani Fortune City (township)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', cctv_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', jogging_track_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', tennis_court_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', basketball_court_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', indoor_games_id),

    -- Oberoi Sky City
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', spa_id),

    -- Prestige City Sarjapur (mega township)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', cctv_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', jogging_track_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', tennis_court_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', basketball_court_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', indoor_games_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', yoga_room_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', cafeteria_id),

    -- Sobha Dream Acres
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', lift_id),

    -- Brigade Eldorado
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', tennis_court_id),

    -- DLF The Arbour (luxury villas)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', yoga_room_id),

    -- DLF The Camellias (ultra luxury)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', yoga_room_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', library_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', cafeteria_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', indoor_games_id),

    -- Prestige High Fields
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', jogging_track_id),

    -- Sobha Neopolis
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', lift_id),

    -- Godrej Woodsville
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', jogging_track_id);
END $$;

-- =============================================
-- PROJECT IMAGES (placeholder Cloudinary IDs)
-- =============================================
INSERT INTO project_images (id, project_id, cloudinary_public_id, width, height, image_type, alt_text, sort_order, is_primary) VALUES
  -- Each project gets 2-3 images
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', 'estate-pulse/godrej-avenue-eleven-1', 1920, 1080, 'exterior', 'Godrej Avenue Eleven exterior view', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01', 'estate-pulse/godrej-avenue-eleven-2', 1920, 1080, 'interior', 'Godrej Avenue Eleven living room', 2, false),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', 'estate-pulse/godrej-horizon-1', 1920, 1080, 'exterior', 'Godrej Horizon tower view', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02', 'estate-pulse/godrej-horizon-2', 1920, 1080, 'interior', 'Godrej Horizon bedroom', 2, false),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03', 'estate-pulse/godrej-reserve-1', 1920, 1080, 'exterior', 'Godrej Reserve aerial view', 1, true),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', 'estate-pulse/lodha-divino-1', 1920, 1080, 'exterior', 'Lodha Divino facade', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04', 'estate-pulse/lodha-divino-2', 1920, 1080, 'amenity', 'Lodha Divino gymkhana', 2, false),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05', 'estate-pulse/lodha-bellevue-1', 1920, 1080, 'exterior', 'Lodha Bellevue sea view', 1, true),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', 'estate-pulse/hiranandani-fortune-1', 1920, 1080, 'exterior', 'Hiranandani Fortune City township', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06', 'estate-pulse/hiranandani-fortune-2', 1920, 1080, 'amenity', 'Hiranandani Fortune City club', 2, false),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07', 'estate-pulse/oberoi-sky-city-1', 1920, 1080, 'exterior', 'Oberoi Sky City tower', 1, true),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 'estate-pulse/prestige-city-1', 1920, 1080, 'exterior', 'Prestige City Sarjapur aerial', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08', 'estate-pulse/prestige-city-2', 1920, 1080, 'amenity', 'Prestige City clubhouse', 2, false),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09', 'estate-pulse/sobha-dream-acres-1', 1920, 1080, 'exterior', 'Sobha Dream Acres campus', 1, true),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10', 'estate-pulse/brigade-eldorado-1', 1920, 1080, 'exterior', 'Brigade Eldorado towers', 1, true),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c16', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11', 'estate-pulse/dlf-arbour-1', 1920, 1080, 'exterior', 'DLF The Arbour villa', 1, true),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c17', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', 'estate-pulse/dlf-camellias-1', 1920, 1080, 'exterior', 'DLF The Camellias luxury tower', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c18', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12', 'estate-pulse/dlf-camellias-2', 1920, 1080, 'interior', 'DLF The Camellias penthouse', 2, false),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c19', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13', 'estate-pulse/prestige-high-fields-1', 1920, 1080, 'exterior', 'Prestige High Fields tower', 1, true),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c20', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14', 'estate-pulse/sobha-neopolis-1', 1920, 1080, 'exterior', 'Sobha Neopolis facade', 1, true),

  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15', 'estate-pulse/godrej-woodsville-1', 1920, 1080, 'exterior', 'Godrej Woodsville greenery', 1, true);

-- Done!
SELECT
  'Seed complete!' as status,
  (SELECT COUNT(*) FROM builders) as builders,
  (SELECT COUNT(*) FROM projects) as projects,
  (SELECT COUNT(*) FROM configurations) as configurations,
  (SELECT COUNT(*) FROM project_amenities) as project_amenities,
  (SELECT COUNT(*) FROM project_images) as project_images;

