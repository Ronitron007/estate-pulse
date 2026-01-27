-- Fix: Allow handle_new_user trigger to bypass RLS during signup
-- The trigger fires when auth.users gets a new row, but auth.uid() isn't set yet
-- in that context, causing the RLS policy on user_profiles to block the insert.

-- Recreate function with proper ownership and search_path
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$;

-- Ensure function is owned by postgres (superuser) to bypass RLS
ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- Recreate trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
