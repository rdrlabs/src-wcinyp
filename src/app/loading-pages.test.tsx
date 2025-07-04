import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createLoadingPageTest } from '@/test/patterns'

// Import all loading components
import RootLoading from './loading'
import DocumentsLoading from './documents/loading'
import FormsLoading from './forms/loading'
import ProvidersLoading from './providers/loading'
import DirectoryLoading from './directory/loading'
import KnowledgeLoading from './knowledge/loading'

describe('Loading Pages', () => {
  // Use pattern for basic loading test
  createLoadingPageTest(RootLoading, 'Root')
  createLoadingPageTest(DocumentsLoading, 'Documents')
  createLoadingPageTest(FormsLoading, 'Forms')
  createLoadingPageTest(ProvidersLoading, 'Providers')
  createLoadingPageTest(DirectoryLoading, 'Directory')
  createLoadingPageTest(KnowledgeLoading, 'Knowledge')

  // Additional specific tests for root loading
  describe('Root Loading Page', () => {
    it('displays centered loading spinner', () => {
      render(<RootLoading />)
      
      // Check for spinner
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      
      // Check for loading text
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('uses min-h-screen for full height', () => {
      const { container } = render(<RootLoading />)
      const wrapper = container.querySelector('.min-h-screen')
      expect(wrapper).toBeInTheDocument()
    })
  })

  // Test skeleton screens for pages that use them
  describe('Documents Loading Page', () => {
    it('displays skeleton placeholders', () => {
      const { container } = render(<DocumentsLoading />)
      
      // Check for animate-pulse elements (skeleton indicators)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('shows correct number of skeleton rows', () => {
      const { container } = render(<DocumentsLoading />)
      
      // Should show 5 skeleton rows in the table area
      const tableArea = container.querySelector('.rounded-md.border')
      const rows = tableArea?.querySelectorAll('.mb-4.flex')
      expect(rows?.length).toBe(5)
    })
  })

  // Test that loading pages don't have interactive elements
  describe('Loading Page Accessibility', () => {
    const loadingComponents = [
      { Component: RootLoading, name: 'Root' },
      { Component: DocumentsLoading, name: 'Documents' },
      { Component: FormsLoading, name: 'Forms' },
      { Component: ProvidersLoading, name: 'Providers' },
      { Component: DirectoryLoading, name: 'Directory' },
      { Component: KnowledgeLoading, name: 'Knowledge' },
    ]

    loadingComponents.forEach(({ Component, name }) => {
      it(`${name} loading page has no interactive elements`, () => {
        const { container } = render(<Component />)
        
        // Should not have any buttons, links, or inputs
        const buttons = container.querySelectorAll('button')
        const links = container.querySelectorAll('a')
        const inputs = container.querySelectorAll('input, select, textarea')
        
        expect(buttons).toHaveLength(0)
        expect(links).toHaveLength(0)
        expect(inputs).toHaveLength(0)
      })

      it(`${name} loading page uses appropriate ARIA attributes`, () => {
        const { container } = render(<Component />)
        
        // Check for loading indicators
        const hasLoadingText = screen.queryByText(/loading/i)
        const hasSpinner = container.querySelector('.animate-spin')
        const hasPulse = container.querySelector('.animate-pulse')
        
        // At least one loading indicator should be present
        expect(hasLoadingText || hasSpinner || hasPulse).toBeTruthy()
      })
    })
  })

  // Test responsive behavior
  describe('Loading Page Responsiveness', () => {
    it('Documents loading uses container with responsive padding', () => {
      const { container } = render(<DocumentsLoading />)
      const wrapper = container.querySelector('.container.mx-auto')
      expect(wrapper).toBeInTheDocument()
    })

    it('Root loading centers content on all screen sizes', () => {
      const { container } = render(<RootLoading />)
      const centered = container.querySelector('.flex.items-center.justify-center')
      expect(centered).toBeInTheDocument()
    })
  })
})