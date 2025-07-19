import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'
import { renderWithTheme, expectSemanticColors } from '@/test/theme-test-utils'

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')
    
    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
    
    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })

  it('applies size classes', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')
    
    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('forwards refs', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Button</Button>)
    expect(ref).toHaveBeenCalled()
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(<Button>Light Button</Button>, { theme: 'light' })
      const button = screen.getByRole('button')
      expectSemanticColors(button)
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(<Button>Dark Button</Button>, { theme: 'dark' })
      const button = screen.getByRole('button')
      expectSemanticColors(button)
    })

    it('maintains semantic colors across all variants', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
      
      // Test in light mode
      variants.forEach(variant => {
        const { unmount } = renderWithTheme(
          <Button variant={variant}>{variant} Button</Button>,
          { theme: 'light' }
        )
        const button = screen.getByRole('button')
        // Button should have semantic color classes
        const classList = button.className
        expect(classList).toMatch(/bg-primary|bg-destructive|bg-secondary|bg-background|bg-muted|text-primary|text-primary-foreground|text-destructive-foreground|text-secondary-foreground|text-accent-foreground|border-input/)
        unmount()
      })
      
      // Test in dark mode
      variants.forEach(variant => {
        const { unmount } = renderWithTheme(
          <Button variant={variant}>{variant} Button</Button>,
          { theme: 'dark' }
        )
        const button = screen.getByRole('button')
        // Button should have semantic color classes
        const classList = button.className
        expect(classList).toMatch(/bg-primary|bg-destructive|bg-secondary|bg-background|bg-muted|text-primary|text-primary-foreground|text-destructive-foreground|text-secondary-foreground|text-accent-foreground|border-input/)
        unmount()
      })
    })
  })
})