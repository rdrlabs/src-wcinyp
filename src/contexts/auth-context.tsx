'use client'

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import { isEmailAllowedToAuthenticate } from '@/lib/auth-validation'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { authSessionManager } from '@/lib/auth-session'
import { retryWithBackoff } from '@/lib/retry-utils'
import { sessionManager } from '@/lib/session-manager'
import { getAuthErrorMessage } from '@/lib/auth-errors'
import { logger } from '@/lib/logger'

// Authentication is now enabled with access request system
const AUTHENTICATION_DISABLED = false

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signInWithEmail: (email: string, rememberMe?: boolean) => Promise<void>
  signOut: () => Promise<void>
  checkSession: () => Promise<void>
  pendingSessionToken: string | null
  isPollingForAuth: boolean
  rememberMe: boolean
  setRememberMe: (remember: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(!AUTHENTICATION_DISABLED) // Skip loading if auth disabled
  const [error, setError] = useState<string | null>(null)
  const [pendingSessionToken, setPendingSessionToken] = useState<string | null>(null)
  const [isPollingForAuth, setIsPollingForAuth] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const pollingIntervalRef = useRef<NodeJS.Timeout | ReturnType<typeof supabase.channel> | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    // Skip all auth checks if authentication is disabled
    if (AUTHENTICATION_DISABLED) {
      setLoading(false)
      return
    }
    
    // Load remember me preference from localStorage
    const storedRememberMe = localStorage.getItem('auth_remember_me') === 'true'
    setRememberMe(storedRememberMe)
    
    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null)
          // Store session token in cookie for server-side verification
          if (session?.access_token && session?.user) {
            const cookieExpiry = rememberMe ? 30 : 7
            Cookies.set('sb-access-token', session.access_token, {
              expires: cookieExpiry,
              secure: true,
              sameSite: 'strict'
            })
            // Store remember me preference
            localStorage.setItem('auth_remember_me', rememberMe.toString())
            
            // Create session record
            const userAgent = navigator.userAgent
            const expiresIn = cookieExpiry * 24 * 60 * 60 * 1000 // Convert days to milliseconds
            sessionManager.createSession(
              session.user.id,
              session.access_token,
              undefined, // IP address will be handled server-side
              userAgent,
              expiresIn
            )
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          Cookies.remove('sb-access-token')
          router.push('/login')
        } else if (event === 'TOKEN_REFRESHED') {
          // Update cookie with new token
          if (session?.access_token) {
            const cookieExpiry = rememberMe ? 30 : 7
            Cookies.set('sb-access-token', session.access_token, {
              expires: cookieExpiry,
              secure: true,
              sameSite: 'strict'
            })
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      // Clean up polling if active
      if (pollingIntervalRef.current) {
        if ('unsubscribe' in pollingIntervalRef.current && typeof pollingIntervalRef.current.unsubscribe === 'function') {
          pollingIntervalRef.current.unsubscribe()
        } else {
          clearInterval(pollingIntervalRef.current as NodeJS.Timeout)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, supabase.auth])

  // Start realtime subscription for authentication status
  const startRealtimeAuth = useCallback((sessionToken: string) => {
    setIsPollingForAuth(true)
    
    // Create a realtime subscription to monitor authentication status
    const channel = supabase
      .channel(`auth-status-${sessionToken}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pending_auth_sessions',
          filter: `session_token=eq.${sessionToken}`
        },
        async (payload) => {
          const { is_authenticated, email } = payload.new as { is_authenticated: boolean; email: string }
          
          if (is_authenticated && email) {
            // Stop listening
            channel.unsubscribe()
            setIsPollingForAuth(false)
            
            // Sign in the user on this device
            try {
              const { error: signInError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                  shouldCreateUser: false,
                }
              })
              
              if (signInError) {
                throw signInError
              }
              
              // Clean up the pending session
              await authSessionManager.cleanupSession(sessionToken)
              
              // Clear the pending session token
              setPendingSessionToken(null)
              
              // The auth state change listener will handle the rest
            } catch (err) {
              logger.error('Failed to complete authentication', err, 'AuthContext')
              setError(getAuthErrorMessage(err))
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Realtime subscription active for session', { sessionToken }, 'AuthContext')
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Realtime subscription error', undefined, 'AuthContext')
          setError(getAuthErrorMessage('network_error'))
          setIsPollingForAuth(false)
        }
      })
    
    // Store channel reference for cleanup
    pollingIntervalRef.current = channel
  }, [supabase])
  
  // Stop realtime subscription
  const stopRealtimeAuth = useCallback(() => {
    if (pollingIntervalRef.current) {
      if ('unsubscribe' in pollingIntervalRef.current && typeof pollingIntervalRef.current.unsubscribe === 'function') {
        pollingIntervalRef.current.unsubscribe()
      } else {
        clearInterval(pollingIntervalRef.current as NodeJS.Timeout)
      }
      pollingIntervalRef.current = null
    }
    setIsPollingForAuth(false)
  }, [])

  const checkSession = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: { session } } = await retryWithBackoff(
        () => supabase.auth.getSession(),
        { maxRetries: 2, initialDelay: 500 }
      )
      
      if (session?.user) {
        // Verify email is allowed to authenticate
        const userEmail = session.user.email || ''
        const { allowed, reason } = await isEmailAllowedToAuthenticate(userEmail)
        
        if (!allowed) {
          await supabase.auth.signOut()
          setError(reason || 'Unauthorized email')
          setUser(null)
        } else {
          setUser(session.user)
          // Update cookie
          if (session.access_token) {
            const storedRememberMe = localStorage.getItem('auth_remember_me') === 'true'
            const cookieExpiry = storedRememberMe ? 30 : 7
            Cookies.set('sb-access-token', session.access_token, {
              expires: cookieExpiry,
              secure: true,
              sameSite: 'strict'
            })
          }
        }
      } else {
        setUser(null)
        Cookies.remove('sb-access-token')
      }
    } catch (err) {
      setError(getAuthErrorMessage(err))
      logger.error('Auth check error', err, 'AuthContext')
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, rememberMeOption?: boolean) => {
    try {
      setLoading(true)
      setError(null)

      // Validate email is allowed to authenticate
      const { allowed, reason } = await isEmailAllowedToAuthenticate(email)
      
      if (!allowed) {
        throw new Error(reason || 'Email not authorized')
      }

      // Create a pending auth session for cross-device flow
      const { sessionToken, error: sessionError } = await authSessionManager.createPendingSession(email)
      
      if (sessionError) {
        throw sessionError
      }

      // Store the session token and remember me preference
      setPendingSessionToken(sessionToken)
      if (rememberMeOption !== undefined) {
        setRememberMe(rememberMeOption)
      }

      // Send the magic link with the session token (with retry)
      const { error } = await retryWithBackoff(
        () => supabase.auth.signInWithOtp({
          email,
          options: {
            // Include session token in redirect URL for cross-device auth
            emailRedirectTo: `${window.location.origin}/auth/callback?session=${sessionToken}`,
          },
        }),
        { 
          maxRetries: 3, 
          initialDelay: 1000,
          onRetry: (error, attempt) => {
            logger.info(`Retrying magic link send (attempt ${attempt})`, undefined, 'AuthContext')
          }
        }
      )

      if (error) {
        throw error
      }

      // Start realtime subscription for authentication
      startRealtimeAuth(sessionToken)

      // Show success message
      setError(null)
    } catch (err) {
      const message = getAuthErrorMessage(err)
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Stop realtime subscription if active
      stopRealtimeAuth()
      
      const { error } = await retryWithBackoff(
        () => supabase.auth.signOut(),
        { maxRetries: 2, initialDelay: 500 }
      )
      
      if (error) {
        throw error
      }
      
      setUser(null)
      setPendingSessionToken(null)
      Cookies.remove('sb-access-token')
      localStorage.removeItem('auth_remember_me')
      router.push('/login')
    } catch (err) {
      const message = getAuthErrorMessage(err)
      setError(message)
      logger.error('Sign out error', err, 'AuthContext')
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithEmail,
    signOut,
    checkSession,
    pendingSessionToken,
    isPollingForAuth,
    rememberMe,
    setRememberMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}