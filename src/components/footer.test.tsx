import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

describe('Footer', () => {
  it('renders footer with project information', () => {
    const { container } = render(<Footer />)
    
    // Check that the footer contains the full text
    const footerText = container.querySelector('p')
    expect(footerText).toHaveTextContent('WCI@NYP is a project currently in development by @Ray')
  })

  it('renders @ symbol with primary color', () => {
    const { container } = render(<Footer />)
    
    // Find the @ symbol span
    const atSymbol = container.querySelector('.text-primary')
    expect(atSymbol).toBeInTheDocument()
    expect(atSymbol).toHaveTextContent('@')
  })

  it('renders footer with proper styling', () => {
    const { container } = render(<Footer />)
    
    // Check footer has border
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('border-t')
    
    // Check centered text
    const paragraph = container.querySelector('p')
    expect(paragraph).toHaveClass('text-center', 'text-sm', 'text-muted-foreground')
  })
})