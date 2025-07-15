import type { Handler } from '@netlify/functions'

// Import the server client code directly since Netlify Functions don't support path aliases
const { createClient } = require('@supabase/supabase-js')

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

async function isEmailAllowedToAuthenticate(email: string, supabase: ReturnType<typeof createClient>) {
  const emailLower = email.toLowerCase()
  const domain = emailLower.split('@')[1] || ''

  // First check if it's a Cornell email with valid CWID format
  if (domain === 'med.cornell.edu') {
    const cwid = emailLower.split('@')[0]
    const cwidRegex = /^[a-zA-Z]{3}\d{4}$/
    if (cwidRegex.test(cwid)) {
      return { allowed: true, reason: 'Cornell Medical email with valid CWID' }
    } else {
      return { allowed: false, reason: 'Invalid CWID format' }
    }
  }

  // Check if domain is in approved domains
  const { data: approvedDomain } = await supabase
    .from('approved_domains')
    .select('domain')
    .eq('domain', domain)
    .eq('is_active', true)
    .single()

  if (approvedDomain) {
    return { allowed: true, reason: 'Approved domain' }
  }

  // Check if email has an approved access request
  const { data: accessRequest } = await supabase
    .from('access_requests')
    .select('status')
    .eq('email', emailLower)
    .eq('status', 'approved')
    .single()

  if (accessRequest) {
    return { allowed: true, reason: 'Approved access request' }
  }

  // Check if there's a valid invitation code for this email
  const { data: invitation } = await supabase
    .from('invitation_codes')
    .select('code')
    .or(`email.eq.${emailLower},email.is.null`)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .gte('max_uses', 'uses_count')
    .limit(1)
    .single()

  if (invitation) {
    return { 
      allowed: true, 
      reason: 'Valid invitation code available',
      requiresInvitationCode: true
    }
  }

  return { 
    allowed: false, 
    reason: 'Email not authorized. Please request access.'
  }
}

async function verifyAuthToken(token: string | null) {
  if (!token) {
    return { user: null, error: 'No token provided' }
  }

  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase.auth.getUser(token)
    
    if (error) {
      return { user: null, error: error.message }
    }
    
    // Verify email is allowed to authenticate
    if (data.user?.email) {
      const { allowed, reason } = await isEmailAllowedToAuthenticate(data.user.email, supabase)
      if (!allowed) {
        return { user: null, error: reason }
      }
    } else {
      return { user: null, error: 'No email associated with user' }
    }
    
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: 'Failed to verify token' }
  }
}

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    // Get the authorization header
    const authHeader = event.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    // Verify the token
    const { user, error } = await verifyAuthToken(token || null)

    if (error || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: error || 'Unauthorized' }),
      }
    }

    // Return user data
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        user: {
          id: user.id,
          email: user.email,
          net_id: user.email?.split('@')[0] || null,
        }
      }),
    }
  } catch (error) {
    console.error('Auth callback error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}