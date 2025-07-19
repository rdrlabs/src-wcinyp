'use client'

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import { isEmailAllowedToAuthenticate } from '@/lib/auth-validation'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { authSessionManager } from '@/lib/auth-session'
import { retryWithBackoff } from '@/lib/retry-utils'
import { sessionManager } from '@/lib/session-manager'
import { getAuthErrorMessage } from '@/lib/auth-errors'
import { logger } from '@/lib/logger'

// Authentication is now enabled with access request system
const AUTHENTICATION_DISABLED = false

/**
 * Authentication context type definition
 * @interface AuthContextType
 * @property {User | null} user - Current authenticated user object or null if not authenticated
 * @property {boolean} loading - Loading state for authentication operations
 * @property {string | null} error - Error message from last authentication operation
 * @property {Function} signInWithEmail - Initiate email magic link authentication
 * @property {Function} signOut - Sign out the current user and clear session
 * @property {Function} checkSession - Verify current session validity and refresh if needed
 * @property {string | null} pendingSessionToken - Token for cross-device authentication flow
 * @property {boolean} isPollingForAuth - Whether realtime auth status polling is active
 * @property {boolean} rememberMe - User preference for extended session duration
 * @property {Function} setRememberMe - Update remember me preference
 */
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

/**
 * Authentication Provider Component
 * Manages authentication state, session persistence, and cross-device authentication
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap with auth context
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 * 
 * @remarks
 * - Handles magic link authentication flow
 * - Supports cross-device authentication via session tokens
 * - Manages session persistence with configurable remember me option
 * - Implements realtime authentication status monitoring
 * - Automatically refreshes tokens and maintains session cookies
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(!AUTHENTICATION_DISABLED) // Skip loading if auth disabled
  const [error, setError] = useState<string | null>(null)
  const [pendingSessionToken, setPendingSessionToken] = useState<string | null>(null)
  const [isPollingForAuth, setIsPollingForAuth] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const pollingIntervalRef = useRef<NodeJS.Timeout | any>(null)

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
    const supabase = getSupabaseClient()
    if (!supabase) {
      setLoading(false)
      return
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
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
  }, [router])

  /**
   * Start realtime subscription for cross-device authentication status
   * Monitors pending_auth_sessions table for authentication completion on another device
   * 
   * @param {string} sessionToken - Unique session token for cross-device auth flow
   * @returns {void}
   * 
   * @remarks
   * - Creates Supabase realtime channel subscription
   * - Listens for authentication status updates
   * - Automatically signs in user when authentication is completed on another device
   * - Cleans up pending session after successful authentication
   */
  const startRealtimeAuth = useCallback((sessionToken: string) => {
    setIsPollingForAuth(true)
    
    const supabase = getSupabaseClient()
    if (!supabase) return
    
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
        async (payload: { new: { is_authenticated: boolean; email: string } }) => {
          const { is_authenticated, email } = payload.new
          
          if (is_authenticated && email) {
            // Stop listening
            channel.unsubscribe()
            setIsPollingForAuth(false)
            
            // Sign in the user on this device
            try {
              const supabase = getSupabaseClient()
              if (!supabase) return
              
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
              logger.error('Failed to complete authentication', { error: err, context: 'AuthContext' })
              setError(getAuthErrorMessage(err))
            }
          }
        }
      )
      .subscribe((status: 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR') => {
        if (status === 'SUBSCRIBED') {
          logger.info('Realtime subscription active for session', { sessionToken, context: 'AuthContext' })
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Realtime subscription error', { context: 'AuthContext' })
          setError(getAuthErrorMessage('network_error'))
          setIsPollingForAuth(false)
        }
      })
    
    // Store channel reference for cleanup
    pollingIntervalRef.current = channel
  }, [])
  
  /**
   * Stop realtime authentication subscription and cleanup resources
   * 
   * @returns {void}
   * 
   * @remarks
   * - Unsubscribes from Supabase realtime channel
   * - Clears polling interval if using fallback polling
   * - Resets polling state flag
   */
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

  /**
   * Check and validate current authentication session
   * Verifies user authorization and updates authentication state
   * 
   * @async
   * @returns {Promise<void>}
   * 
   * @remarks
   * - Retrieves current session from Supabase
   * - Validates user email against authorization rules
   * - Updates session cookies based on remember me preference
   * - Signs out unauthorized users automatically
   * - Implements retry logic for network resilience
   */
  const checkSession = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = getSupabaseClient()
      if (!supabase) {
        setLoading(false)
        return
      }
      
      const { data: { session }, error } = await retryWithBackoff<{
        data: { session: Session | null };
        error: Error | null;
      }>(
        () => supabase.auth.getSession(),
        { maxRetries: 2, initialDelay: 500 }
      )
      
      if (error) throw error
      
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
      setError(getAuthErrorMessage(err as Error))
      logger.error('Auth check error', { error: err, context: 'AuthContext' })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Initiate email magic link authentication with cross-device support
   * 
   * @async
   * @param {string} email - User's email address for authentication
   * @param {boolean} [rememberMeOption] - Whether to extend session duration (30 days vs 7 days)
   * @returns {Promise<void>}
   * @throws {Error} If email is not authorized or authentication fails
   * 
   * @remarks
   * - Validates email authorization before sending magic link
   * - Creates pending session for cross-device authentication
   * - Sends magic link with embedded session token
   * - Starts realtime monitoring for authentication completion
   * - Implements retry logic for email delivery resilience
   * 
   * @example
   * ```tsx
   * try {
   *   await signInWithEmail('user@example.com', true);
   *   // Show success message
   * } catch (error) {
   *   // Handle authentication error
   * }
   * ```
   */
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

      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Unable to initialize authentication')
      }
      
      // Send the magic link with the session token (with retry)
      const { error } = await retryWithBackoff<{ error: Error | null }>(
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
            logger.info(`Retrying magic link send (attempt ${attempt})`, { context: 'AuthContext' })
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

  /**
   * Sign out current user and cleanup authentication state
   * 
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If sign out operation fails
   * 
   * @remarks
   * - Stops any active realtime subscriptions
   * - Clears Supabase authentication session
   * - Removes session cookies and local storage data
   * - Redirects to login page after successful sign out
   * - Implements retry logic for sign out resilience
   */
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Stop realtime subscription if active
      stopRealtimeAuth()
      
      const supabase = getSupabaseClient()
      if (!supabase) {
        setLoading(false)
        return
      }
      
      const { error } = await retryWithBackoff<{ error: Error | null }>(
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
      logger.error('Sign out error', { error: err, context: 'AuthContext' })
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

/**
 * Custom hook to access authentication context
 * 
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, signInWithEmail, signOut } = useAuth();
 *   
 *   if (!user) {
 *     return <LoginForm onSubmit={signInWithEmail} />;
 *   }
 *   
 *   return <Dashboard user={user} onLogout={signOut} />;
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}