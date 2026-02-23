/**
 * Set GCS bucket CORS from gcs-cors.json using @google-cloud/storage.
 * Use this if gcloud storage buckets update --cors-file fails (e.g. Python version).
 *
 * Usage: npx tsx scripts/set-gcs-cors.ts
 * Requires: GCP_PROJECT_ID and GCP_SERVICE_ACCOUNT_KEY in env (or gcloud ADC).
 * Loads .env.local from project root if present.
 */

import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";

const envLocal = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envLocal)) {
  const content = fs.readFileSync(envLocal, "utf-8");
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

const BUCKET = "property-listings-aglaghar";
const CORS_FILE = path.resolve(__dirname, "../gcs-cors.json");

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: process.env.GCP_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY)
    : undefined,
});

async function main(): Promise<void> {
  const raw = fs.readFileSync(CORS_FILE, "utf-8");
  const parsed = JSON.parse(raw) as unknown;
  const cors =
    Array.isArray(parsed) ? parsed : (parsed as { cors: unknown[] }).cors;
  if (!Array.isArray(cors)) {
    throw new Error("gcs-cors.json must be a CORS array or { cors: [...] }");
  }

  const bucket = storage.bucket(BUCKET);
  await bucket.setCorsConfiguration(cors);
  console.log("CORS updated for gs://%s", BUCKET);
  console.log("Rules:", JSON.stringify(cors, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
