import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import AccessRequestsPage from './page'
import { AuthProvider } from '@/contexts/auth-context'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

// Mock auth context
const mockUser = { id: 'admin-123', email: 'admin123@med.cornell.edu' }
vi.mock('@/contexts/auth-context', async () => {
  const actual = await vi.importActual('@/contexts/auth-context')
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
      loading: false,
      error: null,
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
      checkSession: vi.fn(),
      pendingSessionToken: null,
      isPollingForAuth: false,
      rememberMe: false,
      setRememberMe: vi.fn(),
    }),
  }
})

// Mock Supabase
vi.mock('@/lib/supabase-client', () => ({
  getSupabaseClient: () => ({
    from: () => ({
      select: () => ({
        order: () => ({
          then: (cb: any) => cb({ 
            data: [], 
            error: null 
          })
        })
      })
    })
  })
}))

describe('AccessRequestsPage Simple Test', () => {
  it('renders the page title', async () => {
    render(
      <AuthProvider>
        <AccessRequestsPage />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Access Requests')).toBeInTheDocument()
    })
  })
})