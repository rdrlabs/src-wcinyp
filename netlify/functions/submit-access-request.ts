import type { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from './rate-limiter'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown'
  
  // Apply rate limiting - 5 requests per hour per IP
  const rateLimit = await checkRateLimit(`access_request:${clientIp}`)
  
  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
        'Retry-After': String(rateLimit.retryAfter || 3600),
      } as Record<string, string>,
      body: JSON.stringify({ 
        error: 'Too many access requests. Please try again later.',
        retryAfter: rateLimit.retryAfter || 3600
      }),
    }
  }

  try {
    const { email, fullName, organization, role, reason } = JSON.parse(event.body || '{}')
    
    // Validate required fields
    if (!email || !fullName || !organization || !role || !reason) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
      }
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from('access_requests')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single()

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return {
          statusCode: 409,
          body: JSON.stringify({ error: 'An access request for this email is already pending.' }),
        }
      } else if (existingRequest.status === 'approved') {
        return {
          statusCode: 409,
          body: JSON.stringify({ error: 'This email has already been approved for access.' }),
        }
      }
    }

    // Insert new access request
    const { data, error } = await supabase
      .from('access_requests')
      .insert([{
        email: email.toLowerCase(),
        full_name: fullName,
        organization,
        role,
        reason,
        ip_address: clientIp,
        user_agent: event.headers['user-agent'] || 'unknown'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error inserting access request:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to submit access request' }),
      }
    }

    // TODO: Send email notification to admins about new request
    // This would be implemented when email service is configured

    return {
      statusCode: 200,
      headers: {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
      } as Record<string, string>,
      body: JSON.stringify({ 
        success: true,
        message: 'Access request submitted successfully',
        requestId: data.id
      }),
    }
  } catch (error) {
    console.error('Error processing access request:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}