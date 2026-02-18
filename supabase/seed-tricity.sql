-- Seed data for Estate Pulse - Tricity Projects
-- Chandigarh, Mohali, Panchkula, Zirakpur, Kharar

-- =============================================
-- BUILDERS (Tricity-focused)
-- =============================================
INSERT INTO builders (id, name, slug, description, website, established_year) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c61', 'Omaxe Limited', 'omaxe-limited', 'Leading real estate developer with strong presence in North India, known for integrated townships and commercial projects.', 'https://www.omaxe.com', 1987),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c62', 'Sushma Buildtech', 'sushma-buildtech', 'Premium developer in Tricity region known for luxury residential projects and quality construction.', 'https://www.sushmagroup.com', 2005),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c63', 'Motiaz Royal', 'motiaz-royal', 'Boutique developer specializing in ultra-luxury homes and exclusive residential communities in Chandigarh region.', 'https://www.motiazroyal.com', 2008),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c64', 'Janta Land Promoters', 'janta-land-promoters', 'One of the oldest developers in Punjab with over 40 years of experience in residential and commercial projects.', 'https://www.jantaland.com', 1980),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c65', 'Emaar India', 'emaar-india', 'Indian subsidiary of global developer Emaar Properties, known for premium residential and commercial developments.', 'https://www.emaarindia.com', 2005),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c66', 'Ambuja Neotia', 'ambuja-neotia', 'Eastern India based developer expanding to North India with focus on sustainable and community-centric developments.', 'https://www.ambujaneotia.com', 1944)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PROJECTS - TRICITY
-- =============================================

-- Mohali Projects
INSERT INTO projects (id, slug, name, description, status, price_min, price_max, price_on_request, address, city, locality, pincode, location, property_type, total_units, available_units, possession_date, rera_id, builder_id, published_at) VALUES
  -- DLF Hyde Park - Mullanpur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', 'dlf-hyde-park', 'DLF Hyde Park', 'Premium plotted development in New Chandigarh with world-class infrastructure. Gated community with parks, clubhouse, and excellent connectivity to IT City.', 'ongoing', 65000000, 185000000, false, 'Sector 1, Mullanpur, New Chandigarh', 'Mohali', 'Mullanpur', '140901', ST_SetSRID(ST_MakePoint(76.7012, 30.8234), 4326), 'plot', 450, 85, '2027-06-30', 'PBRERA-SAS79-PR0456', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56', NOW()),

  -- Sushma Crescent - Zirakpur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', 'sushma-crescent', 'Sushma Crescent', 'Modern high-rise apartments with stunning views of Shivalik Hills. Premium specifications with modular kitchens and VRV air conditioning.', 'ongoing', 85000000, 175000000, false, 'PR7 Airport Road, Zirakpur', 'Zirakpur', 'Airport Road', '140603', ST_SetSRID(ST_MakePoint(76.8178, 30.6489), 4326), 'apartment', 320, 95, '2027-12-31', 'PBRERA-SAS79-PR0512', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c62', NOW()),

  -- Omaxe The Resort - Mullanpur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', 'omaxe-the-resort', 'Omaxe The Resort', 'Luxury villas in serene setting with private gardens. Resort-style amenities including golf course, spa, and organic farms.', 'upcoming', 250000000, 650000000, false, 'Sector 5, Mullanpur, New Chandigarh', 'Mohali', 'Mullanpur', '140901', ST_SetSRID(ST_MakePoint(76.6934, 30.8156), 4326), 'villa', 120, 120, '2029-03-31', 'PBRERA-SAS79-PR0623', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c61', NOW()),

  -- Motiaz Royal Citi - Zirakpur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', 'motiaz-royal-citi', 'Motiaz Royal Citi', 'Integrated township with residential, commercial, and retail spaces. Central location near Chandigarh-Ambala highway with excellent connectivity.', 'completed', 55000000, 125000000, false, 'VIP Road, Zirakpur', 'Zirakpur', 'VIP Road', '140603', ST_SetSRID(ST_MakePoint(76.8067, 30.6401), 4326), 'apartment', 550, 45, '2024-06-30', 'PBRERA-SAS79-PR0234', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c63', NOW()),

  -- Janta Enclave - Kharar
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', 'janta-enclave-kharar', 'Janta Enclave', 'Affordable housing with premium amenities. Perfect for first-time homebuyers seeking quality homes near IT hub.', 'ongoing', 35000000, 75000000, false, 'Sector 126, Kharar', 'Kharar', 'Sector 126', '140301', ST_SetSRID(ST_MakePoint(76.6456, 30.7234), 4326), 'apartment', 680, 220, '2026-09-30', 'PBRERA-SAS79-PR0345', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c64', NOW()),

  -- Sushma Joynest - Airport Road
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', 'sushma-joynest', 'Sushma Joynest', 'Compact luxury apartments designed for modern urban living. Smart home features and excellent investment potential near airport.', 'ongoing', 45000000, 95000000, false, 'Sector 75, Mohali', 'Mohali', 'Sector 75', '160055', ST_SetSRID(ST_MakePoint(76.7234, 30.7012), 4326), 'apartment', 420, 165, '2027-03-31', 'PBRERA-SAS79-PR0456', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c62', NOW()),

