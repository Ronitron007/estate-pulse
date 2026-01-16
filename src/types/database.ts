export type ProjectStatus = "upcoming" | "ongoing" | "completed";
export type PropertyType = "apartment" | "villa" | "plot" | "commercial" | "penthouse";
export type ImageType = "exterior" | "interior" | "amenity" | "location" | "floor_plan" | "brochure";
export type InquiryStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

export interface Builder {
  id: string;
  name: string;
  slug: string;
  logo_cloudinary_id: string | null;
  description: string | null;
  website: string | null;
  established_year: number | null;
  created_at: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  price_min: number | null;
  price_max: number | null;
  price_on_request: boolean;
  address: string | null;
  city: string;
  locality: string | null;
  pincode: string | null;
  location: { lat: number; lng: number } | null;
  property_type: PropertyType | null;
  total_units: number | null;
  available_units: number | null;
  possession_date: string | null;
  rera_id: string | null;
  builder_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  deleted_at?: string | null;
  // Joined relations
  builder?: Builder;
  configurations?: Configuration[];
  images?: ProjectImage[];
  amenities?: Amenity[];
}

export interface Configuration {
  id: string;
  project_id: string;
  bedrooms: number | null;
  bathrooms: number | null;
  config_name: string | null;
  carpet_area_sqft: number | null;
  built_up_area_sqft: number | null;
  price: number | null;
  floor_plan_cloudinary_id: string | null;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  cloudinary_public_id: string;
  width: number | null;
  height: number | null;
  image_type: ImageType | null;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
}

export interface Inquiry {
  id: string;
  user_id: string | null;
  project_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  whatsapp_opt_in: boolean;
  source: string | null;
  status: InquiryStatus;
  created_at: string;
  // Joined relations
  project?: Pick<Project, "id" | "name" | "slug">;
}

export interface Favorite {
  id: string;
  user_id: string;
  project_id: string;
  created_at: string;
  // Joined relations
  project?: Project;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  whatsapp_opt_in: boolean;
  preferred_cities: string[] | null;
  budget_min: number | null;
  budget_max: number | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: "admin" | "editor" | "viewer";
  created_at: string;
}

// Filter types for search
export interface ProjectFilters {
  city?: string;
  locality?: string;
  property_type?: PropertyType;
  status?: ProjectStatus;
  bedrooms?: number;
  price_min?: number;
  price_max?: number;
  builder_id?: string;
  search?: string;
}

// Map marker type (lightweight project data for map)
export type MapMarker = Pick<
  Project,
  "id" | "slug" | "name" | "location" | "price_min" | "price_max" | "property_type"
>;
