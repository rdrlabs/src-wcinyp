import { render, screen, fireEvent } from '@testing-library/react'
import { NavBar } from './navbar'
import { vi } from 'vitest'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('NavBar', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    vi.clearAllMocks()
  })

  it('renders WCI@NYP branding', () => {
    render(<NavBar />)
    const branding = screen.getByText('WCI@NYP')
    expect(branding).toBeInTheDocument()
  })

  it('renders all navigation links in correct order', () => {
    render(<NavBar />)
    
    const links = screen.getAllByRole('link')
    const navLinks = links.filter(link => {
      const text = link.textContent || ''
      return ['Knowledge Base', 'Directory', 'Documents', 'Providers'].includes(text.trim())
    })
    
    expect(navLinks).toHaveLength(4)
    expect(navLinks[0]).toHaveTextContent('Knowledge Base')
    expect(navLinks[1]).toHaveTextContent('Directory')
    expect(navLinks[2]).toHaveTextContent('Documents')
    expect(navLinks[3]).toHaveTextContent('Providers')
  })

  it('highlights active page', () => {
    // Mock usePathname to return /knowledge
    const usePathname = vi.fn().mockReturnValue('/knowledge')
    vi.doMock('next/navigation', () => ({
      usePathname,
    }))
    
    render(<NavBar />)
    const knowledgeLink = screen.getByRole('link', { name: /Knowledge Base/i })
    
    // Check if the link has the active class
    expect(knowledgeLink.className).toContain('text-primary')
  })

  it('opens search dialog on button click', () => {
    render(<NavBar />)
    
    const searchButton = screen.getByRole('button', { name: /Search/i })
    fireEvent.click(searchButton)
    
    // Check if command dialog is opened
    const searchInput = screen.getByPlaceholderText('Type a command or search...')
    expect(searchInput).toBeInTheDocument()
  })

  it('opens search dialog with Command+K shortcut', () => {
    render(<NavBar />)
    
    // Trigger Command+K
    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    
    // Check if command dialog is opened
    const searchInput = screen.getByPlaceholderText('Type a command or search...')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders quick links dropdown', () => {
    render(<NavBar />)
    
    const quickLinksButton = screen.getByRole('button', { name: /Quick Links/i })
    expect(quickLinksButton).toBeInTheDocument()
  })

  it('renders feedback button', () => {
    render(<NavBar />)
    
    const feedbackButton = screen.getByRole('button', { name: /Feedback/i })
    expect(feedbackButton).toBeInTheDocument()
  })

  it('toggles login state when login button clicked', () => {
    render(<NavBar />)
    
    const loginButton = screen.getByRole('button', { name: /Login/i })
    expect(loginButton).toBeInTheDocument()
    
    // Click to login
    fireEvent.click(loginButton)
    
    // Should show CWID when logged in
    expect(screen.getByText('AB12345')).toBeInTheDocument()
    
    // Click again to logout
    fireEvent.click(loginButton)
    
    // Should show login icon again
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  it('renders theme toggle', () => {
    render(<NavBar />)
    
    const themeToggle = screen.getByRole('button', { name: /Toggle theme/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('renders all navigation items in search dialog', () => {
    render(<NavBar />)
    
    // Open search dialog
    const searchButton = screen.getByRole('button', { name: /Search/i })
    fireEvent.click(searchButton)
    
    // Check all navigation items are in the command list
    expect(screen.getByRole('option', { name: /Knowledge Base/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Directory/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Documents/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Providers/i })).toBeInTheDocument()
  })
})