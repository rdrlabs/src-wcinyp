import { getSupabaseClient } from './supabase-client'
import { logger } from './logger'
import type { UserAgentInfo } from '@/types/auth'

export interface UserSession {
  id: string
  user_id: string
  device_name?: string
  device_type?: string
  browser_name?: string
  os_name?: string
  ip_address?: string
  is_active: boolean
  created_at: string
  last_activity: string
  expires_at: string
}

export class SessionManager {
  private supabase = getSupabaseClient()

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
    expiresIn: number = 7 * 24 * 60 * 60 * 1000 // 7 days default
  ): Promise<{ sessionId: string | null; error: Error | null }> {
    try {
      const tokenHash = await this.hashToken(token)
      const expiresAt = new Date(Date.now() + expiresIn).toISOString()
      const deviceInfo = userAgent ? this.parseUserAgent(userAgent) : {}

      const { data, error } = await this.supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          token_hash: tokenHash,
          ip_address: ipAddress,
          user_agent: userAgent,
          expires_at: expiresAt,
          ...deviceInfo,
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
      const { data, error } = await this.supabase
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
      const { error } = await this.supabase
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
      let query = this.supabase
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
      
      const { error } = await this.supabase.rpc('update_session_activity', {
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

      const { data, error } = await this.supabase
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

// Export singleton instance
export const sessionManager = new SessionManager()