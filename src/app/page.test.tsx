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
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument()
    expect(screen.getByText('Document Hub')).toBeInTheDocument()
    expect(screen.getByText('Updates')).toBeInTheDocument()
    expect(screen.getByText('Directory')).toBeInTheDocument()
  })

  it('does not display statistics', () => {
    render(<Home />)
    
    // Statistics have been removed
    expect(screen.queryByText(/\d+ documents/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\d+ providers/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\d+\+ contacts/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\d+\+ articles/)).not.toBeInTheDocument()
  })

  it('displays feature descriptions', () => {
    render(<Home />)
    
    expect(screen.getByText('Technical documentation, user guides, and best practices for staff reference and training materials')).toBeInTheDocument()
    expect(screen.getByText('Centralized repository for patient forms, medical documents, and administrative paperwork with version control')).toBeInTheDocument()
    expect(screen.getByText('Latest news, operational updates, departmental communications, and important announcements from leadership')).toBeInTheDocument()
    expect(screen.getByText('Complete contact database for internal staff, external partners, facilities, vendors, and referring providers')).toBeInTheDocument()
  })

  it('links to correct pages', () => {
    render(<Home />)
    
    const knowledgeLink = screen.getByRole('link', { name: /Knowledge Base/i })
    expect(knowledgeLink).toHaveAttribute('href', '/knowledge')
    
    const documentLink = screen.getByRole('link', { name: /Document Hub/i })
    expect(documentLink).toHaveAttribute('href', '/documents')
    
    const updatesLink = screen.getByRole('link', { name: /Updates/i })
    expect(updatesLink).toHaveAttribute('href', '/updates')
    
    const directoryLink = screen.getByRole('link', { name: /Directory/i })
    expect(directoryLink).toHaveAttribute('href', '/directory')
  })

  it('has responsive grid layout', () => {
    const { container } = render(<Home />)
    
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('md:grid-cols-2')
    expect(grid).not.toHaveClass('lg:grid-cols-3')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Home />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})