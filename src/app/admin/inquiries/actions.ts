"use server";

import { createClient } from "@/lib/supabase/server";
import { updateInquiryStatus } from "@/lib/queries/inquiries";
import type { InquiryStatus } from "@/types/database";

export async function updateInquiryStatusAction(
  inquiryId: string,
  status: InquiryStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await updateInquiryStatus(inquiryId, status);

    if (!success) {
      return { success: false, error: "Failed to update status" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateInquiryNotesAction(
  inquiryId: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("inquiries")
      .update({ notes })
      .eq("id", inquiryId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry notes:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
