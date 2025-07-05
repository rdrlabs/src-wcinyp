import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ProvidersPage from './page'

// Mock the icon utilities
vi.mock('@/lib/icons', () => ({
  getSpecialtyIcon: () => () => null,
  getLocationColor: () => 'bg-blue-50 text-blue-700',
  getAffiliationInfo: () => ({ label: 'Columbia', color: 'bg-purple-50 text-purple-700' }),
  getFlagInfo: () => ({ icon: () => null, color: 'text-blue-500', tooltip: 'Test flag' })
}))

describe('Providers Page', () => {
  beforeEach(() => {
    render(<ProvidersPage />)
  })

  it('renders the page title', () => {
    expect(screen.getByText('Provider Directory')).toBeInTheDocument()
    expect(screen.getByText('Medical staff contact information and specialties')).toBeInTheDocument()
  })

  it('displays all providers in cards', () => {
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument()
    // Note: The UI no longer shows a count of providers
  })

  it('shows provider details', () => {
    // Check for Dr. Sarah Johnson's details
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Radiology')).toBeInTheDocument()
    // Multiple elements might have "Imaging" text, so use getAllByText
    const imagingElements = screen.getAllByText('Imaging')
    expect(imagingElements.length).toBeGreaterThan(0)
    expect(screen.getByText('61st Street')).toBeInTheDocument()
    expect(screen.getByText('(212) 555-0101')).toBeInTheDocument()
    expect(screen.getByText('sjohnson@wcinyp.org')).toBeInTheDocument()
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