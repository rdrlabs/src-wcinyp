-- Create access_requests table for tracking access requests from external users
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  role TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approved_domains table for whitelisted email domains
CREATE TABLE IF NOT EXISTS public.approved_domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  organization TEXT,
  added_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invitation_codes table for one-time use invitation codes
CREATE TABLE IF NOT EXISTS public.invitation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  email TEXT,
  created_by UUID REFERENCES auth.users(id),
  used_by TEXT,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  max_uses INTEGER DEFAULT 1,
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_access_requests_email ON public.access_requests(email);
CREATE INDEX idx_access_requests_status ON public.access_requests(status);
CREATE INDEX idx_access_requests_requested_at ON public.access_requests(requested_at);
CREATE INDEX idx_approved_domains_domain ON public.approved_domains(domain);
CREATE INDEX idx_invitation_codes_code ON public.invitation_codes(code);
CREATE INDEX idx_invitation_codes_expires_at ON public.invitation_codes(expires_at);

-- Add @med.cornell.edu as the default approved domain
INSERT INTO public.approved_domains (domain, organization, is_active)
VALUES ('med.cornell.edu', 'Weill Cornell Medicine', true)
ON CONFLICT (domain) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_access_requests_updated_at BEFORE UPDATE ON public.access_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approved_domains_updated_at BEFORE UPDATE ON public.approved_domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitation_codes_updated_at BEFORE UPDATE ON public.invitation_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approved_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- Access requests policies
-- Anyone can create an access request
CREATE POLICY "Anyone can create access requests" ON public.access_requests
  FOR INSERT WITH CHECK (true);

-- Users can view their own access requests
CREATE POLICY "Users can view own access requests" ON public.access_requests
  FOR SELECT USING (email = current_user);

-- Admin users can view all access requests (requires admin role)
CREATE POLICY "Admins can view all access requests" ON public.access_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin users can update access requests
CREATE POLICY "Admins can update access requests" ON public.access_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Approved domains policies
-- Anyone can view active approved domains
CREATE POLICY "Anyone can view active approved domains" ON public.approved_domains
  FOR SELECT USING (is_active = true);

-- Admin users can manage approved domains
CREATE POLICY "Admins can manage approved domains" ON public.approved_domains
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Invitation codes policies
-- Anyone can view their own invitation code (by code)
CREATE POLICY "Users can view invitation by code" ON public.invitation_codes
  FOR SELECT USING (true);

-- Admin users can manage invitation codes
CREATE POLICY "Admins can manage invitation codes" ON public.invitation_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to check if an email is allowed to authenticate
CREATE OR REPLACE FUNCTION is_email_allowed_to_authenticate(email_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  email_domain TEXT;
  is_approved BOOLEAN := FALSE;
BEGIN
  -- Extract domain from email
  email_domain := LOWER(SPLIT_PART(email_address, '@', 2));
  
  -- Check if domain is in approved domains
  SELECT EXISTS (
    SELECT 1 FROM public.approved_domains
    WHERE domain = email_domain
    AND is_active = true
  ) INTO is_approved;
  
  -- If not approved by domain, check if email has a valid invitation code
  IF NOT is_approved THEN
    SELECT EXISTS (
      SELECT 1 FROM public.invitation_codes
      WHERE (email IS NULL OR email = email_address)
      AND is_active = true
      AND uses_count < max_uses
      AND expires_at > NOW()
    ) INTO is_approved;
  END IF;
  
  -- If not approved by domain or invitation, check if access request is approved
  IF NOT is_approved THEN
    SELECT EXISTS (
      SELECT 1 FROM public.access_requests
      WHERE email = email_address
      AND status = 'approved'
    ) INTO is_approved;
  END IF;
  
  RETURN is_approved;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to use an invitation code
CREATE OR REPLACE FUNCTION use_invitation_code(code_value TEXT, user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  code_valid BOOLEAN := FALSE;
BEGIN
  -- Update the invitation code if valid
  UPDATE public.invitation_codes
  SET 
    uses_count = uses_count + 1,
    used_by = COALESCE(used_by || ', ', '') || user_email,
    used_at = CASE WHEN uses_count = 0 THEN NOW() ELSE used_at END
  WHERE 
    code = code_value
    AND is_active = true
    AND uses_count < max_uses
    AND expires_at > NOW()
    AND (email IS NULL OR email = user_email)
  RETURNING true INTO code_valid;
  
  RETURN COALESCE(code_valid, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add role column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create a view for access request statistics
CREATE OR REPLACE VIEW public.access_request_stats AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE requested_at > NOW() - INTERVAL '7 days') as last_week_count,
  COUNT(*) FILTER (WHERE requested_at > NOW() - INTERVAL '30 days') as last_month_count
FROM public.access_requests;

-- Grant access to the stats view
GRANT SELECT ON public.access_request_stats TO authenticated;

-- Create function to approve an access request
CREATE OR REPLACE FUNCTION approve_access_request(request_id UUID, notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  request_email TEXT;
  success BOOLEAN := FALSE;
BEGIN
  -- Update the access request
  UPDATE public.access_requests
  SET 
    status = 'approved',
    reviewed_at = NOW(),
    reviewed_by = auth.uid(),
    review_notes = notes
  WHERE 
    id = request_id
    AND status = 'pending'
  RETURNING email INTO request_email;
  
  IF request_email IS NOT NULL THEN
    -- Optionally create an invitation code for the approved user
    INSERT INTO public.invitation_codes (email, created_by, max_uses, expires_at)
    VALUES (request_email, auth.uid(), 1, NOW() + INTERVAL '30 days');
    
    success := TRUE;
  END IF;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reject an access request
CREATE OR REPLACE FUNCTION reject_access_request(request_id UUID, notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN := FALSE;
BEGIN
  -- Update the access request
  UPDATE public.access_requests
  SET 
    status = 'rejected',
    reviewed_at = NOW(),
    reviewed_by = auth.uid(),
    review_notes = notes
  WHERE 
    id = request_id
    AND status = 'pending'
  RETURNING true INTO success;
  
  RETURN COALESCE(success, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;