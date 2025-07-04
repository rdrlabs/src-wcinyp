import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import ProvidersPage from './page'

describe('Providers Page', () => {
  beforeEach(() => {
    render(<ProvidersPage />)
  })

  it('renders the page title', () => {
    expect(screen.getByText('Provider Directory')).toBeInTheDocument()
    expect(screen.getByText('Medical staff contact information and specialties')).toBeInTheDocument()
  })

  it('displays all providers in table', () => {
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument()
    expect(screen.getByText('8 providers in directory')).toBeInTheDocument()
  })

  it('shows provider details', () => {
    // Check for Dr. Sarah Johnson's details
    const row = screen.getByText('Dr. Sarah Johnson').closest('tr')
    expect(row).toHaveTextContent('Radiology')
    expect(row).toHaveTextContent('Imaging')
    expect(row).toHaveTextContent('61st Street')
    expect(row).toHaveTextContent('(212) 555-0101')
    expect(row).toHaveTextContent('sjohnson@wcinyp.org')
  })

  it('filters providers by search term', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText(/search providers/i)
    
    // Search for "sarah"
    await user.type(searchInput, 'sarah')
    
    // Should show matching provider
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument()
    
    // Should hide non-matching providers
    expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument()
    
    // Update count
    expect(screen.getByText('1 providers in directory')).toBeInTheDocument()
  })

  it('searches by specialty', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText(/search providers/i)
    
    // Search for "radiology"
    await user.type(searchInput, 'radiology')
    
    // Should show radiologists
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Dr. Emily Rodriguez')).toBeInTheDocument()
  })

  it('searches by location', async () => {
    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText(/search providers/i)
    
    // Search for "61st Street"
    await user.type(searchInput, '61st Street')
    
    // Should show provider at that location
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument()
    expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument()
  })
})