import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

// Providers that wrap the app
interface ProvidersProps {
  children: React.ReactNode
}

function AllTheProviders({ children }: ProvidersProps) {
  return (
    <>
      {/* Add theme provider, router provider, etc. here as needed */}
      {children}
    </>
  )
}

// Custom render method
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options })

// User event setup helper
export const setupUser = () => userEvent.setup()

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Utility to wait for loading states to finish
export const waitForLoadingToFinish = async () => {
  const { findByText } = customRender(<div>Loading...</div>)
  await expect(findByText(/loading/i)).rejects.toThrow()
}

// Mock window methods
export const mockWindowMethods = () => {
  // Mock window.open for download tests
  const mockOpen = vi.fn()
  window.open = mockOpen
  
  // Mock window.print
  const mockPrint = vi.fn()
  window.print = mockPrint
  
  // Mock clipboard
  const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  }
  Object.assign(navigator, { clipboard: mockClipboard })
  
  return { mockOpen, mockPrint, mockClipboard }
}

// Local storage mock
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  const mockLocalStorage = {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
  
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  })
  
  return mockLocalStorage
}

// Common test IDs
export const testIds = {
  searchInput: 'search-input',
  categoryFilter: 'category-filter',
  downloadButton: 'download-button',
  submitButton: 'submit-button',
  errorMessage: 'error-message',
  loadingSpinner: 'loading-spinner',
  emptyState: 'empty-state',
} as const

// Accessibility helpers
import { axe } from 'jest-axe'

export const checkAccessibility = async (container: HTMLElement) => {
  const results = await axe(container)
  expect(results).toHaveNoViolations()
  
  // Additional manual checks
  const buttons = container.querySelectorAll('button')
  buttons.forEach(button => {
    expect(button).toHaveAccessibleName()
  })
  
  const inputs = container.querySelectorAll('input')
  inputs.forEach(input => {
    expect(input).toHaveAccessibleName()
  })
}

// Helper to test keyboard navigation
export const testKeyboardNavigation = async (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  expect(focusableElements.length).toBeGreaterThan(0)
  
  // Test tab order
  focusableElements.forEach((element, index) => {
    if (index === 0) {
      (element as HTMLElement).focus()
      expect(document.activeElement).toBe(element)
    }
  })
}

// Helper to create delayed responses for loading state tests
export const delayedResponse = <T,>(data: T, delay: number = 100): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay)
  })
}

// Helper to test error boundaries
export const ThrowError = ({ error }: { error: Error }): never => {
  throw error
}