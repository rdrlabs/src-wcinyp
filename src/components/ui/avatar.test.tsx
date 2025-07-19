import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Avatar', () => {
  describe('Basic Functionality', () => {
    it('renders avatar with fallback', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-avatar.jpg" alt="Test User" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      )

      // Radix UI Avatar shows fallback by default until image loads
      expect(screen.getByText('TU')).toBeInTheDocument()
    })

    it('shows fallback without image', () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('AB')).toBeInTheDocument()
    })

    it('renders with custom size', () => {
      const { container } = render(
        <Avatar className="h-20 w-20">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
      )

      expect(container.firstChild).toHaveClass('h-20')
      expect(container.firstChild).toHaveClass('w-20')
    })
  })

  describe('Styling', () => {
    it('applies default styling', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      )

      const avatar = container.firstChild
      expect(avatar).toHaveClass('relative')
      expect(avatar).toHaveClass('flex')
      expect(avatar).toHaveClass('h-10')
      expect(avatar).toHaveClass('w-10')
      expect(avatar).toHaveClass('shrink-0')
      expect(avatar).toHaveClass('overflow-hidden')
      expect(avatar).toHaveClass('rounded-full')
    })

    it('accepts custom className', () => {
      const { container } = render(
        <Avatar className="custom-avatar">
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      )

      expect(container.firstChild).toHaveClass('custom-avatar')
    })

    it('accepts custom size classes', () => {
      const { container } = render(
        <Avatar className="h-20 w-20">
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      )

      expect(container.firstChild).toHaveClass('h-20')
      expect(container.firstChild).toHaveClass('w-20')
    })
  })

  describe('AvatarImage', () => {
    it('renders with image component', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="Test" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      )

      // Check that avatar structure is correct
      expect(container.querySelector('span')).toBeInTheDocument()
    })

    it('accepts custom className on Avatar', () => {
      const { container } = render(
        <Avatar className="custom-avatar">
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      )

      expect(container.firstChild).toHaveClass('custom-avatar')
    })
  })

  describe('AvatarFallback', () => {
    it('applies fallback styling', () => {
      render(
        <Avatar>
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      )

      const fallback = screen.getByText('TU')
      expect(fallback).toHaveClass('flex')
      expect(fallback).toHaveClass('h-full')
      expect(fallback).toHaveClass('w-full')
      expect(fallback).toHaveClass('items-center')
      expect(fallback).toHaveClass('justify-center')
      expect(fallback).toHaveClass('rounded-full')
      expect(fallback).toHaveClass('bg-muted')
    })

    it('accepts custom fallback className', () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback">
            TU
          </AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('TU')).toHaveClass('custom-fallback')
    })

    it('supports emoji fallbacks', () => {
      render(
        <Avatar>
          <AvatarFallback>👤</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('👤')).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(
        <Avatar>
          <AvatarImage src="/test-avatar.jpg" alt="Test User" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>,
        { theme: 'light' }
      )

      const fallback = screen.getByText('TU')
      expect(fallback).toBeInTheDocument()
      
      // Fallback should use semantic color classes
      const fallbackClass = fallback.className
      expect(fallbackClass).toContain('bg-muted')
      
      // Avatar container should have no hard-coded colors
      const avatar = fallback.closest('[class*="rounded-full"]')
      expect(avatar).toBeInTheDocument()
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(
        <Avatar>
          <AvatarImage src="/test-avatar.jpg" alt="Test User" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>,
        { theme: 'dark' }
      )

      const fallback = screen.getByText('TU')
      expect(fallback).toBeInTheDocument()
      
      // Fallback should use semantic color classes
      const fallbackClass = fallback.className
      expect(fallbackClass).toContain('bg-muted')
      
      // Avatar container should have no hard-coded colors
      const avatar = fallback.closest('[class*="rounded-full"]')
      expect(avatar).toBeInTheDocument()
    })

    it('maintains semantic colors with custom styling', () => {
      renderWithTheme(
        <Avatar className="h-20 w-20 border-4 border-primary">
          <AvatarFallback className="text-2xl font-bold">AB</AvatarFallback>
        </Avatar>,
        { theme: 'dark' }
      )

      const fallback = screen.getByText('AB')
      
      // Fallback should still use semantic bg-muted
      expect(fallback.className).toContain('bg-muted')
      expect(fallback.className).toContain('text-2xl')
      expect(fallback.className).toContain('font-bold')
      
      // Avatar should have custom border with semantic color
      const avatar = fallback.closest('[class*="rounded-full"]')
      expect(avatar?.className).toContain('border-primary')
    })

    it('ensures no hard-coded colors', () => {
      renderWithTheme(
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar className="ring-2 ring-offset-2 ring-offset-background ring-primary">
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="/user.jpg" alt="User" />
            <AvatarFallback className="font-semibold">MK</AvatarFallback>
          </Avatar>
        </div>,
        { theme: 'dark' }
      )

      const fallbacks = screen.getAllByText(/^[A-Z]{2}$/)
      
      fallbacks.forEach(fallback => {
        const classList = fallback.className
        // Should not contain hard-coded color values
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        // Should use semantic color
        expect(classList).toContain('bg-muted')
      })
    })

    it('maintains theme consistency in avatar groups', () => {
      renderWithTheme(
        <div className="flex -space-x-4">
          <Avatar className="border-2 border-background">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>+3</AvatarFallback>
          </Avatar>
        </div>,
        { theme: 'dark' }
      )

      // All avatars should use semantic colors
      const avatars = screen.getAllByText(/^(JD|AS|\+3)$/)
      avatars.forEach(fallback => {
        expect(fallback.className).toContain('bg-muted')
        
        // Border should use semantic color
        const avatar = fallback.closest('[class*="rounded-full"]')
        expect(avatar?.className).toContain('border-background')
      })
    })

    it('works correctly with status indicators', () => {
      renderWithTheme(
        <div className="relative inline-block">
          <Avatar>
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        </div>,
        { theme: 'dark' }
      )

      const fallback = screen.getByText('TU')
      expect(fallback.className).toContain('bg-muted')
      
      // Status indicator should use semantic ring color
      const statusIndicator = fallback.closest('.relative')?.querySelector('.absolute')
      expect(statusIndicator?.className).toContain('ring-background')
    })
  }

  describe('Common Use Cases', () => {
    it('renders user avatar with initials', () => {
      render(
        <Avatar>
          <AvatarImage src="/john-doe.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      // Fallback is shown initially
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('renders avatar group', () => {
      render(
        <div className="flex -space-x-4">
          <Avatar className="border-2 border-background">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>+3</AvatarFallback>
          </Avatar>
        </div>
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
      expect(screen.getByText('AS')).toBeInTheDocument()
      expect(screen.getByText('+3')).toBeInTheDocument()
    })

    it('renders status indicator', () => {
      render(
        <div className="relative">
          <Avatar>
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        </div>
      )

      expect(screen.getByText('TU')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('provides accessible structure', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="Profile picture" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      // Avatar should have proper structure
      expect(container.firstChild).toHaveClass('relative')
      expect(container.firstChild).toHaveClass('rounded-full')
    })

    it('provides accessible text in fallback', () => {
      render(
        <Avatar>
          <AvatarFallback aria-label="John Doe initials">JD</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('JD')).toHaveAttribute('aria-label', 'John Doe initials')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty fallback', () => {
      render(
        <Avatar>
          <AvatarFallback />
        </Avatar>
      )

      // Should render without crashing
      expect(document.querySelector('[class*="rounded-full"]')).toBeInTheDocument()
    })

    it('handles very long fallback text', () => {
      render(
        <Avatar>
          <AvatarFallback>ABCDEF</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('ABCDEF')).toBeInTheDocument()
    })

    it('handles special characters in fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>&lt;&gt;</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('<>')).toBeInTheDocument()
    })
  })
})