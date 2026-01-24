import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  fileName: string;
}

export async function generatePresignedUploadUrl(
  originalFileName: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  const ext = originalFileName.split(".").pop() || "jpg";
  const fileName = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const file = bucket.file(fileName);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;

  return { uploadUrl, publicUrl, fileName };
}

export function getPublicUrl(fileName: string): string {
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;
}
