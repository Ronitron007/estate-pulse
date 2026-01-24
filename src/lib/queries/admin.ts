import { createClient } from "@/lib/supabase/server";
import type { Project, Inquiry, InquiryStatus, ProjectStatus } from "@/types/database";

// Dashboard stats
export interface DashboardStats {
  totalProperties: number;
  activeInquiries: number;
  pendingInquiries: number;
  totalFavorites: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [propertiesRes, inquiriesRes, favoritesRes] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("inquiries").select("id, status"),
    supabase.from("saved_properties").select("id", { count: "exact", head: true }),
  ]);

  const inquiries = inquiriesRes.data || [];
  const activeInquiries = inquiries.filter(
    (i) => i.status === "new" || i.status === "contacted"
  ).length;
  const pendingInquiries = inquiries.filter((i) => i.status === "new").length;

  return {
    totalProperties: propertiesRes.count || 0,
    activeInquiries,
    pendingInquiries,
    totalFavorites: favoritesRes.count || 0,
  };
}

// Get all inquiries with project info
export async function getAllInquiries(
  status?: InquiryStatus
): Promise<Inquiry[]> {
  const supabase = await createClient();

  let query = supabase
    .from("inquiries")
    .select(`
      *,
      project:projects(id, name, slug)
    `)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }

  return data || [];
}

// Get recent inquiries for dashboard
export async function getRecentInquiries(limit = 5): Promise<Inquiry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      project:projects(id, name, slug)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent inquiries:", error);
    return [];
  }

  return data || [];
}

// Get all projects for admin (including unpublished)
export interface AdminProjectFilters {
  search?: string;
  status?: ProjectStatus;
  city?: string;
}

export async function getAdminProjects(
  filters?: AdminProjectFilters
): Promise<Project[]> {
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select(`
      id,
      slug,
      name,
      city,
      status,
      price_min,
      price_max,
      price_on_request,
      created_at,
      published_at
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching admin projects:", error);
    return [];
  }

  return (data || []) as Project[];
}

// Get unique cities for filter dropdown
export async function getUniqueCities(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("city")
    .is("deleted_at", null);

  if (error) {
    console.error("Error fetching cities:", error);
    return [];
  }

  const cities = [...new Set(data.map((p) => p.city))].filter(Boolean);
  return cities.sort();
}

// Get current admin user
export async function getCurrentAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Check if user is admin
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!adminData) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: adminData.role as "admin" | "editor" | "viewer",
  };
}

// Get single project by ID with all related data (for edit page)
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      builder:builders(id, name),
      configurations(*),
      images:project_images(*),
      amenities:project_amenities(amenity:amenities(*))
    `)
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return {
    ...data,
    amenities: data.amenities?.map((pa: { amenity: unknown }) => pa.amenity) || [],
  } as Project;
}

// Get all builders (for dropdown in form)
export async function getAllBuilders(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("builders")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error fetching builders:", error);
    return [];
  }

  return data || [];
}

// Get all amenities (for multi-select in form)
export async function getAllAmenities(): Promise<{ id: string; name: string; category: string | null }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("amenities")
    .select("id, name, category")
    .order("category")
    .order("name");

  if (error) {
    console.error("Error fetching amenities:", error);
    return [];
  }

  return data || [];
}
