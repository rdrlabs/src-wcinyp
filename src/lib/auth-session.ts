import { getSupabaseClient } from './supabase-client'
import { retryWithBackoff } from './retry-utils'
import { logger } from './logger'

export class AuthSessionManager {
  private supabase = getSupabaseClient()
  
  /**
   * Create a new pending auth session for cross-device authentication
   */
  async createPendingSession(email: string): Promise<{ sessionToken: string; error: Error | null }> {
    try {
      // Generate secure session token using crypto.randomUUID()
      const sessionToken = crypto.randomUUID()
      
      // Generate device fingerprint
      const deviceFingerprint = await this.generateDeviceFingerprint()
      
      // Session expires in 15 minutes
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
      
      const { error } = await retryWithBackoff(
        async () => {
          return await this.supabase
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
      logger.error('Failed to create pending session', error, 'AuthSession')
      return { sessionToken: '', error: error as Error }
    }
  }
  
  /**
   * Check if a pending session has been authenticated
   */
  async checkSessionStatus(sessionToken: string): Promise<{ 
    isAuthenticated: boolean
    email: string | null
    error: Error | null 
  }> {
    try {
      const { data, error } = await retryWithBackoff(
        async () => {
          return await this.supabase
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
   */
  async authenticateSession(sessionToken: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await this.supabase
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
   */
  async cleanupSession(sessionToken: string): Promise<void> {
    try {
      await this.supabase
        .from('pending_auth_sessions')
        .delete()
        .eq('session_token', sessionToken)
    } catch (error) {
      logger.error('Failed to cleanup session', error, 'AuthSession')
    }
  }
  
  /**
   * Generate a device fingerprint for additional security
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

// Export singleton instance
export const authSessionManager = new AuthSessionManager()