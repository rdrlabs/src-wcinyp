import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from './page'
import { axe } from 'jest-axe'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    <a href={href}>{children}</a>
}))

describe('Home Page', () => {
  it('renders the dashboard title', () => {
    render(<Home />)
    expect(screen.getByText('WCINYP Dashboard')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Home />)
    expect(screen.getByText('Weill Cornell Imaging at NewYork-Presbyterian')).toBeInTheDocument()
  })

  it('displays all feature cards', () => {
    render(<Home />)
    
    // Check all feature cards are present
    expect(screen.getByText('Document Hub')).toBeInTheDocument()
    expect(screen.getByText('Provider Directory')).toBeInTheDocument()
    expect(screen.getByText('Form Generator')).toBeInTheDocument()
    expect(screen.getByText('Directory')).toBeInTheDocument()
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument()
  })

  it('displays correct statistics for each feature', () => {
    render(<Home />)
    
    expect(screen.getByText('156 documents')).toBeInTheDocument()
    expect(screen.getByText('42 providers')).toBeInTheDocument()
    expect(screen.getByText('12 templates')).toBeInTheDocument()
    expect(screen.getByText('150+ contacts')).toBeInTheDocument()
    expect(screen.getByText('15+ articles')).toBeInTheDocument()
  })

  it('displays feature descriptions', () => {
    render(<Home />)
    
    expect(screen.getByText('Manage patient forms and medical documents')).toBeInTheDocument()
    expect(screen.getByText('Search and manage medical staff information')).toBeInTheDocument()
    expect(screen.getByText('Automate medical form creation and processing')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive contact database')).toBeInTheDocument()
    expect(screen.getByText('Documentation and guides')).toBeInTheDocument()
  })

  it('links to correct pages', () => {
    render(<Home />)
    
    const documentLink = screen.getByRole('link', { name: /Document Hub/i })
    expect(documentLink).toHaveAttribute('href', '/documents')
    
    const providerLink = screen.getByRole('link', { name: /Provider Directory/i })
    expect(providerLink).toHaveAttribute('href', '/providers')
    
    const formLink = screen.getByRole('link', { name: /Form Generator/i })
    expect(formLink).toHaveAttribute('href', '/forms')
    
    const directoryLink = screen.getByRole('link', { name: /Directory Comprehensive/i })
    expect(directoryLink).toHaveAttribute('href', '/directory')
    
    const knowledgeLink = screen.getByRole('link', { name: /Knowledge Base/i })
    expect(knowledgeLink).toHaveAttribute('href', '/knowledge')
  })

  it('has responsive grid layout', () => {
    const { container } = render(<Home />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Home />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})