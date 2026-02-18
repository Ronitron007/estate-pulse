import { createClient } from "@supabase/supabase-js";

// New Supabase API key format (2025+): sb_publishable_... and sb_secret_...
// See: https://github.com/orgs/supabase/discussions/29260
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||  // New secret key (sb_secret_...)
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||  // New publishable key (sb_publishable_...)
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;  // Legacy anon key

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL and one of:");
  console.error("  - SUPABASE_SECRET_KEY (new sb_secret_... format)");
  console.error("  - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (new sb_publishable_... format)");
  console.error("  - NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy)");
  process.exit(1);
}

console.log("Connecting to:", supabaseUrl);
console.log("Using key type:", supabaseKey.startsWith("sb_") ? supabaseKey.split("_")[1] : "legacy");
const supabase = createClient(supabaseUrl, supabaseKey);

const builders = [
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51", name: "Godrej Properties", slug: "godrej-properties", description: "One of India's leading real estate developers with a legacy of trust and quality construction.", website: "https://www.godrejproperties.com", established_year: 1990 },
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c52", name: "Lodha Group", slug: "lodha-group", description: "Premium real estate developer known for luxury residences and world-class amenities.", website: "https://www.lodhagroup.com", established_year: 1980 },
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c53", name: "Hiranandani Developers", slug: "hiranandani-developers", description: "Pioneers in township development with integrated living spaces.", website: "https://www.hiranandani.com", established_year: 1978 },
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c54", name: "Oberoi Realty", slug: "oberoi-realty", description: "Ultra-luxury developer with iconic projects across Mumbai.", website: "https://www.oberoirealty.com", established_year: 1998 },
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c55", name: "Prestige Group", slug: "prestige-group", description: "South India's largest real estate developer with pan-India presence.", website: "https://www.prestigeconstructions.com", established_year: 1986 },
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56", name: "DLF Limited", slug: "dlf-limited", description: "India's largest real estate company by market capitalization.", website: "https://www.dlf.in", established_year: 1946 },
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c57", name: "Sobha Limited", slug: "sobha-limited", description: "Known for quality construction and backward integration.", website: "https://www.sobha.com", established_year: 1995 },
  { id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c58", name: "Brigade Group", slug: "brigade-group", description: "Leading developer in Bangalore with diversified portfolio.", website: "https://www.brigadegroup.com", established_year: 1986 },
];

const projects = [
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01", slug: "godrej-avenue-eleven", name: "Godrej Avenue Eleven", description: "Luxury residences in the heart of South Mumbai with stunning views of the racecourse. Features Olympic-length swimming pool, expansive decks, and low-density living.", status: "ongoing", price_min: 1185000000, price_max: 1761000000, price_on_request: false, address: "Mahalaxmi Racecourse, Dr. E Moses Road", city: "Mumbai", locality: "Mahalaxmi", pincode: "400034", property_type: "apartment", total_units: 200, available_units: 45, possession_date: "2028-12-31", rera_id: "P51800028732", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02", slug: "godrej-horizon", name: "Godrej Horizon", description: "Spacious apartments with panoramic views of Eastern Bay and Mumbai skyline. Features private decks and 1.32-acre sky lounge.", status: "ongoing", price_min: 394000000, price_max: 744000000, price_on_request: false, address: "Wadala East, Antop Hill", city: "Mumbai", locality: "Wadala", pincode: "400037", property_type: "apartment", total_units: 350, available_units: 120, possession_date: "2028-05-31", rera_id: "P51800032145", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03", slug: "godrej-reserve", name: "Godrej Reserve", description: "Resort-style living with 2.42 hectares of lush open spaces. Elegantly built apartments with expansive decks and exclusive amenities.", status: "upcoming", price_min: 233000000, price_max: 727000000, price_on_request: false, address: "Western Express Highway, Kandivali East", city: "Mumbai", locality: "Kandivali East", pincode: "400101", property_type: "apartment", total_units: 500, available_units: 500, possession_date: "2030-06-30", rera_id: "P51800045678", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", slug: "lodha-divino", name: "Lodha Divino", description: "Luxurious estate on 10 acres with 70% open space. 15 minutes drive to BKC and Lower Parel. Features Gymkhana-inspired clubhouse of 35,000+ sq ft.", status: "ongoing", price_min: 337000000, price_max: 1239000000, price_on_request: false, address: "Matunga West, Near Five Gardens", city: "Mumbai", locality: "Matunga", pincode: "400016", property_type: "apartment", total_units: 280, available_units: 85, possession_date: "2027-12-31", rera_id: "P51800029876", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c52", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05", slug: "lodha-bellevue", name: "Lodha Bellevue", description: "Ultra-luxury tower with unobstructed sea views. World-class amenities including infinity pool, private theatre, and concierge services.", status: "ongoing", price_min: 518000000, price_max: 1051000000, price_on_request: false, address: "Dr. Annie Besant Road, Mahalaxmi", city: "Mumbai", locality: "Mahalaxmi", pincode: "400034", property_type: "penthouse", total_units: 120, available_units: 28, possession_date: "2026-06-30", rera_id: "P51800027654", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c52", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", slug: "hiranandani-fortune-city", name: "Hiranandani Fortune City", description: "Integrated township with 90,000+ sq ft Club Royale. 80% open spaces and 5.3-acre landscaped area with 80+ active-life amenities.", status: "completed", price_min: 131000000, price_max: 365000000, price_on_request: false, address: "Old Mumbai-Pune Highway, Panvel", city: "Mumbai", locality: "Panvel", pincode: "410206", property_type: "apartment", total_units: 1200, available_units: 180, possession_date: "2024-02-28", rera_id: "P52000018234", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c53", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07", slug: "oberoi-sky-city", name: "Oberoi Sky City", description: "Premium high-rise living with spectacular city views. Features rooftop infinity pool and landscaped podium gardens.", status: "ongoing", price_min: 285000000, price_max: 580000000, price_on_request: false, address: "Western Express Highway, Borivali East", city: "Mumbai", locality: "Borivali", pincode: "400066", property_type: "apartment", total_units: 450, available_units: 165, possession_date: "2027-09-30", rera_id: "P51800034567", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c54", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", slug: "prestige-city-sarjapur", name: "Prestige City", description: "Massive integrated township spread across 180 acres. Multiple towers with varied configurations and world-class amenities.", status: "ongoing", price_min: 85000000, price_max: 245000000, price_on_request: false, address: "Sarjapur Road, Near Wipro Corporate Office", city: "Bangalore", locality: "Sarjapur", pincode: "562125", property_type: "apartment", total_units: 2500, available_units: 890, possession_date: "2028-03-31", rera_id: "PRM/KA/RERA/1251/446/PR/171015/000934", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c55", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09", slug: "sobha-dream-acres", name: "Sobha Dream Acres", description: "Thoughtfully designed homes with Sobha's signature quality. Features extensive landscaping and modern amenities.", status: "completed", price_min: 65000000, price_max: 125000000, price_on_request: false, address: "Panathur Road, Near Marathahalli", city: "Bangalore", locality: "Panathur", pincode: "560103", property_type: "apartment", total_units: 800, available_units: 45, possession_date: "2024-08-31", rera_id: "PRM/KA/RERA/1251/309/PR/170808/001987", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c57", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10", slug: "brigade-eldorado", name: "Brigade Eldorado", description: "Premium apartments near the international airport. Features club with Olympic-size pool and tennis courts.", status: "upcoming", price_min: 75000000, price_max: 165000000, price_on_request: false, address: "Bagalur Road, Near Kempegowda International Airport", city: "Bangalore", locality: "Bagalur", pincode: "562149", property_type: "apartment", total_units: 600, available_units: 600, possession_date: "2029-12-31", rera_id: "PRM/KA/RERA/1251/446/PR/231201/002345", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c58", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11", slug: "dlf-the-arbour", name: "DLF The Arbour", description: "Ultra-luxury independent floors in DLF Phase 5. Private elevator, terrace garden, and exclusive club access.", status: "ongoing", price_min: 450000000, price_max: 950000000, price_on_request: false, address: "DLF Phase 5, Near Golf Course Road", city: "Gurgaon", locality: "DLF Phase 5", pincode: "122009", property_type: "villa", total_units: 85, available_units: 22, possession_date: "2026-12-31", rera_id: "RC/REP/HARERA/GGM/2023/1456", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12", slug: "dlf-the-camellias", name: "DLF The Camellias", description: "India's most expensive residential address. Ultra-luxury apartments with private pools, butler service, and 7-star amenities.", status: "completed", price_min: 1500000000, price_max: 4500000000, price_on_request: true, address: "Golf Course Road, DLF Phase 5", city: "Gurgaon", locality: "Golf Course Road", pincode: "122009", property_type: "penthouse", total_units: 50, available_units: 3, possession_date: "2023-06-30", rera_id: "RC/REP/HARERA/GGM/2019/0234", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c56", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13", slug: "prestige-high-fields", name: "Prestige High Fields", description: "Premium apartments near Financial District. Features rooftop infinity pool with city views and state-of-the-art fitness center.", status: "ongoing", price_min: 95000000, price_max: 285000000, price_on_request: false, address: "Nanakramguda Road, Near Financial District", city: "Hyderabad", locality: "Gachibowli", pincode: "500032", property_type: "apartment", total_units: 380, available_units: 145, possession_date: "2027-06-30", rera_id: "P02400003456", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c55", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14", slug: "sobha-neopolis", name: "Sobha Neopolis", description: "Thoughtfully designed 3 and 4 BHK apartments with premium specifications. Near Outer Ring Road for easy connectivity.", status: "upcoming", price_min: 115000000, price_max: 235000000, price_on_request: false, address: "Kokapet Main Road, Near ORR Junction", city: "Hyderabad", locality: "Kokapet", pincode: "500075", property_type: "apartment", total_units: 420, available_units: 420, possession_date: "2029-09-30", rera_id: "P02400004567", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c57", published_at: new Date().toISOString() },
  { id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15", slug: "godrej-woodsville", name: "Godrej Woodsville", description: "Modern apartments surrounded by greenery. Walking distance to IT parks with excellent connectivity.", status: "ongoing", price_min: 75000000, price_max: 185000000, price_on_request: false, address: "Hinjewadi Phase 3, Near Rajiv Gandhi Infotech Park", city: "Pune", locality: "Hinjewadi", pincode: "411057", property_type: "apartment", total_units: 550, available_units: 210, possession_date: "2027-03-31", rera_id: "P52100028765", builder_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c51", published_at: new Date().toISOString() },
];

const configurations = [
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01", bedrooms: 3, bathrooms: 3, config_name: "3 BHK Premium", carpet_area_sqft: 1450, built_up_area_sqft: 1850, price: 1185000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01", bedrooms: 4, bathrooms: 4, config_name: "4 BHK Luxury", carpet_area_sqft: 2100, built_up_area_sqft: 2650, price: 1761000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02", bedrooms: 2, bathrooms: 2, config_name: "2 BHK Compact", carpet_area_sqft: 850, built_up_area_sqft: 1100, price: 394000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02", bedrooms: 3, bathrooms: 3, config_name: "3 BHK Spacious", carpet_area_sqft: 1250, built_up_area_sqft: 1580, price: 744000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 780, built_up_area_sqft: 1020, price: 233000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03", bedrooms: 3, bathrooms: 3, config_name: "3 BHK", carpet_area_sqft: 1100, built_up_area_sqft: 1420, price: 445000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03", bedrooms: 4, bathrooms: 4, config_name: "4 BHK Grande", carpet_area_sqft: 1650, built_up_area_sqft: 2100, price: 727000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 920, built_up_area_sqft: 1180, price: 337000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", bedrooms: 3, bathrooms: 3, config_name: "3 BHK", carpet_area_sqft: 1380, built_up_area_sqft: 1750, price: 685000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", bedrooms: 4, bathrooms: 5, config_name: "4 BHK Duplex", carpet_area_sqft: 2200, built_up_area_sqft: 2800, price: 1239000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05", bedrooms: 3, bathrooms: 4, config_name: "3 BHK Sea View", carpet_area_sqft: 1850, built_up_area_sqft: 2350, price: 518000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05", bedrooms: 4, bathrooms: 5, config_name: "4 BHK Penthouse", carpet_area_sqft: 3200, built_up_area_sqft: 4100, price: 1051000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 650, built_up_area_sqft: 850, price: 131000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", bedrooms: 3, bathrooms: 2, config_name: "3 BHK", carpet_area_sqft: 920, built_up_area_sqft: 1180, price: 225000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", bedrooms: 4, bathrooms: 3, config_name: "4 BHK", carpet_area_sqft: 1350, built_up_area_sqft: 1720, price: 365000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c16", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 780, built_up_area_sqft: 1000, price: 285000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c17", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07", bedrooms: 3, bathrooms: 3, config_name: "3 BHK", carpet_area_sqft: 1150, built_up_area_sqft: 1450, price: 425000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c18", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07", bedrooms: 4, bathrooms: 4, config_name: "4 BHK Premium", carpet_area_sqft: 1680, built_up_area_sqft: 2100, price: 580000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c19", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", bedrooms: 1, bathrooms: 1, config_name: "1 BHK Studio", carpet_area_sqft: 480, built_up_area_sqft: 620, price: 85000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c20", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 720, built_up_area_sqft: 920, price: 125000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", bedrooms: 3, bathrooms: 3, config_name: "3 BHK", carpet_area_sqft: 1080, built_up_area_sqft: 1380, price: 185000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c22", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", bedrooms: 4, bathrooms: 4, config_name: "4 BHK Villa", carpet_area_sqft: 1650, built_up_area_sqft: 2100, price: 245000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c23", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 680, built_up_area_sqft: 880, price: 65000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c24", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09", bedrooms: 3, bathrooms: 2, config_name: "3 BHK", carpet_area_sqft: 980, built_up_area_sqft: 1250, price: 95000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c25", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09", bedrooms: 3, bathrooms: 3, config_name: "3 BHK Premium", carpet_area_sqft: 1150, built_up_area_sqft: 1450, price: 125000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c26", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 720, built_up_area_sqft: 920, price: 75000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c27", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10", bedrooms: 3, bathrooms: 3, config_name: "3 BHK", carpet_area_sqft: 1050, built_up_area_sqft: 1340, price: 120000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c28", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10", bedrooms: 4, bathrooms: 4, config_name: "4 BHK", carpet_area_sqft: 1480, built_up_area_sqft: 1880, price: 165000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c29", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11", bedrooms: 4, bathrooms: 5, config_name: "4 BHK Independent Floor", carpet_area_sqft: 3200, built_up_area_sqft: 4100, price: 450000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c30", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11", bedrooms: 5, bathrooms: 6, config_name: "5 BHK Villa", carpet_area_sqft: 4500, built_up_area_sqft: 5800, price: 950000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c31", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12", bedrooms: 4, bathrooms: 5, config_name: "4 BHK Ultra Luxury", carpet_area_sqft: 5500, built_up_area_sqft: 7200, price: 1500000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c32", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12", bedrooms: 5, bathrooms: 7, config_name: "5 BHK Penthouse", carpet_area_sqft: 8500, built_up_area_sqft: 11000, price: 4500000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c33", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 820, built_up_area_sqft: 1050, price: 95000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c34", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13", bedrooms: 3, bathrooms: 3, config_name: "3 BHK", carpet_area_sqft: 1250, built_up_area_sqft: 1580, price: 175000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c35", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13", bedrooms: 4, bathrooms: 4, config_name: "4 BHK", carpet_area_sqft: 1750, built_up_area_sqft: 2200, price: 285000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c36", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14", bedrooms: 3, bathrooms: 3, config_name: "3 BHK", carpet_area_sqft: 1150, built_up_area_sqft: 1450, price: 115000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c37", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14", bedrooms: 4, bathrooms: 4, config_name: "4 BHK Premium", carpet_area_sqft: 1650, built_up_area_sqft: 2080, price: 235000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c38", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15", bedrooms: 2, bathrooms: 2, config_name: "2 BHK", carpet_area_sqft: 720, built_up_area_sqft: 920, price: 75000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c39", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15", bedrooms: 3, bathrooms: 2, config_name: "3 BHK", carpet_area_sqft: 1020, built_up_area_sqft: 1300, price: 125000000 },
  { id: "c1c2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c40", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15", bedrooms: 3, bathrooms: 3, config_name: "3 BHK Premium", carpet_area_sqft: 1250, built_up_area_sqft: 1580, price: 185000000 },
];

const projectImages = [
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01", cloudinary_public_id: "estate-pulse/godrej-avenue-eleven-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Godrej Avenue Eleven exterior view", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01", cloudinary_public_id: "estate-pulse/godrej-avenue-eleven-2", width: 1920, height: 1080, image_type: "interior", alt_text: "Godrej Avenue Eleven living room", sort_order: 2, is_primary: false },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02", cloudinary_public_id: "estate-pulse/godrej-horizon-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Godrej Horizon tower view", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02", cloudinary_public_id: "estate-pulse/godrej-horizon-2", width: 1920, height: 1080, image_type: "interior", alt_text: "Godrej Horizon bedroom", sort_order: 2, is_primary: false },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03", cloudinary_public_id: "estate-pulse/godrej-reserve-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Godrej Reserve aerial view", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", cloudinary_public_id: "estate-pulse/lodha-divino-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Lodha Divino facade", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", cloudinary_public_id: "estate-pulse/lodha-divino-2", width: 1920, height: 1080, image_type: "amenity", alt_text: "Lodha Divino gymkhana", sort_order: 2, is_primary: false },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05", cloudinary_public_id: "estate-pulse/lodha-bellevue-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Lodha Bellevue sea view", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", cloudinary_public_id: "estate-pulse/hiranandani-fortune-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Hiranandani Fortune City township", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", cloudinary_public_id: "estate-pulse/hiranandani-fortune-2", width: 1920, height: 1080, image_type: "amenity", alt_text: "Hiranandani Fortune City club", sort_order: 2, is_primary: false },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07", cloudinary_public_id: "estate-pulse/oberoi-sky-city-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Oberoi Sky City tower", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", cloudinary_public_id: "estate-pulse/prestige-city-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Prestige City Sarjapur aerial", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", cloudinary_public_id: "estate-pulse/prestige-city-2", width: 1920, height: 1080, image_type: "amenity", alt_text: "Prestige City clubhouse", sort_order: 2, is_primary: false },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09", cloudinary_public_id: "estate-pulse/sobha-dream-acres-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Sobha Dream Acres campus", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10", cloudinary_public_id: "estate-pulse/brigade-eldorado-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Brigade Eldorado towers", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c16", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11", cloudinary_public_id: "estate-pulse/dlf-arbour-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "DLF The Arbour villa", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c17", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12", cloudinary_public_id: "estate-pulse/dlf-camellias-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "DLF The Camellias luxury tower", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c18", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12", cloudinary_public_id: "estate-pulse/dlf-camellias-2", width: 1920, height: 1080, image_type: "interior", alt_text: "DLF The Camellias penthouse", sort_order: 2, is_primary: false },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c19", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13", cloudinary_public_id: "estate-pulse/prestige-high-fields-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Prestige High Fields tower", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c20", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14", cloudinary_public_id: "estate-pulse/sobha-neopolis-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Sobha Neopolis facade", sort_order: 1, is_primary: true },
  { id: "d1d2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c21", project_id: "b1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15", cloudinary_public_id: "estate-pulse/godrej-woodsville-1", width: 1920, height: 1080, image_type: "exterior", alt_text: "Godrej Woodsville greenery", sort_order: 1, is_primary: true },
];

