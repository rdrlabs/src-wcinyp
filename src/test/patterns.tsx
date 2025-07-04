import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, it, expect, vi } from 'vitest'

// Generic page test suite generator
export const createPageTests = (
  PageComponent: React.ComponentType,
  {
    title,
    description,
    skipAccessibility = false,
    customTests = []
  }: {
    title: string
    description?: string
    skipAccessibility?: boolean
    customTests?: Array<() => void>
  }
) => {
  describe(`${title} Page`, () => {
    it('renders page title', () => {
      render(<PageComponent />)
      expect(screen.getByText(title)).toBeInTheDocument()
    })

    if (description) {
      it('renders page description', () => {
        render(<PageComponent />)
        expect(screen.getByText(description)).toBeInTheDocument()
      })
    }

    if (!skipAccessibility) {
      it('has no accessibility violations', async () => {
        const { container } = render(<PageComponent />)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
    }

    // Run custom tests
    customTests.forEach(test => test())
  })
}

// Loading page test pattern
export const createLoadingPageTest = (
  LoadingComponent: React.ComponentType,
  pageName: string
) => {
  describe(`${pageName} Loading Page`, () => {
    it('displays loading indicator', () => {
      render(<LoadingComponent />)
      
      // Check for common loading patterns
      const loadingText = screen.queryByText(/loading/i)
      const spinner = screen.queryByRole('status')
      const skeleton = document.querySelector('.animate-pulse')
      
      // At least one loading indicator should be present
      expect(loadingText || spinner || skeleton).toBeTruthy()
    })
  })
}

// Error page test pattern
export const createErrorPageTest = (
  ErrorComponent: React.ComponentType<{ error?: Error; reset?: () => void }>,
  pageName: string
) => {
  describe(`${pageName} Error Page`, () => {
    it('displays error message', () => {
      const mockError = new Error('Test error')
      render(<ErrorComponent error={mockError} reset={() => {}} />)
      
      // Should show the actual error message
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('provides reset functionality', async () => {
      const mockReset = vi.fn()
      const user = userEvent.setup()
      
      render(<ErrorComponent error={new Error()} reset={mockReset} />)
      
      const resetButton = screen.getByRole('button', { name: /try again|reset/i })
      await user.click(resetButton)
      
      expect(mockReset).toHaveBeenCalled()
    })
  })
}

// Form testing helpers
export const formHelpers = {
  fillField: async (labelText: string, value: string) => {
    const user = userEvent.setup()
    const field = screen.getByLabelText(labelText)
    await user.clear(field)
    await user.type(field, value)
  },

  selectOption: async (labelText: string, optionText: string) => {
    const user = userEvent.setup()
    const select = screen.getByLabelText(labelText)
    await user.selectOptions(select, optionText)
  },

  checkCheckbox: async (labelText: string) => {
    const user = userEvent.setup()
    const checkbox = screen.getByLabelText(labelText)
    await user.click(checkbox)
  },

  submitForm: async () => {
    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
  },

  expectError: (fieldName: string, errorMessage?: string) => {
    const errorPattern = errorMessage || new RegExp(`${fieldName}.*required|invalid`, 'i')
    expect(screen.getByText(errorPattern)).toBeInTheDocument()
  },

  expectNoErrors: () => {
    const errors = screen.queryAllByRole('alert')
    expect(errors).toHaveLength(0)
  }
}

// Search and filter test helpers
export const searchHelpers = {
  performSearch: async (searchTerm: string) => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText(/search/i)
    await user.clear(searchInput)
    await user.type(searchInput, searchTerm)
  },

  selectFilter: async (filterName: string, value: string) => {
    const user = userEvent.setup()
    const filter = screen.getByLabelText(filterName)
    await user.selectOptions(filter, value)
  },

  clickFilterButton: async (buttonText: string) => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: buttonText })
    await user.click(button)
  },

  expectResults: (count: number) => {
    const resultText = new RegExp(`${count}\\s+(result|item|match)`, 'i')
    expect(screen.getByText(resultText)).toBeInTheDocument()
  },

  expectNoResults: () => {
    expect(screen.getByText(/no results|no items found|no matches/i)).toBeInTheDocument()
  }
}

// Navigation test helpers
export const navigationHelpers = {
  clickLink: async (linkText: string) => {
    const user = userEvent.setup()
    const link = screen.getByRole('link', { name: linkText })
    await user.click(link)
  },

  clickButton: async (buttonText: string) => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: buttonText })
    await user.click(button)
  },

  expectUrl: (expectedUrl: string) => {
    expect(window.location.pathname).toBe(expectedUrl)
  },

  goBack: async () => {
    const user = userEvent.setup()
    const backButton = screen.getByRole('button', { name: /back|return/i })
    await user.click(backButton)
  }
}

// Table test helpers
export const tableHelpers = {
  getRows: () => screen.getAllByRole('row').slice(1), // Skip header row

  getColumnValues: (columnIndex: number) => {
    const rows = tableHelpers.getRows()
    return rows.map(row => {
      const cells = row.querySelectorAll('td')
      return cells[columnIndex]?.textContent || ''
    })
  },

  sortBy: async (columnHeader: string) => {
    const user = userEvent.setup()
    const header = screen.getByRole('columnheader', { name: columnHeader })
    await user.click(header)
  },

  expectRowCount: (count: number) => {
    const rows = tableHelpers.getRows()
    expect(rows).toHaveLength(count)
  }
}

// API mocking helpers
export const mockAPI = {
  success: <T,>(data: T, delay = 0) => {
    return new Promise<T>(resolve => {
      setTimeout(() => resolve(data), delay)
    })
  },

  error: (message: string, delay = 0) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), delay)
    })
  },

  loading: () => new Promise(() => {}) // Never resolves
}

// Common test scenarios
export const testScenarios = {
  testEmptyState: (emptyMessage: string) => {
    it('displays empty state when no data', () => {
      render(<div>{emptyMessage}</div>)
      expect(screen.getByText(emptyMessage)).toBeInTheDocument()
    })
  },

  testLoadingState: () => {
    it('displays loading state while fetching data', async () => {
      render(<div role="status">Loading...</div>)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  },

  testErrorState: (errorMessage: string) => {
    it('displays error state on failure', () => {
      render(<div role="alert">{errorMessage}</div>)
      expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
    })
  }
}