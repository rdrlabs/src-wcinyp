import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import AccessRequestsPage from './page'
import { createAdminSupabaseMock, createAccessRequestSupabaseMock, createErrorSupabaseMock, createUnauthenticatedSupabaseMock } from '@/test/mocks/supabase-factory'
import { setSupabaseMock, resetSupabaseMock } from '@/test/setup'
import { accessRequestFixtures } from '@/test/fixtures/access-requests.fixtures'
import { profileFixtures } from '@/test/fixtures/profiles.fixtures'
import { AuthProvider } from '@/contexts/auth-context'
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

// Mock the useAuth hook
const mockAuthState = {
  user: null as any,
  loading: false,
  error: null as string | null,
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
  checkSession: vi.fn(),
  pendingSessionToken: null,
  isPollingForAuth: false,
  rememberMe: false,
  setRememberMe: vi.fn(),
}

vi.mock('@/contexts/auth-context', async () => {
  const actual = await vi.importActual('@/contexts/auth-context')
  return {
    ...actual,
    useAuth: () => mockAuthState,
  }
})

describe('AccessRequestsPage Integration Tests', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  afterEach(() => {
    resetSupabaseMock()
  })

  describe('Authentication and Authorization', () => {
    it('should redirect non-authenticated users', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = null
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      // The component checks auth status in useEffect, so we need to wait
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      }, { timeout: 2000 })
    })

    it('should redirect non-admin users', async () => {
      const mock = createAccessRequestSupabaseMock()
      // Override admin config to exclude current user
      mock.setTableData('admin_configuration', [{
        id: 'config-1',
        admin_emails: ['otheradmin@med.cornell.edu'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-123', email: 'notadmin@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })

    it('should allow admin users access', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Access Requests')).toBeInTheDocument()
        expect(screen.getByText('Manage user access requests for the WCI@NYP application')).toBeInTheDocument()
      })
    })
  })

  describe('Data Loading and Display', () => {
    it('should display loading state initially', () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = profileFixtures.admin
      mockAuthState.loading = true // Set auth as loading
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should display access request statistics', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        // Look for the specific stat cards
        const pendingCard = screen.getByText('Pending').closest('[data-slot="card"]')
        const approvedCard = screen.getByText('Approved').closest('[data-slot="card"]')
        const rejectedCard = screen.getByText('Rejected').closest('[data-slot="card"]')
        
        expect(pendingCard).toHaveTextContent(`${accessRequestFixtures.pending.length}`)
        expect(approvedCard).toHaveTextContent(`${accessRequestFixtures.approved.length}`)
        expect(rejectedCard).toHaveTextContent(`${accessRequestFixtures.rejected.length}`)
      })
    })

    it('should display pending requests by default', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        accessRequestFixtures.pending.forEach(request => {
          expect(screen.getByText(request.full_name)).toBeInTheDocument()
          expect(screen.getByText(request.organization)).toBeInTheDocument()
        })
      })
    })

    it('should handle empty requests gracefully', async () => {
      const mock = createAccessRequestSupabaseMock()
      mock.setTableData('access_requests', [])
      mock.setTableData('access_request_stats' as any, [{
        pending_count: 0,
        approved_count: 0,
        rejected_count: 0,
        total_count: 0,
        last_week_count: 0,
        last_month_count: 0,
      }])
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('No pending requests found')).toBeInTheDocument()
      })
    })

    it('should handle database errors', async () => {
      const mock = createErrorSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Failed to load access requests')).toBeInTheDocument()
      })
    })
  })

  describe('Tab Navigation', () => {
    it('should switch between tabs', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(accessRequestFixtures.pending[0].full_name)).toBeInTheDocument()
      })

      // Click on approved tab
      fireEvent.click(screen.getByRole('tab', { name: /Approved/ }))

      await waitFor(() => {
        expect(screen.getByText(accessRequestFixtures.approved[0].full_name)).toBeInTheDocument()
        expect(screen.queryByText(accessRequestFixtures.pending[0].full_name)).not.toBeInTheDocument()
      })

      // Click on rejected tab
      fireEvent.click(screen.getByRole('tab', { name: /Rejected/ }))

      await waitFor(() => {
        expect(screen.getByText(accessRequestFixtures.rejected[0].full_name)).toBeInTheDocument()
        expect(screen.queryByText(accessRequestFixtures.approved[0].full_name)).not.toBeInTheDocument()
      })
    })
  })

  describe('Search Functionality', () => {
    it('should filter requests by search query', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(accessRequestFixtures.pending[0].full_name)).toBeInTheDocument()
      })

      // Search for a specific user
      const searchInput = screen.getByPlaceholderText(/Search by email, name, organization, or role/)
      fireEvent.change(searchInput, { target: { value: 'John Doe' } })

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      })
    })
  })

  describe('Request Actions', () => {
    it('should open review dialog when clicking review button', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(accessRequestFixtures.pending[0].full_name)).toBeInTheDocument()
      })

      // Click review button
      const reviewButtons = screen.getAllByText('Review')
      fireEvent.click(reviewButtons[0])

      await waitFor(() => {
        expect(screen.getByText('Review Access Request')).toBeInTheDocument()
        expect(screen.getByText(`Review and take action on this access request from ${accessRequestFixtures.pending[0].full_name}`)).toBeInTheDocument()
      })
    })

    it('should approve a request successfully', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(accessRequestFixtures.pending[0].full_name)).toBeInTheDocument()
      })

      // Open review dialog
      fireEvent.click(screen.getAllByText('Review')[0])

      await waitFor(() => {
        expect(screen.getByText('Review Access Request')).toBeInTheDocument()
      })

      // Add review notes
      const notesTextarea = screen.getByPlaceholderText('Add any notes about this decision...')
      fireEvent.change(notesTextarea, { target: { value: 'Approved for department access' } })

      // Click approve
      fireEvent.click(screen.getByRole('button', { name: /Approve/ }))

      await waitFor(() => {
        // Dialog should close
        expect(screen.queryByText('Review Access Request')).not.toBeInTheDocument()
      })
    })

    it('should reject a request successfully', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(accessRequestFixtures.pending[0].full_name)).toBeInTheDocument()
      })

      // Open review dialog
      fireEvent.click(screen.getAllByText('Review')[0])

      await waitFor(() => {
        expect(screen.getByText('Review Access Request')).toBeInTheDocument()
      })

      // Add review notes
      const notesTextarea = screen.getByPlaceholderText('Add any notes about this decision...')
      fireEvent.change(notesTextarea, { target: { value: 'Not authorized for this access level' } })

      // Click reject
      fireEvent.click(screen.getByRole('button', { name: /Reject/ }))

      await waitFor(() => {
        // Dialog should close
        expect(screen.queryByText('Review Access Request')).not.toBeInTheDocument()
      })
    })

    it('should handle action errors gracefully', async () => {
      const mock = createAccessRequestSupabaseMock()
      // Make RPC call fail
      mock.setRPCResponse('approve_access_request', null, new Error('Database error'))
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(accessRequestFixtures.pending[0].full_name)).toBeInTheDocument()
      })

      // Open review dialog and approve
      fireEvent.click(screen.getAllByText('Review')[0])
      
      await waitFor(() => {
        expect(screen.getByText('Review Access Request')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /Approve/ }))

      await waitFor(() => {
        expect(screen.getByText('Failed to approve request')).toBeInTheDocument()
      })
    })
  })

  describe('Badge Display', () => {
    it('should display correct status badges', async () => {
      const mock = createAccessRequestSupabaseMock()
      setSupabaseMock(mock)

      mockAuthState.user = { id: 'user-admin123', email: 'admin123@med.cornell.edu' }
      mockAuthState.loading = false
      
      render(
        <AuthProvider>
          <AccessRequestsPage />
        </AuthProvider>
      )

      // Click on all tab to see all statuses
      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /All/ })).toBeInTheDocument()
      })
      
      fireEvent.click(screen.getByRole('tab', { name: /All/ }))

      await waitFor(() => {
        // Check for status badges
        expect(screen.getAllByText('Pending').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Approved').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0)
      })
    })
  })
})