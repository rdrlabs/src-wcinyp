-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  net_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile for @med.cornell.edu emails
  IF NEW.email LIKE '%@med.cornell.edu' THEN
    INSERT INTO public.profiles (id, email, net_id)
    VALUES (
      NEW.id,
      NEW.email,
      SPLIT_PART(NEW.email, '@', 1)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create pending_auth_sessions table for cross-device authentication
CREATE TABLE IF NOT EXISTS public.pending_auth_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  email TEXT NOT NULL,
  device_info TEXT,
  device_fingerprint TEXT,
  is_authenticated BOOLEAN DEFAULT FALSE,
  authenticated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_pending_auth_sessions_token ON public.pending_auth_sessions(session_token);
CREATE INDEX idx_pending_auth_sessions_email ON public.pending_auth_sessions(email);

-- Enable RLS on pending_auth_sessions
ALTER TABLE public.pending_auth_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read sessions by token (needed for polling)
CREATE POLICY "Anyone can read sessions by token" ON public.pending_auth_sessions
  FOR SELECT USING (true);

-- Allow service role to insert/update/delete
CREATE POLICY "Service role can manage sessions" ON public.pending_auth_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.pending_auth_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired sessions (if pg_cron is enabled)
-- Note: You'll need to enable pg_cron extension in Supabase dashboard first
-- Then uncomment the following:
-- SELECT cron.schedule('cleanup-expired-sessions', '*/15 * * * *', 'SELECT public.cleanup_expired_sessions();');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.pending_auth_sessions TO anon;
GRANT ALL ON public.profiles TO authenticated;

-- Add helpful comment
COMMENT ON TABLE public.profiles IS 'User profiles for Weill Cornell staff members';
COMMENT ON TABLE public.pending_auth_sessions IS 'Temporary sessions for cross-device authentication flow';
COMMENT ON COLUMN public.pending_auth_sessions.session_token IS 'Unique token passed in magic link for device synchronization';
COMMENT ON COLUMN public.pending_auth_sessions.is_authenticated IS 'Set to true when user clicks magic link on any device';