import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/database";

interface FavoriteWithProject {
  project_id: string;
  created_at: string;
  project: Project;
}

export async function getFavorites(userId: string): Promise<FavoriteWithProject[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saved_properties")
    .select(`
      project_id,
      created_at,
      project:projects(
        *,
        builder:builders(*),
        configurations(*),
        images:project_images(*)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  // Type assertion since Supabase doesn't fully type nested relations
  return (data || []) as unknown as FavoriteWithProject[];
}

export async function addFavorite(userId: string, projectId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("saved_properties")
    .insert({ user_id: userId, project_id: projectId });

  if (error) {
    console.error("Error adding favorite:", error);
    return false;
  }

  return true;
}

export async function removeFavorite(userId: string, projectId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("saved_properties")
    .delete()
    .eq("user_id", userId)
    .eq("project_id", projectId);

  if (error) {
    console.error("Error removing favorite:", error);
    return false;
  }

  return true;
}

export async function isFavorite(userId: string, projectId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saved_properties")
    .select("project_id")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}
