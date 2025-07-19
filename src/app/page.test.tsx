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
    expect(screen.getByTestId('dashboard-title')).toHaveTextContent('WCINYP Dashboard')
  })

  it('renders the subtitle', () => {
    render(<Home />)
    expect(screen.getByTestId('dashboard-subtitle')).toHaveTextContent('Weill Cornell Imaging at NewYork-Presbyterian')
  })

  it('displays all feature cards', () => {
    render(<Home />)
    
    // Check all feature cards are present
    expect(screen.getByTestId('feature-title-knowledge')).toHaveTextContent('Knowledge Base')
    expect(screen.getByTestId('feature-title-documents')).toHaveTextContent('Document Hub')
    expect(screen.getByTestId('feature-title-updates')).toHaveTextContent('Updates')
    expect(screen.getByTestId('feature-title-directory')).toHaveTextContent('Directory')
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
    
    expect(screen.getByTestId('feature-description-knowledge')).toHaveTextContent('Technical documentation, user guides, and best practices for staff reference and training materials')
    expect(screen.getByTestId('feature-description-documents')).toHaveTextContent('Centralized repository for patient forms, medical documents, and administrative paperwork with version control')
    expect(screen.getByTestId('feature-description-updates')).toHaveTextContent('Latest news, operational updates, departmental communications, and important announcements from leadership')
    expect(screen.getByTestId('feature-description-directory')).toHaveTextContent('Complete contact database for internal staff, external partners, facilities, vendors, and referring providers')
  })

  it('links to correct pages', () => {
    render(<Home />)
    
    // Find links by their card content since Next.js Link doesn't pass data-testid to <a>
    const knowledgeCard = screen.getByTestId('feature-card-knowledge')
    const knowledgeLink = knowledgeCard.closest('a')
    expect(knowledgeLink).toHaveAttribute('href', '/knowledge')
    
    const documentsCard = screen.getByTestId('feature-card-documents')
    const documentsLink = documentsCard.closest('a')
    expect(documentsLink).toHaveAttribute('href', '/documents')
    
    const updatesCard = screen.getByTestId('feature-card-updates')
    const updatesLink = updatesCard.closest('a')
    expect(updatesLink).toHaveAttribute('href', '/updates')
    
    const directoryCard = screen.getByTestId('feature-card-directory')
    const directoryLink = directoryCard.closest('a')
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