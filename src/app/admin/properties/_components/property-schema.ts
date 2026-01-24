import { z } from "zod";
import type { Project, Configuration, ProjectImage } from "@/types/database";

export const propertyFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  status: z.enum(["upcoming", "ongoing", "completed"]),
  property_type: z.enum(["apartment", "villa", "plot", "commercial", "penthouse"]).nullable(),
  price_min: z.coerce.number().nullable(),
  price_max: z.coerce.number().nullable(),
  price_on_request: z.boolean().default(false),
  address: z.string().optional(),
  city: z.string().min(2, "City required"),
  locality: z.string().optional(),
  pincode: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  total_units: z.coerce.number().nullable(),
  available_units: z.coerce.number().nullable(),
  possession_date: z.string().optional(),
  rera_id: z.string().optional(),
  builder_id: z.string().nullable(),
  published: z.boolean().default(false),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export interface PropertyFormData extends PropertyFormValues {
  images: Partial<ProjectImage>[];
  configurations: Partial<Configuration>[];
  amenityIds: string[];
}

export function projectToFormData(project: Project): PropertyFormData {
  return {
    name: project.name || "",
    slug: project.slug || "",
    description: project.description || "",
    status: project.status || "upcoming",
    property_type: project.property_type || null,
    price_min: project.price_min,
    price_max: project.price_max,
    price_on_request: project.price_on_request || false,
    address: project.address || "",
    city: project.city || "",
    locality: project.locality || "",
    pincode: project.pincode || "",
    lat: project.location?.lat,
    lng: project.location?.lng,
    total_units: project.total_units,
    available_units: project.available_units,
    possession_date: project.possession_date || "",
    rera_id: project.rera_id || "",
    builder_id: project.builder_id,
    published: !!project.published_at,
    images: project.images || [],
    configurations: project.configurations || [],
    amenityIds: project.amenities?.map((a) => a.id) || [],
  };
}
