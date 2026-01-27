const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

const storage = new Storage();

const VARIANTS = [
  { name: "thumbnail", width: 300, height: 225, quality: 80 },
  { name: "card", width: 600, height: 450, quality: 85 },
  { name: "hero", width: 1600, height: 800, quality: 85 },
];

exports.resizeImage = async (event, context) => {
  const file = event;
  const bucketName = file.bucket;
  const filePath = file.name;

  // Only process original images in properties folder
  if (!filePath.match(/^properties\/[^/]+\/img-[^/]+-original\.(jpg|jpeg|png|webp)$/i)) {
    console.log(`Skipping non-original file: ${filePath}`);
    return;
  }

  console.log(`Processing: ${filePath}`);

  const bucket = storage.bucket(bucketName);
  const basePath = filePath.replace(/-original\.(jpg|jpeg|png|webp)$/i, "");
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));

  try {
    // Download original
    await bucket.file(filePath).download({ destination: tempFilePath });
    console.log(`Downloaded to ${tempFilePath}`);

    // Generate variants
    for (const variant of VARIANTS) {
      const variantPath = `${basePath}-${variant.name}.webp`;
      const tempVariantPath = path.join(os.tmpdir(), `${variant.name}.webp`);

      await sharp(tempFilePath)
        .resize(variant.width, variant.height, { fit: "cover" })
        .webp({ quality: variant.quality })
        .toFile(tempVariantPath);

      await bucket.upload(tempVariantPath, {
        destination: variantPath,
        metadata: {
          contentType: "image/webp",
          cacheControl: "public, max-age=86400",
        },
      });

      console.log(`Created variant: ${variantPath}`);
      fs.unlinkSync(tempVariantPath);
    }

    // Cleanup
    fs.unlinkSync(tempFilePath);
    console.log(`Completed processing: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    throw error;
  }
};
