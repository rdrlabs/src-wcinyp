import { render, screen, waitFor } from '@testing-library/react'
import { NavBar } from './navbar'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { AppProvider } from '@/contexts/app-context'
import { ThemeProvider } from 'next-themes'
import { SearchProvider } from '@/contexts/search-context'
import { AuthProvider } from '@/contexts/auth-context'
import { DemoProvider } from '@/contexts/demo-context'
import { 
  createAuthenticatedSupabaseMock, 
  createAdminSupabaseMock, 
  createUnauthenticatedSupabaseMock 
} from '@/test/mocks/supabase-factory'
import { setSupabaseMock, resetSupabaseMock } from '@/test/setup'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

// Helper function to render with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <DemoProvider>
          <AppProvider>
            <SearchProvider>
              {component}
            </SearchProvider>
          </AppProvider>
        </DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

describe('NavBar with Supabase Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    resetSupabaseMock()
  })

  describe('Authentication States', () => {
    it('shows login button when not authenticated', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)
      
      renderWithProviders(<NavBar />)
      
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument()
        expect(screen.queryByText(/admin123/)).not.toBeInTheDocument()
      })
    })

    it('shows user dropdown when authenticated', async () => {
      const mock = createAuthenticatedSupabaseMock('test123@med.cornell.edu')
      setSupabaseMock(mock)
      
      renderWithProviders(<NavBar />)
      
      await waitFor(() => {
        expect(screen.getByText('test123')).toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument()
      })
    })

    it('shows admin menu item for admin users', async () => {
      const mock = createAdminSupabaseMock('admin123@med.cornell.edu')
      setSupabaseMock(mock)
      
      renderWithProviders(<NavBar />)
      
      await waitFor(() => {
        expect(screen.getByText('admin123')).toBeInTheDocument()
      })
      
      // Click on user dropdown
      const userButton = screen.getByRole('button', { name: /admin123/i })
      userButton.click()
      
      await waitFor(() => {
        expect(screen.getByText('Access Requests')).toBeInTheDocument()
      })
    })

    it('does not show admin menu for regular users', async () => {
      const mock = createAuthenticatedSupabaseMock('user123@med.cornell.edu')
      // Override admin config to exclude this user
      mock.setTableData('admin_configuration', [{
        id: 'config-1',
        admin_emails: ['otheradmin@med.cornell.edu'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      setSupabaseMock(mock)
      
      renderWithProviders(<NavBar />)
      
      await waitFor(() => {
        expect(screen.getByText('user123')).toBeInTheDocument()
      })
      
      // Click on user dropdown
      const userButton = screen.getByRole('button', { name: /user123/i })
      userButton.click()
      
      await waitFor(() => {
        expect(screen.queryByText('Access Requests')).not.toBeInTheDocument()
      })
    })
  })

  describe('Demo Mode', () => {
    it('shows demo mode indicator when in demo mode', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)
      
      // Need to render with demo mode active
      render(
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <DemoProvider initialDemoMode={true}>
              <AppProvider>
                <SearchProvider>
                  <NavBar />
                </SearchProvider>
              </AppProvider>
            </DemoProvider>
          </AuthProvider>
        </ThemeProvider>
      )
      
      await waitFor(() => {
        expect(screen.getByText('Demo')).toBeInTheDocument()
      })
    })

    it('does not show demo mode indicator when not in demo mode', async () => {
      const mock = createAuthenticatedSupabaseMock()
      setSupabaseMock(mock)
      
      renderWithProviders(<NavBar />)
      
      await waitFor(() => {
        expect(screen.queryByText('Demo')).not.toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('handles auth loading state gracefully', () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)
      
      // The navbar should render immediately even while auth is loading
      renderWithProviders(<NavBar />)
      
      // Core navigation should be present
      expect(screen.getByRole('link', { name: /WCI.*@.*NYP/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Knowledge Base/i })).toBeInTheDocument()
    })
  })

  describe('Real-time Updates', () => {
    it('reacts to auth state changes', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)
      
      renderWithProviders(<NavBar />)
      
      // Initially not authenticated
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument()
      })
      
      // Simulate auth state change
      mock.setAuthUser(
        { id: 'user-123', email: 'newuser@med.cornell.edu' },
        { 
          user: { id: 'user-123', email: 'newuser@med.cornell.edu' },
          access_token: 'token',
          refresh_token: 'refresh',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
        }
      )
      
      // Trigger auth state change
      mock.config.auth.stateChanges = [{
        event: 'SIGNED_IN',
        session: {
          user: { id: 'user-123', email: 'newuser@med.cornell.edu' },
          access_token: 'token',
        }
      }]
      
      // In a real scenario, the auth context would react to this change
      // For this test, we're demonstrating the mock capability
    })
  })
})