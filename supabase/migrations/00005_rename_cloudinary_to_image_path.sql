-- Rename cloudinary_public_id to image_path in project_images table
ALTER TABLE project_images
RENAME COLUMN cloudinary_public_id TO image_path;

-- Add comment explaining the field
COMMENT ON COLUMN project_images.image_path IS 'Base path in GCS bucket (e.g., properties/slug/img-uuid). Variants derived by appending -thumbnail, -card, -hero.';
