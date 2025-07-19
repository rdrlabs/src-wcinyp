import { createSupabaseMock, SupabaseMock } from './supabase'
import { accessRequestFixtures } from '../fixtures/access-requests.fixtures'
import { profileFixtures } from '../fixtures/profiles.fixtures'
import { authSessionFixtures } from '../fixtures/auth-sessions.fixtures'
import { adminConfigFixtures } from '../fixtures/admin-config.fixtures'

/**
 * Factory functions for creating pre-configured Supabase mocks
 * for common testing scenarios
 */

/**
 * Creates a mock with an authenticated user
 */
export function createAuthenticatedSupabaseMock(email = 'test123@med.cornell.edu') {
  const userId = `user-${email.split('@')[0]}`
  const mock = createSupabaseMock()
  
  mock.setAuthUser(
    { id: userId, email },
    { 
      user: { id: userId, email },
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
    }
  )
  
  mock.setTableData('profiles', [
    { 
      id: userId, 
      email, 
      net_id: email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    }
  ])
  
  return mock
}

/**
 * Creates a mock with an admin user
 */
export function createAdminSupabaseMock(email = 'admin123@med.cornell.edu') {
  const mock = createAuthenticatedSupabaseMock(email)
  
  // Add admin configuration
  mock.setTableData('admin_configuration', [
    {
      id: 'config-1',
      admin_emails: [email],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ])
  
  // Update profile with admin role
  const profiles = mock.from('profiles' as any)
  mock.setTableData('profiles', [
    {
      ...profileFixtures.admin,
      email,
      net_id: email.split('@')[0],
      role: 'admin',
    }
  ])
  
  return mock
}

/**
 * Creates a mock with no authenticated user
 */
export function createUnauthenticatedSupabaseMock() {
  return createSupabaseMock()
}

/**
 * Creates a mock that simulates network errors
 */
export function createErrorSupabaseMock() {
  const mock = createSupabaseMock()
  
  // Set errors for all operations
  const tables = ['profiles', 'access_requests', 'pending_auth_sessions', 'admin_configuration']
  const operations = ['select', 'insert', 'update', 'delete'] as const
  
  tables.forEach(table => {
    operations.forEach(op => {
      mock.setTableError(table as any, op, new Error('Network error'))
    })
  })
  
  mock.setAuthError(new Error('Authentication service unavailable'))
  
  return mock
}

/**
 * Creates a mock with access request data
 */
export function createAccessRequestSupabaseMock() {
  const mock = createAdminSupabaseMock()
  
  // Add access request data
  mock.setTableData('access_requests', accessRequestFixtures.all)
  
  // Add access request stats view
  mock.setTableData('access_request_stats' as any, [{
    pending_count: accessRequestFixtures.pending.length,
    approved_count: accessRequestFixtures.approved.length,
    rejected_count: accessRequestFixtures.rejected.length,
    total_count: accessRequestFixtures.all.length,
    last_week_count: 5,
    last_month_count: 12,
  }])
  
  // Add RPC functions
  mock.setRPCResponse('approve_access_request', { success: true })
  mock.setRPCResponse('reject_access_request', { success: true })
  
  return mock
}

/**
 * Creates a mock with auth session data for testing cross-device auth
 */
export function createAuthSessionSupabaseMock(sessionToken = 'test-session-token') {
  const mock = createSupabaseMock()
  
  mock.setTableData('pending_auth_sessions', [
    {
      ...authSessionFixtures.pending,
      session_token: sessionToken,
    }
  ])
  
  return mock
}

/**
 * Creates a mock with real-time subscription support
 */
export function createRealtimeSupabaseMock() {
  const mock = createSupabaseMock()
  
  // Add some initial data
  mock.setTableData('access_requests', accessRequestFixtures.pending)
  
  // Configure real-time events
  mock.addRealtimeEvent(
    'access_requests',
    'INSERT',
    { 
      new: accessRequestFixtures.pending[0],
      eventType: 'INSERT',
      schema: 'public',
      table: 'access_requests',
    },
    100 // 100ms delay
  )
  
  return mock
}

/**
 * Creates a mock for testing rate limiting scenarios
 */
export function createRateLimitedSupabaseMock() {
  const mock = createSupabaseMock()
  
  mock.setAuthError(new Error('Too many requests. Please try again later.'))
  
  return mock
}

/**
 * Creates a builder for more complex mock configurations
 */
export class SupabaseMockBuilder {
  private mock: SupabaseMock

  constructor() {
    this.mock = createSupabaseMock()
  }

  withUser(email: string) {
    const userId = `user-${email.split('@')[0]}`
    this.mock.setAuthUser(
      { id: userId, email },
      { 
        user: { id: userId, email },
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
      }
    )
    return this
  }

  withProfiles(profiles: any[]) {
    this.mock.setTableData('profiles', profiles)
    return this
  }

  withAccessRequests(requests: any[]) {
    this.mock.setTableData('access_requests', requests)
    return this
  }

  withError(table: string, operation: 'select' | 'insert' | 'update' | 'delete', error: Error) {
    this.mock.setTableError(table as any, operation, error)
    return this
  }

  withRPC(name: string, response: any, error?: Error) {
    this.mock.setRPCResponse(name, response, error)
    return this
  }

  withRealtimeEvent(channel: string, event: string, payload: any, delay?: number) {
    this.mock.addRealtimeEvent(channel, event, payload, delay)
    return this
  }

  build() {
    return this.mock
  }
}

/**
 * Helper function to reset all mocks
 */
export function resetSupabaseMocks() {
  // This would be called in afterEach hooks to ensure clean state
  // The actual implementation depends on how mocks are stored globally
}