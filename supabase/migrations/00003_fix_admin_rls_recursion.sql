-- Fix infinite recursion in admin_users RLS policy
-- The policy was querying admin_users to check access to admin_users

-- Create a security definer function to check admin status
-- This bypasses RLS when checking, preventing recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Only super_admin can manage admins" ON admin_users;

-- Recreate with security definer function
CREATE POLICY "Only super_admin can manage admins" ON admin_users
  FOR ALL USING (public.is_super_admin());

-- Update other admin policies to use the function (cleaner, more efficient)
DROP POLICY IF EXISTS "Admins full access projects" ON projects;
DROP POLICY IF EXISTS "Admins full access configurations" ON configurations;
DROP POLICY IF EXISTS "Admins full access images" ON project_images;
DROP POLICY IF EXISTS "Admins full access builders" ON builders;
DROP POLICY IF EXISTS "Admins full access amenities" ON amenities;
DROP POLICY IF EXISTS "Admins full access project_amenities" ON project_amenities;
DROP POLICY IF EXISTS "Admins full access inquiries" ON inquiries;

CREATE POLICY "Admins full access projects" ON projects
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins full access configurations" ON configurations
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins full access images" ON project_images
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins full access builders" ON builders
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins full access amenities" ON amenities
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins full access project_amenities" ON project_amenities
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins full access inquiries" ON inquiries
  FOR ALL USING (public.is_admin());