-- Chandigarh Projects
  -- Emaar Palm Heights - Manimajra
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', 'emaar-palm-heights', 'Emaar Palm Heights', 'Ultra-luxury towers near Railway Station with panoramic city views. Premium fittings, private elevators, and signature Emaar quality.', 'ongoing', 185000000, 425000000, false, 'Near Railway Station, Manimajra', 'Chandigarh', 'Manimajra', '160101', ST_SetSRID(ST_MakePoint(76.8234, 30.7234), 4326), 'apartment', 180, 55, '2028-06-30', 'HARERA-PKL-PR0789', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c65', NOW()),

  -- Omaxe Celestia Royal - IT Park
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', 'omaxe-celestia-royal', 'Omaxe Celestia Royal', 'Premium apartments near IT Park Chandigarh. Walking distance to tech offices with luxury amenities and green spaces.', 'completed', 95000000, 225000000, false, 'Near IT Park, Sector 20', 'Chandigarh', 'Sector 20', '160020', ST_SetSRID(ST_MakePoint(76.7845, 30.7456), 4326), 'apartment', 280, 28, '2024-03-31', 'HARERA-PKL-PR0567', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c61', NOW()),

-- Panchkula Projects
  -- DLF Garden City - Panchkula Extension
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', 'dlf-garden-city-panchkula', 'DLF Garden City', 'Premium plotted development with panoramic Shivalik views. Gated community with extensive green areas and modern infrastructure.', 'ongoing', 75000000, 195000000, false, 'Sector 25, Panchkula Extension', 'Panchkula', 'Sector 25', '134116', ST_SetSRID(ST_MakePoint(76.8678, 30.7012), 4326), 'plot', 280, 95, '2027-12-31', 'HARERA-PKL-PR0890', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56', NOW()),

  -- Ambuja Utalika - Panchkula
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', 'ambuja-utalika', 'Ambuja Utalika', 'Luxury condominiums with international design standards. Floor-to-ceiling windows, premium finishes, and wellness-focused amenities.', 'upcoming', 125000000, 285000000, false, 'Sector 20, Panchkula', 'Panchkula', 'Sector 20', '134116', ST_SetSRID(ST_MakePoint(76.8523, 30.6934), 4326), 'apartment', 220, 220, '2029-06-30', 'HARERA-PKL-PR0912', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c66', NOW()),

  -- Omaxe Shivalik Homes - Panchkula
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', 'omaxe-shivalik-homes', 'Omaxe Shivalik Homes', 'Row houses and independent floors with mountain views. Perfect blend of privacy and community living in serene surroundings.', 'completed', 85000000, 165000000, false, 'Sector 21, Panchkula', 'Panchkula', 'Sector 21', '134116', ST_SetSRID(ST_MakePoint(76.8612, 30.6856), 4326), 'villa', 150, 12, '2023-12-31', 'HARERA-PKL-PR0456', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c61', NOW()),

