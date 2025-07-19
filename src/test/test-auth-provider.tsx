import React from 'react'
import type { User } from '@supabase/supabase-js'

interface TestAuthProviderProps {
  children: React.ReactNode
  user?: User | null
  loading?: boolean
  error?: string | null
  signInWithEmail?: (email: string, rememberMe?: boolean) => Promise<void>
  signOut?: () => Promise<void>
  checkSession?: () => Promise<void>
  pendingSessionToken?: string | null
  isPollingForAuth?: boolean
  rememberMe?: boolean
  setRememberMe?: (remember: boolean) => void
}

// Mock the auth context directly
const mockAuthValue = {
  user: null as User | null,
  loading: false,
  error: null as string | null,
  signInWithEmail: async () => {},
  signOut: async () => {},
  checkSession: async () => {},
  pendingSessionToken: null as string | null,
  isPollingForAuth: false,
  rememberMe: false,
  setRememberMe: () => {},
}

/**
 * Test wrapper for components that use the AuthContext
 * Provides a controlled auth state for testing
 * Since AuthContext is not exported, we need to mock the entire AuthProvider
 */
export function TestAuthProvider({
  children,
  user = null,
  loading = false,
  error = null,
  signInWithEmail = async () => {},
  signOut = async () => {},
  checkSession = async () => {},
  pendingSessionToken = null,
  isPollingForAuth = false,
  rememberMe = false,
  setRememberMe = () => {},
}: TestAuthProviderProps) {
  // Create a mock context that matches the AuthContext interface
  const AuthContext = React.createContext({
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
  })

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}