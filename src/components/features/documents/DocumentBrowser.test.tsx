import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentBrowser } from './DocumentBrowser'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'

describe('DocumentBrowser', () => {
  let mockWindowOpen: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Mock window.open for download tests
    mockWindowOpen = vi.fn()
    window.open = mockWindowOpen
  })

  describe('Rendering', () => {
    it('should render search input and category buttons', () => {
      render(<DocumentBrowser />)
      
      // Search input
      expect(screen.getByPlaceholderText('Search documents...')).toBeInTheDocument()
      
      // Category buttons - use real categories from data
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'ABN Forms' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Patient Questionnaires' })).toBeInTheDocument()
    })

    it('should display documents when rendered', () => {
      render(<DocumentBrowser />)
      
      // Check for actual documents from the real data
      expect(screen.getByText('ABN - 55th Street.pdf')).toBeInTheDocument()
      expect(screen.getByText('Biopsy Questionnaire.pdf')).toBeInTheDocument()
    })

    it('should show document categories as headings', () => {
      render(<DocumentBrowser />)
      
      // Category headings
      expect(screen.getByRole('heading', { name: 'ABN Forms' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Patient Questionnaires' })).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('should filter documents by search query', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      const searchInput = screen.getByPlaceholderText('Search documents...')
      
      // Search for "Biopsy"
      await user.type(searchInput, 'Biopsy')
      
      // Should show matching document
      expect(screen.getByText('Biopsy Questionnaire.pdf')).toBeInTheDocument()
      
      // Should hide non-matching documents
      expect(screen.queryByText('ABN - 55th Street.pdf')).not.toBeInTheDocument()
    })

    it('should show empty state when no search results', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      const searchInput = screen.getByPlaceholderText('Search documents...')
      await user.type(searchInput, 'xyznonexistent')
      
      expect(screen.getByText('No documents found matching your criteria.')).toBeInTheDocument()
    })

    it('should be case-insensitive', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      const searchInput = screen.getByPlaceholderText('Search documents...')
      await user.type(searchInput, 'biopsy')
      
      // Should still find the document
      expect(screen.getByText('Biopsy Questionnaire.pdf')).toBeInTheDocument()
    })
  })

  describe('Category Filtering', () => {
    it('should filter by category when button is clicked', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      // Click ABN Forms category
      const abnButton = screen.getByRole('button', { name: 'ABN Forms' })
      await user.click(abnButton)
      
      // Should only show ABN Forms section
      expect(screen.getByText('ABN - 55th Street.pdf')).toBeInTheDocument()
      expect(screen.queryByText('Biopsy Questionnaire.pdf')).not.toBeInTheDocument()
    })

    it('should show all documents when All Documents is selected', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      // First select a specific category
      await user.click(screen.getByRole('button', { name: 'ABN Forms' }))
      
      // Then click All Documents
      await user.click(screen.getByRole('button', { name: 'All' }))
      
      // Should show documents from multiple categories
      expect(screen.getByText('ABN - 55th Street.pdf')).toBeInTheDocument()
      expect(screen.getByText('Biopsy Questionnaire.pdf')).toBeInTheDocument()
    })
  })

  describe('Download Functionality', () => {
    it('should trigger download when button is clicked', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      // Find a specific download button
      const downloadButtons = screen.getAllByText('Download')
      await user.click(downloadButtons[0])
      
      // Should open window with document URL
      expect(mockWindowOpen).toHaveBeenCalledTimes(1)
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('/documents/'),
        '_blank'
      )
    })

    it('should handle download action', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      const downloadButtons = screen.getAllByText('Download')
      
      // Test that clicking download doesn't throw an error
      await expect(user.click(downloadButtons[0])).resolves.not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<DocumentBrowser />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      // Tab to search input
      await user.tab()
      const searchInput = screen.getByPlaceholderText('Search documents...')
      expect(searchInput).toHaveFocus()
      
      // Tab to first category button
      await user.tab()
      const allButton = screen.getByRole('button', { name: 'All' })
      expect(allButton).toHaveFocus()
    })
  })

  describe('User Flows', () => {
    it('should support search and filter workflow', async () => {
      const user = userEvent.setup()
      render(<DocumentBrowser />)
      
      // User searches for "Form"
      const searchInput = screen.getByPlaceholderText('Search documents...')
      await user.type(searchInput, 'Form')
      
      // Multiple forms should be visible
      const formsFound = screen.getAllByText(/Form/i)
      expect(formsFound.length).toBeGreaterThan(1)
      
      // User then filters by Administrative Forms
      await user.click(screen.getByRole('button', { name: 'Administrative Forms' }))
      
      // Should show only Administrative Forms with "Form" in the name
      expect(screen.getByText('Minor Auth Form.pdf')).toBeInTheDocument()
      
      // Clear search to see all Administrative Forms
      await user.clear(searchInput)
      
      // Should now see all Administrative Forms
      expect(screen.getByText('Appointment Verification Letter.pdf')).toBeInTheDocument()
    })
  })
})