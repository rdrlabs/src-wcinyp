import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import DocumentsPage from './page'

describe('Documents Page', () => {
  beforeEach(() => {
    render(<DocumentsPage />)
  })

  it('renders the page title and description', () => {
    expect(screen.getByText('Document Hub')).toBeInTheDocument()
    expect(screen.getByText('Medical forms and documents repository')).toBeInTheDocument()
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
})