-- More Mohali Projects
  -- Emaar Digi Homes - Sector 62
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', 'emaar-digi-homes', 'Emaar Digi Homes', 'Smart apartments with IoT integration near Mohali IT Park. Fully automated homes with voice control, smart security, and energy management.', 'ongoing', 65000000, 145000000, false, 'Sector 62, Mohali', 'Mohali', 'Sector 62', '160062', ST_SetSRID(ST_MakePoint(76.7134, 30.7089), 4326), 'apartment', 380, 145, '2027-09-30', 'PBRERA-SAS79-PR0678', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c65', NOW()),

  -- Sushma Valencia - Zirakpur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', 'sushma-valencia', 'Sushma Valencia', 'Spanish-themed luxury apartments with courtyards and terraces. Mediterranean architecture with modern Indian sensibilities.', 'ongoing', 75000000, 165000000, false, 'Gazipur Road, Zirakpur', 'Zirakpur', 'Gazipur', '140603', ST_SetSRID(ST_MakePoint(76.8234, 30.6523), 4326), 'apartment', 290, 110, '2028-03-31', 'PBRERA-SAS79-PR0734', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c62', NOW()),

  -- Janta Sky Gardens - Mohali
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', 'janta-sky-gardens', 'Janta Sky Gardens', 'High-rise apartments with sky gardens on every 5th floor. Unique terraced design maximizing natural light and ventilation.', 'upcoming', 55000000, 125000000, false, 'Sector 66A, Mohali', 'Mohali', 'Sector 66A', '160066', ST_SetSRID(ST_MakePoint(76.7234, 30.6923), 4326), 'apartment', 450, 450, '2029-12-31', 'PBRERA-SAS79-PR0845', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c64', NOW()),

  -- Motiaz Splendour - Mullanpur
  ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', 'motiaz-splendour', 'Motiaz Splendour', 'Exclusive boutique residences with only 4 apartments per floor. Ultra-luxury specifications with imported marble and designer fittings.', 'ongoing', 185000000, 385000000, false, 'Sector 2, Mullanpur, New Chandigarh', 'Mohali', 'Mullanpur', '140901', ST_SetSRID(ST_MakePoint(76.6978, 30.8189), 4326), 'penthouse', 80, 25, '2027-06-30', 'PBRERA-SAS79-PR0567', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c63', NOW());

