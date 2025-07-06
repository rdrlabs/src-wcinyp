import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

describe('Footer', () => {
  it('renders footer with all sections', () => {
    render(<Footer />)
    
    // Check section headings
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByText('Stay Connected')).toBeInTheDocument()
  })

  it('renders all quick links', () => {
    render(<Footer />)
    
    const quickLinksSection = screen.getByText('Quick Links').parentElement
    expect(quickLinksSection).toHaveTextContent('Knowledge Base')
    expect(quickLinksSection).toHaveTextContent('Directory')
    expect(quickLinksSection).toHaveTextContent('Documents & Forms')
  })

  it('renders contact information', () => {
    render(<Footer />)
    
    const contactSection = screen.getByText('Contact Us').parentElement
    
    // Address
    expect(contactSection).toHaveTextContent('525 East 68th Street')
    expect(contactSection).toHaveTextContent('New York, NY 10065')
    
    // Phone
    expect(contactSection).toHaveTextContent('(212) 746-2920')
    const phoneLink = screen.getByRole('link', { name: '(212) 746-2920' })
    expect(phoneLink).toHaveAttribute('href', 'tel:2127462920')
    
    // Email
    expect(contactSection).toHaveTextContent('imaging@med.cornell.edu')
    const emailLink = screen.getByRole('link', { name: 'imaging@med.cornell.edu' })
    expect(emailLink).toHaveAttribute('href', 'mailto:imaging@med.cornell.edu')
    
    // Hours
    expect(contactSection).toHaveTextContent('Mon-Fri: 8:00 AM - 5:00 PM')
  })

  it('renders resource links with external link indicators', () => {
    render(<Footer />)
    
    const resourcesSection = screen.getByText('Resources').parentElement
    
    // Check that external links have the external link icon
    const externalLinks = resourcesSection?.querySelectorAll('a[target="_blank"]')
    expect(externalLinks?.length).toBeGreaterThan(0)
  })

  it('renders social media links', () => {
    render(<Footer />)
    
    // Check for social media links by aria-label
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument()
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument()
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument()
  })

  it('renders emergency information', () => {
    render(<Footer />)
    
    expect(screen.getByText('Emergency? Call 911')).toBeInTheDocument()
    expect(screen.getByText(/For urgent imaging needs/)).toBeInTheDocument()
  })

  it('renders copyright and collaboration information', () => {
    render(<Footer />)
    
    expect(screen.getByText(/© 2025 Weill Cornell Imaging at NewYork-Presbyterian/)).toBeInTheDocument()
    expect(screen.getByText(/WCI@NYP is a collaboration between/)).toBeInTheDocument()
    
    // Check for partner links - there are multiple links with same text, so use getAllByRole
    const wcmLinks = screen.getAllByRole('link', { name: 'Weill Cornell Medicine' })
    expect(wcmLinks.length).toBeGreaterThan(0)
    expect(wcmLinks[0]).toHaveAttribute('href', 'https://weillcornell.org')
    
    const nypLink = screen.getByRole('link', { name: 'NewYork-Presbyterian Hospital' })
    expect(nypLink).toHaveAttribute('href', 'https://nyp.org')
  })

  it('renders correct icons for navigation items', () => {
    render(<Footer />)
    
    const quickLinksSection = screen.getByText('Quick Links').parentElement
    
    // Check that icons are rendered (they'll be svg elements)
    const svgIcons = quickLinksSection?.querySelectorAll('svg')
    expect(svgIcons?.length).toBe(4) // 4 navigation items (Knowledge Base, Documents, Updates, Directory)
  })

  it('renders correct styling classes', () => {
    render(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('bg-muted/50', 'border-t')
  })
})