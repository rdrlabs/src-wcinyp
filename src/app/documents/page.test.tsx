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

describe('Documents Page', () => {
  beforeEach(() => {
    render(<DocumentsPage />)
  })

  it('renders the page title and description', () => {
    expect(screen.getByText('Documents & Forms')).toBeInTheDocument()
    expect(screen.getByText('Medical forms and documents repository')).toBeInTheDocument()
  })

  it('shows documents view by default', () => {
    // Check that documents table is visible
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Document Name')).toBeInTheDocument()
  })

  it('toggles between documents and forms view', () => {
    // Should show documents initially
    expect(screen.getByText('Medical forms and documents repository')).toBeInTheDocument()
    
    // Find and click the toggle switch
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Should now show forms view
    expect(screen.getByText('Create and manage form templates')).toBeInTheDocument()
    expect(screen.getByText('Form Name')).toBeInTheDocument()
    
    // Toggle back to documents
    fireEvent.click(toggle)
    expect(screen.getByText('Medical forms and documents repository')).toBeInTheDocument()
  })

  it('shows correct labels near toggle switch', () => {
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Form Filler')).toBeInTheDocument()
  })

  it('displays form action buttons in forms view', () => {
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    expect(screen.getByText('Create New Form')).toBeInTheDocument()
    expect(screen.getByText('Import Template')).toBeInTheDocument()
    expect(screen.getByText('Bulk Export')).toBeInTheDocument()
    expect(screen.getByText('Print Batch')).toBeInTheDocument()
  })

  it('shows self-pay form automation section in forms view', () => {
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    expect(screen.getByText('Self-Pay Form Automation')).toBeInTheDocument()
    expect(screen.getByText(/Streamline the self-pay process/)).toBeInTheDocument()
    expect(screen.getByText('Configure Self-Pay Workflow')).toBeInTheDocument()
  })

  it('shows form templates table in forms view', () => {
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Check form table headers
    expect(screen.getByText('Form Name')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Fields')).toBeInTheDocument()
    expect(screen.getByText('Submissions')).toBeInTheDocument()
    expect(screen.getByText('Last Used')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('opens form builder when Fill button is clicked', async () => {
    const user = userEvent.setup()
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Find and click a Fill button
    const fillButtons = screen.getAllByText('Fill')
    await user.click(fillButtons[0])
    
    // Should show back button and form builder
    expect(screen.getByText('← Back to Forms')).toBeInTheDocument()
    expect(screen.getByTestId('form-builder')).toBeInTheDocument()
  })

  it('returns to forms list when Back to Forms is clicked', async () => {
    const user = userEvent.setup()
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Open a form
    const fillButtons = screen.getAllByText('Fill')
    await user.click(fillButtons[0])
    
    // Click back button
    const backButton = screen.getByText('← Back to Forms')
    await user.click(backButton)
    
    // Should be back at forms list
    expect(screen.getByText('Form Name')).toBeInTheDocument()
    expect(screen.queryByTestId('form-builder')).not.toBeInTheDocument()
  })

  it('search functionality works in both views', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText('Search documents...')
    
    // Search in documents view
    await user.type(searchInput, 'ABN')
    const abnDocs = screen.getAllByText(/ABN/i)
    expect(abnDocs.length).toBeGreaterThan(0)
    
    // Clear search and switch to forms
    await user.clear(searchInput)
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Search in forms view
    await user.type(searchInput, 'patient')
    const patientForms = screen.getAllByText(/patient/i)
    expect(patientForms.length).toBeGreaterThan(0)
  })

  it('displays all document categories', () => {
    // Use getAllByRole to find category buttons
    const categoryButtons = screen.getAllByRole('button')
    const categoryNames = categoryButtons.map(btn => btn.textContent)
    
    expect(categoryNames.some(name => name?.includes('ABN Forms'))).toBe(true)
    expect(categoryNames.some(name => name?.includes('Calcium Score ABN'))).toBe(true)
    expect(categoryNames.some(name => name?.includes('Patient Questionnaires'))).toBe(true)
    expect(categoryNames.some(name => name?.includes('Administrative Forms'))).toBe(true)
    expect(categoryNames.some(name => name?.includes('Fax Transmittal Forms'))).toBe(true)
    expect(categoryNames.some(name => name?.includes('Invoice Forms'))).toBe(true)
  })

  it('shows correct document count', () => {
    expect(screen.getByText(/69 documents available/)).toBeInTheDocument()
  })

  it('filters documents by search term', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText('Search documents...')
    
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
    
    // Click on Patient Questionnaires category
    const categoryButton = screen.getByRole('button', { name: /Patient Questionnaires/i })
    await user.click(categoryButton)
    
    // Should show questionnaires
    expect(screen.getByText('Biopsy Questionnaire.pdf')).toBeInTheDocument()
    expect(screen.getByText('CT Questionnaire.pdf')).toBeInTheDocument()
    
    // Should not show other categories
    expect(screen.queryByText('ABN - 55th Street.pdf')).not.toBeInTheDocument()
  })

  it('displays document metadata in table', () => {
    // Check table headers
    expect(screen.getByText('Document Name')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getByText('Updated')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('shows download buttons for each document', () => {
    const downloadButtons = screen.getAllByText('Download')
    expect(downloadButtons.length).toBeGreaterThan(0)
  })

  it('displays form action buttons for each template', () => {
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Should have Fill, Preview, and Clone buttons for each form
    const fillButtons = screen.getAllByText('Fill')
    const previewButtons = screen.getAllByText('Preview')
    const cloneButtons = screen.getAllByText('Clone')
    
    expect(fillButtons.length).toBeGreaterThan(0)
    expect(previewButtons.length).toBeGreaterThan(0)
    expect(cloneButtons.length).toBeGreaterThan(0)
    expect(fillButtons.length).toBe(previewButtons.length)
    expect(fillButtons.length).toBe(cloneButtons.length)
  })
})