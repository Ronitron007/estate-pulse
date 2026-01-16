-- Estate Pulse Database Schema
-- Run this in Supabase SQL Editor

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- BUILDERS/DEVELOPERS
-- ============================================

CREATE TABLE builders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_cloudinary_id TEXT,
  description TEXT,
  website TEXT,
  established_year INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_builders_slug ON builders(slug);

-- ============================================
-- PROPERTY PROJECTS
-- ============================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed')) DEFAULT 'upcoming',

  -- Pricing (in smallest currency unit)
  price_min BIGINT,
  price_max BIGINT,
  price_on_request BOOLEAN DEFAULT FALSE,

  -- Location
  address TEXT,
  city TEXT NOT NULL,
  locality TEXT,
  pincode TEXT,
  location GEOGRAPHY(POINT, 4326),

  -- Property Details
  property_type TEXT CHECK (property_type IN ('apartment', 'villa', 'plot', 'commercial', 'penthouse')),
  total_units INT,
  available_units INT,
  possession_date DATE,
  rera_id TEXT,

  -- Builder
  builder_id UUID REFERENCES builders(id) ON DELETE SET NULL,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_projects_location ON projects USING GIST (location);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_city ON projects(city);
CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_price ON projects(price_min, price_max);
CREATE INDEX idx_projects_builder ON projects(builder_id);
CREATE INDEX idx_projects_published ON projects(published_at) WHERE published_at IS NOT NULL AND deleted_at IS NULL;

-- ============================================
-- CONFIGURATIONS (Unit types)
-- ============================================

CREATE TABLE configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

  bedrooms INT,
  bathrooms INT,
  config_name TEXT,

  carpet_area_sqft INT,
  built_up_area_sqft INT,

  price BIGINT,
  floor_plan_cloudinary_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_configs_project ON configurations(project_id);
CREATE INDEX idx_configs_bedrooms ON configurations(bedrooms);

-- ============================================
-- IMAGES
-- ============================================

CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

  cloudinary_public_id TEXT NOT NULL,
  width INT,
  height INT,

  image_type TEXT CHECK (image_type IN ('exterior', 'interior', 'amenity', 'location', 'floor_plan', 'brochure')),
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_images_project ON project_images(project_id);
CREATE INDEX idx_images_primary ON project_images(project_id) WHERE is_primary = TRUE;

-- ============================================
-- AMENITIES
-- ============================================

CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  category TEXT
);

CREATE TABLE project_amenities (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, amenity_id)
);

-- Seed common amenities
INSERT INTO amenities (name, icon, category) VALUES
  ('Swimming Pool', 'pool', 'fitness'),
  ('Gym', 'dumbbell', 'fitness'),
  ('Clubhouse', 'building', 'lifestyle'),
  ('Children''s Play Area', 'baby', 'lifestyle'),
  ('Garden', 'tree', 'lifestyle'),
  ('Parking', 'car', 'convenience'),
  ('24/7 Security', 'shield', 'security'),
  ('CCTV', 'camera', 'security'),
  ('Power Backup', 'zap', 'convenience'),
  ('Lift', 'arrow-up', 'convenience'),
  ('Intercom', 'phone', 'security'),
  ('Fire Safety', 'flame', 'security'),
  ('Jogging Track', 'footprints', 'fitness'),
  ('Tennis Court', 'circle', 'fitness'),
  ('Basketball Court', 'circle', 'fitness'),
  ('Indoor Games', 'gamepad-2', 'lifestyle'),
  ('Library', 'book-open', 'lifestyle'),
  ('Yoga Room', 'heart', 'fitness'),
  ('Spa', 'sparkles', 'lifestyle'),
  ('Cafeteria', 'coffee', 'lifestyle');

-- ============================================
-- USER PROFILES
-- ============================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  preferred_cities TEXT[],
  budget_min BIGINT,
  budget_max BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SAVED PROPERTIES
-- ============================================

CREATE TABLE saved_properties (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, project_id)
);

-- ============================================
-- COMPARISON LISTS
-- ============================================

CREATE TABLE comparison_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT max_comparison_items CHECK (array_length(project_ids, 1) <= 4)
);

CREATE INDEX idx_comparisons_user ON comparison_lists(user_id);

-- ============================================
-- INQUIRIES
-- ============================================

CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,

  -- Lead tracking
  source TEXT,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,

  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')) DEFAULT 'new',
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_project ON inquiries(project_id);
CREATE INDEX idx_inquiries_user ON inquiries(user_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- ============================================
-- ADMIN USERS
-- ============================================

CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'editor')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view published projects" ON projects
  FOR SELECT USING (published_at IS NOT NULL AND deleted_at IS NULL);

CREATE POLICY "Public can view configurations" ON configurations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND published_at IS NOT NULL AND deleted_at IS NULL)
  );

CREATE POLICY "Public can view project images" ON project_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND published_at IS NOT NULL AND deleted_at IS NULL)
  );

CREATE POLICY "Public can view builders" ON builders
  FOR SELECT USING (TRUE);

CREATE POLICY "Public can view amenities" ON amenities
  FOR SELECT USING (TRUE);

CREATE POLICY "Public can view project amenities" ON project_amenities
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND published_at IS NOT NULL AND deleted_at IS NULL)
  );

-- User policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view own saved" ON saved_properties
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can save properties" ON saved_properties
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave properties" ON saved_properties
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view own comparisons" ON comparison_lists
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own inquiries" ON inquiries
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Admin policies (full access)
CREATE POLICY "Admins full access projects" ON projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access configurations" ON configurations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access images" ON project_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access builders" ON builders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access amenities" ON amenities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access project_amenities" ON project_amenities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access inquiries" ON inquiries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Only super_admin can manage admins" ON admin_users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'super_admin')
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_builders_updated_at
  BEFORE UPDATE ON builders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
