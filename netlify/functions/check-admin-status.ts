import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { createLogger } from './utils/logger';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface RequestBody {
  email: string;
  userId: string;
}

interface AdminConfig {
  admin_emails: string[];
}

const logger = createLogger('check-admin-status');

export const handler: Handler = async (event) => {
  const log = logger.withRequest(event);
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      } as Record<string, string>,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Validate request body
  let requestBody: RequestBody;
  try {
    requestBody = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      } as Record<string, string>,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const { email, userId } = requestBody;

  // Validate required fields
  if (!email || !userId) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      } as Record<string, string>,
      body: JSON.stringify({ error: 'Missing required fields: email and userId' }),
    };
  }

  try {
    // Get admin emails from configuration
    const { data: config, error: configError } = await supabase
      .from('admin_configuration')
      .select('admin_emails')
      .single();

    if (configError) {
      log.error('Error fetching admin configuration', { error: configError });
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Failed to fetch admin configuration' }),
      };
    }

    // Check if email is in admin list (case-insensitive)
    const adminEmails = (config as AdminConfig)?.admin_emails || [];
    const isAdmin = adminEmails.some(
      adminEmail => adminEmail.toLowerCase() === email.toLowerCase()
    );

    // If user is admin, update their profile role
    if (isAdmin) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId)
        .eq('email', email.toLowerCase());

      if (updateError) {
        log.error('Error updating user role', { error: updateError, userId });
        // Don't fail the request, just log the error
      }
    }

    // Return admin status
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      } as Record<string, string>,
      body: JSON.stringify({ 
        isAdmin,
        // Include timestamp for debugging
        timestamp: new Date().toISOString()
      }),
    };

  } catch (error) {
    log.error('Unexpected error in check-admin-status', { error });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      } as Record<string, string>,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};