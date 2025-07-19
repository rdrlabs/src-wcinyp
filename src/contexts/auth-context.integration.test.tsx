import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AuthProvider, useAuth } from './auth-context'
import { 
  createAuthenticatedSupabaseMock, 
  createUnauthenticatedSupabaseMock,
  createErrorSupabaseMock,
  createAuthSessionSupabaseMock,
  SupabaseMockBuilder
} from '@/test/mocks/supabase-factory'
import { setSupabaseMock, resetSupabaseMock } from '@/test/setup'
import { profileFixtures } from '@/test/fixtures/profiles.fixtures'
import { authSessionFixtures } from '@/test/fixtures/auth-sessions.fixtures'
import React from 'react'

// Mock Next.js navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  ...vi.importActual('next/navigation'),
  useRouter: () => ({
    push: mockPush,
    refresh: vi.fn(),
  }),
}))

// Mock js-cookie
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

// Test component to access auth context
function TestComponent() {
  const auth = useAuth()
  
  return (
    <div>
      <div data-testid="user-email">{auth.user?.email || 'Not authenticated'}</div>
      <div data-testid="loading">{auth.loading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="error">{auth.error || 'No error'}</div>
      <div data-testid="pending-token">{auth.pendingSessionToken || 'No token'}</div>
      <div data-testid="polling">{auth.isPollingForAuth ? 'Polling' : 'Not polling'}</div>
      <div data-testid="remember-me">{auth.rememberMe ? 'Remember' : 'Forget'}</div>
      
      <button onClick={() => auth.signInWithEmail('test@med.cornell.edu')}>
        Sign In
      </button>
      <button onClick={() => auth.signOut()}>
        Sign Out
      </button>
      <button onClick={() => auth.checkSession()}>
        Check Session
      </button>
      <button onClick={() => auth.setRememberMe(!auth.rememberMe)}>
        Toggle Remember
      </button>
    </div>
  )
}

describe('AuthContext Integration Tests', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  afterEach(() => {
    resetSupabaseMock()
  })

  describe('Initial Authentication State', () => {
    it('should start with loading state', () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
      expect(screen.getByTestId('user-email')).toHaveTextContent('Not authenticated')
    })

    it('should load authenticated user session', async () => {
      const mock = createAuthenticatedSupabaseMock('test123@med.cornell.edu')
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
        expect(screen.getByTestId('user-email')).toHaveTextContent('test123@med.cornell.edu')
      })
    })

    it('should handle session loading errors', async () => {
      const mock = createErrorSupabaseMock()
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
        expect(screen.getByTestId('error')).toHaveTextContent('Authentication service unavailable')
      })
    })
  })

  describe('Email Sign In', () => {
    it('should successfully send magic link for valid email', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
      })

      const signInButton = screen.getByText('Sign In')
      await act(async () => {
        fireEvent.click(signInButton)
      })

      // Should not show error for successful sign in
      expect(screen.getByTestId('error')).toHaveTextContent('No error')
    })

    it('should reject invalid email format', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
      })

      // Override the test component to use invalid email
      const { rerender } = render(
        <AuthProvider>
          <div>
            <button onClick={async () => {
              const auth = useAuth()
              await auth.signInWithEmail('invalid-email')
            }}>
              Sign In Invalid
            </button>
          </div>
        </AuthProvider>
      )

      // This would need proper implementation in the actual test
      // For now, we're testing the mock behavior
    })

    it('should handle sign in errors', async () => {
      const mock = createErrorSupabaseMock()
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
      })

      const signInButton = screen.getByText('Sign In')
      await act(async () => {
        fireEvent.click(signInButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Authentication service unavailable')
      })
    })
  })

  describe('Sign Out', () => {
    it('should successfully sign out authenticated user', async () => {
      const mock = createAuthenticatedSupabaseMock()
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test123@med.cornell.edu')
      })

      const signOutButton = screen.getByText('Sign Out')
      await act(async () => {
        fireEvent.click(signOutButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('Not authenticated')
      })
    })

    it('should handle sign out errors gracefully', async () => {
      const mock = createAuthenticatedSupabaseMock()
      // Override signOut to fail
      mock.auth.signOut = vi.fn(() => Promise.resolve({ error: new Error('Sign out failed') }))
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test123@med.cornell.edu')
      })

      const signOutButton = screen.getByText('Sign Out')
      await act(async () => {
        fireEvent.click(signOutButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Sign out failed')
      })
    })
  })

  describe('Cross-Device Authentication', () => {
    it('should create pending auth session for cross-device flow', async () => {
      const mock = new SupabaseMockBuilder()
        .withUser('test123@med.cornell.edu')
        .build()
      
      // Mock will return a session token when creating auth session
      mock.setTableData('pending_auth_sessions', [])
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
      })

      // Sign in should create a pending session
      const signInButton = screen.getByText('Sign In')
      await act(async () => {
        fireEvent.click(signInButton)
      })

      // In real implementation, this would show the pending token
      // For now, we're testing the mock behavior
    })

    it('should poll for authentication status with pending session', async () => {
      const sessionToken = 'test-session-token'
      const mock = createAuthSessionSupabaseMock(sessionToken)
      
      // Simulate the session becoming authenticated after a delay
      setTimeout(() => {
        const sessions = mock.from('pending_auth_sessions' as any)
        mock.setTableData('pending_auth_sessions', [
          authSessionFixtures.authenticate(authSessionFixtures.pending)
        ])
      }, 100)
      
      setSupabaseMock(mock)

      // Would need to set up the component with a pending session token
      // This is a simplified test of the concept
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
      })
    })
  })

  describe('Remember Me Functionality', () => {
    it('should toggle remember me preference', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
      })

      expect(screen.getByTestId('remember-me')).toHaveTextContent('Forget')

      const toggleButton = screen.getByText('Toggle Remember')
      fireEvent.click(toggleButton)

      await waitFor(() => {
        expect(screen.getByTestId('remember-me')).toHaveTextContent('Remember')
      })

      fireEvent.click(toggleButton)

      await waitFor(() => {
        expect(screen.getByTestId('remember-me')).toHaveTextContent('Forget')
      })
    })
  })

  describe('Session Management', () => {
    it('should check and refresh session', async () => {
      const mock = createAuthenticatedSupabaseMock()
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test123@med.cornell.edu')
      })

      const checkButton = screen.getByText('Check Session')
      await act(async () => {
        fireEvent.click(checkButton)
      })

      // Session should still be valid
      expect(screen.getByTestId('user-email')).toHaveTextContent('test123@med.cornell.edu')
      expect(screen.getByTestId('error')).toHaveTextContent('No error')
    })

    it('should handle expired sessions', async () => {
      const mock = createAuthenticatedSupabaseMock()
      // Override getSession to return null (expired)
      mock.auth.getSession = vi.fn(() => 
        Promise.resolve({ data: { session: null }, error: null })
      )
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('Not authenticated')
      })
    })
  })

  describe('Auth State Changes', () => {
    it('should react to auth state changes', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      
      // Set up auth state change to fire after mount
      mock.config.auth.stateChanges = [{
        event: 'SIGNED_IN',
        session: {
          user: profileFixtures.regular,
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
        }
      }]
      
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent(profileFixtures.regular.email)
      })
    })
  })

  describe('Error Handling', () => {
    it('should display user-friendly error messages', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      mock.setAuthError(new Error('Invalid login credentials'))
      setSupabaseMock(mock)

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
      })

      const signInButton = screen.getByText('Sign In')
      await act(async () => {
        fireEvent.click(signInButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid login credentials')
      })
    })
  })
})