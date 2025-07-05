import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DocsPage from './page'
import { axe } from 'jest-axe'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    <a href={href}>{children}</a>
}))

describe('Docs Page', () => {
  it('renders page title and description', () => {
    render(<DocsPage />)
    
    expect(screen.getByText('WCINYP Wiki')).toBeInTheDocument()
    expect(screen.getByText('Welcome to the Weill Cornell Imaging at NewYork-Presbyterian work wiki')).toBeInTheDocument()
  })

  it('displays main sections as cards', () => {
    render(<DocsPage />)
    
    expect(screen.getByText('Getting Started')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
  })

  it('displays card descriptions', () => {
    render(<DocsPage />)
    
    expect(screen.getByText('Learn the basics of WCINYP')).toBeInTheDocument()
    expect(screen.getByText('Explore WCINYP features')).toBeInTheDocument()
  })

  it('contains correct links', () => {
    render(<DocsPage />)
    
    // Getting Started links
    const introLink = screen.getByRole('link', { name: 'Introduction to WCINYP' })
    expect(introLink).toHaveAttribute('href', '/docs/getting-started/introduction')
    
    const quickstartLink = screen.getByRole('link', { name: 'Quick Start Guide' })
    expect(quickstartLink).toHaveAttribute('href', '/docs/getting-started/quickstart')
    
    const requirementsLink = screen.getByRole('link', { name: 'System Requirements' })
    expect(requirementsLink).toHaveAttribute('href', '/docs/getting-started/requirements')
    
    // Features links
    const documentsLink = screen.getByRole('link', { name: 'Document Management' })
    expect(documentsLink).toHaveAttribute('href', '/docs/features/documents')
    
    const formsLink = screen.getByRole('link', { name: 'Form Builder' })
    expect(formsLink).toHaveAttribute('href', '/docs/features/forms')
    
    const providersLink = screen.getByRole('link', { name: 'Provider Directory' })
    expect(providersLink).toHaveAttribute('href', '/docs/features/providers')
    
    const contactsLink = screen.getByRole('link', { name: 'Contact Directory' })
    expect(contactsLink).toHaveAttribute('href', '/docs/features/contacts')
  })

  it('has proper grid layout', () => {
    render(<DocsPage />)
    
    const gridContainer = screen.getByText('Getting Started').closest('.grid')
    expect(gridContainer).toHaveClass('grid', 'gap-6', 'md:grid-cols-2')
  })

  it('has proper heading hierarchy', () => {
    render(<DocsPage />)
    
    // Should have one h1
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent('WCINYP Wiki')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<DocsPage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})