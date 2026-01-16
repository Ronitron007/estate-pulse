import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProjectFilters, PropertyType, ProjectStatus } from "@/types/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const supabase = await createClient();

  const filters: ProjectFilters = {
    city: searchParams.get("city") || undefined,
    locality: searchParams.get("locality") || undefined,
    property_type: (searchParams.get("type") as PropertyType) || undefined,
    status: (searchParams.get("status") as ProjectStatus) || undefined,
    price_min: searchParams.get("price_min") ? Number(searchParams.get("price_min")) : undefined,
    price_max: searchParams.get("price_max") ? Number(searchParams.get("price_max")) : undefined,
    search: searchParams.get("q") || undefined,
  };

  let query = supabase
    .from("projects")
    .select(`
      id, slug, name, status, price_min, price_max, price_on_request,
      city, locality, location, property_type, possession_date,
      builder:builders(id, name),
      images:project_images(cloudinary_public_id, is_primary, alt_text)
    `)
    .not("published_at", "is", null)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }
  if (filters.locality) {
    query = query.ilike("locality", `%${filters.locality}%`);
  }
  if (filters.property_type) {
    query = query.eq("property_type", filters.property_type);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.price_min) {
    query = query.gte("price_min", filters.price_min);
  }
  if (filters.price_max) {
    query = query.lte("price_max", filters.price_max);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data });
}
