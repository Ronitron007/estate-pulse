import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/queries/admin";
import { generatePresignedUploadUrl } from "@/lib/gcp-storage";

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role === "viewer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileName, contentType } = await request.json();

  if (!fileName || !contentType) {
    return NextResponse.json({ error: "Missing fileName or contentType" }, { status: 400 });
  }

  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
  }

  try {
    const result = await generatePresignedUploadUrl(fileName, contentType);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
