import { getSupabaseClient } from './supabase-client'
import { retryWithBackoff } from './retry-utils'
import { logger } from './logger-v2'
import { authConfig } from '@/config/app.config'

/**
 * Manages cross-device authentication sessions
 * Handles creation, validation, and cleanup of pending authentication sessions
 * 
 * @class AuthSessionManager
 * 
 * @remarks
 * This class implements a secure cross-device authentication flow:
 * 1. User initiates login on Device A
 * 2. Pending session is created with unique token
 * 3. Magic link is sent with embedded session token
 * 4. User clicks link on Device B
 * 5. Session is marked as authenticated
 * 6. Device A detects authentication and completes login
 */
export class AuthSessionManager {
  private supabase: ReturnType<typeof getSupabaseClient> | null = null
  
  /**
   * Get or initialize Supabase client instance
   * Uses lazy initialization pattern for efficiency
   * 
   * @private
   * @returns {ReturnType<typeof getSupabaseClient> | null} Supabase client instance
   */
  private getSupabase() {
    if (!this.supabase) {
      this.supabase = getSupabaseClient()
    }
    return this.supabase
  }
  
  /**
   * Create a new pending auth session for cross-device authentication
   * 
   * @async
   * @param {string} email - User's email address for authentication
   * @returns {Promise<{sessionToken: string; error: Error | null}>} Session token and error state
   * 
   * @remarks
   * - Generates cryptographically secure session token using crypto.randomUUID()
   * - Creates device fingerprint for additional security
   * - Session expires after configured minutes for security
   * - Implements retry logic for database resilience
   * 
   * @example
   * ```typescript
   * const { sessionToken, error } = await authSessionManager.createPendingSession('user@example.com');
   * if (error) {
   *   console.error('Failed to create session:', error);
   * } else {
   *   // Use sessionToken in magic link URL
   * }
   * ```
   */
  async createPendingSession(email: string): Promise<{ sessionToken: string; error: Error | null }> {
    try {
      // Generate secure session token using crypto.randomUUID()
      const sessionToken = crypto.randomUUID()
      
      // Generate device fingerprint
      const deviceFingerprint = await this.generateDeviceFingerprint()
      
      // Session expires based on configuration
      const expiresAt = new Date(Date.now() + authConfig.magicLink.expiryMinutes * 60 * 1000).toISOString()
      
      const supabase = this.getSupabase()
      if (!supabase) {
        throw new Error('Unable to initialize authentication')
      }
      
      const { error } = await retryWithBackoff(
        async () => {
          return await supabase
            .from('pending_auth_sessions')
            .insert({
              session_token: sessionToken,
              email,
              device_info: navigator.userAgent,
              device_fingerprint: deviceFingerprint,
              expires_at: expiresAt,
            })
        },
        { maxRetries: 2, initialDelay: 500 }
      )
      
      if (error) throw error
      
      return { sessionToken, error: null }
    } catch (error) {
      logger.error('Failed to create pending session', { error, context: 'AuthSession' })
      return { sessionToken: '', error: error as Error }
    }
  }
  
