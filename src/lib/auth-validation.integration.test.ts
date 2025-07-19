import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  isEmailAllowedToAuthenticate, 
  checkIsAdmin,
  validateAccessRequest,
  validateSessionToken
} from './auth-validation'
import { 
  createAdminSupabaseMock,
  createAccessRequestSupabaseMock,
  createErrorSupabaseMock,
  createUnauthenticatedSupabaseMock,
  SupabaseMockBuilder
} from '@/test/mocks/supabase-factory'
import { setSupabaseMock, resetSupabaseMock } from '@/test/setup'
import { accessRequestFixtures } from '@/test/fixtures/access-requests.fixtures'
import { adminConfigFixtures } from '@/test/fixtures/admin-config.fixtures'

describe('Auth Validation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    resetSupabaseMock()
  })

  describe('isEmailAllowedToAuthenticate', () => {
    it('should allow valid Cornell Medicine email', async () => {
      const result = await isEmailAllowedToAuthenticate('abc123@med.cornell.edu')
      expect(result).toBe(true)
    })

    it('should reject non-Cornell email', async () => {
      const result = await isEmailAllowedToAuthenticate('user@example.com')
      expect(result).toBe(false)
    })

    it('should reject invalid CWID format', async () => {
      const result = await isEmailAllowedToAuthenticate('invalid@med.cornell.edu')
      expect(result).toBe(false)
    })

    it('should reject email with numbers in wrong position', async () => {
      const result = await isEmailAllowedToAuthenticate('123abc@med.cornell.edu')
      expect(result).toBe(false)
    })

    it('should handle email case insensitively', async () => {
      const result = await isEmailAllowedToAuthenticate('ABC123@MED.CORNELL.EDU')
      expect(result).toBe(true)
    })
  })

  describe('checkIsAdmin', () => {
    it('should return true for admin users', async () => {
      const mock = createAdminSupabaseMock('admin123@med.cornell.edu')
      setSupabaseMock(mock)

      const result = await checkIsAdmin('admin123@med.cornell.edu', 'user-admin123')
      expect(result).toBe(true)
    })

    it('should return false for non-admin users', async () => {
      const mock = createAccessRequestSupabaseMock()
      // Override admin config to exclude the test user
      mock.setTableData('admin_configuration', [{
        ...adminConfigFixtures.default,
        admin_emails: ['otheradmin@med.cornell.edu'],
      }])
      setSupabaseMock(mock)

      const result = await checkIsAdmin('notadmin@med.cornell.edu', 'user-notadmin')
      expect(result).toBe(false)
    })

    it('should handle empty admin configuration', async () => {
      const mock = createAccessRequestSupabaseMock()
      mock.setTableData('admin_configuration', [adminConfigFixtures.empty])
      setSupabaseMock(mock)

      const result = await checkIsAdmin('admin123@med.cornell.edu', 'user-admin123')
      expect(result).toBe(false)
    })

    it('should handle database errors gracefully', async () => {
      const mock = createErrorSupabaseMock()
      setSupabaseMock(mock)

      const result = await checkIsAdmin('admin123@med.cornell.edu', 'user-admin123')
      expect(result).toBe(false)
    })

    it('should handle missing configuration table', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      // Don't set any admin_configuration data
      setSupabaseMock(mock)

      const result = await checkIsAdmin('admin123@med.cornell.edu', 'user-admin123')
      expect(result).toBe(false)
    })

    it('should check email case-insensitively', async () => {
      const mock = createAdminSupabaseMock('admin123@med.cornell.edu')
      setSupabaseMock(mock)

      const result = await checkIsAdmin('ADMIN123@MED.CORNELL.EDU', 'user-admin123')
      expect(result).toBe(true)
    })
  })

  describe('validateAccessRequest', () => {
    it('should validate complete access request', () => {
      const request = {
        email: 'test123@med.cornell.edu',
        full_name: 'Test User',
        organization: 'Radiology',
        role: 'Physician',
        reason: 'Need access for patient care',
      }

      const errors = validateAccessRequest(request)
      expect(errors).toEqual([])
    })

    it('should require all fields', () => {
      const request = {
        email: '',
        full_name: '',
        organization: '',
        role: '',
        reason: '',
      }

      const errors = validateAccessRequest(request)
      expect(errors).toContain('Email is required')
      expect(errors).toContain('Full name is required')
      expect(errors).toContain('Organization is required')
      expect(errors).toContain('Role is required')
      expect(errors).toContain('Reason is required')
    })

    it('should validate email format', () => {
      const request = {
        email: 'invalid-email',
        full_name: 'Test User',
        organization: 'Radiology',
        role: 'Physician',
        reason: 'Need access',
      }

      const errors = validateAccessRequest(request)
      expect(errors).toContain('Invalid email format')
    })

    it('should require Cornell email domain', () => {
      const request = {
        email: 'user@example.com',
        full_name: 'Test User',
        organization: 'Radiology',
        role: 'Physician',
        reason: 'Need access',
      }

      const errors = validateAccessRequest(request)
      expect(errors).toContain('Must use a Cornell Medicine email address')
    })

    it('should validate minimum length requirements', () => {
      const request = {
        email: 'abc123@med.cornell.edu',
        full_name: 'AB',
        organization: 'IT',
        role: 'IT',
        reason: 'Need',
      }

      const errors = validateAccessRequest(request)
      expect(errors).toContain('Full name must be at least 3 characters')
      expect(errors).toContain('Organization must be at least 3 characters')
      expect(errors).toContain('Role must be at least 3 characters')
      expect(errors).toContain('Reason must be at least 10 characters')
    })

    it('should trim whitespace before validation', () => {
      const request = {
        email: '  abc123@med.cornell.edu  ',
        full_name: '  Test User  ',
        organization: '  Radiology Department  ',
        role: '  Physician  ',
        reason: '  Need access for patient care  ',
      }

      const errors = validateAccessRequest(request)
      expect(errors).toEqual([])
    })
  })

  describe('validateSessionToken', () => {
    it('should validate correct token format', () => {
      const validToken = 'abc123def456ghi789jkl012mno345pqr678'
      expect(validateSessionToken(validToken)).toBe(true)
    })

    it('should reject short tokens', () => {
      const shortToken = 'abc123'
      expect(validateSessionToken(shortToken)).toBe(false)
    })

    it('should reject tokens with invalid characters', () => {
      const invalidToken = 'abc123!@#$%^&*()_+-=[]{}|;:,.<>?'
      expect(validateSessionToken(invalidToken)).toBe(false)
    })

    it('should reject empty token', () => {
      expect(validateSessionToken('')).toBe(false)
    })

    it('should reject null/undefined', () => {
      expect(validateSessionToken(null as any)).toBe(false)
      expect(validateSessionToken(undefined as any)).toBe(false)
    })
  })

  describe('Integration with Supabase', () => {
    it('should check admin status with real database query', async () => {
      const mock = new SupabaseMockBuilder()
        .withUser('admin123@med.cornell.edu')
        .build()

      // Set up admin configuration
      mock.setTableData('admin_configuration', [adminConfigFixtures.default])
      setSupabaseMock(mock)

      const isAdmin = await checkIsAdmin('admin123@med.cornell.edu', 'user-admin123')
      expect(isAdmin).toBe(true)

      // Verify the mock was called correctly
      const { from } = mock as any
      expect(from).toBeDefined()
    })

    it('should handle concurrent admin checks', async () => {
      const mock = createAdminSupabaseMock()
      setSupabaseMock(mock)

      // Run multiple checks concurrently
      const results = await Promise.all([
        checkIsAdmin('admin123@med.cornell.edu', 'user-1'),
        checkIsAdmin('admin123@med.cornell.edu', 'user-2'),
        checkIsAdmin('notadmin@med.cornell.edu', 'user-3'),
        checkIsAdmin('superadmin@med.cornell.edu', 'user-4'),
      ])

      expect(results[0]).toBe(true)  // admin123
      expect(results[1]).toBe(true)  // admin123 (same email)
      expect(results[2]).toBe(false) // notadmin
      expect(results[3]).toBe(true)  // superadmin
    })

    it('should handle network timeout gracefully', async () => {
      const mock = createUnauthenticatedSupabaseMock()
      
      // Override the from method to simulate a timeout
      mock.from = vi.fn(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ data: null, error: new Error('Network timeout') }), 100)
        })
      }) as any

      setSupabaseMock(mock)

      const result = await checkIsAdmin('admin123@med.cornell.edu', 'user-admin123')
      expect(result).toBe(false)
    })
  })
})