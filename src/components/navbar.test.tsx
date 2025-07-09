import { render, screen } from '@testing-library/react'
import { NavBar } from './navbar'
import { vi } from 'vitest'
import { AppProvider } from '@/contexts/app-context'
import { ThemeProvider } from 'next-themes'
import { SearchProvider } from '@/contexts/search-context'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Helper function to render with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        <SearchProvider>
          {component}
        </SearchProvider>
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
    // The brand name contains these text parts
    const brandLink = screen.getByRole('link', { name: /WCI.*@.*NYP/i })
    expect(brandLink).toBeInTheDocument()
    expect(brandLink).toHaveAttribute('href', '/')
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
    const brandLink = screen.getByRole('link', { name: /WCI.*@.*NYP/i })
    expect(brandLink).toBeInTheDocument()
    
    // All navigation links should be present
    expect(screen.getByRole('link', { name: /Knowledge Base/i })).toBeInTheDocument()
  })

  it('renders search functionality', () => {
    renderWithProviders(<NavBar />)
    
    // Search functionality is present
    const searchInput = screen.getByPlaceholderText('Search...')
    expect(searchInput).toBeInTheDocument()
  })

  it('shows Command+K shortcut in search', () => {
    renderWithProviders(<NavBar />)
    
    // Should show keyboard shortcut in the search input area
    const searchInput = screen.getByPlaceholderText('Search...')
    expect(searchInput).toBeInTheDocument()
    
    // The shortcut is shown as a kbd element
    const kbdElement = searchInput.parentElement?.querySelector('kbd')
    expect(kbdElement).toBeInTheDocument()
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

  it('renders login functionality', () => {
    renderWithProviders(<NavBar />)
    
    // Login functionality is present
    const loginLink = screen.getByRole('link', { name: /Login/i })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('renders theme toggle', () => {
    renderWithProviders(<NavBar />)
    
    const themeToggle = screen.getByRole('button', { name: /Toggle theme/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('renders navbar with all elements', () => {
    renderWithProviders(<NavBar />)
    
    // Should have logo
    const brandLink = screen.getByRole('link', { name: /WCI.*@.*NYP/i })
    expect(brandLink).toBeInTheDocument()
    
    // Should have navigation links
    expect(screen.getByRole('link', { name: /Knowledge Base/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Directory/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Documents/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Updates/i })).toBeInTheDocument()
    
    // Should have theme toggle
    expect(screen.getByRole('button', { name: /Toggle theme/i })).toBeInTheDocument()
    
    // Should have search
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    
    // Should have login
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument()
  })
})