"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/queries/admin";
import type { PropertyFormData } from "./_components/property-schema";

interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

export async function createPropertyAction(
  data: PropertyFormData
): Promise<ActionResult> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }
    if (admin.role === "viewer") {
      return { success: false, error: "Viewers cannot create properties" };
    }

    const supabase = await createClient();

    // Build location object if lat/lng provided
    const location =
      data.lat && data.lng ? { lat: data.lat, lng: data.lng } : null;

    // Insert project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        status: data.status,
        property_type: data.property_type,
        price_min: data.price_min,
        price_max: data.price_max,
        price_on_request: data.price_on_request,
        address: data.address || null,
        city: data.city,
        locality: data.locality || null,
        pincode: data.pincode || null,
        location,
        total_units: data.total_units,
        available_units: data.available_units,
        possession_date: data.possession_date || null,
        rera_id: data.rera_id || null,
        builder_id: data.builder_id,
        published_at: data.published ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (projectError) {
      // Handle unique slug constraint violation
      if (projectError.code === "23505") {
        return { success: false, error: "Slug already exists" };
      }
      console.error("Error creating project:", projectError);
      return { success: false, error: projectError.message };
    }

    const projectId = project.id;

    // Insert images
    if (data.images.length > 0) {
      const imagesToInsert = data.images.map((img, index) => ({
        project_id: projectId,
        cloudinary_public_id: img.cloudinary_public_id!,
        width: img.width || null,
        height: img.height || null,
        image_type: img.image_type || null,
        alt_text: img.alt_text || null,
        sort_order: img.sort_order ?? index,
        is_primary: img.is_primary ?? index === 0,
      }));

      const { error: imagesError } = await supabase
        .from("project_images")
        .insert(imagesToInsert);

      if (imagesError) {
        console.error("Error inserting images:", imagesError);
      }
    }

    // Insert configurations
    if (data.configurations.length > 0) {
      const configsToInsert = data.configurations.map((config) => ({
        project_id: projectId,
        bedrooms: config.bedrooms ?? null,
        bathrooms: config.bathrooms ?? null,
        config_name: config.config_name || null,
        carpet_area_sqft: config.carpet_area_sqft ?? null,
        built_up_area_sqft: config.built_up_area_sqft ?? null,
        price: config.price ?? null,
        floor_plan_cloudinary_id: config.floor_plan_cloudinary_id || null,
      }));

      const { error: configsError } = await supabase
        .from("configurations")
        .insert(configsToInsert);

      if (configsError) {
        console.error("Error inserting configurations:", configsError);
      }
    }

    // Insert amenities
    if (data.amenityIds.length > 0) {
      const amenitiesToInsert = data.amenityIds.map((amenityId) => ({
        project_id: projectId,
        amenity_id: amenityId,
      }));

      const { error: amenitiesError } = await supabase
        .from("project_amenities")
        .insert(amenitiesToInsert);

      if (amenitiesError) {
        console.error("Error inserting amenities:", amenitiesError);
      }
    }

    revalidatePath("/admin/properties");
    revalidatePath("/properties");

    return { success: true, id: projectId };
  } catch (error) {
    console.error("Unexpected error creating property:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updatePropertyAction(
  id: string,
  data: PropertyFormData
): Promise<ActionResult> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }
    if (admin.role === "viewer") {
      return { success: false, error: "Viewers cannot update properties" };
    }

    const supabase = await createClient();

    // Get current project to check published_at status
    const { data: currentProject } = await supabase
      .from("projects")
      .select("published_at, slug")
      .eq("id", id)
      .single();

    // Build location object if lat/lng provided
    const location =
      data.lat && data.lng ? { lat: data.lat, lng: data.lng } : null;

    // Determine published_at value
    let published_at = currentProject?.published_at;
    if (data.published && !published_at) {
      published_at = new Date().toISOString();
    } else if (!data.published) {
      published_at = null;
    }

    // Update project
    const { error: projectError } = await supabase
      .from("projects")
      .update({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        status: data.status,
        property_type: data.property_type,
        price_min: data.price_min,
        price_max: data.price_max,
        price_on_request: data.price_on_request,
        address: data.address || null,
        city: data.city,
        locality: data.locality || null,
        pincode: data.pincode || null,
        location,
        total_units: data.total_units,
        available_units: data.available_units,
        possession_date: data.possession_date || null,
        rera_id: data.rera_id || null,
        builder_id: data.builder_id,
        published_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (projectError) {
      if (projectError.code === "23505") {
        return { success: false, error: "Slug already exists" };
      }
      console.error("Error updating project:", projectError);
      return { success: false, error: projectError.message };
    }

    // Replace images: delete existing, insert new
    await supabase.from("project_images").delete().eq("project_id", id);

    if (data.images.length > 0) {
      const imagesToInsert = data.images.map((img, index) => ({
        project_id: id,
        cloudinary_public_id: img.cloudinary_public_id!,
        width: img.width || null,
        height: img.height || null,
        image_type: img.image_type || null,
        alt_text: img.alt_text || null,
        sort_order: img.sort_order ?? index,
        is_primary: img.is_primary ?? index === 0,
      }));

      const { error: imagesError } = await supabase
        .from("project_images")
        .insert(imagesToInsert);

      if (imagesError) {
        console.error("Error inserting images:", imagesError);
      }
    }

    // Replace configurations: delete existing, insert new
    await supabase.from("configurations").delete().eq("project_id", id);

    if (data.configurations.length > 0) {
      const configsToInsert = data.configurations.map((config) => ({
        project_id: id,
        bedrooms: config.bedrooms ?? null,
        bathrooms: config.bathrooms ?? null,
        config_name: config.config_name || null,
        carpet_area_sqft: config.carpet_area_sqft ?? null,
        built_up_area_sqft: config.built_up_area_sqft ?? null,
        price: config.price ?? null,
        floor_plan_cloudinary_id: config.floor_plan_cloudinary_id || null,
      }));

      const { error: configsError } = await supabase
        .from("configurations")
        .insert(configsToInsert);

      if (configsError) {
        console.error("Error inserting configurations:", configsError);
      }
    }

    // Replace amenities: delete existing, insert new
    await supabase.from("project_amenities").delete().eq("project_id", id);

    if (data.amenityIds.length > 0) {
      const amenitiesToInsert = data.amenityIds.map((amenityId) => ({
        project_id: id,
        amenity_id: amenityId,
      }));

      const { error: amenitiesError } = await supabase
        .from("project_amenities")
        .insert(amenitiesToInsert);

      if (amenitiesError) {
        console.error("Error inserting amenities:", amenitiesError);
      }
    }

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${data.slug}`);
    // Also revalidate old slug if changed
    if (currentProject?.slug && currentProject.slug !== data.slug) {
      revalidatePath(`/properties/${currentProject.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating property:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deletePropertyAction(id: string): Promise<ActionResult> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }
    if (admin.role !== "admin") {
      return { success: false, error: "Only admins can delete properties" };
    }

    const supabase = await createClient();

    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from("projects")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/properties");
    revalidatePath("/properties");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting property:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
