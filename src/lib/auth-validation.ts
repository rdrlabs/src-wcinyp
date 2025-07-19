import { getSupabaseClient } from './supabase-client'
import { logger } from './logger-v2'

/**
 * Validate Cornell Weill ID (CWID) format
 * 
 * @param {string} cwid - The CWID to validate
 * @returns {boolean} True if CWID matches expected format (3 letters + 4 numbers)
 * 
 * @remarks
 * - Case insensitive validation
 * - Expected format: ABC1234 (3 letters followed by 4 digits)
 * - Used for automatic authorization of Cornell Medical emails
 * 
 * @example
 * ```typescript
 * isValidCWIDFormat('abc1234'); // true
 * isValidCWIDFormat('ab12345'); // false (wrong format)
 * isValidCWIDFormat('abcd123'); // false (too many letters)
 * ```
 */
export function isValidCWIDFormat(cwid: string): boolean {
  const cwidRegex = /^[a-zA-Z]{3}\d{4}$/
  return cwidRegex.test(cwid)
}

/**
 * Extract domain from email address
 * 
 * @param {string} email - Email address to parse
 * @returns {string} Domain portion of email (lowercase) or empty string if invalid
 * 
 * @remarks
 * - Returns lowercase domain for case-insensitive comparison
 * - Handles edge cases like missing @ symbol
 * - Used for domain-based authorization checks
 * 
 * @example
 * ```typescript
 * getEmailDomain('user@example.com'); // 'example.com'
 * getEmailDomain('USER@EXAMPLE.COM'); // 'example.com'
 * getEmailDomain('invalid-email'); // ''
 * ```
 */
export function getEmailDomain(email: string): string {
  return email.toLowerCase().split('@')[1] || ''
}

/**
 * Check if email is allowed to authenticate based on authorization rules
 * 
 * @async
 * @param {string} email - Email address to validate
 * @returns {Promise<{allowed: boolean; reason?: string; requiresInvitationCode?: boolean}>} Authorization result
 * 
 * @remarks
 * Authorization hierarchy:
 * 1. Cornell Medical emails with valid CWID format (auto-approved)
 * 2. Emails from approved domains
 * 3. Emails with approved access requests
 * 4. Emails with valid invitation codes (requires code entry)
 * 
 * @example
 * ```typescript
 * const { allowed, reason, requiresInvitationCode } = await isEmailAllowedToAuthenticate('user@med.cornell.edu');
 * if (allowed) {
 *   if (requiresInvitationCode) {
 *     // Prompt user for invitation code
 *   } else {
 *     // Proceed with authentication
 *   }
 * } else {
 *   // Show error: reason
 * }
 * ```
 */
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

/**
 * Validate and consume an invitation code for authentication
 * 
 * @async
 * @param {string} code - Invitation code to validate
 * @param {string} email - Email address using the code
 * @returns {Promise<{success: boolean; error?: string}>} Validation result
 * 
 * @remarks
 * - Calls Supabase RPC function to atomically validate and use code
 * - Prevents code reuse by incrementing use count
 * - Validates code expiration and max uses
 * - Email is normalized to lowercase
 * 
 * @example
 * ```typescript
 * const { success, error } = await validateAndUseInvitationCode('ABC123', 'user@example.com');
 * if (success) {
 *   // Code valid, proceed with authentication
 * } else {
 *   // Show error message
 *   console.error(error);
 * }
 * ```
 */
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

/**
 * Check if user has admin privileges via server-side validation
 * 
 * @async
 * @param {string} email - User's email address
 * @param {string} userId - User's unique identifier
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 * 
 * @remarks
 * - Makes request to Netlify function for secure server-side validation
 * - Admin emails are stored in database, not in client code
 * - Returns false on any error (fail-safe approach)
 * - Logs errors for debugging but doesn't throw
 * 
 * @security
 * Admin status must never be determined client-side
 * 
 * @example
 * ```typescript
 * const isAdmin = await checkIsAdmin('admin@example.com', 'user-uuid');
 * if (isAdmin) {
 *   // Show admin features
 * }
 * ```
 */
