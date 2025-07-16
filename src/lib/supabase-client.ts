import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )
}

// Export a singleton instance for client-side use
let client: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  // During build/prerendering, return null to avoid errors
  if (typeof window === 'undefined') {
    return null as any
  }
  
  if (!client) {
    client = createClient()
  }
  return client
}

// Helper function to validate CWID format (3 letters + 4 numbers)
export function isValidCWIDFormat(cwid: string): boolean {
  const cwidRegex = /^[a-zA-Z]{3}\d{4}$/
  return cwidRegex.test(cwid)
}

// Helper function to validate email domain and format
export function isValidCornellEmail(email: string): boolean {
  const emailLower = email.toLowerCase()
  const match = emailLower.match(/^([^@]+)@med\.cornell\.edu$/)
  
  if (!match) return false
  
  const cwid = match[1]
  return isValidCWIDFormat(cwid)
}

// Helper function to extract NetID from email
export function getNetIdFromEmail(email: string): string | null {
  const match = email.toLowerCase().match(/^([^@]+)@med\.cornell\.edu$/)
  return match ? match[1] : null
}