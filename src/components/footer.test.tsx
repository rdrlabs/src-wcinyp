import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

describe('Footer', () => {
  it('renders footer with all sections', () => {
    render(<Footer />)
    
    // Check section headings
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
  })

  it('renders all quick links', () => {
    render(<Footer />)
    
    const quickLinksSection = screen.getByText('Quick Links').parentElement
    expect(quickLinksSection).toHaveTextContent('Knowledge Base')
    expect(quickLinksSection).toHaveTextContent('Directory')
    expect(quickLinksSection).toHaveTextContent('Documents & Forms')
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
    
    expect(screen.getByText(/WCI@NYP is a collaboration between/)).toBeInTheDocument()
    
    // Check collaboration links
    const collaborationSection = screen.getByText(/WCI@NYP is a collaboration/).parentElement?.parentElement
    const wcmLinks = screen.getAllByRole('link', { name: 'Weill Cornell Medicine' })
    const wcmLink = wcmLinks.find(link => collaborationSection?.contains(link))
    expect(wcmLink).toHaveAttribute('href', 'https://weillcornell.org')
    
    const nypLink = screen.getByRole('link', { name: 'NewYork-Presbyterian Hospital' })
    expect(nypLink).toHaveAttribute('href', 'https://nyp.org')
  })

  it('renders correct icons for navigation items', () => {
    render(<Footer />)
    
    // Footer should not have icons in quick links anymore
    const quickLinksSection = screen.getByText('Quick Links').parentElement
    const icons = quickLinksSection?.querySelectorAll('svg')
    expect(icons?.length).toBe(0)
  })

  it('renders footer with responsive grid', () => {
    const { container } = render(<Footer />)
    
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2')
  })
})