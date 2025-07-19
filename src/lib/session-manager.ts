import { getSupabaseClient } from './supabase-client'
import { logger } from './logger-v2'
import { authConfig } from '@/config/app.config'
import type { UserAgentInfo } from '@/types/auth'
import { getGeolocation, type GeolocationData } from './geolocation'

export interface UserSession {
  id: string
  user_id: string
  device_name?: string
  device_type?: string
  browser_name?: string
  os_name?: string
  ip_address?: string
  location_city?: string
  location_region?: string
  location_country?: string
  location_isp?: string
  is_active: boolean
  created_at: string
  last_activity: string
  expires_at: string
}

export class SessionManager {
  private supabase: ReturnType<typeof getSupabaseClient> | null = null
  
  private getSupabase() {
    if (!this.supabase) {
      this.supabase = getSupabaseClient()
    }
    return this.supabase
  }

  /**
   * Hash a token for secure storage using Web Crypto API
   */
  private async hashToken(token: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  /**
   * Parse user agent to extract device information
   */
  private parseUserAgent(userAgent: string): {
    device_name?: string
    device_type?: string
    browser_name?: string
    os_name?: string
  } {
    // Simple parser - in production, use a library like ua-parser-js
    const info: UserAgentInfo = {}

    // Detect device type
    if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
      info.device_type = 'mobile'
      if (/iPhone|iPad/i.test(userAgent)) {
        info.device_name = /iPad/i.test(userAgent) ? 'iPad' : 'iPhone'
        info.os_name = 'iOS'
      } else if (/Android/i.test(userAgent)) {
        info.device_name = 'Android Device'
        info.os_name = 'Android'
      }
    } else {
      info.device_type = 'desktop'
      if (/Windows/i.test(userAgent)) {
        info.os_name = 'Windows'
      } else if (/Mac/i.test(userAgent)) {
        info.os_name = 'macOS'
      } else if (/Linux/i.test(userAgent)) {
        info.os_name = 'Linux'
      }
    }

    // Detect browser
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
      info.browser_name = 'Chrome'
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      info.browser_name = 'Safari'
    } else if (/Firefox/i.test(userAgent)) {
      info.browser_name = 'Firefox'
    } else if (/Edg/i.test(userAgent)) {
      info.browser_name = 'Edge'
    }

    return info
  }

  /**
   * Create a new session record
   */
  async createSession(
    userId: string,
    token: string,
    ipAddress?: string,
    userAgent?: string,
    expiresIn?: number
  ): Promise<{ sessionId: string | null; error: Error | null }> {
    try {
      const tokenHash = await this.hashToken(token)
      // Use configured default session duration if not specified
      const duration = expiresIn || (authConfig.sessionDuration.default * 24 * 60 * 60 * 1000)
      const expiresAt = new Date(Date.now() + duration).toISOString()
      const deviceInfo = userAgent ? this.parseUserAgent(userAgent) : {}
      
      // Get geolocation data if IP address is provided
      let geoData: GeolocationData | null = null
      if (ipAddress) {
        geoData = await getGeolocation(ipAddress)
      }

      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          token_hash: tokenHash,
          ip_address: ipAddress,
          user_agent: userAgent,
          expires_at: expiresAt,
          ...deviceInfo,
          ...(geoData && geoData.status === 'success' ? {
            location_city: geoData.city,
            location_region: geoData.regionName,
            location_country: geoData.country,
            location_isp: geoData.isp || geoData.org
          } : {}),
        })
        .select('id')
        .single()

      if (error) throw error

      return { sessionId: data.id, error: null }
    } catch (error) {
      logger.error('Failed to create session', { error, context: 'SessionManager' })
      return { sessionId: null, error: error as Error }
    }
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<UserSession[]> {
    try {
      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('last_activity', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      logger.error('Failed to get user sessions', { error, context: 'SessionManager' })
      return []
    }
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const supabase = this.getSupabase()
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId)
        .eq('user_id', userId)

      if (error) throw error

      return true
    } catch (error) {
      logger.error('Failed to revoke session', { error, context: 'SessionManager' })
      return false
    }
  }

  /**
   * Revoke all sessions for a user (except current)
   */
  async revokeAllSessions(userId: string, exceptTokenHash?: string): Promise<boolean> {
    try {
      const supabase = this.getSupabase()
      let query = supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true)

      if (exceptTokenHash) {
        query = query.neq('token_hash', exceptTokenHash)
      }

      const { error } = await query

      if (error) throw error

      return true
    } catch (error) {
      logger.error('Failed to revoke all sessions', { error, context: 'SessionManager' })
      return false
    }
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(token: string): Promise<void> {
    try {
      const tokenHash = await this.hashToken(token)
      
      const supabase = this.getSupabase()
      const { error } = await supabase.rpc('update_session_activity', {
        p_token_hash: tokenHash,
      })

      if (error) throw error
    } catch (error) {
      logger.error('Failed to update session activity', { error, context: 'SessionManager' })
    }
  }

  /**
   * Verify if a session is valid and active
   */
  async verifySession(token: string): Promise<boolean> {
    try {
      const tokenHash = await this.hashToken(token)

      const supabase = this.getSupabase()
      const { data, error } = await supabase
        .from('user_sessions')
        .select('id, expires_at')
        .eq('token_hash', tokenHash)
        .eq('is_active', true)
        .single()

      if (error || !data) return false

      // Check if session is expired
      return new Date(data.expires_at) > new Date()
    } catch (error) {
      logger.error('Failed to verify session', { error, context: 'SessionManager' })
      return false
    }
  }
}

// Export singleton instance with lazy initialization
let _sessionManager: SessionManager | null = null

export function getSessionManager(): SessionManager {
  if (!_sessionManager) {
    _sessionManager = new SessionManager()
  }
  return _sessionManager
}

export const sessionManager = {
  createSession: (userId: string, token: string, ipAddress?: string, userAgent?: string, expiresIn?: number) => 
    getSessionManager().createSession(userId, token, ipAddress, userAgent, expiresIn),
  getUserSessions: (userId: string) => 
    getSessionManager().getUserSessions(userId),
  revokeSession: (sessionId: string, userId: string) => 
    getSessionManager().revokeSession(sessionId, userId),
  revokeAllSessions: (userId: string, exceptTokenHash?: string) => 
    getSessionManager().revokeAllSessions(userId, exceptTokenHash),
  updateSessionActivity: (token: string) => 
    getSessionManager().updateSessionActivity(token),
  verifySession: (token: string) => 
    getSessionManager().verifySession(token),
}