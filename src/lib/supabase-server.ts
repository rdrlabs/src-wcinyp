import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// This is for server-side use in Netlify Functions
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper to verify auth token from request
export async function verifyAuthToken(token: string | null) {
  if (!token) {
    return { user: null, error: 'No token provided' }
  }

  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase.auth.getUser(token)
    
    if (error) {
      return { user: null, error: error.message }
    }
    
    // Verify email domain
    if (data.user?.email && !data.user.email.endsWith('@med.cornell.edu')) {
      return { user: null, error: 'Unauthorized email domain' }
    }
    
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: 'Failed to verify token' }
  }
}