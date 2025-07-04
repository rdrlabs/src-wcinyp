import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Label } from './label'

describe('Label', () => {
  it('renders label with text', () => {
    render(<Label>Test Label</Label>)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>)
    
    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-class')
    // Also has default classes
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none')
  })

  it('forwards htmlFor attribute', () => {
    render(
      <>
        <Label htmlFor="test-input">Form Label</Label>
        <input id="test-input" type="text" />
      </>
    )
    
    const label = screen.getByText('Form Label')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('renders as label element', () => {
    const { container } = render(<Label>Label Element</Label>)
    
    const labelElement = container.querySelector('label')
    expect(labelElement).toBeInTheDocument()
    expect(labelElement).toHaveTextContent('Label Element')
  })

  it('supports data attributes', () => {
    render(<Label data-testid="custom-label">Data Label</Label>)
    
    expect(screen.getByTestId('custom-label')).toBeInTheDocument()
  })
})