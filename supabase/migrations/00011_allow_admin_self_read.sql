-- Allow authenticated users to read their own admin_users row
-- Fixes middleware redirect: anon key couldn't read admin_users due to super_admin-only RLS
CREATE POLICY "Users can read own admin role" ON admin_users
  FOR SELECT USING (user_id = auth.uid());
