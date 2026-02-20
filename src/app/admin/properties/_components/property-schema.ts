import { z } from "zod";
import type { Project, Configuration, ProjectImage, ProjectHighlight, ProjectSpecification, ProjectParking, Tower, PointOfInterest } from "@/types/database";

// Form schema - all string inputs, transform in submit handler
export const propertyFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  tagline: z.string().optional(),
  status: z.enum(["upcoming", "ongoing", "completed"]),
  property_type: z.enum(["apartment", "villa", "plot", "commercial", "penthouse", ""]),
  price_min: z.string(),
  price_max: z.string(),
  price_on_request: z.boolean(),
  address: z.string().optional(),
  city: z.string().min(2, "City required"),
  locality: z.string().optional(),
  pincode: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  total_units: z.string(),
  available_units: z.string(),
  possession_date: z.string().optional(),
  rera_id: z.string().optional(),
  builder_id: z.string(),
  published: z.boolean(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export interface PropertyFormData {
  name: string;
  slug: string;
  description?: string;
  status: "upcoming" | "ongoing" | "completed";
  property_type: "apartment" | "villa" | "plot" | "commercial" | "penthouse" | null;
  price_min: number | null;
  price_max: number | null;
  price_on_request: boolean;
  address?: string;
  city: string;
  locality?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  total_units: number | null;
  available_units: number | null;
  possession_date?: string;
  rera_id?: string;
  builder_id: string | null;
  published: boolean;
  tagline?: string;
  images: Partial<ProjectImage>[];
  configurations: Partial<Configuration>[];
  amenityIds: string[];
  highlights: ProjectHighlight[];
  specifications: ProjectSpecification[];
  parking: ProjectParking | null;
  towers: Partial<Tower>[];
  points_of_interest: PointOfInterest[];
}

// Transform form values to proper types for submission
export function transformFormData(
  values: PropertyFormValues,
  images: Partial<ProjectImage>[],
  configurations: Partial<Configuration>[],
  amenityIds: string[],
  highlights: ProjectHighlight[],
  specifications: ProjectSpecification[],
  parking: ProjectParking | null,
  towers: Partial<Tower>[],
  points_of_interest: PointOfInterest[]
): PropertyFormData {
  return {
    name: values.name,
    slug: values.slug,
    description: values.description,
    tagline: values.tagline,
    status: values.status,
    property_type: values.property_type === "" ? null : values.property_type,
    price_min: values.price_min === "" ? null : Number(values.price_min),
    price_max: values.price_max === "" ? null : Number(values.price_max),
    price_on_request: values.price_on_request,
    address: values.address,
    city: values.city,
    locality: values.locality,
    pincode: values.pincode,
    lat: values.lat === "" || values.lat === undefined ? undefined : Number(values.lat),
    lng: values.lng === "" || values.lng === undefined ? undefined : Number(values.lng),
    total_units: values.total_units === "" ? null : Number(values.total_units),
    available_units: values.available_units === "" ? null : Number(values.available_units),
    possession_date: values.possession_date,
    rera_id: values.rera_id,
    builder_id: values.builder_id === "" ? null : values.builder_id,
    published: values.published,
    images,
    configurations,
    amenityIds,
    highlights,
    specifications,
    parking,
    towers,
    points_of_interest,
  };
}

// Convert project to form values (strings for numeric fields)
export function projectToFormValues(project: Project): PropertyFormValues & {
  images: Partial<ProjectImage>[];
  configurations: Partial<Configuration>[];
  amenityIds: string[];
  highlights: ProjectHighlight[];
  specifications: ProjectSpecification[];
  parking: ProjectParking | null;
  towers: Partial<Tower>[];
  points_of_interest: PointOfInterest[];
} {
  return {
    name: project.name || "",
    slug: project.slug || "",
    description: project.description || "",
    tagline: project.tagline || "",
    status: project.status || "upcoming",
    property_type: project.property_type || "",
    price_min: project.price_min?.toString() ?? "",
    price_max: project.price_max?.toString() ?? "",
    price_on_request: project.price_on_request || false,
    address: project.address || "",
    city: project.city || "",
    locality: project.locality || "",
    pincode: project.pincode || "",
    lat: project.location?.lat?.toString() ?? "",
    lng: project.location?.lng?.toString() ?? "",
    total_units: project.total_units?.toString() ?? "",
    available_units: project.available_units?.toString() ?? "",
    possession_date: project.possession_date || "",
    rera_id: project.rera_id || "",
    builder_id: project.builder_id || "",
    published: !!project.published_at,
    images: project.images || [],
    configurations: project.configurations || [],
    amenityIds: project.amenities?.map((a) => a.id) || [],
    highlights: project.highlights || [],
    specifications: project.specifications || [],
    parking: project.parking || null,
    towers: project.towers || [],
    points_of_interest: project.points_of_interest || [],
  };
}
