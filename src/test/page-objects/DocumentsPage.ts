import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Page Object Model for Documents Page
 * Provides abstraction layer for UI interactions to reduce test brittleness
 */
export class DocumentsPage {
  // Element getters using data-testid when available
  get searchInput() {
    return screen.getByTestId('document-search-input')
  }

  get browseTab() {
    return screen.getByTestId('tab-browse')
  }

  get formsTab() {
    return screen.getByTestId('tab-forms')
  }

  get builderTab() {
    return screen.getByTestId('tab-builder')
  }

  getCategoryButton(category: string) {
    const testId = `category-button-${category.toLowerCase().replace(/\s+/g, '-')}`
    return screen.getByTestId(testId)
  }

  getDownloadButton(documentName: string) {
    const testId = `download-button-${documentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    return screen.getByTestId(testId)
  }

  // Action methods
  async searchDocuments(searchTerm: string) {
    const user = userEvent.setup()
    await user.clear(this.searchInput)
    await user.type(this.searchInput, searchTerm)
  }

  async selectCategory(category: string) {
    const user = userEvent.setup()
    await user.click(this.getCategoryButton(category))
  }

  async switchToTab(tab: 'browse' | 'forms' | 'builder') {
    const user = userEvent.setup()
    const tabMap = {
      browse: this.browseTab,
      forms: this.formsTab,
      builder: this.builderTab
    }
    await user.click(tabMap[tab])
  }

  async downloadDocument(documentName: string) {
    const user = userEvent.setup()
    await user.click(this.getDownloadButton(documentName))
  }

  // Assertion helpers
  expectCategorySelected(category: string) {
    const button = this.getCategoryButton(category)
    expect(button).toHaveAttribute('variant', 'default')
  }

  expectNoResults() {
    expect(screen.getByText(/no documents found/i)).toBeInTheDocument()
  }

  expectDocumentCount(count: number) {
    const documents = screen.getAllByRole('heading', { level: 3 })
    expect(documents).toHaveLength(count)
  }
}