  /**
   * Check if a pending session has been authenticated
   * Used by the initiating device to poll for authentication completion
   * 
   * @async
   * @param {string} sessionToken - Unique session token to check
   * @returns {Promise<{isAuthenticated: boolean; email: string | null; error: Error | null}>} Authentication status
   * 
   * @remarks
   * - Verifies session exists and hasn't expired
   * - Returns authentication status and associated email
   * - Implements retry logic for network resilience
   * - Automatically handles expired sessions
   * 
   * @example
   * ```typescript
   * const { isAuthenticated, email, error } = await authSessionManager.checkSessionStatus(token);
   * if (isAuthenticated && email) {
   *   // Complete login on this device
   * }
   * ```
   */
  async checkSessionStatus(sessionToken: string): Promise<{ 
    isAuthenticated: boolean
    email: string | null
    error: Error | null 
  }> {
    try {
      const supabase = this.getSupabase()
      if (!supabase) {
        throw new Error('Unable to initialize authentication')
      }
      
      const { data, error } = await retryWithBackoff(
        async () => {
          return await supabase
            .from('pending_auth_sessions')
            .select('is_authenticated, email, expires_at')
            .eq('session_token', sessionToken)
            .single()
        },
        { maxRetries: 2, initialDelay: 500 }
      )
      
      if (error) throw error
      
      // Check if session has expired
      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Session has expired')
      }
      
      return { 
        isAuthenticated: data.is_authenticated, 
        email: data.email,
        error: null 
      }
    } catch (error) {
      return { 
        isAuthenticated: false, 
        email: null,
        error: error as Error 
      }
    }
  }
  
  /**
   * Mark a session as authenticated (called from the device that clicked the magic link)
   * 
   * @async
   * @param {string} sessionToken - Session token from magic link URL
   * @returns {Promise<{success: boolean; error: Error | null}>} Operation result
   * 
   * @remarks
   * - Updates pending session to authenticated state
   * - Records authentication timestamp
   * - Prevents re-authentication of already authenticated sessions
   * - Triggers realtime update for cross-device synchronization
   * 
   * @example
   * ```typescript
   * // In auth callback handler
   * const sessionToken = new URLSearchParams(window.location.search).get('session');
   * if (sessionToken) {
   *   const { success, error } = await authSessionManager.authenticateSession(sessionToken);
   *   if (success) {
   *     // Session authenticated, original device will complete login
   *   }
   * }
   * ```
   */
  async authenticateSession(sessionToken: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const supabase = this.getSupabase()
      if (!supabase) {
        throw new Error('Unable to initialize authentication')
      }
      
      const { error } = await supabase
        .from('pending_auth_sessions')
        .update({ 
          is_authenticated: true,
          authenticated_at: new Date().toISOString()
        })
        .eq('session_token', sessionToken)
        .eq('is_authenticated', false) // Prevent re-authentication
      
      if (error) throw error
      
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: error as Error }
    }
  }
  
  /**
   * Clean up a pending session after successful authentication
   * Removes session data to prevent replay attacks
   * 
   * @async
   * @param {string} sessionToken - Session token to clean up
   * @returns {Promise<void>}
   * 
   * @remarks
   * - Should be called after successful authentication on initiating device
   * - Prevents session token reuse
   * - Errors are logged but not thrown (best-effort cleanup)
   * 
   * @example
   * ```typescript
   * // After successful authentication
   * await authSessionManager.cleanupSession(sessionToken);
   * ```
   */
  async cleanupSession(sessionToken: string): Promise<void> {
    try {
      const supabase = this.getSupabase()
      if (!supabase) {
        logger.error('Unable to initialize authentication for cleanup', { context: 'AuthSessionManager' })
        return
      }
      
      await supabase
        .from('pending_auth_sessions')
        .delete()
        .eq('session_token', sessionToken)
    } catch (error) {
      logger.error('Failed to cleanup session', { error, context: 'AuthSession' })
    }
  }
  
  /**
   * Generate a device fingerprint for additional security
   * Creates a unique identifier based on device characteristics
   * 
   * @private
   * @async
   * @returns {Promise<string>} Device fingerprint hash
   * 
   * @remarks
   * - Combines multiple device attributes for uniqueness
   * - Includes random UUID for additional entropy
   * - Uses simple hash function to create compact identifier
   * - Not meant for cryptographic security, only device identification
   */
  private async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      // Use crypto.randomUUID() for better entropy
      crypto.randomUUID()
    ]
    
    const fingerprint = components.join('|')
    
    // Simple hash function for the fingerprint
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36)
  }
}

/**
 * Singleton instance management for AuthSessionManager
 * @private
 */
let _authSessionManager: AuthSessionManager | null = null

/**
 * Get or create AuthSessionManager singleton instance
 * Ensures only one instance exists throughout the application
 * 
 * @returns {AuthSessionManager} Singleton instance
 * 
 * @example
 * ```typescript
 * const manager = getAuthSessionManager();
 * await manager.createPendingSession(email);
 * ```
 */
export function getAuthSessionManager(): AuthSessionManager {
  if (!_authSessionManager) {
    _authSessionManager = new AuthSessionManager()
  }
  return _authSessionManager
}

/**
 * Convenient API for auth session management
 * Provides a simple interface to AuthSessionManager methods
 * 
 * @namespace authSessionManager
 * 
 * @example
 * ```typescript
 * import { authSessionManager } from '@/lib/auth-session';
 * 
 * // Create pending session
 * const { sessionToken } = await authSessionManager.createPendingSession(email);
 * 
 * // Check status
 * const { isAuthenticated } = await authSessionManager.checkSessionStatus(sessionToken);
 * 
 * // Authenticate (on magic link device)
 * await authSessionManager.authenticateSession(sessionToken);
 * 
 * // Cleanup
 * await authSessionManager.cleanupSession(sessionToken);
 * ```
 */
export const authSessionManager = {
  createPendingSession: (email: string) => getAuthSessionManager().createPendingSession(email),
  checkSessionStatus: (sessionToken: string) => getAuthSessionManager().checkSessionStatus(sessionToken),
  authenticateSession: (sessionToken: string) => getAuthSessionManager().authenticateSession(sessionToken),
  cleanupSession: (sessionToken: string) => getAuthSessionManager().cleanupSession(sessionToken),
}