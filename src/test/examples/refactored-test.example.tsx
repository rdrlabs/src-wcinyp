import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DocumentsPage from '@/app/documents/page'
import { DocumentsPage as DocumentsPageObject } from '@/test/page-objects'

/**
 * Example: Refactoring tests to use Page Object Models
 * 
 * This shows how to convert brittle tests to use page objects
 * for better maintainability during rapid UI changes.
 */

describe('Documents Page - Refactored Example', () => {
  let page: DocumentsPageObject

  beforeEach(() => {
    render(<DocumentsPage />)
    page = new DocumentsPageObject()
  })

  // ❌ OLD: Brittle test that breaks with UI changes
  it.skip('OLD WAY: searches documents by text', async () => {
    const user = userEvent.setup()
    
    // This breaks if placeholder text changes
    const searchInput = screen.getByPlaceholderText('Search documents...')
    await user.type(searchInput, 'ABN')
    
    // This breaks if button text changes
    const categoryButton = screen.getByRole('button', { name: 'ABN Forms' })
    await user.click(categoryButton)
    
    // This breaks if the text format changes
    expect(screen.getByText('ABN - 55th Street.pdf')).toBeInTheDocument()
  })

  // ✅ NEW: Resilient test using page objects
  it('NEW WAY: searches documents using page object', async () => {
    // Actions are abstracted - UI can change without breaking tests
    await page.searchDocuments('ABN')
    await page.selectCategory('ABN Forms')
    
    // Assertions use stable patterns
    page.expectCategorySelected('ABN Forms')
    page.expectDocumentCount(5) // or whatever the expected count is
  })

  // ✅ Benefits of Page Objects:
  // 1. Single place to update when UI changes
  // 2. Reusable actions across tests
  // 3. Better test readability
  // 4. Consistent test patterns
  
  describe('Tab Navigation - Refactored', () => {
    // ❌ OLD: Checking specific text that might change
    it.skip('OLD WAY: switches tabs by text', async () => {
      const user = userEvent.setup()
      
      // Breaks if tab labels change
      const formsTab = screen.getByRole('tab', { name: /Interactive Forms|Forms/i })
      await user.click(formsTab)
      
      // Breaks if heading text changes
      expect(screen.getByText('Interactive Forms')).toBeInTheDocument()
    })

    // ✅ NEW: Using stable abstractions
    it('NEW WAY: switches tabs using page object', async () => {
      await page.switchToTab('forms')
      
      // Check for content, not specific text
      const formsListPage = new FormsListPage()
      formsListPage.expectFormTemplateVisible('Self Pay Waiver Form')
    })
  })

  describe('Document Download - Refactored', () => {
    // ✅ NEW: Action-focused test
    it('downloads document using page object', async () => {
      const mockOpen = vi.fn()
      window.open = mockOpen
      
      await page.downloadDocument('ABN - 55th Street.pdf')
      
      // Test the behavior, not the implementation
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('/documents/'),
        '_blank'
      )
    })
  })
})