import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const { projectId, name, email, phone, message, whatsappOptIn } = body;

  // Validate required fields
  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      user_id: user?.id || null,
      project_id: projectId || null,
      name,
      email,
      phone,
      message: message || null,
      whatsapp_opt_in: whatsappOptIn ?? false,
      source: "website",
      status: "new",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, inquiry: data });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      project:projects(id, name, slug)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data });
}
