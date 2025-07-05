import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import KnowledgePage from './page'
import { axe } from 'jest-axe'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    <a href={href}>{children}</a>
}))

describe('Knowledge Page', () => {
  it('renders page title and description', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument()
    expect(screen.getByText('Documentation, guides, and resources for WCINYP')).toBeInTheDocument()
  })

  it('displays documentation section', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Documentation')).toBeInTheDocument()
    
    // Check getting started docs
    expect(screen.getByText('Introduction to WCINYP')).toBeInTheDocument()
    expect(screen.getByText('Quick Start Guide')).toBeInTheDocument()
    expect(screen.getByText('System Requirements')).toBeInTheDocument()
  })

  it('displays quick access sections', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Quick Access')).toBeInTheDocument()
    
    // Check categories
    expect(screen.getByText('Document Management')).toBeInTheDocument()
    expect(screen.getByText('Provider & Contact Management')).toBeInTheDocument()
  })

  it('links to correct documentation pages', () => {
    render(<KnowledgePage />)
    
    // Test the actual URLs used in the page
    const introLink = screen.getByRole('link', { name: /Introduction to WCINYP/i })
    expect(introLink).toHaveAttribute('href', '/docs/getting-started/introduction')
    
    const quickstartLink = screen.getByRole('link', { name: /Quick Start Guide/i })
    expect(quickstartLink).toHaveAttribute('href', '/docs/getting-started/quickstart')
    
    const requirementsLink = screen.getByRole('link', { name: /System Requirements/i })
    expect(requirementsLink).toHaveAttribute('href', '/docs/getting-started/requirements')
  })

  it('links to feature pages', () => {
    render(<KnowledgePage />)
    
    // Document management links
    expect(screen.getByRole('link', { name: /Browse Documents Access all documents/i }))
      .toHaveAttribute('href', '/documents')
    
    expect(screen.getByRole('link', { name: /Form Templates View available forms/i }))
      .toHaveAttribute('href', '/documents?tab=forms')
    
    expect(screen.getByRole('link', { name: /Form Builder Create custom forms/i }))
      .toHaveAttribute('href', '/documents?tab=builder')
    
    // Provider management links
    expect(screen.getByRole('link', { name: /Provider Directory View all providers/i }))
      .toHaveAttribute('href', '/providers')
    
    expect(screen.getByRole('link', { name: /Contact Directory Complete contact list/i }))
      .toHaveAttribute('href', '/directory')
  })

  it('displays help cards', () => {
    render(<KnowledgePage />)
    
    // Need Help card
    expect(screen.getByText('Need Help?')).toBeInTheDocument()
    expect(screen.getByText("Can't find what you're looking for?")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact Support' }))
      .toHaveAttribute('href', '/directory')
    
    // Video Tutorials card
    expect(screen.getByText('Video Tutorials')).toBeInTheDocument()
    expect(screen.getByText('Coming soon: Video guides')).toBeInTheDocument()
    
    // API Documentation card
    expect(screen.getByText('API Documentation')).toBeInTheDocument()
    expect(screen.getByText('Developer guides coming soon')).toBeInTheDocument()
  })

  it('disables coming soon buttons', () => {
    render(<KnowledgePage />)
    
    const watchVideosBtn = screen.getByRole('button', { name: 'Watch Videos' })
    expect(watchVideosBtn).toBeDisabled()
    
    const apiDocsBtn = screen.getByRole('button', { name: 'View API Docs' })
    expect(apiDocsBtn).toBeDisabled()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<KnowledgePage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})