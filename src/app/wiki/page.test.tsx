import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import WikiPage from './page'
import { axe } from 'jest-axe'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    <a href={href}>{children}</a>
}))

// Mock the wiki-loader module
vi.mock('@/lib/wiki-loader', () => ({
  getWikiPage: vi.fn(() => Promise.resolve('# Welcome to WCINYP Wiki\n\nThis is the wiki homepage.'))
}))

describe('Wiki Page', () => {
  it('renders page title and description', async () => {
    render(<WikiPage />)
    
    expect(screen.getByText('WCINYP Staff Wiki')).toBeInTheDocument()
    expect(screen.getByText('Your comprehensive guide to policies, procedures, and operations')).toBeInTheDocument()
  })

  it('displays navigation sidebar', async () => {
    render(<WikiPage />)
    
    // Check sidebar navigation
    expect(screen.getByText('Wiki Sections')).toBeInTheDocument()
    const wikiHomeLink = screen.getByRole('link', { name: /Wiki Home/i })
    expect(wikiHomeLink).toBeInTheDocument()
    
    // Check sidebar links exist
    const sidebar = screen.getByText('Wiki Sections').closest('.rounded-xl')
    expect(sidebar).toBeInTheDocument()
    
    // Wait for content to load
    await screen.findByText('Official WCINYP policies and guidelines')
    
    // Check that sidebar has all section links
    const sidebarLinks = within(sidebar!).getAllByRole('link')
    const linkTexts = sidebarLinks.map(link => link.textContent)
    expect(linkTexts).toContain('Wiki Home')
    expect(linkTexts).toContain('Policies')
    expect(linkTexts).toContain('Procedures')
    expect(linkTexts).toContain('Locations')
    expect(linkTexts).toContain('Departments')
    expect(linkTexts).toContain('Emergency')
    expect(linkTexts).toContain('Workflows')
  })

  it('displays category cards on home page', async () => {
    render(<WikiPage />)
    
    // Wait for content to load - use findAllByText since there might be multiple instances
    const policyDescriptions = await screen.findAllByText('Official WCINYP policies and guidelines')
    expect(policyDescriptions.length).toBeGreaterThan(0)
    
    // Check for other category descriptions (these should be unique)
    expect(screen.getByText('Step-by-step guides for common tasks')).toBeInTheDocument()
    expect(screen.getByText('Information about WCINYP facilities')).toBeInTheDocument()
    expect(screen.getByText('Department-specific information')).toBeInTheDocument()
    expect(screen.getByText('Emergency procedures and contacts')).toBeInTheDocument()
    expect(screen.getByText('Common workflow documentation')).toBeInTheDocument()
  })

  it('has search functionality', () => {
    render(<WikiPage />)
    
    const searchInput = screen.getByPlaceholderText('Search wiki...')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays quick links sidebar', () => {
    render(<WikiPage />)
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    
    const contactLink = screen.getByRole('link', { name: 'Contact Directory' })
    expect(contactLink).toHaveAttribute('href', '/directory')
    
    const documentsLink = screen.getByRole('link', { name: 'Document Hub' })
    expect(documentsLink).toHaveAttribute('href', '/documents')
    
    const formsLink = screen.getByRole('link', { name: 'Forms Generator' })
    expect(formsLink).toHaveAttribute('href', '/forms')
  })

  it('displays help section', () => {
    render(<WikiPage />)
    
    expect(screen.getByText('Need Help?')).toBeInTheDocument()
    expect(screen.getByText(/Can't find what you're looking for/)).toBeInTheDocument()
    
    const contactsButton = screen.getByRole('link', { name: 'View Contacts' })
    expect(contactsButton).toHaveAttribute('href', '/directory')
  })

  it('has proper breadcrumb navigation', () => {
    render(<WikiPage />)
    
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveAttribute('href', '/')
    
    const wikiLink = screen.getByRole('link', { name: 'Wiki' })
    expect(wikiLink).toHaveAttribute('href', '/wiki')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<WikiPage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('uses proper semantic HTML structure', () => {
    render(<WikiPage />)
    
    // Should have proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('WCINYP Staff Wiki')
  })
})