-- =============================================
-- CONFIGURATIONS (BHK variants)
-- =============================================
INSERT INTO configurations (id, project_id, bedrooms, bathrooms, config_name, carpet_area_sqft, built_up_area_sqft, price) VALUES
  -- DLF Hyde Park (plots)
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', 0, 0, '200 Sq Yard Plot', 1800, 1800, 65000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c52', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', 0, 0, '300 Sq Yard Plot', 2700, 2700, 95000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c53', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', 0, 0, '500 Sq Yard Plot', 4500, 4500, 185000000),

  -- Sushma Crescent
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c54', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', 3, 3, '3 BHK Premium', 1450, 1850, 85000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c55', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', 4, 4, '4 BHK Luxury', 1950, 2450, 125000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', 4, 5, '4 BHK Penthouse', 2800, 3500, 175000000),

  -- Omaxe The Resort (villas)
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c57', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', 4, 5, '4 BHK Villa', 3500, 4200, 250000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c58', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', 5, 6, '5 BHK Manor', 5200, 6500, 450000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c59', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', 6, 7, '6 BHK Estate', 7500, 9200, 650000000),

  -- Motiaz Royal Citi
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c60', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', 2, 2, '2 BHK', 950, 1200, 55000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c61', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', 3, 2, '3 BHK', 1250, 1580, 85000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c62', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', 3, 3, '3 BHK Premium', 1450, 1850, 125000000),

  -- Janta Enclave Kharar
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c63', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', 2, 2, '2 BHK Compact', 750, 980, 35000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c64', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', 2, 2, '2 BHK Standard', 920, 1180, 48000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c65', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', 3, 2, '3 BHK', 1150, 1450, 75000000),

  -- Sushma Joynest
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c66', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', 2, 2, '2 BHK Smart', 850, 1080, 45000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c67', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', 3, 2, '3 BHK Smart', 1120, 1420, 68000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c68', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', 3, 3, '3 BHK Premium', 1350, 1720, 95000000),

  -- Emaar Palm Heights
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c69', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', 3, 3, '3 BHK Luxury', 1650, 2100, 185000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c70', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', 4, 4, '4 BHK Ultra Luxury', 2200, 2800, 285000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c71', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', 4, 5, '4 BHK Penthouse', 3200, 4100, 425000000),

  -- Omaxe Celestia Royal
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c72', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', 3, 3, '3 BHK', 1350, 1720, 95000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c73', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', 3, 3, '3 BHK Premium', 1580, 2000, 145000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c74', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', 4, 4, '4 BHK', 1950, 2480, 225000000),

  -- DLF Garden City Panchkula (plots)
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c75', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', 0, 0, '250 Sq Yard Plot', 2250, 2250, 75000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c76', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', 0, 0, '350 Sq Yard Plot', 3150, 3150, 125000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c77', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', 0, 0, '500 Sq Yard Plot', 4500, 4500, 195000000),

  -- Ambuja Utalika
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c78', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', 3, 3, '3 BHK Luxury', 1550, 1980, 125000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c79', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', 4, 4, '4 BHK Ultra', 2100, 2680, 195000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c80', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', 4, 5, '4 BHK Penthouse', 2850, 3650, 285000000),

  -- Omaxe Shivalik Homes (villas/floors)
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c81', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', 3, 3, '3 BHK Independent Floor', 1650, 2100, 85000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c82', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', 4, 4, '4 BHK Row House', 2400, 3050, 125000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c83', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', 4, 5, '4 BHK Villa', 3200, 4100, 165000000),

  -- Emaar Digi Homes
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c84', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', 2, 2, '2 BHK Smart Home', 920, 1180, 65000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c85', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', 3, 2, '3 BHK Smart Home', 1200, 1520, 95000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c86', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', 3, 3, '3 BHK Smart Plus', 1450, 1850, 145000000),

  -- Sushma Valencia
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c87', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', 3, 3, '3 BHK Valencia', 1380, 1750, 75000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c88', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', 3, 3, '3 BHK Courtyard', 1580, 2000, 115000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c89', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', 4, 4, '4 BHK Terrace', 2100, 2680, 165000000),

  -- Janta Sky Gardens
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c90', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', 2, 2, '2 BHK', 920, 1180, 55000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c91', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', 3, 2, '3 BHK', 1200, 1520, 85000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c92', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', 3, 3, '3 BHK Sky Garden', 1450, 1850, 125000000),

  -- Motiaz Splendour
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c93', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', 3, 4, '3 BHK Exclusive', 2100, 2680, 185000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c94', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', 4, 5, '4 BHK Grand', 2800, 3580, 285000000),
  ('c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c95', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', 4, 5, '4 BHK Penthouse', 3500, 4500, 385000000);

-- =============================================
-- PROJECT AMENITIES
-- =============================================
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
  SELECT id INTO jogging_track_id FROM amenities WHERE name = 'Jogging Track';
  SELECT id INTO tennis_court_id FROM amenities WHERE name = 'Tennis Court';
  SELECT id INTO basketball_court_id FROM amenities WHERE name = 'Basketball Court';
  SELECT id INTO indoor_games_id FROM amenities WHERE name = 'Indoor Games';
  SELECT id INTO library_id FROM amenities WHERE name = 'Library';
  SELECT id INTO yoga_room_id FROM amenities WHERE name = 'Yoga Room';
  SELECT id INTO spa_id FROM amenities WHERE name = 'Spa';
  SELECT id INTO cafeteria_id FROM amenities WHERE name = 'Cafeteria';

  INSERT INTO project_amenities (project_id, amenity_id) VALUES
    -- DLF Hyde Park (plotted development)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', cctv_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', jogging_track_id),

    -- Sushma Crescent (luxury apartments)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', yoga_room_id),

    -- Omaxe The Resort (luxury villas)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', tennis_court_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', jogging_track_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', yoga_room_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', cafeteria_id),

    -- Motiaz Royal Citi (township)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', cctv_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', lift_id),

    -- Janta Enclave Kharar (affordable)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', lift_id),

    -- Sushma Joynest (compact luxury)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', lift_id),

    -- Emaar Palm Heights (ultra luxury)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', yoga_room_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', library_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', cafeteria_id),

    -- Omaxe Celestia Royal
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', jogging_track_id),

    -- DLF Garden City Panchkula (plotted)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', cctv_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', jogging_track_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', tennis_court_id),

    -- Ambuja Utalika (luxury condos)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', yoga_room_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', indoor_games_id),

    -- Omaxe Shivalik Homes (villas)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', power_backup_id),

    -- Emaar Digi Homes (smart apartments)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', cctv_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', lift_id),

    -- Sushma Valencia (spanish themed)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', jogging_track_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', cafeteria_id),

    -- Janta Sky Gardens (high-rise)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', play_area_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', jogging_track_id),

    -- Motiaz Splendour (ultra boutique)
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', swimming_pool_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', gym_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', clubhouse_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', garden_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', parking_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', security_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', power_backup_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', lift_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', spa_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', yoga_room_id),
    ('b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', library_id);
END $$;

