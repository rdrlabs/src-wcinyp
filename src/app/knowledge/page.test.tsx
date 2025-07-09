import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KnowledgePage from './page'
import { axe } from 'jest-axe'

describe('Knowledge Page', () => {
  it('renders page title and coming soon message', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })

  it('displays coming soon description', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Comprehensive documentation and guides for using the imaging center portal')).toBeInTheDocument()
  })

  it('displays coming soon feature cards', () => {
    render(<KnowledgePage />)
    
    // Check feature cards
    expect(screen.getByText('Getting Started Guide')).toBeInTheDocument()
    expect(screen.getByText('Documentation')).toBeInTheDocument()
    expect(screen.getByText('Contact Resources')).toBeInTheDocument()
    expect(screen.getByText('System Configuration')).toBeInTheDocument()
    expect(screen.getByText('FAQ & Troubleshooting')).toBeInTheDocument()
    expect(screen.getByText('Best Practices')).toBeInTheDocument()
  })

  it('displays preview button', () => {
    render(<KnowledgePage />)
    
    const previewButton = screen.getByRole('link', { name: /Preview Knowledge Base/i })
    expect(previewButton).toBeInTheDocument()
    expect(previewButton).toHaveAttribute('href', '/knowledge-preview')
  })

  it('renders feature card descriptions', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Learn the basics and become resourceful')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive guides and access to information')).toBeInTheDocument()
    expect(screen.getByText('Resources on all our contacts and communication best practices')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<KnowledgePage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})