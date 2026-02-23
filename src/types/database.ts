export type ProjectStatus = "upcoming" | "ongoing" | "completed";
export type PropertyType = "apartment" | "villa" | "plot" | "commercial" | "penthouse";
export type ImageType = "exterior" | "interior" | "amenity" | "location" | "floor_plan" | "brochure";
export type InquiryStatus =
  | "new"
  | "contacted"
  | "site_visit_scheduled"
  | "site_visit_done"
  | "negotiation"
  | "qualified"
  | "converted"
  | "closed"
  | "lost";

export interface Icon {
  id: string;
  name: string;
  lucide_name: string;
  category: string | null;
}

export interface Tower {
  id: string;
  project_id: string;
  name: string;
  floor_from: number | null;
  floor_to: number | null;
  units_per_floor: number | null;
  lifts_count: number | null;
  lift_type: string | null;
  staircase_info: string | null;
  sort_order: number;
}

export interface ProjectHighlight {
  text: string;
  icon_id: string | null;
  icon_name: string | null; // lucide_name, denormalized
}

export interface ProjectSpecification {
  label: string;
  value: string;
  icon_id: string | null;
  icon_name: string | null; // lucide_name, denormalized
}

export interface ProjectParking {
  types: string[];
  basement_levels: number | null;
  guest_parking: boolean;
  allotment: string | null;
}

export interface PointOfInterest {
  name: string;
  category: string;
  distance_value: number;
  distance_unit: string;
}

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
  booking_amount: number | null;
  maintenance_charges: number | null;
  price_per_sqft: number | null;
  vastu_compliant: boolean;
  gated_community: boolean;
  matterport_url: string | null;
  video_url: string | null;
  location_advantages: Record<string, number> | null;
  project_details_extra: {
    totalTowers?: number;
    totalUnits?: number;
    floors?: number;
    constructionStatus?: string;
    facingOptions?: string[];
  } | null;
  investment_data: {
    rentalYieldPct?: number;
    appreciationTrendText?: string;
    futureInfrastructureText?: string;
    developerTrackRecordSummary?: string;
  } | null;
  tagline: string | null;
  highlights: ProjectHighlight[];
  specifications: ProjectSpecification[];
  parking: ProjectParking | null;
  points_of_interest: PointOfInterest[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  deleted_at?: string | null;
  // Joined relations
  builder?: Builder;
  configurations?: Configuration[];
  images?: ProjectImage[];
  amenities?: Amenity[];
  towers?: Tower[];
}

export interface ConfigTower {
  name: string;
  floor_from?: number | null;
  floor_to?: number | null;
}

export interface Configuration {
  id: string;
  project_id: string;
  bedrooms: number | null;
  bathrooms: number | null;
  config_name: string | null;
  carpet_area_sqft: number | null;
  built_up_area_sqft: number | null;
  balcony_area_sqft: number | null;
  covered_area_sqft: number | null;
  super_area_sqft: number | null;
  price: number | null;
  floor_plan_cloudinary_id: string | null;
  type_label: string | null;
  towers: ConfigTower[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_path: string;
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
  budget: string | null;
  timeline: string | null;
  property_title: string | null;
  notes: string | null;
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
  sort?: "price_asc" | "price_desc" | "newest" | "possession";
}

// Map marker type (lightweight project data for map)
export type MapMarker = Pick<
  Project,
  "id" | "slug" | "name" | "location" | "price_min" | "price_max" | "property_type"
>;
