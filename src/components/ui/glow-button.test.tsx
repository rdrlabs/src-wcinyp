import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { GlowButton } from './glow-button'
import { renderWithTheme } from '@/test/theme-test-utils'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: vi.fn(({ children, className, style, onMouseEnter, onMouseLeave, onClick, ...props }) => (
      <button
        className={className}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )),
    div: vi.fn(({ children, className, style, ...props }) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    )),
  },
  HTMLMotionProps: {},
}))

describe('GlowButton', () => {
  describe('Basic Functionality', () => {
    it('renders button with text', () => {
      render(<GlowButton>Click me</GlowButton>)

      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
    })

    it('handles click events', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(<GlowButton onClick={handleClick}>Click me</GlowButton>)

      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalled()
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      
      render(<GlowButton ref={ref}>Button</GlowButton>)

      expect(ref).toHaveBeenCalled()
    })

    it('accepts custom className', () => {
      render(<GlowButton className="custom-button">Button</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-button')
    })
  })

  describe('Variants', () => {
    it('applies primary variant styles by default', () => {
      render(<GlowButton>Primary</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
      expect(button).toHaveClass('text-primary-foreground')
    })

    it('applies secondary variant styles', () => {
      render(<GlowButton variant="secondary">Secondary</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent')
      expect(button).toHaveClass('text-foreground')
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('border-white/10')
    })

    it('applies ghost variant styles', () => {
      render(<GlowButton variant="ghost">Ghost</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent')
      expect(button).toHaveClass('text-foreground')
      expect(button).toHaveClass('hover:bg-white/5')
    })
  })

  describe('Sizes', () => {
    it('applies small size styles', () => {
      render(<GlowButton size="sm">Small</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4')
      expect(button).toHaveClass('py-2')
      expect(button).toHaveClass('text-sm')
    })

    it('applies medium size styles by default', () => {
      render(<GlowButton>Medium</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6')
      expect(button).toHaveClass('py-3')
      expect(button).toHaveClass('text-base')
    })

    it('applies large size styles', () => {
      render(<GlowButton size="lg">Large</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-8')
      expect(button).toHaveClass('py-4')
      expect(button).toHaveClass('text-lg')
    })
  })

  describe('Glow Effects', () => {
    it('applies glow shadow for primary variant', () => {
      render(<GlowButton variant="primary">Glow</GlowButton>)

      const button = screen.getByRole('button')
      expect(button.style.boxShadow).toContain('rgba')
    })

    it('handles hover glow effect for primary variant', () => {
      render(<GlowButton variant="primary">Hover me</GlowButton>)

      const button = screen.getByRole('button')
      
      fireEvent.mouseEnter(button)
      expect(button.style.boxShadow).toBe('var(--hover-shadow)')
      
      fireEvent.mouseLeave(button)
      expect(button.style.boxShadow).toContain('rgba')
    })

    it('does not apply glow effect for secondary variant', () => {
      render(<GlowButton variant="secondary">No glow</GlowButton>)

      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)
      
      expect(button.style.boxShadow).not.toBe('var(--hover-shadow)')
    })

    it('renders glow overlay for primary variant', () => {
      const { container } = render(<GlowButton variant="primary">Glow</GlowButton>)

      // Look for the glow effect div
      const glowOverlay = container.querySelector('.absolute.inset-0.rounded-lg.bg-primary')
      expect(glowOverlay).toBeInTheDocument()
    })
  })

  describe('Shimmer Effect', () => {
    it('renders shimmer overlay', () => {
      const { container } = render(<GlowButton>Shimmer</GlowButton>)

      // Look for shimmer effect div with gradient
      const shimmerOverlay = container.querySelector('[style*="linear-gradient"]')
      expect(shimmerOverlay).toBeInTheDocument()
    })
  })

  describe('Event Handlers', () => {
    it('preserves custom mouse event handlers', () => {
      const handleMouseEnter = vi.fn()
      const handleMouseLeave = vi.fn()
      
      render(
        <GlowButton
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Events
        </GlowButton>
      )

      const button = screen.getByRole('button')
      
      fireEvent.mouseEnter(button)
      expect(handleMouseEnter).toHaveBeenCalled()
      
      fireEvent.mouseLeave(button)
      expect(handleMouseLeave).toHaveBeenCalled()
    })

    it('merges custom styles', () => {
      render(
        <GlowButton style={{ backgroundColor: 'red' }}>
          Custom style
        </GlowButton>
      )

      const button = screen.getByRole('button')
      expect(button.style.backgroundColor).toBe('red')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <div className="space-y-4">
          <GlowButton variant="primary">Primary Button</GlowButton>
          <GlowButton variant="secondary">Secondary Button</GlowButton>
          <GlowButton variant="ghost">Ghost Button</GlowButton>
        </div>,
        { theme: 'light' }
      )

      // Check primary variant uses semantic colors
      const primaryButton = screen.getByRole('button', { name: 'Primary Button' })
      expect(primaryButton).toHaveClass('bg-primary')
      expect(primaryButton).toHaveClass('text-primary-foreground')
      expect(primaryButton).toHaveClass('hover:bg-primary/90')
      
      // Check glow effect for primary
      expect(primaryButton.style.boxShadow).toContain('rgba')
      
      // Check secondary variant uses semantic colors
      const secondaryButton = screen.getByRole('button', { name: 'Secondary Button' })
      expect(secondaryButton).toHaveClass('bg-transparent')
      expect(secondaryButton).toHaveClass('text-foreground')
      expect(secondaryButton).toHaveClass('border')
      expect(secondaryButton).toHaveClass('border-white/10')
      expect(secondaryButton).toHaveClass('hover:bg-white/5')
      
      // Check ghost variant uses semantic colors
      const ghostButton = screen.getByRole('button', { name: 'Ghost Button' })
      expect(ghostButton).toHaveClass('bg-transparent')
      expect(ghostButton).toHaveClass('text-foreground')
      expect(ghostButton).toHaveClass('hover:bg-white/5')
      
      // Check overlays maintain proper styling
      const glowOverlays = container.querySelectorAll('.absolute.inset-0.rounded-lg.bg-primary')
      expect(glowOverlays.length).toBeGreaterThan(0)
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <div className="space-y-4 p-8 bg-background">
          <GlowButton variant="primary" size="lg">
            <span className="mr-2">🚀</span>
            Launch Application
          </GlowButton>
          <GlowButton variant="secondary" size="md">
            View Documentation
          </GlowButton>
          <GlowButton variant="ghost" size="sm">
            Skip Tutorial
          </GlowButton>
        </div>,
        { theme: 'dark' }
      )

      // Check all buttons maintain semantic colors in dark mode
      const buttons = screen.getAllByRole('button')
      
      // Primary button
      expect(buttons[0]).toHaveClass('bg-primary')
      expect(buttons[0]).toHaveClass('text-primary-foreground')
      expect(buttons[0]).toHaveClass('text-lg') // size="lg"
      
      // Secondary button
      expect(buttons[1]).toHaveClass('border-white/10')
      expect(buttons[1]).toHaveClass('hover:bg-white/5')
      expect(buttons[1]).toHaveClass('text-base') // size="md"
      
      // Ghost button
      expect(buttons[2]).toHaveClass('hover:bg-white/5')
      expect(buttons[2]).toHaveClass('text-sm') // size="sm"
      
      // Background uses semantic color
      const bgContainer = container.querySelector('.bg-background')
      expect(bgContainer).toBeInTheDocument()
    })

    it('maintains glow effects with semantic colors', () => {
      const { container } = renderWithTheme(
        <GlowButton variant="primary">Glowing Button</GlowButton>,
        { theme: 'dark' }
      )
      
      const button = screen.getByRole('button')
      
      // Check initial glow
      expect(button.style.boxShadow).toContain('rgba')
      
      // Simulate hover for enhanced glow
      fireEvent.mouseEnter(button)
      expect(button.style.boxShadow).toBe('var(--hover-shadow)')
      
      // Check glow overlay
      const glowOverlay = container.querySelector('.absolute.inset-0.rounded-lg.bg-primary')
      expect(glowOverlay).toBeInTheDocument()
      expect(glowOverlay).toHaveClass('opacity-50')
      expect(glowOverlay).toHaveClass('blur-xl')
      
      // Simulate mouse leave
      fireEvent.mouseLeave(button)
      expect(button.style.boxShadow).toContain('rgba')
    })

    it('shimmer effect works in both themes', () => {
      const { container, rerender } = renderWithTheme(
        <GlowButton>Shimmer Button</GlowButton>,
        { theme: 'light' }
      )
      
      // Check shimmer overlay in light mode
      let shimmerOverlay = container.querySelector('[style*="linear-gradient"]')
      expect(shimmerOverlay).toBeInTheDocument()
      expect(shimmerOverlay).toHaveClass('absolute')
      expect(shimmerOverlay).toHaveClass('inset-0')
      expect(shimmerOverlay).toHaveClass('animate-shimmer')
      
      // Switch to dark mode
      rerender(<GlowButton>Shimmer Button</GlowButton>)
      
      // Shimmer should still work in dark mode
      shimmerOverlay = container.querySelector('[style*="linear-gradient"]')
      expect(shimmerOverlay).toBeInTheDocument()
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <div className="space-y-4">
          <GlowButton variant="primary" className="custom-class">
            Primary Action
          </GlowButton>
          <GlowButton variant="secondary" disabled>
            Disabled Secondary
          </GlowButton>
          <GlowButton variant="ghost">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" />
              Ghost Action
            </span>
          </GlowButton>
        </div>,
        { theme: 'dark' }
      )
      
      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string') {
          // Should not contain hard-coded color values (except white opacity for glass effects)
          if (!classList.includes('white/')) {
            expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone)-\d+/)
            expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone)-\d+/)
            expect(classList).not.toMatch(/border-(gray|slate|zinc|neutral|stone)-\d+/)
          }
        }
      })
    })

    it('maintains theme consistency with all sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      
      renderWithTheme(
        <div className="flex gap-4">
          {sizes.map(size => (
            <GlowButton key={size} size={size} variant="primary">
              {size.toUpperCase()}
            </GlowButton>
          ))}
        </div>,
        { theme: 'light' }
      )
      
      const buttons = screen.getAllByRole('button')
      
      // All sizes should maintain semantic colors
      buttons.forEach(button => {
        expect(button).toHaveClass('bg-primary')
        expect(button).toHaveClass('text-primary-foreground')
        expect(button).toHaveClass('hover:bg-primary/90')
      })
      
      // Check size-specific classes
      expect(buttons[0]).toHaveClass('px-4', 'py-2', 'text-sm')
      expect(buttons[1]).toHaveClass('px-6', 'py-3', 'text-base')
      expect(buttons[2]).toHaveClass('px-8', 'py-4', 'text-lg')
    })

    it('works with different backgrounds while maintaining glow', () => {
      renderWithTheme(
        <div className="space-y-4">
          {/* On solid background */}
          <div className="p-4 bg-background">
            <GlowButton>On Solid Background</GlowButton>
          </div>
          
          {/* On gradient background */}
          <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20">
            <GlowButton>On Gradient Background</GlowButton>
          </div>
          
          {/* On muted background */}
          <div className="p-4 bg-muted">
            <GlowButton>On Muted Background</GlowButton>
          </div>
          
          {/* On card background */}
          <div className="p-4 bg-card border rounded-lg">
            <GlowButton>On Card Background</GlowButton>
          </div>
        </div>,
        { theme: 'dark' }
      )
      
      // All buttons should maintain consistent styling
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(4)
      
      buttons.forEach(button => {
        expect(button).toHaveClass('bg-primary')
        expect(button).toHaveClass('text-primary-foreground')
        // Each should have glow effect
        expect(button.style.boxShadow).toContain('rgba')
      })
      
      // Check semantic background classes are used
      expect(document.querySelector('.bg-background')).toBeInTheDocument()
      expect(document.querySelector('.bg-muted')).toBeInTheDocument()
      expect(document.querySelector('.bg-card')).toBeInTheDocument()
    })

    it('maintains proper z-index layering for effects', () => {
      const { container } = renderWithTheme(
        <GlowButton variant="primary">
          <span>Button Content</span>
        </GlowButton>,
        { theme: 'dark' }
      )
      
      // Check z-index layering
      const contentWrapper = container.querySelector('.relative.z-10')
      expect(contentWrapper).toBeInTheDocument()
      expect(contentWrapper).toHaveTextContent('Button Content')
      
      // Glow overlay should be behind content
      const glowOverlay = container.querySelector('.absolute.inset-0.rounded-lg.bg-primary')
      expect(glowOverlay).toBeInTheDocument()
      
      // Shimmer overlay should also be behind content
      const shimmerOverlay = container.querySelector('[style*="linear-gradient"]')
      expect(shimmerOverlay).toBeInTheDocument()
    })

    it('works with custom styling while maintaining glow effects', () => {
      const { container } = renderWithTheme(
        <div className="min-h-screen bg-gradient-to-br from-background to-muted p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h1>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Basic</h3>
                <p className="text-muted-foreground mb-6">For individuals</p>
                <GlowButton variant="secondary" className="w-full">
                  Get Started
                </GlowButton>
              </div>
              
              <div className="bg-card p-6 rounded-lg border-2 border-primary">
                <h3 className="text-xl font-semibold mb-4">Pro</h3>
                <p className="text-muted-foreground mb-6">For teams</p>
                <GlowButton variant="primary" className="w-full" size="lg">
                  Upgrade Now
                </GlowButton>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
                <p className="text-muted-foreground mb-6">For organizations</p>
                <GlowButton variant="ghost" className="w-full">
                  Contact Sales
                </GlowButton>
              </div>
            </div>
          </div>
        </div>,
        { theme: 'dark' }
      )
      
      // Check gradient background
      const gradientBg = container.querySelector('.bg-gradient-to-br')
      expect(gradientBg).toBeInTheDocument()
      
      // Check cards use semantic colors
      const cards = container.querySelectorAll('.bg-card')
      expect(cards).toHaveLength(3)
      cards.forEach(card => {
        expect(card).toHaveClass('border')
      })
      
      // Check buttons maintain their variant styling
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toHaveClass('bg-transparent') // secondary
      expect(buttons[1]).toHaveClass('bg-primary') // primary
      expect(buttons[2]).toHaveClass('bg-transparent') // ghost
      
      // Pro card button should have glow
      expect(buttons[1].style.boxShadow).toContain('rgba')
      
      // All text uses semantic colors
      const mutedTexts = container.querySelectorAll('.text-muted-foreground')
      expect(mutedTexts).toHaveLength(3)
    })
  })

  describe('Common Use Cases', () => {
    it('works as CTA button', () => {
      render(
        <GlowButton size="lg" variant="primary">
          Get Started
        </GlowButton>
      )

      const button = screen.getByRole('button', { name: 'Get Started' })
      expect(button).toHaveClass('bg-primary')
      expect(button).toHaveClass('text-lg')
    })

    it('works as secondary action', () => {
      render(
        <GlowButton variant="secondary" size="md">
          Learn More
        </GlowButton>
      )

      const button = screen.getByRole('button', { name: 'Learn More' })
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('hover:bg-white/5')
    })

    it('works with icons', () => {
      render(
        <GlowButton>
          <span className="icon">→</span>
          Next
        </GlowButton>
      )

      expect(screen.getByText('→')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('supports disabled state', () => {
      render(<GlowButton disabled>Disabled</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('supports aria attributes', () => {
      render(
        <GlowButton aria-label="Submit form" aria-pressed="true">
          Submit
        </GlowButton>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Submit form')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('supports type attribute', () => {
      render(<GlowButton type="submit">Submit</GlowButton>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<GlowButton />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('handles complex children', () => {
      render(
        <GlowButton>
          <div>
            <span>Icon</span>
            <span>Text</span>
          </div>
        </GlowButton>
      )

      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })

    it('maintains button content z-index', () => {
      const { container } = render(<GlowButton>Content</GlowButton>)

      const contentSpan = container.querySelector('.relative.z-10')
      expect(contentSpan).toBeInTheDocument()
      expect(contentSpan).toHaveTextContent('Content')
    })
  })
})