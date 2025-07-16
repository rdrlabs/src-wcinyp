import { getSupabaseClient } from './supabase-client'
import { logger } from './logger'

// Helper function to validate CWID format (3 letters + 4 numbers)
export function isValidCWIDFormat(cwid: string): boolean {
  const cwidRegex = /^[a-zA-Z]{3}\d{4}$/
  return cwidRegex.test(cwid)
}

// Helper function to extract domain from email
export function getEmailDomain(email: string): string {
  return email.toLowerCase().split('@')[1] || ''
}

// Helper function to check if email is allowed to authenticate
export async function isEmailAllowedToAuthenticate(email: string): Promise<{
  allowed: boolean
  reason?: string
  requiresInvitationCode?: boolean
}> {
  const supabase = getSupabaseClient()
  const emailLower = email.toLowerCase()
  const domain = getEmailDomain(emailLower)

  // First check if it's a Cornell email with valid CWID format
  if (domain === 'med.cornell.edu') {
    const cwid = emailLower.split('@')[0]
    if (isValidCWIDFormat(cwid)) {
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

// Helper function to validate and use an invitation code
export async function validateAndUseInvitationCode(
  code: string, 
  email: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  
  try {
    // Call the database function to use the invitation code
    const { data, error } = await supabase
      .rpc('use_invitation_code', {
        code_value: code,
        user_email: email.toLowerCase()
      })

    if (error) {
      logger.error('Error using invitation code', { error, context: 'AuthValidation' })
      return { success: false, error: 'Invalid or expired invitation code' }
    }

    return { success: data === true }
  } catch (err) {
    logger.error('Error validating invitation code', { error: err, context: 'AuthValidation' })
    return { success: false, error: 'Failed to validate invitation code' }
  }
}

// Helper function to get user's role
// HARDCODED: Only rco4001@med.cornell.edu can be admin
export async function getUserRole(userId: string): Promise<string> {
  const supabase = getSupabaseClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', userId)
    .single()

  // SECURITY: Double-check - only rco4001@med.cornell.edu can be admin
  // Even if someone somehow modifies the database, this ensures only the
  // hardcoded admin email can have admin privileges
  if (profile?.role === 'admin' && profile?.email !== 'rco4001@med.cornell.edu') {
    logger.securityWarn(`User ${profile.email} has admin role but is not the authorized admin`);
    return 'user';
  }

  return profile?.role || 'user'
}

// Helper function to check if an email is the hardcoded admin
// HARDCODED: Only rco4001@med.cornell.edu can be admin
export function isHardcodedAdmin(email: string): boolean {
  return email.toLowerCase() === 'rco4001@med.cornell.edu'
}

// Get the hardcoded admin email (for display purposes)
export function getHardcodedAdminEmail(): string {
  return 'rco4001@med.cornell.edu'
}