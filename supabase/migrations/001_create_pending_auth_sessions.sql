-- Create table for pending authentication sessions (cross-device flow)
CREATE TABLE IF NOT EXISTS pending_auth_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  email TEXT NOT NULL,
  device_info TEXT,
  device_fingerprint TEXT,
  is_authenticated BOOLEAN DEFAULT FALSE,
  authenticated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Add index for faster lookups
  CONSTRAINT email_format CHECK (email ~ '^[^@]+@med\.cornell\.edu$')
);

-- Add indexes for performance
CREATE INDEX idx_pending_auth_sessions_token ON pending_auth_sessions(session_token);
CREATE INDEX idx_pending_auth_sessions_email ON pending_auth_sessions(email);
CREATE INDEX idx_pending_auth_sessions_expires ON pending_auth_sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE pending_auth_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to read their own pending sessions
CREATE POLICY "Allow anonymous to read pending sessions" ON pending_auth_sessions
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to update their sessions
CREATE POLICY "Allow update own pending sessions" ON pending_auth_sessions
  FOR UPDATE
  USING (email = auth.jwt() ->> 'email');

-- Create a function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_auth_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM pending_auth_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-auth-sessions', '*/15 * * * *', 'SELECT cleanup_expired_auth_sessions();');