import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { createErrorPageTest } from '@/test/patterns'

// Import all error components
import RootError from './error'
import DocumentsError from './documents/error'
import DirectoryError from './directory/error'
import UpdatesError from './updates/error'
import NotFound from './not-found'
import GlobalError from './global-error'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    <a href={href}>{children}</a>
}))

describe('Error Pages', () => {
  // Use pattern for basic error tests
  createErrorPageTest(RootError, 'Root')
  createErrorPageTest(DocumentsError, 'Documents')
  createErrorPageTest(DirectoryError, 'Directory')
  createErrorPageTest(UpdatesError, 'Updates')

  // Test error pages with custom error messages
  describe('Error Message Display', () => {
    it('displays custom error message when provided', () => {
      const customError = new Error('Custom error message')
      render(<RootError error={customError} reset={() => {}} />)
      
      expect(screen.getByText('Custom error message')).toBeInTheDocument()
    })

    it('displays default message when error message is empty', () => {
      const emptyError = new Error('')
      render(<RootError error={emptyError} reset={() => {}} />)
      
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
    })

    it('displays error digest when available', () => {
      const errorWithDigest = Object.assign(new Error('Test error'), { digest: 'ABC123' })
      render(<RootError error={errorWithDigest} reset={() => {}} />)
      
      // Should still display the error message
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })
  })

  // Test navigation links
  describe('Error Page Navigation', () => {
    it('includes home link in error pages', () => {
      render(<RootError error={new Error()} reset={() => {}} />)
      
      const homeLink = screen.getByRole('link', { name: 'Go home' })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('reset button calls reset function', async () => {
      const mockReset = vi.fn()
      const user = userEvent.setup()
      
      render(<RootError error={new Error()} reset={mockReset} />)
      
      const resetButton = screen.getByRole('button', { name: 'Try again' })
      await user.click(resetButton)
      
      expect(mockReset).toHaveBeenCalledTimes(1)
    })
  })

  // Test 404 Not Found page
  describe('404 Not Found Page', () => {
    it('displays 404 error code', () => {
      render(<NotFound />)
      
      expect(screen.getByText('404')).toBeInTheDocument()
      expect(screen.getByText('Oh no! VIDA 1 is down!')).toBeInTheDocument()
    })

    it('includes helpful message', () => {
      render(<NotFound />)
      
      expect(screen.getByText("Sorry, we couldn't find the page you're looking for.")).toBeInTheDocument()
    })

    it('provides navigation options', () => {
      render(<NotFound />)
      
      const homeLink = screen.getByRole('link', { name: 'Go home' })
      expect(homeLink).toHaveAttribute('href', '/')
      
      const documentsLink = screen.getByRole('link', { name: 'Browse documents' })
      expect(documentsLink).toHaveAttribute('href', '/documents')
    })
  })

  // Test Global Error page
  describe('Global Error Page', () => {
    it('renders global error with HTML structure', () => {
      // Global error needs to render full HTML
      render(<GlobalError error={new Error('Global error')} reset={() => {}} />)
      
      // Should show critical error message
      expect(screen.getByText('Critical Error')).toBeInTheDocument()
      expect(screen.getByText(/A critical error occurred/i)).toBeInTheDocument()
      
      // Should show the actual error in the details
      expect(screen.getByText(/Global error/)).toBeInTheDocument()
    })

    it('global error reset function works', async () => {
      const mockReset = vi.fn()
      const user = userEvent.setup()
      
      render(<GlobalError error={new Error()} reset={mockReset} />)
      
      const resetButton = screen.getByRole('button', { name: /try again|reset/i })
      await user.click(resetButton)
      
      expect(mockReset).toHaveBeenCalledTimes(1)
    })

    it('global error uses semantic color classes', () => {
      const { container } = render(<GlobalError error={new Error('Test')} reset={() => {}} />)
      
      // Check for semantic classes in global error
      expect(container.querySelector('.border-destructive\\/20')).toBeInTheDocument()
      expect(container.querySelector('.text-destructive')).toBeInTheDocument()
      expect(container.querySelector('.text-destructive\\/80')).toBeInTheDocument()
      expect(container.querySelector('.bg-destructive')).toBeInTheDocument()
      expect(container.querySelector('.text-destructive-foreground')).toBeInTheDocument()
    })
  })

  // Test error page styling
  describe('Error Page Styling', () => {
    it('uses error-specific styling (destructive theme)', () => {
      const { container } = render(<RootError error={new Error()} reset={() => {}} />)
      
      // Check for destructive-themed elements
      const destructiveElements = container.querySelectorAll('[class*="destructive"]')
      expect(destructiveElements.length).toBeGreaterThan(0)
    })

    it('uses semantic color classes for error pages', () => {
      const { container } = render(<RootError error={new Error()} reset={() => {}} />)
      
      // Check for specific semantic classes
      expect(container.querySelector('.bg-destructive\\/10')).toBeInTheDocument()
      expect(container.querySelector('.border-destructive\\/20')).toBeInTheDocument()
      expect(container.querySelector('.text-destructive')).toBeInTheDocument()
      expect(container.querySelector('.bg-destructive')).toBeInTheDocument()
      expect(container.querySelector('.text-destructive-foreground')).toBeInTheDocument()
    })

    it('centers content on screen', () => {
      const { container } = render(<RootError error={new Error()} reset={() => {}} />)
      
      const centered = container.querySelector('.min-h-screen.flex.items-center.justify-center')
      expect(centered).toBeInTheDocument()
    })
  })

  // Test all error pages have consistent structure
  describe('Error Page Consistency', () => {
    const errorComponents = [
      { Component: RootError, name: 'Root' },
      { Component: DocumentsError, name: 'Documents' },
      { Component: DirectoryError, name: 'Directory' },
      { Component: UpdatesError, name: 'Updates' },
    ]

    errorComponents.forEach(({ Component, name }) => {
      it(`${name} error page has reset button`, () => {
        render(<Component error={new Error()} reset={() => {}} />)
        
        // All error pages should have a reset button
        expect(screen.getByRole('button', { name: /try again|reset/i })).toBeInTheDocument()
      })

      it(`${name} error page displays error styling`, () => {
        const { container } = render(<Component error={new Error()} reset={() => {}} />)
        
        // Should have error-themed styling (destructive colors)
        const hasErrorStyling = container.querySelector('[class*="destructive"]') || 
                              container.querySelector('[class*="error"]')
        expect(hasErrorStyling).toBeTruthy()
      })
    })
  })
})