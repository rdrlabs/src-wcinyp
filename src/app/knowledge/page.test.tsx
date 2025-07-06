import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KnowledgePage from './page'
import { axe } from 'jest-axe'

describe('Knowledge Page', () => {
  it('renders page title and coming soon message', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByRole('heading', { name: 'Knowledge Base' })).toBeInTheDocument()
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })

  it('displays placeholder description', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText(/Our comprehensive documentation and guides are being prepared/)).toBeInTheDocument()
  })

  it('displays coming soon feature cards', () => {
    render(<KnowledgePage />)
    
    // Check feature cards
    expect(screen.getByText('Getting Started Guide')).toBeInTheDocument()
    expect(screen.getByText('Documentation')).toBeInTheDocument()
    expect(screen.getByText('Provider Resources')).toBeInTheDocument()
    expect(screen.getByText('System Configuration')).toBeInTheDocument()
    expect(screen.getByText('FAQ & Troubleshooting')).toBeInTheDocument()
    expect(screen.getByText('Best Practices')).toBeInTheDocument()
  })

  it('displays contact information', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText(/Need immediate assistance/)).toBeInTheDocument()
    const emailLink = screen.getByRole('link', { name: 'imaging@med.cornell.edu' })
    expect(emailLink).toHaveAttribute('href', 'mailto:imaging@med.cornell.edu')
  })

  it('renders feature card descriptions', () => {
    render(<KnowledgePage />)
    
    expect(screen.getByText('Learn the basics of using the imaging center portal')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive guides for all features and workflows')).toBeInTheDocument()
    expect(screen.getByText('Information for referring providers and staff')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<KnowledgePage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})