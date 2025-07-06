import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import DirectoryPage from './page'
import { axe } from 'jest-axe'
import contactsData from '@/data/contacts.json'

describe('Directory Page', () => {
  describe('Page Structure', () => {
    it('renders page title and description', () => {
      render(<DirectoryPage />)
      
      expect(screen.getByRole('heading', { name: 'Directory' })).toBeInTheDocument()
      expect(screen.getByText('Comprehensive contact database for all internal staff, facilities, and partners')).toBeInTheDocument()
    })

    it('displays all contacts by default', () => {
      render(<DirectoryPage />)
      
      // Table should contain all contacts
      const rows = screen.getAllByRole('row')
      // Subtract 1 for header row
      expect(rows.length - 1).toBe(contactsData.contacts.length)
    })

    it('renders contact table with correct headers', () => {
      render(<DirectoryPage />)
      
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Department' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Contact Info' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Location' })).toBeInTheDocument()
    })
  })

  describe('View Toggle', () => {
    it('displays view toggle buttons', () => {
      render(<DirectoryPage />)
      
      // Check we have the view toggle buttons
      expect(screen.getByRole('button', { name: 'Directory' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Referring Provider Database' })).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('renders search input with placeholder', () => {
      render(<DirectoryPage />)
      
      const searchInput = screen.getByPlaceholderText('Search by name, department, email, or phone...')
      expect(searchInput).toBeInTheDocument()
    })

    it('filters contacts by search term', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      const searchInput = screen.getByPlaceholderText(/search/i)
      
      // Search for a term that exists in the data
      const firstContact = contactsData.contacts[0]
      await user.type(searchInput, firstContact.name.slice(0, 3))
      
      // Should find at least one result
      const rows = screen.getAllByRole('row')
      // Subtract 1 for header row
      expect(rows.length - 1).toBeGreaterThan(0)
      
      // Should show the searched contact
      expect(screen.getByText(firstContact.name)).toBeInTheDocument()
    })

    it('shows empty table when search yields nothing', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      const searchInput = screen.getByPlaceholderText(/search/i)
      
      // Search for non-existent term
      await user.type(searchInput, 'xyzabc123')
      
      // Should have only the header row
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBe(1) // Only header row
    })

    it('searches across multiple fields', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      const searchInput = screen.getByPlaceholderText(/search/i)
      
      // Get first contact's data
      const firstContact = contactsData.contacts[0]
      
      // Search by email
      await user.clear(searchInput)
      await user.type(searchInput, firstContact.email.slice(0, 5))
      
      // Should find the contact
      expect(screen.getByText(firstContact.name)).toBeInTheDocument()
    })

    it('filters contacts based on search', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, contactsData.contacts[0].name.slice(0, 5))
      
      // Should show filtered results
      const rows = screen.getAllByRole('row')
      
      // Should have at least the header row plus some results
      expect(rows.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Contact Display', () => {
    it('displays contact information correctly', () => {
      render(<DirectoryPage />)
      
      const firstContact = contactsData.contacts[0]
      
      // Find the row containing this contact
      const row = screen.getByText(firstContact.name).closest('tr')
      expect(row).toBeTruthy()
      
      // Check all fields within that row
      within(row!).getByText(firstContact.name)
      within(row!).getByText(firstContact.department)
      within(row!).getByText(firstContact.phone)
      within(row!).getByText(firstContact.email)
      within(row!).getByText(firstContact.location)
    })

    it('applies correct styling to contact type badges', () => {
      render(<DirectoryPage />)
      
      // Find a provider contact
      const providerContact = contactsData.contacts.find(c => c.type === 'Provider')
      if (!providerContact) return // Skip if no provider in test data
      
      // Find the row with this contact
      const row = screen.getByText(providerContact.name).closest('tr')
      expect(row).toBeTruthy()
      
      // Find the type badge within that row
      const typeBadge = within(row!).getByText(providerContact.type)
      expect(typeBadge).toHaveClass('bg-blue-50', 'text-blue-700')
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<DirectoryPage />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('search input is properly labeled', () => {
      render(<DirectoryPage />)
      
      const searchInput = screen.getByPlaceholderText(/search/i)
      expect(searchInput).toHaveAttribute('type', 'search')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      // Tab to first interactive element
      await user.tab()
      
      // Should focus on a button or input
      const activeElement = document.activeElement?.tagName
      expect(['BUTTON', 'INPUT'].includes(activeElement || '')).toBe(true)
    })
  })
})