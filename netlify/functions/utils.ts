// netlify/functions/utils.ts

const { createClient } = require('@supabase/supabase-js')

/**
 * Creates and returns a Supabase client instance configured for server-side use.
 *
 * Throws an error if the required Supabase environment variables are not set.
 * The client is initialized with authentication options that disable automatic token refresh and session persistence.
 *
 * @returns A Supabase client instance for server-side operations
 */
function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

module.exports = { createServerClient }
