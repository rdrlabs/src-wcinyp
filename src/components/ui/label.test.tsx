import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Label } from './label'
import { renderWithTheme } from '@/test/theme-test-utils'

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
    expect(label).toHaveClass('text-sm', 'font-semibold', 'leading-none')
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

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(
        <div>
          <Label htmlFor="test-input">Light mode label</Label>
          <input id="test-input" type="text" />
        </div>,
        { theme: 'light' }
      )
      
      const label = screen.getByText('Light mode label')
      expect(label).toBeInTheDocument()
      
      // Label uses semantic text color
      const labelClass = label.className
      expect(labelClass).toContain('text-sm')
      expect(labelClass).toContain('font-semibold')
      // Labels inherit text color from parent, no explicit color class needed
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(
        <div>
          <Label htmlFor="test-input">Dark mode label</Label>
          <input id="test-input" type="text" />
        </div>,
        { theme: 'dark' }
      )
      
      const label = screen.getByText('Dark mode label')
      expect(label).toBeInTheDocument()
      
      // Label uses semantic text color
      const labelClass = label.className
      expect(labelClass).toContain('text-sm')
      expect(labelClass).toContain('font-semibold')
      // Labels inherit text color from parent, no explicit color class needed
    })

    it('maintains semantic styling with custom classes', () => {
      renderWithTheme(
        <Label className="text-muted-foreground" htmlFor="optional-field">
          Optional Field
        </Label>,
        { theme: 'dark' }
      )
      
      const label = screen.getByText('Optional Field')
      expect(label.className).toContain('text-muted-foreground')
      expect(label.className).toContain('text-sm')
      expect(label.className).toContain('font-semibold')
    })

    it('ensures no hard-coded colors', () => {
      renderWithTheme(
        <div className="space-y-4">
          <Label htmlFor="field1">Default Label</Label>
          <Label htmlFor="field2" className="text-destructive">
            Required Field *
          </Label>
          <Label htmlFor="field3" className="text-muted-foreground">
            Optional Label
          </Label>
        </div>,
        { theme: 'dark' }
      )
      
      const labels = screen.getAllByText(/Label|Field/)
      
      labels.forEach(label => {
        const classList = label.className
        // Should not contain hard-coded color values
        expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
    })

    it('works correctly with form fields in both themes', () => {
      const { rerender } = renderWithTheme(
        <form className="space-y-2">
          <div>
            <Label htmlFor="username">Username</Label>
            <input id="username" type="text" className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <input id="email" type="email" className="w-full rounded border px-3 py-2" />
          </div>
        </form>,
        { theme: 'light' }
      )
      
      // Light mode check
      expect(screen.getByText('Username')).toHaveAttribute('for', 'username')
      expect(screen.getByText('Email Address')).toHaveAttribute('for', 'email')
      
      // Switch to dark mode
      rerender(
        <form className="space-y-2">
          <div>
            <Label htmlFor="username">Username</Label>
            <input id="username" type="text" className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <input id="email" type="email" className="w-full rounded border px-3 py-2" />
          </div>
        </form>
      )
      
      // Labels should still function correctly
      expect(screen.getByText('Username')).toHaveAttribute('for', 'username')
      expect(screen.getByText('Email Address')).toHaveAttribute('for', 'email')
    })
  })
})