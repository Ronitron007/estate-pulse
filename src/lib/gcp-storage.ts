import { Storage, Bucket } from "@google-cloud/storage";
import { randomUUID } from "crypto";

let _storage: Storage | null = null;
let _bucket: Bucket | null = null;

function getBucket(): Bucket {
  if (!_bucket) {
    if (!process.env.GCP_BUCKET_NAME) {
      throw new Error("GCP_BUCKET_NAME environment variable is required");
    }
    _storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY || "{}"),
    });
    _bucket = _storage.bucket(process.env.GCP_BUCKET_NAME);
  }
  return _bucket;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  fileName: string;
  basePath: string;
}

export async function generatePresignedUploadUrl(
  originalFileName: string,
  contentType: string,
  slug: string
): Promise<PresignedUrlResponse> {
  const ext = originalFileName.split(".").pop() || "jpg";
  const uuid = randomUUID().slice(0, 8);
  const basePath = `properties/${slug}/img-${uuid}`;
  const fileName = `${basePath}-original.${ext}`;

  const file = getBucket().file(fileName);

  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;

  return { uploadUrl, publicUrl, fileName, basePath };
}

export function getPublicUrl(fileName: string): string {
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${fileName}`;
}
