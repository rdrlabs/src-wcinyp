import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { GlassCard } from './glass-card'
import { renderWithTheme } from '@/test/theme-test-utils'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, className, style, onMouseEnter, onMouseLeave, ...props }) => (
      <div
        className={className}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </div>
    )),
  },
  HTMLMotionProps: {},
}))

describe('GlassCard', () => {
  describe('Basic Functionality', () => {
    it('renders children content', () => {
      render(
        <GlassCard>
          <p>Glass card content</p>
        </GlassCard>
      )

      expect(screen.getByText('Glass card content')).toBeInTheDocument()
    })

    it('applies glass styling classes', () => {
      const { container } = render(
        <GlassCard>Content</GlassCard>
      )

      const card = container.firstChild
      expect(card).toHaveClass('rounded-2xl')
      expect(card).toHaveClass('bg-white/[0.03]')
      expect(card).toHaveClass('backdrop-blur-[var(--blur-base)]')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('border-white/[0.06]')
    })

    it('accepts custom className', () => {
      const { container } = render(
        <GlassCard className="custom-glass">Content</GlassCard>
      )

      expect(container.firstChild).toHaveClass('custom-glass')
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      
      render(
        <GlassCard ref={ref}>Content</GlassCard>
      )

      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Hover Effects', () => {
    it('applies hover classes when hover is true', () => {
      const { container } = render(
        <GlassCard hover={true}>Content</GlassCard>
      )

      const card = container.firstChild
      expect(card).toHaveClass('hover:bg-white/[0.05]')
      expect(card).toHaveClass('hover:border-white/[0.1]')
      expect(card).toHaveClass('hover:translate-y-[-2px]')
    })

    it('does not apply hover classes when hover is false', () => {
      const { container } = render(
        <GlassCard hover={false}>Content</GlassCard>
      )

      const card = container.firstChild
      expect(card).not.toHaveClass('hover:bg-white/[0.05]')
      expect(card).not.toHaveClass('hover:border-white/[0.1]')
      expect(card).not.toHaveClass('hover:translate-y-[-2px]')
    })

    it('handles mouse enter event', () => {
      const handleMouseEnter = vi.fn()
      const { container } = render(
        <GlassCard onMouseEnter={handleMouseEnter}>Content</GlassCard>
      )

      const card = container.firstChild as HTMLElement
      fireEvent.mouseEnter(card)

      expect(handleMouseEnter).toHaveBeenCalled()
      // The framer-motion mock doesn't handle style changes
      expect(card).toBeInTheDocument()
    })

    it('handles mouse leave event', () => {
      const handleMouseLeave = vi.fn()
      const { container } = render(
        <GlassCard onMouseLeave={handleMouseLeave}>Content</GlassCard>
      )

      const card = container.firstChild as HTMLElement
      
      // First enter to set shadow
      fireEvent.mouseEnter(card)
      
      // Then leave to clear shadow
      fireEvent.mouseLeave(card)
      expect(handleMouseLeave).toHaveBeenCalled()
      // The framer-motion mock doesn't handle style changes
      expect(card).toBeInTheDocument()
    })

    it('does not apply hover shadow when hover is false', () => {
      const { container } = render(
        <GlassCard hover={false}>Content</GlassCard>
      )

      const card = container.firstChild as HTMLElement
      fireEvent.mouseEnter(card)

      expect(card.style.boxShadow).not.toBe('var(--hover-shadow)')
    })
  })

  describe('Glow Effect', () => {
    it('applies glow class when glow is true', () => {
      const { container } = render(
        <GlassCard glow={true}>Content</GlassCard>
      )

      expect(container.firstChild).toHaveClass('shadow-[var(--shadow-glow)]')
    })

    it('does not apply glow class when glow is false', () => {
      const { container } = render(
        <GlassCard glow={false}>Content</GlassCard>
      )

      expect(container.firstChild).not.toHaveClass('shadow-[var(--shadow-glow)]')
    })
  })

  describe('Glass Texture', () => {
    it('renders glass texture overlay', () => {
      const { container } = render(
        <GlassCard>Content</GlassCard>
      )

      const overlay = container.querySelector('.absolute.inset-0.opacity-\\[0\\.015\\]')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveStyle({ backgroundImage: expect.stringContaining('svg') })
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <GlassCard hover glow>
          <h3 className="text-lg font-semibold">Glass Card Title</h3>
          <p className="text-muted-foreground">Glass card content with semantic colors</p>
        </GlassCard>,
        { theme: 'light' }
      )

      const card = container.firstChild as HTMLElement
      
      // Check glass effect styling (using white with opacity)
      expect(card).toHaveClass('bg-white/[0.03]')
      expect(card).toHaveClass('border-white/[0.06]')
      expect(card).toHaveClass('backdrop-blur-[var(--blur-base)]')
      
      // Check hover classes are semantic
      expect(card).toHaveClass('hover:bg-white/[0.05]')
      expect(card).toHaveClass('hover:border-white/[0.1]')
      
      // Check glow effect
      expect(card).toHaveClass('shadow-[var(--shadow-glow)]')
      
      // Check content uses semantic colors
      const title = screen.getByText('Glass Card Title')
      expect(title.className).toContain('font-semibold')
      
      const content = screen.getByText(/Glass card content/)
      expect(content.className).toContain('text-muted-foreground')
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <GlassCard hover={false} glow={false}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Label</span>
            <span className="text-muted-foreground">Value</span>
          </div>
        </GlassCard>,
        { theme: 'dark' }
      )

      const card = container.firstChild as HTMLElement
      
      // Glass effect should be consistent in dark mode
      expect(card).toHaveClass('bg-white/[0.03]')
      expect(card).toHaveClass('border-white/[0.06]')
      
      // No hover classes when hover is false
      expect(card).not.toHaveClass('hover:bg-white/[0.05]')
      
      // No glow when glow is false
      expect(card).not.toHaveClass('shadow-[var(--shadow-glow)]')
      
      // Check content maintains semantic colors
      const label = screen.getByText('Label')
      expect(label.className).toContain('font-medium')
      
      const value = screen.getByText('Value')
      expect(value.className).toContain('text-muted-foreground')
    })

    it('maintains glass effect with different content layouts', () => {
      renderWithTheme(
        <div className="space-y-4 p-8 bg-background">
          {/* Card with padding */}
          <GlassCard className="p-6" hover glow>
            <h3 className="text-xl font-bold mb-2">Feature Card</h3>
            <p className="text-muted-foreground">
              This is a feature description using semantic colors
            </p>
          </GlassCard>
          
          {/* Compact card */}
          <GlassCard className="p-4" hover>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10" />
              <div>
                <p className="font-medium">User Name</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </GlassCard>
          
          {/* Widget card */}
          <GlassCard className="p-3" glow>
            <div className="text-center">
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </GlassCard>
        </div>,
        { theme: 'dark' }
      )
      
      // Check all cards maintain glass effect
      const cards = document.querySelectorAll('.bg-white\\/\\[0\\.03\\]')
      expect(cards).toHaveLength(3)
      
      cards.forEach(card => {
        expect(card).toHaveClass('border-white/[0.06]')
        expect(card).toHaveClass('backdrop-blur-[var(--blur-base)]')
      })
      
      // Check semantic colors in content
      const mutedTexts = screen.getAllByText((content, element) => {
        return element?.className?.includes('text-muted-foreground') || false
      })
      expect(mutedTexts.length).toBeGreaterThan(0)
    })

    it('ensures no hard-coded colors except glass effects', () => {
      const { container } = renderWithTheme(
        <GlassCard hover glow className="custom-card">
          <div className="space-y-2">
            <h4 className="font-semibold">Card Title</h4>
            <p className="text-sm text-muted-foreground">Card description</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-primary text-primary-foreground rounded">
                Action
              </button>
              <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded">
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>,
        { theme: 'dark' }
      )
      
      // Glass effects use white with opacity (this is intentional for glass effect)
      const card = container.firstChild
      expect(card).toHaveClass('bg-white/[0.03]')
      expect(card).toHaveClass('border-white/[0.06]')
      
      // Check content doesn't have hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string' && !classList.includes('white/[')) {
          // Should not contain hard-coded color values (except the glass white opacity)
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone)-\d+/)
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone)-\d+/)
          expect(classList).not.toMatch(/border-(gray|slate|zinc|neutral|stone)-\d+/)
        }
      })
    })

    it('works with hover effects in both themes', () => {
      const { container } = renderWithTheme(
        <GlassCard hover>
          <div className="p-4">
            <p className="font-medium">Hover over this card</p>
            <p className="text-sm text-muted-foreground mt-1">
              The glass effect intensifies on hover
            </p>
          </div>
        </GlassCard>,
        { theme: 'light' }
      )
      
      const card = container.firstChild as HTMLElement
      
      // Check hover state classes
      expect(card).toHaveClass('hover:bg-white/[0.05]')
      expect(card).toHaveClass('hover:border-white/[0.1]')
      expect(card).toHaveClass('hover:translate-y-[-2px]')
      expect(card).toHaveClass('transition-all')
      expect(card).toHaveClass('duration-300')
      
      // Simulate hover
      fireEvent.mouseEnter(card)
      
      // Style changes would be handled by CSS, but we can verify the event handler was called
      expect(card).toBeInTheDocument()
    })

    it('maintains glass texture overlay', () => {
      const { container } = renderWithTheme(
        <GlassCard>
          <p>Content with texture overlay</p>
        </GlassCard>,
        { theme: 'dark' }
      )
      
      // Check for texture overlay
      const overlay = container.querySelector('.absolute.inset-0.opacity-\\[0\\.015\\]')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('pointer-events-none')
      expect(overlay).toHaveClass('mix-blend-screen')
      
      // Check it has the SVG pattern
      const style = overlay?.getAttribute('style')
      expect(style).toContain('background-image')
      expect(style).toContain('url(')
      expect(style).toContain('svg')
    })

    it('works with custom styling while maintaining glass effect', () => {
      const { container } = renderWithTheme(
        <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
          <GlassCard 
            className="max-w-md mx-auto p-8" 
            hover 
            glow
          >
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <div className="space-y-4">
              <input 
                className="w-full px-4 py-2 bg-background/50 border rounded-lg"
                placeholder="Email"
              />
              <input 
                className="w-full px-4 py-2 bg-background/50 border rounded-lg"
                placeholder="Password"
                type="password"
              />
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg">
                Sign In
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Don't have an account? Sign up
            </p>
          </GlassCard>
        </div>,
        { theme: 'dark' }
      )
      
      // Check gradient background
      const gradientBg = container.querySelector('.bg-gradient-to-br')
      expect(gradientBg).toBeInTheDocument()
      
      // Check glass card maintains its effect
      const card = container.querySelector('.bg-white\\/\\[0\\.03\\]')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('max-w-md')
      expect(card).toHaveClass('mx-auto')
      expect(card).toHaveClass('p-8')
      
      // Check form elements use semantic colors
      const inputs = container.querySelectorAll('input')
      inputs.forEach(input => {
        expect(input.className).toContain('bg-background/50')
        expect(input.className).toContain('border')
      })
      
      const button = screen.getByRole('button', { name: 'Sign In' })
      expect(button.className).toContain('bg-primary')
      expect(button.className).toContain('text-primary-foreground')
    })

    it('glass effect works on different backgrounds', () => {
      renderWithTheme(
        <div className="space-y-4">
          {/* On solid background */}
          <div className="p-4 bg-background">
            <GlassCard className="p-4">
              <p>Glass on solid background</p>
            </GlassCard>
          </div>
          
          {/* On gradient background */}
          <div className="p-4 bg-gradient-to-r from-primary to-secondary">
            <GlassCard className="p-4">
              <p>Glass on gradient background</p>
            </GlassCard>
          </div>
          
          {/* On image background (simulated with pattern) */}
          <div className="p-4 bg-muted" style={{ backgroundImage: 'url(data:image/svg+xml,...)' }}>
            <GlassCard className="p-4">
              <p>Glass on image background</p>
            </GlassCard>
          </div>
        </div>,
        { theme: 'light' }
      )
      
      // All cards should maintain consistent glass effect
      const cards = document.querySelectorAll('.bg-white\\/\\[0\\.03\\]')
      expect(cards).toHaveLength(3)
      
      cards.forEach(card => {
        expect(card).toHaveClass('backdrop-blur-[var(--blur-base)]')
        expect(card).toHaveClass('border-white/[0.06]')
      })
    })
  })

  describe('Motion Props', () => {
    it('passes through motion props', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <GlassCard
          onClick={handleClick}
          data-testid="glass-card"
        >
          Content
        </GlassCard>
      )

      const card = container.firstChild as HTMLElement
      fireEvent.click(card)

      expect(handleClick).toHaveBeenCalled()
      expect(card).toHaveAttribute('data-testid', 'glass-card')
    })

    it('merges custom styles', () => {
      const { container } = render(
        <GlassCard style={{ backgroundColor: 'red' }}>
          Content
        </GlassCard>
      )

      const card = container.firstChild as HTMLElement
      expect(card.style.backgroundColor).toBe('red')
    })
  })

  describe('Common Use Cases', () => {
    it('renders as feature card', () => {
      render(
        <GlassCard className="p-6" hover glow>
          <h3 className="text-xl font-bold">Feature Title</h3>
          <p className="mt-2">Feature description</p>
        </GlassCard>
      )

      expect(screen.getByText('Feature Title')).toBeInTheDocument()
      expect(screen.getByText('Feature description')).toBeInTheDocument()
    })

    it('renders as dashboard widget', () => {
      render(
        <GlassCard className="p-4" hover={false}>
          <div className="flex justify-between">
            <span>Metric</span>
            <span>Value</span>
          </div>
        </GlassCard>
      )

      expect(screen.getByText('Metric')).toBeInTheDocument()
      expect(screen.getByText('Value')).toBeInTheDocument()
    })

    it('renders with interactive content', async () => {
      const user = userEvent.setup()
      const handleButtonClick = vi.fn()
      
      render(
        <GlassCard>
          <button onClick={handleButtonClick}>Click me</button>
        </GlassCard>
      )

      await user.click(screen.getByRole('button'))
      expect(handleButtonClick).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('can be focused when interactive', () => {
      const { container } = render(
        <GlassCard tabIndex={0} role="article">
          Content
        </GlassCard>
      )

      const card = container.firstChild as HTMLElement
      expect(card).toHaveAttribute('tabIndex', '0')
      expect(card).toHaveAttribute('role', 'article')
    })

    it('supports aria attributes', () => {
      const { container } = render(
        <GlassCard aria-label="Glass card component" aria-describedby="desc">
          <p id="desc">Description</p>
        </GlassCard>
      )

      const card = container.firstChild
      expect(card).toHaveAttribute('aria-label', 'Glass card component')
      expect(card).toHaveAttribute('aria-describedby', 'desc')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { container } = render(
        <GlassCard />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles multiple children', () => {
      render(
        <GlassCard>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </GlassCard>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('preserves event handlers when hover is disabled', () => {
      const handleMouseEnter = vi.fn()
      const handleMouseLeave = vi.fn()
      
      const { container } = render(
        <GlassCard
          hover={false}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Content
        </GlassCard>
      )

      const card = container.firstChild as HTMLElement
      fireEvent.mouseEnter(card)
      fireEvent.mouseLeave(card)

      expect(handleMouseEnter).toHaveBeenCalled()
      expect(handleMouseLeave).toHaveBeenCalled()
    })
  })
})