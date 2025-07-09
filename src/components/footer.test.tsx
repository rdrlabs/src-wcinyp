import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

describe('Footer', () => {
  it('renders footer with all sections', () => {
    render(<Footer />)
    
    // Check section headings
    expect(screen.getByText('Navigation')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
  })

  it('renders all quick links', () => {
    render(<Footer />)
    
    const navigationSection = screen.getByText('Navigation').parentElement
    expect(navigationSection).toHaveTextContent('Knowledge Base')
    expect(navigationSection).toHaveTextContent('Directory')
    expect(navigationSection).toHaveTextContent('Documents & Forms')
  })

  it('renders resource links with external link indicators', () => {
    render(<Footer />)
    
    const resourcesSection = screen.getByText('Resources').parentElement
    
    // Check that external links have the external link icon
    const externalLinks = resourcesSection?.querySelectorAll('a[target="_blank"]')
    expect(externalLinks?.length).toBeGreaterThan(0)
  })

  it('renders collaboration information', () => {
    render(<Footer />)
    
    // The text is split across elements, so check for the key parts
    expect(screen.getByText(/is a project currently in development by @Ray/)).toBeInTheDocument()
  })

  it('renders correct icons for navigation items', () => {
    render(<Footer />)
    
    // Footer should have icons in navigation links
    const navigationSection = screen.getByText('Navigation').parentElement
    const icons = navigationSection?.querySelectorAll('svg')
    expect(icons?.length).toBeGreaterThan(0)
  })

  it('renders footer with responsive grid', () => {
    const { container } = render(<Footer />)
    
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2')
  })
})