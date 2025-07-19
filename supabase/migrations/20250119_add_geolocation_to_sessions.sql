-- Add geolocation fields to user_sessions table
ALTER TABLE user_sessions
ADD COLUMN IF NOT EXISTS location_city TEXT,
ADD COLUMN IF NOT EXISTS location_region TEXT,
ADD COLUMN IF NOT EXISTS location_country TEXT,
ADD COLUMN IF NOT EXISTS location_isp TEXT;

-- Add index for location-based queries
CREATE INDEX IF NOT EXISTS idx_sessions_location_country ON user_sessions(location_country) WHERE location_country IS NOT NULL;

-- Also add geolocation fields to access_requests table for consistency
ALTER TABLE access_requests
ADD COLUMN IF NOT EXISTS location_city TEXT,
ADD COLUMN IF NOT EXISTS location_region TEXT,
ADD COLUMN IF NOT EXISTS location_country TEXT,
ADD COLUMN IF NOT EXISTS location_isp TEXT;

-- Add index for location-based queries on access_requests
CREATE INDEX IF NOT EXISTS idx_access_requests_location_country ON access_requests(location_country) WHERE location_country IS NOT NULL;

-- Update the access request stats view to include location information
CREATE OR REPLACE VIEW access_request_stats AS
SELECT
    COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
    COUNT(*) FILTER (WHERE status = 'approved') AS approved_count,
    COUNT(*) FILTER (WHERE status = 'rejected') AS rejected_count,
    COUNT(*) AS total_count,
    COUNT(*) FILTER (WHERE requested_at >= CURRENT_DATE - INTERVAL '7 days') AS last_week_count,
    COUNT(*) FILTER (WHERE requested_at >= CURRENT_DATE - INTERVAL '30 days') AS last_month_count,
    COUNT(DISTINCT location_country) FILTER (WHERE location_country IS NOT NULL) AS unique_countries
FROM access_requests;