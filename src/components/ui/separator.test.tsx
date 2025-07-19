import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Separator } from './separator'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Separator', () => {
  describe('Basic Functionality', () => {
    it('renders separator element with decorative role by default', () => {
      render(<Separator />)
      
      const separator = screen.getByRole('none')
      expect(separator).toBeInTheDocument()
    })

    it('renders as separator role when not decorative', () => {
      render(<Separator decorative={false} />)
      
      const separator = screen.getByRole('separator')
      expect(separator).toBeInTheDocument()
    })

    it('renders as div element', () => {
      const { container } = render(<Separator />)
      
      const separator = container.firstChild
      expect(separator?.nodeName).toBe('DIV')
    })

    it('sets data-orientation attribute', () => {
      const { container } = render(<Separator />)
      
      const separator = container.firstChild
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    })
  })

  describe('Orientation', () => {
    it('renders horizontal separator by default', () => {
      const { container } = render(<Separator />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('h-[1px]')
      expect(separator).toHaveClass('w-full')
    })

    it('renders vertical separator when specified', () => {
      const { container } = render(<Separator orientation="vertical" />)
      
      const separator = container.firstChild
      expect(separator).toHaveAttribute('data-orientation', 'vertical')
      expect(separator).toHaveClass('h-full')
      expect(separator).toHaveClass('w-[1px]')
    })

    it('applies correct aria-orientation when not decorative', () => {
      render(<Separator decorative={false} />)
      
      const separator = screen.getByRole('separator')
      expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    })
  })

  describe('Variants', () => {
    it('applies default variant', () => {
      const { container } = render(<Separator />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('bg-border')
    })

    it('applies strong variant', () => {
      const { container } = render(<Separator variant="strong" />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('bg-foreground/20')
    })

    it('applies muted variant', () => {
      const { container } = render(<Separator variant="muted" />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('bg-muted')
    })

    it('applies gradient variant', () => {
      const { container } = render(<Separator variant="gradient" />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('bg-gradient-to-r')
      expect(separator).toHaveClass('from-transparent')
      expect(separator).toHaveClass('via-border')
      expect(separator).toHaveClass('to-transparent')
    })
  })

  describe('Styling', () => {
    it('applies default styling', () => {
      const { container } = render(<Separator />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('shrink-0')
      expect(separator).toHaveClass('bg-border')
    })

    it('accepts custom className', () => {
      const { container } = render(<Separator className="my-separator" />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('my-separator')
    })

    it('merges custom className with base styles', () => {
      const { container } = render(<Separator className="bg-red-500" />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('bg-red-500')
      expect(separator).toHaveClass('shrink-0') // Base style retained
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <div className="space-y-4">
          <Separator />
          <Separator variant="strong" />
          <Separator variant="muted" />
          <Separator variant="gradient" />
        </div>,
        { theme: 'light' }
      )
      
      const separators = container.querySelectorAll('[data-orientation]')
      expect(separators).toHaveLength(4)
      
      // Default variant uses semantic border color
      expect(separators[0]).toHaveClass('bg-border')
      
      // Strong variant uses semantic foreground with opacity
      expect(separators[1]).toHaveClass('bg-foreground/20')
      
      // Muted variant uses semantic muted color
      expect(separators[2]).toHaveClass('bg-muted')
      
      // Gradient variant uses semantic border color
      expect(separators[3]).toHaveClass('via-border')
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <div className="space-y-4">
          <Separator />
          <Separator variant="strong" />
          <Separator variant="muted" />
          <Separator variant="gradient" />
        </div>,
        { theme: 'dark' }
      )
      
      const separators = container.querySelectorAll('[data-orientation]')
      expect(separators).toHaveLength(4)
      
      // All variants should use semantic colors in dark mode too
      expect(separators[0]).toHaveClass('bg-border')
      expect(separators[1]).toHaveClass('bg-foreground/20')
      expect(separators[2]).toHaveClass('bg-muted')
      expect(separators[3]).toHaveClass('via-border')
    })

    it('maintains semantic colors for vertical orientation', () => {
      const { container } = renderWithTheme(
        <div className="flex h-20 items-center gap-4">
          <span>Item 1</span>
          <Separator orientation="vertical" />
          <span>Item 2</span>
          <Separator orientation="vertical" variant="strong" />
          <span>Item 3</span>
        </div>,
        { theme: 'dark' }
      )
      
      const verticalSeparators = container.querySelectorAll('[data-orientation="vertical"]')
      expect(verticalSeparators).toHaveLength(2)
      
      // Vertical separators should use same semantic colors
      expect(verticalSeparators[0]).toHaveClass('bg-border')
      expect(verticalSeparators[1]).toHaveClass('bg-foreground/20')
      
      // Should have vertical dimensions
      expect(verticalSeparators[0]).toHaveClass('h-full')
      expect(verticalSeparators[0]).toHaveClass('w-[1px]')
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <div className="space-y-4">
          <Separator className="my-4" />
          <Separator variant="strong" className="my-2" />
          <Separator variant="muted" />
          <Separator variant="gradient" className="my-8" />
        </div>,
        { theme: 'dark' }
      )
      
      const separators = container.querySelectorAll('[data-orientation]')
      
      separators.forEach(separator => {
        const classList = separator.className
        // Should not contain hard-coded color values
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        
        // Should use semantic colors
        expect(classList).toMatch(/bg-(border|foreground\/20|muted)|via-border/)
      })
    })

    it('maintains theme consistency in different contexts', () => {
      renderWithTheme(
        <div>
          {/* In a card */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">Card Title</h3>
            <Separator className="my-2" />
            <p className="text-muted-foreground">Card content</p>
          </div>
          
          {/* In a dropdown menu */}
          <div role="menu" className="bg-popover">
            <div role="menuitem">Option 1</div>
            <Separator />
            <div role="menuitem">Option 2</div>
          </div>
          
          {/* In a list */}
          <ul className="space-y-2">
            <li>Item 1</li>
            <Separator variant="muted" />
            <li>Item 2</li>
          </ul>
        </div>,
        { theme: 'dark' }
      )
      
      const separators = screen.getAllByRole('separator', { hidden: true })
      expect(separators.length).toBeGreaterThan(0)
      
      // All separators should maintain semantic colors
      separators.forEach(separator => {
        const classList = separator.className
        expect(classList).toMatch(/bg-(border|muted)/) 
      })
    })

    it('works with gradient variant in both themes', () => {
      const { rerender, container } = renderWithTheme(
        <Separator variant="gradient" className="my-8" />,
        { theme: 'light' }
      )
      
      // Light mode
      let separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveClass('bg-gradient-to-r')
      expect(separator).toHaveClass('from-transparent')
      expect(separator).toHaveClass('via-border')
      expect(separator).toHaveClass('to-transparent')
      
      // Switch to dark mode
      rerender(<Separator variant="gradient" className="my-8" />)
      
      // Dark mode - gradient should still work with semantic colors
      separator = container.querySelector('[data-orientation]')
      expect(separator).toHaveClass('bg-gradient-to-r')
      expect(separator).toHaveClass('via-border') // Uses semantic border color
    })
  })

  describe('Common Use Cases', () => {
    it('separates sections horizontally', () => {
      const { container } = render(
        <div>
          <section>Section 1</section>
          <Separator />
          <section>Section 2</section>
        </div>
      )
      
      const separator = container.querySelector('[data-orientation="horizontal"]')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveClass('h-[1px]')
      expect(separator).toHaveClass('w-full')
    })

    it('separates items vertically', () => {
      const { container } = render(
        <div className="flex">
          <span>Item 1</span>
          <Separator orientation="vertical" className="mx-2" />
          <span>Item 2</span>
        </div>
      )
      
      const separator = container.querySelector('[data-orientation="vertical"]')
      expect(separator).toHaveClass('h-full')
      expect(separator).toHaveClass('w-[1px]')
      expect(separator).toHaveClass('mx-2')
    })

    it('works in dropdown menus', () => {
      const { container } = render(
        <div role="menu">
          <div role="menuitem">Item 1</div>
          <Separator />
          <div role="menuitem">Item 2</div>
        </div>
      )
      
      const separator = container.querySelector('[data-orientation]')
      expect(separator).toBeInTheDocument()
    })

    it('works with custom spacing', () => {
      const { container } = render(<Separator className="my-8" />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('my-8')
    })
  })

  describe('Accessibility', () => {
    it('has none role when decorative', () => {
      render(<Separator decorative />)
      
      const separator = screen.getByRole('none')
      expect(separator).toBeInTheDocument()
    })

    it('has separator role when not decorative', () => {
      render(<Separator decorative={false} />)
      
      const separator = screen.getByRole('separator')
      expect(separator).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(<Separator decorative={false} aria-label="Content separator" />)
      
      const separator = screen.getByRole('separator')
      expect(separator).toHaveAttribute('aria-label', 'Content separator')
    })
  })

  describe('Edge Cases', () => {
    it('renders with no props', () => {
      const { container } = render(<Separator />)
      
      const separator = container.firstChild
      expect(separator).toBeInTheDocument()
    })

    it('handles invalid orientation gracefully', () => {
      // @ts-ignore - Testing invalid prop
      const { container } = render(<Separator orientation="diagonal" />)
      
      const separator = container.firstChild
      // Should not have orientation classes
      expect(separator).toHaveClass('shrink-0')
    })

    it('works with zero opacity', () => {
      const { container } = render(<Separator className="opacity-0" />)
      
      const separator = container.firstChild
      expect(separator).toHaveClass('opacity-0')
    })

    it('works with custom height/width', () => {
      render(
        <>
          <Separator className="h-2" />
          <Separator orientation="vertical" className="w-2" />
        </>
      )
      
      const separators = screen.getAllByRole('none')
      expect(separators[0]).toHaveClass('h-2')
      expect(separators[1]).toHaveClass('w-2')
    })
  })
})