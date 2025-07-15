import type { Handler } from '@netlify/functions'

// Import the server client code directly since Netlify Functions don't support path aliases
const { createClient } = require('@supabase/supabase-js')

/**
 * Creates and returns a Supabase client using environment variables for configuration.
 *
 * @returns A Supabase client instance configured with service role key and no session persistence.
 * @throws If required Supabase environment variables are missing.
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

/**
 * Verifies a Supabase authentication token and enforces an email domain restriction.
 *
 * Checks if the provided token is valid and corresponds to a user with an email ending in `@med.cornell.edu`.
 *
 * @param token - The authentication token to verify, or null if not provided.
 * @returns An object containing the authenticated user (or null) and an error message (or null).
 */
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
    
    // Verify email domain
    if (data.user?.email && !data.user.email.endsWith('@med.cornell.edu')) {
      return { user: null, error: 'Unauthorized email domain' }
    }
    
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: 'Failed to verify token' }
  }
}

interface FormSubmission {
  formType: string
  patientName: string
  email?: string
  phone?: string
  data: Record<string, any>
  submittedAt: string
}

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  try {
    // Check authentication
    const authHeader = event.headers.authorization || event.headers.Authorization
    const token = authHeader?.replace('Bearer ', '')
    
    const { user, error: authError } = await verifyAuthToken(token || null)
    
    if (authError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      }
    }

    // Parse the form data
    const submission: FormSubmission = JSON.parse(event.body || '{}')
    
    // Validate required fields
    if (!submission.formType || !submission.patientName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['formType', 'patientName']
        }),
      }
    }

    // Add timestamp
    submission.submittedAt = new Date().toISOString()

    // Here you would typically:
    // 1. Save to database (e.g., Supabase, Airtable)
    // 2. Send confirmation email
    // 3. Create PDF
    // 4. Notify staff
    
    // For now, just log and return success
    console.log('Form submission received:', submission)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        submissionId: `SUB-${Date.now()}`,
        data: submission,
      }),
    }
  } catch (error) {
    console.error('Form submission error:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    }
  }
}