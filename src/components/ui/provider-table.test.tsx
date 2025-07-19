import { render, screen, fireEvent } from '@testing-library/react'
import { ProviderTable } from './provider-table'
import type { Provider } from '@/types'
import { renderWithTheme } from '@/test/theme-test-utils'

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

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <ProviderTable providers={mockProviders} />,
        { theme: 'light' }
      )

      // Check table uses semantic colors
      const table = container.querySelector('table')
      expect(table).toHaveClass('w-full')
      
      // Check avatar backgrounds use semantic colors
      const avatars = container.querySelectorAll('[class*="bg-primary/10"]')
      expect(avatars.length).toBeGreaterThan(0)
      avatars.forEach(avatar => {
        expect(avatar.className).toContain('bg-primary/10')
      })
      
      // Check provider names don't use hard-coded colors
      const providerNames = screen.getAllByText(/Dr\. (Jane Smith|John Doe)/)
      providerNames.forEach(name => {
        expect(name.className).toContain('font-medium')
        expect(name.className).not.toMatch(/text-gray-\d+/)
      })
      
      // Check specialty text uses semantic colors
      const specialties = screen.getAllByText(/(Radiology|Neuroradiology)/)
      specialties.forEach(specialty => {
        expect(specialty.className).toContain('text-muted-foreground')
      })
      
      // Check department text uses semantic colors  
      const departments = screen.getAllByText(/(Diagnostic Imaging|Brain Imaging)/)
      departments.forEach(dept => {
        expect(dept.className).toContain('text-muted-foreground')
      })
      
      // Check contact links use semantic colors
      const phoneLinks = screen.getAllByRole('link', { name: /\(212\) 746-/ })
      phoneLinks.forEach(link => {
        expect(link.className).toContain('text-muted-foreground')
        expect(link.className).toContain('hover:text-foreground')
      })
      
      // Check View Profile button uses semantic colors
      const viewButtons = screen.getAllByText('View Profile')
      viewButtons.forEach(button => {
        expect(button.parentElement?.className).toContain('bg-primary')
        expect(button.parentElement?.className).toContain('text-primary-foreground')
      })
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <ProviderTable providers={mockProviders} />,
        { theme: 'dark' }
      )

      // Check table maintains semantic colors in dark mode
      const rows = container.querySelectorAll('tr')
      rows.forEach(row => {
        if (row.parentElement?.tagName === 'TBODY') {
          expect(row.className).toContain('hover:bg-muted/50')
        }
      })
      
      // Check avatars maintain semantic colors
      const avatars = container.querySelectorAll('[class*="bg-primary/10"]')
      avatars.forEach(avatar => {
        expect(avatar.className).toContain('bg-primary/10')
      })
      
      // Check avatar text uses semantic colors
      const avatarTexts = screen.getAllByText('DJ')
      avatarTexts.forEach(text => {
        expect(text.className).toContain('text-primary')
        expect(text.className).toContain('font-semibold')
      })
      
      // Check badges use semantic colors
      const affiliationBadges = screen.getAllByText(/(Weill Cornell Medicine|NewYork-Presbyterian)/)
      affiliationBadges.forEach(badge => {
        const badgeElement = badge.parentElement
        expect(badgeElement?.className).toContain('bg-')
        expect(badgeElement?.className).toContain('text-')
      })
      
      // Check location badges
      const locationBadges = screen.getAllByText(/(61st Street|Broadway)/)
      locationBadges.forEach(badge => {
        const badgeContainer = badge.parentElement
        expect(badgeContainer?.className).toContain('bg-secondary')
        expect(badgeContainer?.className).toContain('text-secondary-foreground')
      })
    })

    it('maintains semantic colors for expandable notes', () => {
      const { container } = renderWithTheme(
        <ProviderTable providers={mockProviders} />,
        { theme: 'dark' }
      )
      
      // Click Notes button to expand
      const notesButton = screen.getByRole('button', { name: /Notes/ })
      expect(notesButton.className).toContain('text-muted-foreground')
      expect(notesButton.className).toContain('hover:text-foreground')
      
      fireEvent.click(notesButton)
      
      // Check expanded notes use semantic colors
      const notesText = screen.getByText(/Specializes in pediatric imaging/)
      expect(notesText.className).toContain('text-muted-foreground')
      
      // Check the notes container background
      const notesContainer = notesText.closest('td')?.querySelector('div')
      expect(notesContainer?.className).toContain('bg-muted/30')
      expect(notesContainer?.className).toContain('border')
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <ProviderTable providers={mockProviders} searchTerm="test" />,
        { theme: 'dark' }
      )
      
      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string') {
          // Should not contain hard-coded color values
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone)-\d+/)
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone)-\d+/)
          expect(classList).not.toMatch(/border-(gray|slate|zinc|neutral|stone)-\d+/)
        }
      })
    })

    it('empty state uses semantic colors', () => {
      renderWithTheme(
        <ProviderTable providers={[]} searchTerm="cardiology" />,
        { theme: 'light' }
      )
      
      const emptyStateText = screen.getByText('No providers found matching "cardiology"')
      expect(emptyStateText.className).toContain('text-muted-foreground')
      
      const emptyStateContainer = emptyStateText.closest('td')
      expect(emptyStateContainer?.className).toContain('text-center')
    })

    it('maintains theme consistency across all provider data', () => {
      const extendedProviders: ExtendedProvider[] = [
        ...mockProviders,
        {
          id: 3,
          name: 'Dr. Sarah Johnson',
          specialty: 'Interventional Radiology',
          department: 'Vascular Imaging',
          location: 'York Avenue',
          phone: '(212) 746-9999',
          email: 'sarah.johnson@med.cornell.edu',
          npi: '1122334455',
          affiliation: 'NYP/Columbia',
          flags: ['new', 'urgent'],
          availableToday: false,
        },
        {
          id: 4,
          name: 'Dr. Michael Chen',
          specialty: 'Pediatric Radiology',
          department: 'Children\'s Imaging',
          location: '68th Street',
          phone: '(212) 746-7777',
          email: 'michael.chen@med.cornell.edu',
          npi: '5544332211',
          affiliation: 'Private',
          languages: ['English', 'Cantonese'],
          notes: 'Accepting new patients. Specializes in non-invasive pediatric imaging techniques.',
        },
      ]
      
      const { container } = renderWithTheme(
        <ProviderTable providers={extendedProviders} />,
        { theme: 'dark' }
      )
      
      // Check all provider rows maintain consistent styling
      const providerRows = container.querySelectorAll('tbody tr')
      expect(providerRows).toHaveLength(4)
      
      providerRows.forEach(row => {
        expect(row.className).toContain('hover:bg-muted/50')
        expect(row.className).toContain('transition-colors')
      })
      
      // Check all avatars have consistent styling
      const avatars = container.querySelectorAll('.w-12.h-12.rounded-full')
      expect(avatars).toHaveLength(4)
      avatars.forEach(avatar => {
        expect(avatar.className).toContain('bg-primary/10')
      })
      
      // Check all affiliation badges maintain semantic colors
      const nypColumbiaBadge = screen.getByText('NYP/Columbia')
      expect(nypColumbiaBadge.parentElement?.className).toContain('bg-purple-100')
      expect(nypColumbiaBadge.parentElement?.className).toContain('text-purple-800')
      
      const privateBadge = screen.getByText('Private Practice')
      expect(privateBadge.parentElement?.className).toContain('bg-amber-100')
      expect(privateBadge.parentElement?.className).toContain('text-amber-800')
      
      // Check all location badges use consistent semantic styling
      const allLocationBadges = screen.getAllByText(/(61st Street|Broadway|York Avenue|68th Street)/)
      allLocationBadges.forEach(badge => {
        const parent = badge.parentElement
        expect(parent?.className).toContain('bg-secondary')
        expect(parent?.className).toContain('text-secondary-foreground')
      })
    })

    it('interactive elements maintain semantic colors', () => {
      const { container } = renderWithTheme(
        <ProviderTable providers={mockProviders} />,
        { theme: 'light' }
      )
      
      // Check all interactive elements
      const links = container.querySelectorAll('a')
      links.forEach(link => {
        if (link.className.includes('text-')) {
          expect(link.className).toContain('hover:text-foreground')
        }
      })
      
      const buttons = container.querySelectorAll('button')
      buttons.forEach(button => {
        if (button.textContent === 'View Profile') {
          expect(button.className).toContain('bg-primary')
          expect(button.className).toContain('hover:bg-primary/90')
        } else if (button.textContent?.includes('Notes')) {
          expect(button.className).toContain('hover:text-foreground')
        }
      })
    })

    it('complex provider table with all features', () => {
      const { container } = renderWithTheme(
        <div className="p-8 bg-background">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-2xl font-bold mb-4">Provider Directory</h2>
            <p className="text-muted-foreground mb-6">
              Browse our network of healthcare providers
            </p>
            <ProviderTable providers={mockProviders} />
          </div>
        </div>,
        { theme: 'dark' }
      )
      
      // Check wrapper uses semantic colors
      const wrapper = container.querySelector('.bg-background')
      expect(wrapper).toBeInTheDocument()
      
      // Check card container uses semantic colors
      const card = container.querySelector('.bg-card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('border')
      
      // Check heading uses semantic styling
      const heading = screen.getByText('Provider Directory')
      expect(heading.className).toContain('font-bold')
      
      // Check description uses semantic colors
      const description = screen.getByText('Browse our network of healthcare providers')
      expect(description.className).toContain('text-muted-foreground')
      
      // Ensure table inherits theme correctly
      const table = container.querySelector('table')
      expect(table?.closest('.bg-card')).toBeInTheDocument()
    })
  })
})