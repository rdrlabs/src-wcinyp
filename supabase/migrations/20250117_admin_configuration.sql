-- Create admin configuration table for secure admin email management
-- This replaces hardcoded admin emails in client code

-- Create the admin_configuration table
CREATE TABLE IF NOT EXISTS admin_configuration (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_emails TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert initial admin email (to be updated in production)
INSERT INTO admin_configuration (admin_emails) 
VALUES (ARRAY['rco4001@med.cornell.edu'])
ON CONFLICT DO NOTHING;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_configuration_updated_at
  BEFORE UPDATE ON admin_configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE admin_configuration ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read admin configuration
CREATE POLICY "Users can view admin configuration" ON admin_configuration
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Policy: Only existing admins can update admin configuration
CREATE POLICY "Only admins can update admin configuration" ON admin_configuration
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy: No one can insert new rows (single row table)
CREATE POLICY "No inserts allowed" ON admin_configuration
  FOR INSERT 
  WITH CHECK (false);

-- Policy: No one can delete rows
CREATE POLICY "No deletes allowed" ON admin_configuration
  FOR DELETE 
  USING (false);

-- Create function to check if an email is an admin
CREATE OR REPLACE FUNCTION is_admin_email(check_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_configuration 
    WHERE check_email = ANY(admin_emails)
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to sync admin role in profiles
CREATE OR REPLACE FUNCTION sync_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- If email is in admin list, set role to admin
  IF is_admin_email(NEW.email) THEN
    NEW.role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync admin role on profile insert/update
CREATE TRIGGER sync_admin_role_trigger
  BEFORE INSERT OR UPDATE OF email ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_admin_role();

-- Add index for performance
CREATE INDEX idx_admin_configuration_emails ON admin_configuration USING GIN (admin_emails);

-- Add comment for documentation
COMMENT ON TABLE admin_configuration IS 'Stores admin email addresses for secure server-side validation';
COMMENT ON COLUMN admin_configuration.admin_emails IS 'Array of email addresses that have admin privileges';