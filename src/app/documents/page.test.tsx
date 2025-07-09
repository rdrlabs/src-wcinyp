import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import DocumentsPage from './page'

// Mock FormBuilder component
vi.mock('@/components/FormBuilder', () => ({
  FormBuilder: ({ template }: { template: { name: string } }) => (
    <div data-testid="form-builder">Form Builder for {template.name}</div>
  ),
}))

// Mock DetailsSheet to prevent it from opening during tests
vi.mock('@/components/shared', () => ({
  DetailsSheet: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => 
    isOpen ? (
      <div role="dialog" aria-label="Details">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}))

describe('Documents Page', () => {
  beforeEach(() => {
    render(<DocumentsPage />)
  })

  it('renders the page title and description', () => {
    expect(screen.getByText('Documents & Forms')).toBeInTheDocument()
    expect(screen.getByText('Access medical forms, documents, and create custom forms')).toBeInTheDocument()
  })

  it('shows documents view by default', () => {
    // Check that tabs are visible and 'all' tab is selected by default
    expect(screen.getByRole('tab', { name: /All/i })).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('toggles between documents and forms view', async () => {
    const user = userEvent.setup()
    
    // Should show all items initially
    expect(screen.getByRole('tab', { name: /All/i })).toHaveAttribute('data-state', 'active')
    
    // Click on Forms tab - be specific to avoid matching "ABN Forms", etc.
    const formsTab = screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })
    fireEvent.click(formsTab)
    
    // Close the details sheet if it opened
    const closeButton = screen.queryByText('Close')
    if (closeButton) {
      await user.click(closeButton)
    }
    
    // Should now show forms view
    expect(formsTab).toHaveAttribute('data-state', 'active')
    
    // Forms view specific elements should be visible
    expect(screen.getByText('Create New Form')).toBeInTheDocument()
    
    // Click on Documents tab
    const documentsTab = screen.getByRole('tab', { name: /^Documents \(\d+\)$/ })
    fireEvent.click(documentsTab)
    
    // Close the details sheet if it opened again
    const closeButton2 = screen.queryByText('Close')
    if (closeButton2) {
      await user.click(closeButton2)
    }
    
    expect(documentsTab).toHaveAttribute('data-state', 'active')
    
    // Forms view elements should no longer be visible
    expect(screen.queryByText('Create New Form')).not.toBeInTheDocument()
  })

  it('shows correct tabs', () => {
    expect(screen.getByRole('tab', { name: /^Documents \(\d+\)$/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })).toBeInTheDocument()
  })

  it('displays form action buttons in forms view', async () => {
    const user = userEvent.setup()
    const formsTab = screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })
    fireEvent.click(formsTab)
    
    // Close the details sheet if it opened
    const closeButton = screen.queryByText('Close')
    if (closeButton) {
      await user.click(closeButton)
    }
    
    expect(screen.getByText('Create New Form')).toBeInTheDocument()
    expect(screen.getByText('Import Template')).toBeInTheDocument()
    expect(screen.getByText('Bulk Export')).toBeInTheDocument()
    expect(screen.getByText('Print Batch')).toBeInTheDocument()
  })

  it('shows self-pay form automation section in forms view', async () => {
    const user = userEvent.setup()
    const formsTab = screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })
    fireEvent.click(formsTab)
    
    // Close the details sheet if it opened
    const closeButton = screen.queryByText('Close')
    if (closeButton) {
      await user.click(closeButton)
    }
    
    expect(screen.getByText('Self-Pay Form Automation')).toBeInTheDocument()
    expect(screen.getByText(/Streamline the self-pay process/)).toBeInTheDocument()
    expect(screen.getByText('Configure Self-Pay Workflow')).toBeInTheDocument()
  })

  it('shows form templates table in forms view', async () => {
    const user = userEvent.setup()
    const formsTab = screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })
    fireEvent.click(formsTab)
    
    // Close the details sheet if it opened
    const closeButton = screen.queryByText('Close')
    if (closeButton) {
      await user.click(closeButton)
    }
    
    // Check table headers using columnheader role
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Size' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Updated' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument()
  })

  it('opens form builder when View button is clicked', async () => {
    const user = userEvent.setup()
    const formsTab = screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })
    fireEvent.click(formsTab)
    
    // Close the details sheet if it opened
    const closeButton = screen.queryByText('Close')
    if (closeButton) {
      await user.click(closeButton)
    }
    
    // Find and click a View button in actions menu - look for "Open menu" buttons
    const actionsButtons = screen.getAllByRole('button', { name: 'Open menu' })
    expect(actionsButtons.length).toBeGreaterThan(0)
    await user.click(actionsButtons[0])
    
    const viewButton = screen.getByRole('menuitem', { name: /View/i })
    await user.click(viewButton)
    
    // Should show back button and form builder
    expect(screen.getByText('← Back to Forms')).toBeInTheDocument()
    expect(screen.getByTestId('form-builder')).toBeInTheDocument()
  })

  it('returns to forms list when Back to Forms is clicked', async () => {
    const user = userEvent.setup()
    const formsTab = screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })
    fireEvent.click(formsTab)
    
    // Close the details sheet if it opened
    const closeButton = screen.queryByText('Close')
    if (closeButton) {
      await user.click(closeButton)
    }
    
    // Open a form using actions menu - look for "Open menu" buttons
    const actionsButtons = screen.getAllByRole('button', { name: 'Open menu' })
    expect(actionsButtons.length).toBeGreaterThan(0)
    await user.click(actionsButtons[0])
    const viewButton = screen.getByRole('menuitem', { name: /View/i })
    await user.click(viewButton)
    
    // Click back button
    const backButton = screen.getByText('← Back to Forms')
    await user.click(backButton)
    
    // Should be back at forms list
    expect(screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })).toHaveAttribute('data-state', 'active')
    expect(screen.queryByTestId('form-builder')).not.toBeInTheDocument()
  })

  it('search functionality works in both views', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText('Search...')
    
    // Search in documents view
    await user.type(searchInput, 'ABN')
    const abnDocs = screen.getAllByText(/ABN/i)
    expect(abnDocs.length).toBeGreaterThan(0)
    
    // Clear search and switch to forms
    await user.clear(searchInput)
    const formsTab = screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })
    fireEvent.click(formsTab)
    
    // Close the details sheet if it opened
    const closeButton = screen.queryByText('Close')
    if (closeButton) {
      await user.click(closeButton)
    }
    
    // Search in forms view
    await user.type(searchInput, 'patient')
    const patientForms = screen.getAllByText(/patient/i)
    expect(patientForms.length).toBeGreaterThan(0)
  })

  it('displays all document categories', () => {
    // Categories are shown as tabs
    const tabs = screen.getAllByRole('tab')
    const tabNames = tabs.map(tab => tab.textContent)
    
    expect(tabNames.some(name => name?.includes('ABN Forms'))).toBe(true)
    expect(tabNames.some(name => name?.includes('Calcium Score ABN'))).toBe(true)
    expect(tabNames.some(name => name?.includes('Patient Questionnaires'))).toBe(true)
    expect(tabNames.some(name => name?.includes('Administrative Forms'))).toBe(true)
    expect(tabNames.some(name => name?.includes('Fax Transmittal Forms'))).toBe(true)
    expect(tabNames.some(name => name?.includes('Invoice Forms'))).toBe(true)
  })

  it('shows correct document count', () => {
    // The count is displayed in tabs
    const allTab = screen.getByRole('tab', { name: /All/i })
    expect(allTab.textContent).toMatch(/\d+/) // Should contain a number
  })

  it('filters documents by search term', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText('Search...')
    
    // Search for ABN
    await user.type(searchInput, 'ABN')
    
    // Should show ABN-related documents
    const abnDocs = screen.getAllByText(/ABN/i)
    expect(abnDocs.length).toBeGreaterThan(0)
    
    // Non-ABN documents should be filtered out
    expect(screen.queryByText('Biopsy Questionnaire.pdf')).not.toBeInTheDocument()
  })

  it('filters documents by category', async () => {
    const user = userEvent.setup()
    
    // Click on Patient Questionnaires tab
    const categoryTab = screen.getByRole('tab', { name: /Patient Questionnaires/i })
    await user.click(categoryTab)
    
    // Tab should be active
    expect(categoryTab).toHaveAttribute('data-state', 'active')
  })

  it('displays document metadata in table', () => {
    // Check table headers - using columnheader role for DataTable
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Size' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Updated' })).toBeInTheDocument()
    // Actions column header might not have text
    const headers = screen.getAllByRole('columnheader')
    expect(headers.length).toBeGreaterThanOrEqual(5)
  })

  it('shows download buttons for each document', async () => {
    const user = userEvent.setup()
    
    // Actions are in dropdown menus - look for "Open menu" buttons
    const actionsButtons = screen.getAllByRole('button', { name: 'Open menu' })
    expect(actionsButtons.length).toBeGreaterThan(0)
    
    // Click the first action button
    await user.click(actionsButtons[0])
    
    // Check for Download option in the menu
    expect(screen.getByRole('menuitem', { name: /Download/i })).toBeInTheDocument()
  })

  it('displays form action buttons for each template', async () => {
    const user = userEvent.setup()
    const formsTab = screen.getByRole('tab', { name: /^Forms \(\d+\)$/ })
    fireEvent.click(formsTab)
    
    // Close the details sheet if it opened
    const closeButton = screen.queryByText('Close')
    if (closeButton) {
      await user.click(closeButton)
    }
    
    // Actions are in dropdown menus - look for "Open menu" buttons
    const actionsButtons = screen.getAllByRole('button', { name: 'Open menu' })
    expect(actionsButtons.length).toBeGreaterThan(0)
    
    // Click the first action button
    await user.click(actionsButtons[0])
    
    // Check for View option in the menu
    expect(screen.getByRole('menuitem', { name: /View/i })).toBeInTheDocument()
  })
})