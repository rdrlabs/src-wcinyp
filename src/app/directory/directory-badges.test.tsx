import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DirectoryPage from './page'

// Mock the contacts data
vi.mock('@/data/contacts.json', () => ({
  default: {
    contacts: [
      {
        id: 1,
        name: 'Dr. John Smith',
        type: 'Provider',
        department: 'Radiology',
        phone: '(212) 555-0101',
        email: 'john.smith@wcinyp.org',
        location: 'Main Building, Floor 3',
        lastContact: '2024-03-15'
      },
      {
        id: 2,
        name: 'Blue Cross Insurance',
        type: 'Insurance',
        department: 'Claims',
        phone: '1-800-555-0102',
        email: 'claims@bluecross.com',
        location: 'External',
        lastContact: '2024-03-14'
      },
      {
        id: 3,
        name: 'Central Lab Services',
        type: 'Lab',
        department: 'Pathology',
        phone: '(212) 555-0103',
        email: 'lab@wcinyp.org',
        location: 'Building B, Floor 1',
        lastContact: '2024-03-13'
      }
    ]
  }
}))

describe('Directory Page Badge Implementation', () => {
  it('should render contact type badges using Badge component', () => {
    render(<DirectoryPage />)
    
    // Check that badges are rendered (both in filter buttons and table)
    const providerBadges = screen.getAllByText('Provider')
    const insuranceBadges = screen.getAllByText('Insurance')
    const labBadges = screen.getAllByText('Lab')
    
    // At least one of each type should exist
    expect(providerBadges.length).toBeGreaterThan(0)
    expect(insuranceBadges.length).toBeGreaterThan(0)
    expect(labBadges.length).toBeGreaterThan(0)
  })

  it('should apply correct color classes to Provider badge', () => {
    render(<DirectoryPage />)
    
    // Get badges in the table, not filter buttons
    const providerBadges = screen.getAllByText('Provider')
    // Find the one that's actually a badge (in the table)
    const tableBadge = providerBadges.find(badge => 
      badge.className.includes('bg-blue-50') || badge.className.includes('inline-flex')
    )
    
    expect(tableBadge).toBeDefined()
    expect(tableBadge?.className).toContain('bg-blue-50')
    expect(tableBadge?.className).toContain('dark:bg-blue-950/50')
    expect(tableBadge?.className).toContain('text-blue-700')
    expect(tableBadge?.className).toContain('dark:text-blue-300')
  })

  it('should apply correct color classes to Insurance badge', () => {
    render(<DirectoryPage />)
    
    const insuranceBadges = screen.getAllByText('Insurance')
    const tableBadge = insuranceBadges.find(badge => 
      badge.className.includes('bg-green-50') || badge.className.includes('inline-flex')
    )
    
    expect(tableBadge).toBeDefined()
    expect(tableBadge?.className).toContain('bg-green-50')
    expect(tableBadge?.className).toContain('dark:bg-green-950/50')
    expect(tableBadge?.className).toContain('text-green-700')
    expect(tableBadge?.className).toContain('dark:text-green-300')
  })

  it('should apply correct color classes to Lab badge', () => {
    render(<DirectoryPage />)
    
    const labBadges = screen.getAllByText('Lab')
    const tableBadge = labBadges.find(badge => 
      badge.className.includes('bg-yellow-50') || badge.className.includes('inline-flex')
    )
    
    expect(tableBadge).toBeDefined()
    expect(tableBadge?.className).toContain('bg-yellow-50')
    expect(tableBadge?.className).toContain('dark:bg-yellow-950/50')
    expect(tableBadge?.className).toContain('text-yellow-700')
    expect(tableBadge?.className).toContain('dark:text-yellow-300')
  })

  it('should have Badge component structure', () => {
    render(<DirectoryPage />)
    
    const allElements = screen.getAllByText(/Provider|Insurance|Lab/)
    // Filter to only get the table badges (not buttons)
    const badges = allElements.filter(el => 
      el.className.includes('bg-') && el.className.includes('50')
    )
    
    expect(badges.length).toBeGreaterThan(0)
    
    badges.forEach(badge => {
      // Badge component should have proper structure
      expect(badge.className).toContain('text-xs')
      // Should have rounded corners
      expect(badge.className).toContain('rounded')
    })
  })
})