-- =============================================
-- PROJECT IMAGES (local paths for GCS upload)
-- Using new path convention: properties/{slug}/img-{uuid}
-- =============================================
INSERT INTO project_images (id, project_id, cloudinary_public_id, width, height, image_type, alt_text, sort_order, is_primary) VALUES
  -- DLF Hyde Park
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', 'properties/dlf-hyde-park/img-a1b2c3d4', 1920, 1080, 'exterior', 'DLF Hyde Park plotted development aerial view', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21', 'properties/dlf-hyde-park/img-e5f6g7h8', 1920, 1080, 'amenity', 'DLF Hyde Park clubhouse', 2, false),

  -- Sushma Crescent
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', 'properties/sushma-crescent/img-i9j0k1l2', 1920, 1080, 'exterior', 'Sushma Crescent tower facade', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22', 'properties/sushma-crescent/img-m3n4o5p6', 1920, 1080, 'interior', 'Sushma Crescent living room', 2, false),

  -- Omaxe The Resort
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', 'properties/omaxe-the-resort/img-q7r8s9t0', 1920, 1080, 'exterior', 'Omaxe The Resort villa exterior', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c36', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23', 'properties/omaxe-the-resort/img-u1v2w3x4', 1920, 1080, 'amenity', 'Omaxe The Resort golf course', 2, false),

  -- Motiaz Royal Citi
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c37', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24', 'properties/motiaz-royal-citi/img-y5z6a7b8', 1920, 1080, 'exterior', 'Motiaz Royal Citi township entrance', 1, true),

  -- Janta Enclave
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c38', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25', 'properties/janta-enclave-kharar/img-c9d0e1f2', 1920, 1080, 'exterior', 'Janta Enclave building facade', 1, true),

  -- Sushma Joynest
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c39', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', 'properties/sushma-joynest/img-g3h4i5j6', 1920, 1080, 'exterior', 'Sushma Joynest modern facade', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c40', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26', 'properties/sushma-joynest/img-k7l8m9n0', 1920, 1080, 'interior', 'Sushma Joynest smart home setup', 2, false),

  -- Emaar Palm Heights
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c41', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', 'properties/emaar-palm-heights/img-o1p2q3r4', 1920, 1080, 'exterior', 'Emaar Palm Heights tower', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c42', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27', 'properties/emaar-palm-heights/img-s5t6u7v8', 1920, 1080, 'interior', 'Emaar Palm Heights penthouse', 2, false),

  -- Omaxe Celestia Royal
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c43', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28', 'properties/omaxe-celestia-royal/img-w9x0y1z2', 1920, 1080, 'exterior', 'Omaxe Celestia Royal building', 1, true),

  -- DLF Garden City Panchkula
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c44', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', 'properties/dlf-garden-city-panchkula/img-a3b4c5d6', 1920, 1080, 'exterior', 'DLF Garden City Panchkula aerial', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c45', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29', 'properties/dlf-garden-city-panchkula/img-e7f8g9h0', 1920, 1080, 'amenity', 'DLF Garden City Panchkula clubhouse', 2, false),

  -- Ambuja Utalika
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c46', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30', 'properties/ambuja-utalika/img-i1j2k3l4', 1920, 1080, 'exterior', 'Ambuja Utalika tower', 1, true),

  -- Omaxe Shivalik Homes
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c47', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31', 'properties/omaxe-shivalik-homes/img-m5n6o7p8', 1920, 1080, 'exterior', 'Omaxe Shivalik Homes villa', 1, true),

  -- Emaar Digi Homes
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c48', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', 'properties/emaar-digi-homes/img-q9r0s1t2', 1920, 1080, 'exterior', 'Emaar Digi Homes smart building', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c49', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32', 'properties/emaar-digi-homes/img-u3v4w5x6', 1920, 1080, 'interior', 'Emaar Digi Homes smart interior', 2, false),

  -- Sushma Valencia
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c50', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', 'properties/sushma-valencia/img-y7z8a9b0', 1920, 1080, 'exterior', 'Sushma Valencia Spanish architecture', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33', 'properties/sushma-valencia/img-c1d2e3f4', 1920, 1080, 'interior', 'Sushma Valencia courtyard', 2, false),

  -- Janta Sky Gardens
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c52', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34', 'properties/janta-sky-gardens/img-g5h6i7j8', 1920, 1080, 'exterior', 'Janta Sky Gardens terraced tower', 1, true),

  -- Motiaz Splendour
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c53', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', 'properties/motiaz-splendour/img-k9l0m1n2', 1920, 1080, 'exterior', 'Motiaz Splendour boutique tower', 1, true),
  ('d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c54', 'b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35', 'properties/motiaz-splendour/img-o3p4q5r6', 1920, 1080, 'interior', 'Motiaz Splendour penthouse living', 2, false);

-- Done!
