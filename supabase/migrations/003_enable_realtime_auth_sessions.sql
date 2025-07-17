-- Enable realtime for pending_auth_sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE pending_auth_sessions;

-- Create policy to allow anonymous users to listen to realtime changes on their sessions
CREATE POLICY "Allow anonymous to subscribe to own sessions" ON pending_auth_sessions
  FOR SELECT
  USING (true);

-- Ensure the update policy allows the auth callback to update sessions
CREATE POLICY "Allow service role to update sessions" ON pending_auth_sessions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add index for better performance on realtime queries
CREATE INDEX IF NOT EXISTS idx_pending_auth_sessions_is_authenticated 
  ON pending_auth_sessions(is_authenticated) 
  WHERE is_authenticated = true;