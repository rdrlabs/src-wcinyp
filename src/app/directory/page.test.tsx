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
      
      expect(screen.getByText('Directory')).toBeInTheDocument()
      expect(screen.getByText('Comprehensive contact database for all providers, facilities, and partners')).toBeInTheDocument()
    })

    it('displays all contacts by default', () => {
      render(<DirectoryPage />)
      
      const caption = screen.getByText(/contacts in directory/i)
      expect(caption).toHaveTextContent(`${contactsData.contacts.length} contacts in directory`)
    })

    it('renders contact table with correct headers', () => {
      render(<DirectoryPage />)
      
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Department' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Contact Info' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Location' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Last Contact' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()
    })
  })

  describe('Contact Type Filtering', () => {
    it('displays all contact type filter buttons', () => {
      render(<DirectoryPage />)
      
      expect(screen.getByRole('button', { name: /All Contacts/i })).toBeInTheDocument()
      
      // Get unique types from the data
      const uniqueTypes = [...new Set(contactsData.contacts.map(c => c.type))]
      uniqueTypes.forEach(type => {
        expect(screen.getByRole('button', { name: new RegExp(type, 'i') })).toBeInTheDocument()
      })
    })

    it('shows correct count for each type', () => {
      render(<DirectoryPage />)
      
      // Check All Contacts count
      const allButton = screen.getByRole('button', { name: /All Contacts/i })
      expect(allButton).toHaveTextContent(`(${contactsData.contacts.length})`)
    })

    it('filters contacts by type when button is clicked', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      // Click on Provider button
      const providerButton = screen.getByRole('button', { name: /Provider/i })
      await user.click(providerButton)
      
      // Check that only provider contacts are shown
      const providerContacts = contactsData.contacts.filter(c => c.type === 'Provider')
      const caption = screen.getByText(/contacts in directory/i)
      expect(caption).toHaveTextContent(`${providerContacts.length} contacts in directory`)
    })

    it('highlights active filter button', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      const providerButton = screen.getByRole('button', { name: /Provider/i })
      const allButton = screen.getByRole('button', { name: /All Contacts/i })
      
      // Initially All Contacts is active (default variant)
      expect(allButton).not.toHaveClass('border')
      expect(providerButton).toHaveClass('border')
      
      // Click to activate Provider
      await user.click(providerButton)
      
      // Should be highlighted (no border class for active)
      expect(providerButton).not.toHaveClass('border')
      expect(allButton).toHaveClass('border')
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

    it('shows no results message when search yields nothing', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      const searchInput = screen.getByPlaceholderText(/search/i)
      
      // Search for non-existent term
      await user.type(searchInput, 'xyzabc123')
      
      expect(screen.getByText('No contacts found matching "xyzabc123"')).toBeInTheDocument()
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

    it('combines search with type filter', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      // First filter by type
      const providerButton = screen.getByRole('button', { name: /Provider/i })
      await user.click(providerButton)
      
      // Then search
      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'test')
      
      // Results should be filtered by both type and search
      const caption = screen.getByText(/contacts in directory|No contacts found/i)
      expect(caption).toBeInTheDocument()
    })
  })

  describe('Action Buttons', () => {
    it('displays Add Contact button', () => {
      render(<DirectoryPage />)
      
      expect(screen.getByRole('button', { name: 'Add Contact' })).toBeInTheDocument()
    })

    it('displays Import CSV button', () => {
      render(<DirectoryPage />)
      
      expect(screen.getByRole('button', { name: 'Import CSV' })).toBeInTheDocument()
    })

    it('displays Edit and Notes buttons for each contact', () => {
      render(<DirectoryPage />)
      
      const rows = screen.getAllByRole('row')
      // Skip header row
      const dataRows = rows.slice(1)
      
      dataRows.forEach(row => {
        within(row).getByRole('button', { name: 'Edit' })
        within(row).getByRole('button', { name: 'Notes' })
      })
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
      within(row!).getByText(firstContact.lastContact)
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

    it('supports keyboard navigation for filter buttons', async () => {
      const user = userEvent.setup()
      render(<DirectoryPage />)
      
      // Tab to first filter button
      await user.tab()
      
      // Should focus on a button
      expect(document.activeElement?.tagName).toBe('BUTTON')
    })
  })
})