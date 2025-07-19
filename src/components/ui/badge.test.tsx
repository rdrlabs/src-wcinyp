import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge, badgeVariants } from './badge'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Badge', () => {
  describe('Basic Functionality', () => {
    it('renders badge with text', () => {
      render(<Badge>New</Badge>)
      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('renders as div by default', () => {
      const { container } = render(<Badge>Badge</Badge>)
      expect(container.firstChild?.nodeName).toBe('DIV')
    })

    it('renders with children nodes', () => {
      render(
        <Badge>
          <span>Icon</span> Label
        </Badge>
      )
      
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText(/Label/)).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Badge>Default</Badge>)
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('bg-primary')
      expect(badge).toHaveClass('text-primary-foreground')
    })

    it('renders secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>)
      const badge = screen.getByText('Secondary')
      expect(badge).toHaveClass('bg-muted')
      expect(badge).toHaveClass('text-secondary-foreground')
    })

    it('renders destructive variant', () => {
      render(<Badge variant="destructive">Error</Badge>)
      const badge = screen.getByText('Error')
      expect(badge).toHaveClass('bg-destructive')
      expect(badge).toHaveClass('text-destructive-foreground')
    })

    it('renders outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>)
      const badge = screen.getByText('Outline')
      expect(badge).toHaveClass('border')
      expect(badge).toHaveClass('text-foreground')
    })
  })

  describe('Styling', () => {
    it('applies base styling', () => {
      render(<Badge>Styled</Badge>)
      const badge = screen.getByText('Styled')
      
      expect(badge).toHaveClass('inline-flex')
      expect(badge).toHaveClass('items-center')
      expect(badge).toHaveClass('rounded-full')
      expect(badge).toHaveClass('px-2.5')
      expect(badge).toHaveClass('py-0.5')
      expect(badge).toHaveClass('text-xs')
      expect(badge).toHaveClass('font-semibold')
    })

    it('accepts custom className', () => {
      render(<Badge className="custom-badge">Custom</Badge>)
      expect(screen.getByText('Custom')).toHaveClass('custom-badge')
    })

    it('merges custom className with base styles', () => {
      render(<Badge className="text-lg">Large</Badge>)
      const badge = screen.getByText('Large')
      
      expect(badge).toHaveClass('text-lg')
      expect(badge).toHaveClass('inline-flex') // Base style retained
    })
  })

  describe('badgeVariants utility', () => {
    it('generates correct classes for variants', () => {
      const defaultClasses = badgeVariants({ variant: 'default' })
      expect(defaultClasses).toContain('bg-primary')
      
      const secondaryClasses = badgeVariants({ variant: 'secondary' })
      expect(secondaryClasses).toContain('bg-muted')
      
      const destructiveClasses = badgeVariants({ variant: 'destructive' })
      expect(destructiveClasses).toContain('bg-destructive')
      
      const outlineClasses = badgeVariants({ variant: 'outline' })
      expect(outlineClasses).toContain('border')
    })

    it('applies custom className through badgeVariants', () => {
      const classes = badgeVariants({ 
        variant: 'default',
        className: 'custom-class' 
      })
      expect(classes).toContain('custom-class')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(<Badge>Light Badge</Badge>, { theme: 'light' })
      const badge = screen.getByText('Light Badge')
      expect(badge).toBeInTheDocument()
      
      // Badge should use semantic color classes
      expect(badge.className).toContain('bg-primary')
      expect(badge.className).toContain('text-primary-foreground')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(<Badge>Dark Badge</Badge>, { theme: 'dark' })
      const badge = screen.getByText('Dark Badge')
      expect(badge).toBeInTheDocument()
      
      // Badge should use semantic color classes
      expect(badge.className).toContain('bg-primary')
      expect(badge.className).toContain('text-primary-foreground')
    })

    it('maintains semantic colors across all variants', () => {
      const variants = ['default', 'secondary', 'destructive', 'outline'] as const
      
      variants.forEach(variant => {
        const { unmount } = renderWithTheme(
          <Badge variant={variant}>{variant} badge</Badge>,
          { theme: 'dark' }
        )
        
        const badge = screen.getByText(`${variant} badge`)
        const classList = badge.className
        
        // Check for semantic color classes based on variant
        if (variant === 'default') {
          expect(classList).toContain('bg-primary')
          expect(classList).toContain('text-primary-foreground')
        } else if (variant === 'secondary') {
          expect(classList).toContain('bg-muted')
          expect(classList).toContain('text-secondary-foreground')
        } else if (variant === 'destructive') {
          expect(classList).toContain('bg-destructive')
          expect(classList).toContain('text-destructive-foreground')
        } else if (variant === 'outline') {
          expect(classList).toContain('border')
          expect(classList).toContain('text-foreground')
        }
        
        // Ensure no hard-coded colors
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        
        unmount()
      })
    })
  })

  describe('Common Use Cases', () => {
    it('renders status badges', () => {
      render(
        <>
          <Badge variant="default">Active</Badge>
          <Badge variant="secondary">Pending</Badge>
          <Badge variant="destructive">Inactive</Badge>
        </>
      )
      
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Inactive')).toBeInTheDocument()
    })

    it('renders count badges', () => {
      render(
        <>
          <Badge>5</Badge>
          <Badge variant="destructive">99+</Badge>
        </>
      )
      
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('99+')).toBeInTheDocument()
    })

    it('renders with icons', () => {
      render(
        <Badge>
          <span className="mr-1">●</span>
          Online
        </Badge>
      )
      
      expect(screen.getByText('●')).toBeInTheDocument()
      expect(screen.getByText(/Online/)).toBeInTheDocument()
    })

    it('renders in a button', () => {
      render(
        <button>
          Messages <Badge className="ml-2">3</Badge>
        </button>
      )
      
      expect(screen.getByRole('button')).toHaveTextContent('Messages 3')
    })
  })

  describe('Accessibility', () => {
    it('can be labeled with aria-label', () => {
      render(<Badge aria-label="3 new notifications">3</Badge>)
      expect(screen.getByText('3')).toHaveAttribute('aria-label', '3 new notifications')
    })

    it('supports role attribute', () => {
      render(<Badge role="status">Live</Badge>)
      expect(screen.getByRole('status')).toHaveTextContent('Live')
    })

    it('can be used with screen reader only text', () => {
      render(
        <Badge>
          <span className="sr-only">Status:</span> Active
        </Badge>
      )
      
      expect(screen.getByText(/Active/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('renders empty badge', () => {
      const { container } = render(<Badge />)
      expect(container.firstChild).toBeInTheDocument()
      expect(container.firstChild).toHaveClass('inline-flex')
    })

    it('renders with very long text', () => {
      render(<Badge>This is a very long badge text that might wrap</Badge>)
      expect(screen.getByText(/very long badge text/)).toBeInTheDocument()
    })

    it('renders with numbers', () => {
      render(<Badge>12345</Badge>)
      expect(screen.getByText('12345')).toBeInTheDocument()
    })

    it('renders with special characters', () => {
      render(<Badge>Badge™</Badge>)
      expect(screen.getByText('Badge™')).toBeInTheDocument()
    })

    it('handles conditional rendering', () => {
      const count = 5
      render(
        <>
          {count > 0 && <Badge>{count}</Badge>}
        </>
      )
      
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })
})