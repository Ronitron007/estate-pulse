import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@supabase/supabase-js";
import type { Project, ProjectFilters } from "@/types/database";

// For use in generateStaticParams (build time, no cookies)
function createBuildTimeClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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

  // Transform amenities from nested structure
  return (data || []).map((project) => ({
    ...project,
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

  return data || [];
}
