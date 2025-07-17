-- Create user_sessions table to track active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  device_name TEXT,
  device_type TEXT,
  browser_name TEXT,
  os_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Add constraints
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Add indexes for performance
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_sessions_is_active ON user_sessions(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can revoke their own sessions
CREATE POLICY "Users can revoke own sessions" ON user_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND is_active = false);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE user_sessions
  SET is_active = false
  WHERE expires_at < NOW() AND is_active = true;
  
  -- Delete very old sessions (older than 90 days)
  DELETE FROM user_sessions
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record session activity
CREATE OR REPLACE FUNCTION update_session_activity(p_token_hash TEXT)
RETURNS void AS $$
BEGIN
  UPDATE user_sessions
  SET last_activity = NOW()
  WHERE token_hash = p_token_hash AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new session
CREATE OR REPLACE FUNCTION create_user_session(
  p_user_id UUID,
  p_token_hash TEXT,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_expires_at TIMESTAMPTZ
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  -- Parse user agent to extract device info
  INSERT INTO user_sessions (
    user_id,
    token_hash,
    ip_address,
    user_agent,
    expires_at
  ) VALUES (
    p_user_id,
    p_token_hash,
    p_ip_address::INET,
    p_user_agent,
    p_expires_at
  ) RETURNING id INTO v_session_id;
  
  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;