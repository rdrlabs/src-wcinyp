import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import KnowledgePage from './page'
import { axe } from 'jest-axe'

// Mock fumadocs-ui components
vi.mock('fumadocs-ui/page', () => ({
  DocsPage: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DocsBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('fumadocs-ui/components/callout', () => ({
  Callout: ({ children, type, className }: { children: React.ReactNode; type: string; className?: string }) => 
    <div className={className} data-type={type}>{children}</div>
}))

describe('Knowledge Page', () => {
  it('renders page title and description', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('WCINYP Knowledge Base')).toBeInTheDocument()
    expect(screen.getByText('Documentation and guides for the WCINYP platform')).toBeInTheDocument()
  })

  it('displays coming soon message', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText(/The knowledge base is currently being updated/)).toBeInTheDocument()
  })

  it('displays coming soon section with features list', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
    expect(screen.getByText(/We're working on creating comprehensive documentation/)).toBeInTheDocument()
    
    // Check feature list items
    expect(screen.getByText(/Getting started guides/)).toBeInTheDocument()
    expect(screen.getByText(/Feature documentation/)).toBeInTheDocument()
    expect(screen.getByText(/API references/)).toBeInTheDocument()
    expect(screen.getByText(/Video tutorials/)).toBeInTheDocument()
    expect(screen.getByText(/Best practices/)).toBeInTheDocument()
    expect(screen.getByText(/Troubleshooting guides/)).toBeInTheDocument()
  })

  it('displays need help section with contact info', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Need Help Now?')).toBeInTheDocument()
    expect(screen.getByText('While we build out the knowledge base, you can:')).toBeInTheDocument()
    
    // Check contact options
    expect(screen.getByText('support@wcinyp.org')).toBeInTheDocument()
    expect(screen.getByText('(212) 555-0100')).toBeInTheDocument()
    expect(screen.getByText(/Use the in-app help tooltips/)).toBeInTheDocument()
    expect(screen.getByText(/Schedule a training session/)).toBeInTheDocument()
  })

  it('displays urgent issues warning', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText(/For urgent technical issues/)).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<KnowledgePage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})