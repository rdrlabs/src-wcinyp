-- HARDCODED ADMIN ASSIGNMENT FOR rco4001@med.cornell.edu
-- This migration sets up a single, immutable admin user

-- First, ensure the admin user exists in auth.users (if not already)
-- Note: This assumes the user will sign up or has signed up already
-- We're just ensuring their profile has the correct role

-- Create or update the profile for rco4001@med.cornell.edu with admin role
INSERT INTO public.profiles (id, email, net_id, role)
SELECT 
  id,
  email,
  'rco4001',
  'admin'
FROM auth.users
WHERE email = 'rco4001@med.cornell.edu'
ON CONFLICT (id) DO UPDATE
SET role = 'admin'
WHERE profiles.email = 'rco4001@med.cornell.edu';

-- Create a function to enforce single hardcoded admin
CREATE OR REPLACE FUNCTION enforce_single_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Only rco4001@med.cornell.edu can be admin
  IF NEW.role = 'admin' AND NEW.email != 'rco4001@med.cornell.edu' THEN
    RAISE EXCEPTION 'Only rco4001@med.cornell.edu can have admin role';
  END IF;
  
  -- Prevent rco4001@med.cornell.edu from being demoted
  IF OLD.email = 'rco4001@med.cornell.edu' AND OLD.role = 'admin' AND NEW.role != 'admin' THEN
    RAISE EXCEPTION 'Cannot remove admin role from rco4001@med.cornell.edu';
  END IF;
  
  -- Prevent email changes for admin user
  IF OLD.role = 'admin' AND OLD.email != NEW.email THEN
    RAISE EXCEPTION 'Cannot change email for admin user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce admin rules on INSERT and UPDATE
DROP TRIGGER IF EXISTS enforce_admin_trigger ON public.profiles;
CREATE TRIGGER enforce_admin_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION enforce_single_admin();

-- Add a CHECK constraint for extra safety (belt and suspenders approach)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS single_admin_check;
ALTER TABLE public.profiles ADD CONSTRAINT single_admin_check 
CHECK (
  (role = 'admin' AND email = 'rco4001@med.cornell.edu') OR 
  (role != 'admin')
);

-- Create a view to easily check admin status
CREATE OR REPLACE VIEW admin_status AS
SELECT 
  COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
  COUNT(*) FILTER (WHERE role = 'admin' AND email = 'rco4001@med.cornell.edu') as correct_admin_count,
  COUNT(*) FILTER (WHERE role = 'admin' AND email != 'rco4001@med.cornell.edu') as incorrect_admin_count
FROM public.profiles;

-- Ensure only one admin exists and it's the correct one
DO $$
DECLARE
  admin_check RECORD;
BEGIN
  -- Remove admin role from anyone who isn't supposed to have it
  UPDATE public.profiles
  SET role = 'user'
  WHERE role = 'admin' AND email != 'rco4001@med.cornell.edu';
  
  -- Check the admin status
  SELECT * INTO admin_check FROM admin_status;
  
  -- Log the result
  RAISE NOTICE 'Admin check - Total admins: %, Correct admin: %, Incorrect admins: %', 
    admin_check.admin_count, 
    admin_check.correct_admin_count, 
    admin_check.incorrect_admin_count;
END $$;

-- Add helpful comments
COMMENT ON FUNCTION enforce_single_admin() IS 'Ensures only rco4001@med.cornell.edu can be admin - HARDCODED FOR SECURITY';
COMMENT ON CONSTRAINT single_admin_check ON public.profiles IS 'Enforces that only rco4001@med.cornell.edu can have admin role';
COMMENT ON VIEW admin_status IS 'Quick check to verify admin configuration is correct';

-- Create audit log for admin actions (optional but recommended)
CREATE TABLE IF NOT EXISTS public.admin_action_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  target_table TEXT,
  target_id TEXT,
  action_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin action log
ALTER TABLE public.admin_action_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view the admin action log
CREATE POLICY "Only admins can view admin action log" ON public.admin_action_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.email = 'rco4001@med.cornell.edu'
    )
  );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_type TEXT,
  target_table TEXT DEFAULT NULL,
  target_id TEXT DEFAULT NULL,
  action_details JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.admin_action_log (admin_id, action_type, target_table, target_id, action_details)
  VALUES (auth.uid(), action_type, target_table, target_id, action_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on log function to authenticated users
GRANT EXECUTE ON FUNCTION log_admin_action TO authenticated;