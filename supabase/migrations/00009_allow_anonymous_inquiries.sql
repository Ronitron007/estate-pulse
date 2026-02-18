-- Allow anonymous (not-logged-in) users to submit inquiries
-- The existing policy only allows auth.uid() IS NOT NULL
DROP POLICY IF EXISTS "Users can create inquiries" ON inquiries;

CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);
