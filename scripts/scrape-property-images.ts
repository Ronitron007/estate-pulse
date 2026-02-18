/**
 * Scrape property images from official websites and upload to GCS
 * Usage: npx tsx scripts/scrape-property-images.ts
 */

import { chromium } from "playwright";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";

const BUCKET = "property-listings-aglaghar";
const TMP_DIR = "/tmp/property-images";

// Property websites mapping
const PROPERTIES: Record<string, string> = {
  "godrej-avenue-eleven": "https://www.godrejproperties.com/mumbai/residential/godrej-avenue-eleven",
  "godrej-horizon": "https://www.godrejproperties.com/mumbai/residential/godrej-horizon",
  "godrej-reserve": "https://www.godrejproperties.com/pune/residential/godrej-reserve",
  "godrej-woodsville": "https://www.godrejproperties.com/pune/residential/godrej-woodsville",
  "lodha-divino": "https://www.lodhagroup.in/mumbai/lodha-divino",
  "lodha-bellevue": "https://www.lodhagroup.in/mumbai/lodha-bellevue",
  "hiranandani-fortune-city": "https://www.hiranandanicommunities.com/panvel/fortune-city",
  "oberoi-sky-city": "https://www.oberoirealty.com/mumbai/oberoi-sky-city",
  "prestige-city-sarjapur": "https://www.prestigeconstructions.com/residential-projects/bangalore/prestige-city",
  "prestige-high-fields": "https://www.prestigeconstructions.com/residential-projects/hyderabad/prestige-high-fields",
  "sobha-dream-acres": "https://www.sobha.com/bangalore/sobha-dream-acres",
  "sobha-neopolis": "https://www.sobha.com/bangalore/sobha-neopolis",
  "brigade-eldorado": "https://www.brigadegroup.com/residential/brigade-eldorado",
  "dlf-the-arbour": "https://www.dlf.in/homes/dlf-the-arbour",
  "dlf-the-camellias": "https://www.dlf.in/homes/dlf-the-camellias",
};

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: process.env.GCP_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY)
    : undefined,
});
const bucket = storage.bucket(BUCKET);

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    return true;
  } catch {
    return false;
  }
}

async function uploadToGCS(localPath: string, gcsPath: string): Promise<void> {
  await bucket.upload(localPath, {
    destination: gcsPath,
    metadata: {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=86400",
    },
  });
}

async function scrapeProperty(slug: string, url: string): Promise<string[]> {
  console.log(`\n=== Scraping ${slug} ===`);
  console.log(`URL: ${url}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const uploadedPaths: string[] = [];

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Extract image URLs - look for high-res images
    const imageUrls = await page.evaluate(() => {
      const imgs = document.querySelectorAll("img");
      const urls: string[] = [];

      imgs.forEach((img) => {
        let src = img.src;

        // Handle Next.js image optimization URLs
        if (src.includes("/_next/image")) {
          const urlParam = new URL(src).searchParams.get("url");
          if (urlParam) src = decodeURIComponent(urlParam);
        }

        // Filter for property images (not icons, logos, etc.)
        if (
          src &&
          !src.includes("logo") &&
          !src.includes("icon") &&
          !src.includes("svg") &&
          (src.includes("blob.core.windows.net") ||
           src.includes("cloudinary") ||
           src.includes("cdn") ||
           src.includes("s3.") ||
           (img.naturalWidth > 400 && img.naturalHeight > 300))
        ) {
          urls.push(src);
        }
      });

      return [...new Set(urls)].slice(0, 5); // Dedupe and limit to 5
    });

    console.log(`Found ${imageUrls.length} images`);

    // Download and upload images
    const slugDir = path.join(TMP_DIR, slug);
    fs.mkdirSync(slugDir, { recursive: true });

    let imgIndex = 1;
    for (const imgUrl of imageUrls.slice(0, 2)) { // Only take first 2
      const localPath = path.join(slugDir, `img-${slug.slice(0, 3)}${String(imgIndex).padStart(3, "0")}-original.jpg`);
      const gcsPath = `properties/${slug}/img-${slug.slice(0, 3)}${String(imgIndex).padStart(3, "0")}-original.jpg`;

      console.log(`  Downloading: ${imgUrl.slice(0, 80)}...`);
      const downloaded = await downloadImage(imgUrl, localPath);

      if (downloaded && fs.statSync(localPath).size > 10000) { // Min 10KB
        console.log(`  Uploading to GCS: ${gcsPath}`);
        await uploadToGCS(localPath, gcsPath);
        uploadedPaths.push(`properties/${slug}/img-${slug.slice(0, 3)}${String(imgIndex).padStart(3, "0")}`);
        imgIndex++;
      } else {
        console.log(`  Skipped (too small or failed)`);
      }
    }
  } catch (err) {
    console.error(`  Error: ${err}`);
  } finally {
    await browser.close();
  }

  return uploadedPaths;
}

async function main() {
  console.log("=== Property Image Scraper ===\n");

  fs.mkdirSync(TMP_DIR, { recursive: true });

  const results: Record<string, string[]> = {};

  for (const [slug, url] of Object.entries(PROPERTIES)) {
    try {
      const paths = await scrapeProperty(slug, url);
      results[slug] = paths;
      console.log(`  Uploaded ${paths.length} images`);
    } catch (err) {
      console.error(`  Failed: ${err}`);
      results[slug] = [];
    }
  }

  console.log("\n=== Summary ===");
  for (const [slug, paths] of Object.entries(results)) {
    console.log(`${slug}: ${paths.length} images`);
  }

  // Output paths for DB update
  console.log("\n=== DB Update Needed ===");
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