async function seed() {
  console.log("Seeding remote Supabase...");

  // Insert builders
  console.log("Inserting builders...");
  const { error: buildersError } = await supabase.from("builders").upsert(builders, { onConflict: "id" });
  if (buildersError) console.error("Builders error:", buildersError);
  else console.log(`✓ ${builders.length} builders`);

  // Insert projects
  console.log("Inserting projects...");
  const { error: projectsError } = await supabase.from("projects").upsert(projects, { onConflict: "id" });
  if (projectsError) console.error("Projects error:", projectsError);
  else console.log(`✓ ${projects.length} projects`);

  // Insert configurations
  console.log("Inserting configurations...");
  const { error: configsError } = await supabase.from("configurations").upsert(configurations, { onConflict: "id" });
  if (configsError) console.error("Configurations error:", configsError);
  else console.log(`✓ ${configurations.length} configurations`);

  // Insert project images
  console.log("Inserting project images...");
  const { error: imagesError } = await supabase.from("project_images").upsert(projectImages, { onConflict: "id" });
  if (imagesError) console.error("Images error:", imagesError);
  else console.log(`✓ ${projectImages.length} project images`);

  // Get amenities and link to projects
  console.log("Linking amenities...");
  const { data: amenities } = await supabase.from("amenities").select("id, name");

  if (amenities) {
    const amenityMap = new Map(amenities.map((a) => [a.name, a.id]));

    const projectAmenities: { project_id: string; amenity_id: string }[] = [];
    const commonAmenities = ["Swimming Pool", "Gym", "Clubhouse", "Garden", "Parking", "24/7 Security", "Power Backup", "Lift"];

    for (const project of projects) {
      for (const amenityName of commonAmenities) {
        const amenityId = amenityMap.get(amenityName);
        if (amenityId) {
          projectAmenities.push({ project_id: project.id, amenity_id: amenityId });
        }
      }
    }

    const { error: amenitiesError } = await supabase.from("project_amenities").upsert(projectAmenities, { onConflict: "project_id,amenity_id", ignoreDuplicates: true });
    if (amenitiesError) console.error("Amenities error:", amenitiesError);
    else console.log(`✓ ${projectAmenities.length} project amenities`);
  }

  console.log("\n✅ Seed complete!");
}

seed().catch(console.error);
