import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi, expect } from 'vitest'
import React from 'react'
import { toHaveNoViolations } from 'jest-axe'

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
  useParams() {
    return {}
  },
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => React.createElement('a', { href }, children),
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props)
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock crypto.randomUUID
if (!global.crypto) {
  global.crypto = {} as any
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = vi.fn(() => 
    `test-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}`
  ) as any
}

// Mock pointer events for Radix UI components
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn()
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn()
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn()
}

// Mock scrollIntoView for Select component
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}

// Mock ResizeObserver for cmdk
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Import Supabase mocks
import { createSupabaseMock } from './mocks/supabase'
import { createUnauthenticatedSupabaseMock } from './mocks/supabase-factory'

// Default Supabase mock for tests
let defaultSupabaseMock = createUnauthenticatedSupabaseMock()

// Mock Supabase client module
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => defaultSupabaseMock)
}))

// Mock the getSupabaseClient function
vi.mock('@/lib/supabase-client', () => ({
  getSupabaseClient: vi.fn(() => defaultSupabaseMock),
  isValidCWIDFormat: vi.fn((cwid: string) => /^[a-zA-Z]{3}\d{4}$/.test(cwid)),
  isValidCornellEmail: vi.fn((email: string) => {
    const emailLower = email.toLowerCase()
    const match = emailLower.match(/^([^@]+)@med\.cornell\.edu$/)
    if (!match) return false
    const cwid = match[1]
    return /^[a-zA-Z]{3}\d{4}$/.test(cwid)
  }),
  getNetIdFromEmail: vi.fn((email: string) => {
    const match = email.toLowerCase().match(/^([^@]+)@med\.cornell\.edu$/)
    return match ? match[1] : null
  }),
}))

// Helper to set the Supabase mock for a specific test
export function setSupabaseMock(mock: ReturnType<typeof createSupabaseMock>) {
  defaultSupabaseMock = mock
}

// Reset Supabase mock to default
export function resetSupabaseMock() {
  defaultSupabaseMock = createUnauthenticatedSupabaseMock()
}

// Mock global fetch for Netlify Functions
global.fetch = vi.fn((url: string, options?: any) => {
  // Mock admin check endpoint
  if (url === '/.netlify/functions/check-admin-status') {
    const body = JSON.parse(options?.body || '{}')
    const adminEmails = ['admin123@med.cornell.edu', 'superadmin@med.cornell.edu', 'dept.admin@med.cornell.edu']
    const isAdmin = adminEmails.includes(body.email?.toLowerCase())
    
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ isAdmin }),
    } as Response)
  }
  
  // Default response for other endpoints
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' }),
  } as Response)
}) as any

// Initialize feature flags for tests
// By default, all feature flags are disabled to ensure backward compatibility
global.process = {
  ...global.process,
  env: {
    ...global.process.env,
    NEXT_PUBLIC_STRICT_DESIGN_SYSTEM: 'false',
    NEXT_PUBLIC_NEUTRAL_BADGES: 'false', 
    NEXT_PUBLIC_ENFORCE_TYPOGRAPHY: 'false',
    // Mock Supabase environment variables for tests
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  }
}