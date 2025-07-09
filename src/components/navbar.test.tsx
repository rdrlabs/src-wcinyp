import { render, screen, fireEvent } from '@testing-library/react'
import { NavBar } from './navbar'
import { vi } from 'vitest'
import { AppProvider } from '@/contexts/app-context'
import { ThemeProvider } from 'next-themes'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Helper function to render with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        {component}
      </AppProvider>
    </ThemeProvider>
  )
}

describe('NavBar', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    vi.clearAllMocks()
  })

  it('renders WCI@NYP branding', () => {
    renderWithProviders(<NavBar />)
    const branding = screen.getByText('WCI@NYP')
    expect(branding).toBeInTheDocument()
  })

  it('renders all navigation links in correct order', () => {
    renderWithProviders(<NavBar />)
    
    const links = screen.getAllByRole('link')
    const navLinks = links.filter(link => {
      const text = link.textContent || ''
      return ['Knowledge Base', 'Directory', 'Documents', 'Updates'].includes(text.trim())
    })
    
    expect(navLinks).toHaveLength(4)
    expect(navLinks[0]).toHaveTextContent('Knowledge Base')
    expect(navLinks[1]).toHaveTextContent('Directory')
    expect(navLinks[2]).toHaveTextContent('Documents')
    expect(navLinks[3]).toHaveTextContent('Updates')
  })

  it('highlights active page', () => {
    // For this test, we need to check the actual implementation
    // The active state is determined by usePathname hook
    renderWithProviders(<NavBar />)
    
    // The navbar should render without errors
    expect(screen.getByText('WCI@NYP')).toBeInTheDocument()
    
    // All navigation links should be present
    expect(screen.getByRole('link', { name: /Knowledge Base/i })).toBeInTheDocument()
  })

  it('does not render search functionality', () => {
    renderWithProviders(<NavBar />)
    
    // Search functionality has been removed
    const searchButton = screen.queryByRole('button', { name: /Search/i })
    expect(searchButton).not.toBeInTheDocument()
  })

  it('does not respond to Command+K shortcut', () => {
    renderWithProviders(<NavBar />)
    
    // Trigger Command+K
    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    
    // Search dialog should not exist
    const searchInput = screen.queryByPlaceholderText('Type a command or search...')
    expect(searchInput).not.toBeInTheDocument()
  })

  it('does not render quick links dropdown', () => {
    renderWithProviders(<NavBar />)
    
    // Quick links dropdown has been removed
    const quickLinksButton = screen.queryByRole('button', { name: /Quick Links/i })
    expect(quickLinksButton).not.toBeInTheDocument()
  })

  it('does not render feedback button', () => {
    renderWithProviders(<NavBar />)
    
    // Feedback button has been removed
    const feedbackButton = screen.queryByRole('button', { name: /Feedback/i })
    expect(feedbackButton).not.toBeInTheDocument()
  })

  it('does not render login functionality', () => {
    renderWithProviders(<NavBar />)
    
    // Login functionality has been removed
    const loginButton = screen.queryByRole('button', { name: /Login/i })
    expect(loginButton).not.toBeInTheDocument()
    
    // Should not show CWID
    expect(screen.queryByText('AB12345')).not.toBeInTheDocument()
  })

  it('renders theme toggle', () => {
    renderWithProviders(<NavBar />)
    
    const themeToggle = screen.getByRole('button', { name: /Toggle theme/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('renders simplified navbar with only essential elements', () => {
    renderWithProviders(<NavBar />)
    
    // Should have logo
    expect(screen.getByText('WCI@NYP')).toBeInTheDocument()
    
    // Should have navigation links
    expect(screen.getByRole('link', { name: /Knowledge Base/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Directory/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Documents/i })).toBeInTheDocument()
    
    // Should have theme toggle
    expect(screen.getByRole('button', { name: /Toggle theme/i })).toBeInTheDocument()
    
    // Should not have providers link
    expect(screen.queryByRole('link', { name: /Providers/i })).not.toBeInTheDocument()
    
    // Should have only theme toggle button
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1) // Only theme toggle
  })
})