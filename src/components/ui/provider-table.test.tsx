import { render, screen, fireEvent } from '@testing-library/react'
import { ProviderTable } from './provider-table'
import type { Provider } from '@/types'

// Extended provider type for testing
interface ExtendedProvider extends Provider {
  npi?: string
  affiliation?: 'WCM' | 'NYP' | 'NYP-Affiliate' | 'NYP/Columbia' | 'Private' | 'BTC' | 'WCCC'
  flags?: Array<'vip' | 'urgent' | 'new' | 'teaching' | 'research' | 'multilingual'>
  languages?: string[]
  notes?: string
  availableToday?: boolean
}

const mockProviders: ExtendedProvider[] = [
  {
    id: 1,
    name: 'Dr. Jane Smith',
    specialty: 'Radiology',
    department: 'Diagnostic Imaging',
    location: '61st Street',
    phone: '(212) 746-1234',
    email: 'jane.smith@med.cornell.edu',
    npi: '1234567890',
    affiliation: 'WCM',
    flags: ['vip', 'teaching'],
    languages: ['English', 'Spanish'],
    notes: 'Specializes in pediatric imaging. Available for consultations on complex cases.',
    availableToday: true,
  },
  {
    id: 2,
    name: 'Dr. John Doe',
    specialty: 'Neuroradiology',
    department: 'Brain Imaging',
    location: 'Broadway',
    phone: '(212) 746-5678',
    email: 'john.doe@med.cornell.edu',
    npi: '0987654321',
    affiliation: 'NYP',
    flags: ['research', 'multilingual'],
    languages: ['English', 'Mandarin', 'French'],
  },
]

describe('ProviderTable', () => {
  it('renders providers correctly', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument()
  })

  it('displays provider specialty and department', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    expect(screen.getByText('Radiology')).toBeInTheDocument()
    expect(screen.getByText('Diagnostic Imaging')).toBeInTheDocument()
    expect(screen.getByText('Neuroradiology')).toBeInTheDocument()
    expect(screen.getByText('Brain Imaging')).toBeInTheDocument()
  })

  it('shows NPI numbers', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    expect(screen.getByText('NPI: 1234567890')).toBeInTheDocument()
    expect(screen.getByText('NPI: 0987654321')).toBeInTheDocument()
  })

  it('displays affiliation badges correctly', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    expect(screen.getByText('Weill Cornell Medicine')).toBeInTheDocument()
    expect(screen.getByText('NewYork-Presbyterian')).toBeInTheDocument()
  })

  it('shows location badges with correct styling', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    const sixtyFirstBadge = screen.getByText('61st Street')
    const broadwayBadge = screen.getByText('Broadway')
    
    expect(sixtyFirstBadge).toBeInTheDocument()
    expect(broadwayBadge).toBeInTheDocument()
    
    // Check that badges have location icon
    expect(sixtyFirstBadge.parentElement).toContainHTML('svg')
    expect(broadwayBadge.parentElement).toContainHTML('svg')
  })

  it('does not display provider flags', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    // Provider flags have been removed
    const { container } = render(<ProviderTable providers={mockProviders} />)
    const flagContainers = container.querySelectorAll('.absolute.-right-1.-bottom-1')
    
    // Should not have any flag containers
    expect(flagContainers.length).toBe(0)
  })

  it('does not show available today badge', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    // Available Today badge has been removed
    expect(screen.queryByText('Available Today')).not.toBeInTheDocument()
  })

  it('does not display languages', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    // Languages section has been removed
    expect(screen.queryByText('English, Spanish')).not.toBeInTheDocument()
    expect(screen.queryByText('English, Mandarin, French')).not.toBeInTheDocument()
  })

  it('renders contact information correctly', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    // Phone numbers
    const phoneLinks = screen.getAllByRole('link', { name: /\(212\) 746-/ })
    expect(phoneLinks[0]).toHaveAttribute('href', 'tel:(212) 746-1234')
    expect(phoneLinks[1]).toHaveAttribute('href', 'tel:(212) 746-5678')
    
    // Email addresses
    const emailLinks = screen.getAllByRole('link', { name: /@med.cornell.edu/ })
    expect(emailLinks[0]).toHaveAttribute('href', 'mailto:jane.smith@med.cornell.edu')
    expect(emailLinks[1]).toHaveAttribute('href', 'mailto:john.doe@med.cornell.edu')
  })

  it('renders only View Profile button', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    // Should only have View Profile button for each provider
    expect(screen.queryAllByText('Schedule')).toHaveLength(0)
    expect(screen.queryAllByText('vCard')).toHaveLength(0)
    expect(screen.getAllByText('View Profile')).toHaveLength(2)
  })

  it('expands and collapses notes section', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    // Notes should not be visible initially
    expect(screen.queryByText(/Specializes in pediatric imaging/)).not.toBeInTheDocument()
    
    // Click the Notes button
    const notesButton = screen.getByRole('button', { name: /Notes/ })
    fireEvent.click(notesButton)
    
    // Notes should now be visible
    expect(screen.getByText(/Specializes in pediatric imaging/)).toBeInTheDocument()
    
    // Click again to collapse
    fireEvent.click(notesButton)
    
    // Notes should be hidden again
    expect(screen.queryByText(/Specializes in pediatric imaging/)).not.toBeInTheDocument()
  })

  it('shows empty state when no providers', () => {
    render(<ProviderTable providers={[]} />)
    
    expect(screen.getByText('No providers available')).toBeInTheDocument()
  })

  it('shows search-specific empty state', () => {
    render(<ProviderTable providers={[]} searchTerm="cardiology" />)
    
    expect(screen.getByText('No providers found matching "cardiology"')).toBeInTheDocument()
  })

  it('renders provider initials in avatar', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    // The component uses getInitials which takes first letter of each word and then first 2 chars
    // Dr. Jane Smith -> D + J + S -> "DJS" -> "DJ"
    // Dr. John Doe -> D + J + D -> "DJD" -> "DJ"
    const avatarInitials = screen.getAllByText('DJ')
    expect(avatarInitials).toHaveLength(2) // Both providers result in "DJ"
  })

  it('does not render rating stars', () => {
    render(<ProviderTable providers={mockProviders} />)
    
    // Rating stars have been removed
    const ratings = screen.queryAllByText('(4.8)')
    expect(ratings).toHaveLength(0)
  })
})