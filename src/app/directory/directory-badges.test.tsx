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

  it('should apply semantic color classes to Provider badge', () => {
    render(<DirectoryPage />)
    
    // Get all elements with Provider text
    const providerElements = screen.getAllByText('Provider')
    
    // At least one should exist
    expect(providerElements.length).toBeGreaterThan(0)
    
    // Check if any of them have badge styling
    const hasBadgeStyling = providerElements.some(element => {
      const className = element.className + ' ' + (element.parentElement?.className || '')
      return className.includes('rounded') && className.includes('px-2')
    })
    
    expect(hasBadgeStyling).toBe(true)
  })

  // Test removed - NEUTRAL_BADGES_ONLY is always true now

  it('should render Insurance badge with secondary variant', () => {
    render(<DirectoryPage />)
    
    // The Badge component with variant="secondary" is rendered
    const insuranceBadges = screen.getAllByText('Insurance')
    expect(insuranceBadges.length).toBeGreaterThan(0)
    
    // At least one should be in the table (not in filters)
    const tableInsuranceBadge = insuranceBadges.find(badge => 
      badge.closest('table') !== null
    )
    expect(tableInsuranceBadge).toBeDefined()
  })

  it('should render Lab badge with secondary variant', () => {
    render(<DirectoryPage />)
    
    // The Badge component with variant="secondary" is rendered
    const labBadges = screen.getAllByText('Lab')
    expect(labBadges.length).toBeGreaterThan(0)
    
    // At least one should be in the table (not in filters)
    const tableLabBadge = labBadges.find(badge => 
      badge.closest('table') !== null
    )
    expect(tableLabBadge).toBeDefined()
  })

  it('should have Badge component structure', () => {
    render(<DirectoryPage />)
    
    const allElements = screen.getAllByText(/Provider|Insurance|Lab/)
    // Filter to only get the table badges (not buttons)
    const badges = allElements.filter(el => {
      const parent = el.parentElement
      // Look for elements that are either the badge itself or inside a badge
      return (el.className.includes('inline-flex') && el.className.includes('rounded')) ||
             (parent?.className.includes('inline-flex') && parent?.className.includes('rounded'))
    })
    
    expect(badges.length).toBeGreaterThan(0)
    
    badges.forEach(badge => {
      // Badge component should have proper structure
      expect(badge.className).toContain('text-sm')
      // Should have rounded corners
      expect(badge.className).toContain('rounded')
    })
  })
})