export async function checkIsAdmin(email: string, userId: string): Promise<boolean> {
  try {
    const response = await fetch('/.netlify/functions/check-admin-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userId }),
    });

    if (!response.ok) {
      logger.error('Failed to check admin status', { status: response.status }, 'AuthValidation');
      return false;
    }

    const { isAdmin } = await response.json();
    return isAdmin;
  } catch (error) {
    logger.error('Error checking admin status', { error }, 'AuthValidation');
    return false;
  }
}

/**
 * Get user's role from profile with admin validation
 * 
 * @async
 * @param {string} userId - User's unique identifier
 * @returns {Promise<string>} User role ('admin', 'user', etc.) defaults to 'user'
 * 
 * @remarks
 * - Fetches role from user profile
 * - Validates admin role against server-side authorization
 * - Downgrades unauthorized admin roles to 'user' for security
 * - Logs security warnings for unauthorized admin attempts
 * 
 * @security
 * Admin roles are always validated server-side to prevent privilege escalation
 * 
 * @example
 * ```typescript
 * const role = await getUserRole('user-uuid');
 * switch(role) {
 *   case 'admin':
 *     // Verified admin user
 *     break;
 *   case 'user':
 *   default:
 *     // Regular user
 * }
 * ```
 */
export async function getUserRole(userId: string): Promise<string> {
  const supabase = getSupabaseClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', userId)
    .single()

  // Server-side validation for admin role
  if (profile?.role === 'admin' && profile?.email) {
    const isValidAdmin = await checkIsAdmin(profile.email, userId);
    if (!isValidAdmin) {
      logger.securityWarn(`User ${profile.email} has admin role but is not authorized`, undefined, 'Lib.auth-validation');
      return 'user';
    }
  }

  return profile?.role || 'user'
}

/**
 * Check if email belongs to an admin user
 * 
 * @async
 * @param {string} email - Email address to check
 * @param {string} userId - User's unique identifier
 * @returns {Promise<boolean>} True if email is admin, false otherwise
 * 
 * @remarks
 * - Wrapper around checkIsAdmin for consistency
 * - Always uses server-side validation
 * - Safe to use in client code as it doesn't expose admin list
 * 
 * @example
 * ```typescript
 * const isAdmin = await isAdminEmail('user@example.com', userId);
 * ```
 */
export async function isAdminEmail(email: string, userId: string): Promise<boolean> {
  return checkIsAdmin(email, userId);
}

/**
 * @deprecated Use isAdminEmail() instead. Will be removed in v2.0.0
 * 
 * Check if email is hardcoded admin (DEPRECATED)
 * 
 * @param {string} email - Email to check
 * @returns {boolean} Always returns false to force migration
 * 
 * @remarks
 * - This function previously checked against hardcoded admin emails
 * - Now always returns false to prevent security vulnerabilities
 * - Logs deprecation warning when called
 * - Migrate to isAdminEmail() for server-side validation
 */
export function isHardcodedAdmin(email: string): boolean {
  console.warn('isHardcodedAdmin is deprecated. Use isAdminEmail() instead.');
  return false; // Always return false to force migration to server-side check
}

/**
 * @deprecated Admin emails are now managed server-side. Will be removed in v2.0.0
 * 
 * Get hardcoded admin email (DEPRECATED)
 * 
 * @returns {string} Always returns empty string
 * 
 * @remarks
 * - Previously returned hardcoded admin email
 * - Now returns empty string to force migration
 * - Admin emails should never be exposed in client code
 * - Use server-side admin configuration instead
 */
export function getHardcodedAdminEmail(): string {
  console.warn('getHardcodedAdminEmail is deprecated. Admin emails are now managed server-side.');
  return ''; // Return empty string to force migration
}