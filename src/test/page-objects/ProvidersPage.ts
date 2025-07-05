import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Page Object Model for Providers Directory
 * Abstracts provider search and table interactions
 */
export class ProvidersPage {
  // Search functionality
  get searchInput() {
    return screen.getByTestId('providers-search-input')
  }

  // Table elements
  get table() {
    return screen.getByRole('table')
  }

  get tableCaption() {
    return screen.getByRole('caption')
  }

  // Actions
  async searchProviders(searchTerm: string) {
    const user = userEvent.setup()
    await user.clear(this.searchInput)
    await user.type(this.searchInput, searchTerm)
  }

  async clearSearch() {
    const user = userEvent.setup()
    await user.clear(this.searchInput)
  }

  // Provider row helpers
  getProviderRow(providerName: string) {
    const providerCell = screen.getByText(providerName)
    return providerCell.closest('tr')
  }

  getProviderDetails(providerName: string) {
    const row = this.getProviderRow(providerName)
    if (!row) return null

    const cells = within(row).getAllByRole('cell')
    return {
      name: cells[0]?.textContent || '',
      specialty: cells[1]?.textContent || '',
      department: cells[2]?.textContent || '',
      location: cells[3]?.textContent || '',
      contact: {
        phone: within(cells[4]).getByRole('link', { name: /\d{3}-\d{3}-\d{4}/ })?.textContent || '',
        email: within(cells[4]).getByRole('link', { name: /@/ })?.textContent || ''
      }
    }
  }

  // Contact actions
  async callProvider(providerName: string) {
    const user = userEvent.setup()
    const row = this.getProviderRow(providerName)
    if (!row) throw new Error(`Provider ${providerName} not found`)
    
    const phoneLink = within(row).getByRole('link', { name: /\d{3}-\d{3}-\d{4}/ })
    await user.click(phoneLink)
  }

  async emailProvider(providerName: string) {
    const user = userEvent.setup()
    const row = this.getProviderRow(providerName)
    if (!row) throw new Error(`Provider ${providerName} not found`)
    
    const emailLink = within(row).getByRole('link', { name: /@/ })
    await user.click(emailLink)
  }

  // Assertions
  expectProviderCount(count: number) {
    const rows = within(this.table).getAllByRole('row')
    // Subtract 1 for header row
    expect(rows.length - 1).toBe(count)
  }

  expectNoResults(searchTerm: string) {
    expect(this.tableCaption).toHaveTextContent(`No providers found matching "${searchTerm}"`)
  }

  expectProviderVisible(providerName: string) {
    expect(screen.getByText(providerName)).toBeInTheDocument()
  }

  expectProviderNotVisible(providerName: string) {
    expect(screen.queryByText(providerName)).not.toBeInTheDocument()
  }

  expectProviderSpecialty(providerName: string, specialty: string) {
    const details = this.getProviderDetails(providerName)
    expect(details?.specialty).toBe(specialty)
  }

  expectProviderDepartment(providerName: string, department: string) {
    const details = this.getProviderDetails(providerName)
    expect(details?.department).toBe(department)
  }

  expectProviderLocation(providerName: string, location: string) {
    const details = this.getProviderDetails(providerName)
    expect(details?.location).toBe(location)
  }
}