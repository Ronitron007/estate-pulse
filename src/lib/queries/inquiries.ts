import { createClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/types/database";

interface CreateInquiryInput {
  userId?: string;
  projectId?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  whatsappOptIn?: boolean;
  source?: string;
}

export async function createInquiry(input: CreateInquiryInput): Promise<Inquiry | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      user_id: input.userId || null,
      project_id: input.projectId || null,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message || null,
      whatsapp_opt_in: input.whatsappOptIn ?? false,
      source: input.source || "website",
      status: "new",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating inquiry:", error);
    return null;
  }

  return data;
}

export async function getUserInquiries(userId: string): Promise<Inquiry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      project:projects(id, name, slug)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user inquiries:", error);
    return [];
  }

  return data || [];
}

export async function getInquiriesByProject(projectId: string): Promise<Inquiry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching project inquiries:", error);
    return [];
  }

  return data || [];
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: Inquiry["status"]
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", inquiryId);

  if (error) {
    console.error("Error updating inquiry status:", error);
    return false;
  }

  return true;
}
