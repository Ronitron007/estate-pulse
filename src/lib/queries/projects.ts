import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import type { Project, ProjectFilters } from "@/types/database";

// For use in generateStaticParams (build time, no cookies)
function createBuildTimeClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );
}

// Parse WKB (Well-Known Binary) hex string from PostGIS geography column
// Format: 01 01000020 E6100000 [8 bytes lng] [8 bytes lat]
// - 01 = little endian
// - 01000020 = Point type with SRID flag
// - E6100000 = SRID 4326 (little endian)
// - 8 bytes each for lng and lat as 64-bit doubles
function parseWKBPoint(wkb: string | null): { lat: number; lng: number } | null {
  if (!wkb || typeof wkb !== "string") return null;

  try {
    // WKB hex string for Point with SRID is 50 characters (25 bytes)
    // Skip first 18 characters (9 bytes): endian(1) + type(4) + srid(4)
    const coordsHex = wkb.substring(18);
    
    // Extract 16 hex chars (8 bytes) for longitude, then 16 for latitude
    const lngHex = coordsHex.substring(0, 16);
    const latHex = coordsHex.substring(16, 32);
    
    // Convert hex to 64-bit float (little endian)
    const lng = hexToDouble(lngHex);
    const lat = hexToDouble(latHex);
    
    if (isNaN(lng) || isNaN(lat)) return null;
    
    return { lat, lng };
  } catch {
    console.error("Failed to parse WKB:", wkb);
    return null;
  }
}

// Convert little-endian hex string to 64-bit double
function hexToDouble(hex: string): number {
  // Reverse byte order (little endian to big endian)
  const bytes = hex.match(/.{2}/g)?.reverse().join("") || "";
  
  // Parse as 64-bit float
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  
  for (let i = 0; i < 8; i++) {
    view.setUint8(i, parseInt(bytes.substring(i * 2, i * 2 + 2), 16));
  }
  
  return view.getFloat64(0);
}

export async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select(`
      *,
      builder:builders(*),
      configurations(*),
      images:project_images(*),
      amenities:project_amenities(amenity:amenities(*))
    `)
    .not("published_at", "is", null)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters?.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }

  if (filters?.locality) {
    query = query.ilike("locality", `%${filters.locality}%`);
  }

  if (filters?.property_type) {
    query = query.eq("property_type", filters.property_type);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.price_min) {
    query = query.gte("price_min", filters.price_min);
  }

  if (filters?.price_max) {
    query = query.lte("price_max", filters.price_max);
  }

  if (filters?.builder_id) {
    query = query.eq("builder_id", filters.builder_id);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  // Transform amenities and location from nested/PostGIS structure
  return (data || []).map((project) => ({
    ...project,
    location: parseWKBPoint(project.location as string | null),
    amenities: project.amenities?.map((pa: { amenity: unknown }) => pa.amenity) || [],
  }));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      builder:builders(*),
      configurations(*),
      images:project_images(*),
      amenities:project_amenities(amenity:amenities(*))
    `)
    .eq("slug", slug)
    .not("published_at", "is", null)
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    console.error("Error fetching project:", error);
    return null;
  }

  return {
    ...data,
    location: parseWKBPoint(data.location as string | null),
    amenities: data.amenities?.map((pa: { amenity: unknown }) => pa.amenity) || [],
  };
}

export async function getProjectSlugs(): Promise<string[]> {
  // Use build-time client (no cookies needed for public data)
  const supabase = createBuildTimeClient();

  const { data, error } = await supabase
    .from("projects")
    .select("slug")
    .not("published_at", "is", null)
    .is("deleted_at", null);

  if (error) {
    console.error("Error fetching slugs:", error);
    return [];
  }

  return data.map((p) => p.slug);
}

export async function getCities(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("city")
    .not("published_at", "is", null)
    .is("deleted_at", null);

  if (error) {
    console.error("Error fetching cities:", error);
    return [];
  }

  // Get unique cities
  const cities = [...new Set(data.map((p) => p.city))];
  return cities.sort();
}

export async function getProjectsForMap(): Promise<Pick<Project, "id" | "slug" | "name" | "location" | "price_min" | "price_max" | "property_type">[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, name, location, price_min, price_max, property_type")
    .not("published_at", "is", null)
    .is("deleted_at", null)
    .not("location", "is", null);

  if (error) {
    console.error("Error fetching map projects:", error);
    return [];
  }

  // Transform WKB location to {lat, lng} format
  return (data || []).map((project) => ({
    ...project,
    location: parseWKBPoint(project.location as string | null),
  }));
}
