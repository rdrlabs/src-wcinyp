import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from './skeleton'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Skeleton', () => {
  describe('Basic Functionality', () => {
    it('renders skeleton element', () => {
      render(<Skeleton />)
      
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('animate-pulse')
    })

    it('renders as div by default', () => {
      render(<Skeleton />)
      
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton.nodeName).toBe('DIV')
    })

    it('renders with children', () => {
      render(
        <Skeleton>
          <span>Loading content...</span>
        </Skeleton>
      )
      
      expect(screen.getByText('Loading content...')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies default styling', () => {
      render(<Skeleton />)
      
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveClass('animate-pulse')
      expect(skeleton).toHaveClass('rounded-md')
      expect(skeleton).toHaveClass('bg-muted')
    })

    it('accepts custom className', () => {
      render(<Skeleton className="h-4 w-[250px]" />)
      
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveClass('h-4')
      expect(skeleton).toHaveClass('w-[250px]')
    })

    it('merges custom className with base styles', () => {
      const { container } = render(
        <Skeleton className="rounded-full" />
      )
      
      const skeleton = container.firstChild
      expect(skeleton).toHaveClass('rounded-full')
      expect(skeleton).toHaveClass('animate-pulse') // Base style retained
      expect(skeleton).toHaveClass('bg-muted') // Base style retained
    })
  })

  describe('Common Use Cases', () => {
    it('renders text skeleton', () => {
      render(
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      )
      
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(3)
    })

    it('renders card skeleton', () => {
      render(
        <div className="rounded-lg border p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )
      
      const circularSkeleton = document.querySelector('.rounded-full')
      expect(circularSkeleton).toBeInTheDocument()
    })

    it('renders image skeleton', () => {
      const { container } = render(
        <Skeleton className="h-[200px] w-full rounded-lg" />
      )
      
      const skeleton = container.firstChild
      expect(skeleton).toHaveClass('h-[200px]')
      expect(skeleton).toHaveClass('w-full')
      expect(skeleton).toHaveClass('rounded-lg')
    })

    it('renders avatar skeleton', () => {
      const { container } = render(
        <Skeleton className="h-10 w-10 rounded-full" />
      )
      
      const skeleton = container.firstChild
      expect(skeleton).toHaveClass('h-10')
      expect(skeleton).toHaveClass('w-10')
      expect(skeleton).toHaveClass('rounded-full')
    })

    it('renders table row skeleton', () => {
      render(
        <table>
          <tbody>
            <tr>
              <td className="p-2">
                <Skeleton className="h-4 w-[100px]" />
              </td>
              <td className="p-2">
                <Skeleton className="h-4 w-[150px]" />
              </td>
              <td className="p-2">
                <Skeleton className="h-4 w-[80px]" />
              </td>
            </tr>
          </tbody>
        </table>
      )
      
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(3)
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <Skeleton className="h-4 w-[200px]" />,
        { theme: 'light' }
      )
      
      const skeleton = container.firstChild
      expect(skeleton).toBeInTheDocument()
      
      // Skeleton should use semantic color class
      const classList = (skeleton as Element).className
      expect(classList).toContain('bg-muted')
      expect(classList).toContain('animate-pulse')
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <Skeleton className="h-4 w-[200px]" />,
        { theme: 'dark' }
      )
      
      const skeleton = container.firstChild
      expect(skeleton).toBeInTheDocument()
      
      // Skeleton should use semantic color class
      const classList = (skeleton as Element).className
      expect(classList).toContain('bg-muted')
      expect(classList).toContain('animate-pulse')
    })

    it('maintains semantic colors in complex layouts', () => {
      const { container } = renderWithTheme(
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>,
        { theme: 'dark' }
      )
      
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(4)
      
      // All skeletons should use semantic bg-muted color
      skeletons.forEach(skeleton => {
        expect(skeleton.className).toContain('bg-muted')
      })
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-[100px] w-full rounded-md" />
        </div>,
        { theme: 'dark' }
      )
      
      const skeletons = container.querySelectorAll('.animate-pulse')
      
      skeletons.forEach(skeleton => {
        const classList = skeleton.className
        // Should not contain hard-coded color values
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        // Should use semantic color
        expect(classList).toContain('bg-muted')
      })
    })

    it('maintains theme consistency when overriding styles', () => {
      const { container } = renderWithTheme(
        <Skeleton className="h-4 w-[200px] rounded-full opacity-50" />,
        { theme: 'dark' }
      )
      
      const skeleton = container.firstChild as Element
      
      // Custom styles should be applied along with semantic colors
      expect(skeleton.className).toContain('bg-muted')
      expect(skeleton.className).toContain('rounded-full')
      expect(skeleton.className).toContain('opacity-50')
      expect(skeleton.className).toContain('animate-pulse')
    })

    it('works correctly as loading placeholder in both themes', () => {
      const { rerender } = renderWithTheme(
        <div className="p-4 bg-background">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </div>,
        { theme: 'light' }
      )
      
      // Check light mode
      let skeletons = document.querySelectorAll('.bg-muted')
      expect(skeletons).toHaveLength(3)
      
      // Switch to dark mode
      rerender(
        <div className="p-4 bg-background">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      )
      
      // Check dark mode
      skeletons = document.querySelectorAll('.bg-muted')
      expect(skeletons).toHaveLength(3)
    })
  })

  describe('Animation', () => {
    it('has pulse animation', () => {
      const { container } = render(<Skeleton />)
      
      expect(container.firstChild).toHaveClass('animate-pulse')
    })

    it('maintains animation with custom styles', () => {
      const { container } = render(
        <Skeleton className="h-20 w-20 rounded-full bg-gray-200" />
      )
      
      expect(container.firstChild).toHaveClass('animate-pulse')
      expect(container.firstChild).toHaveClass('bg-gray-200')
    })
  })

  describe('Layout', () => {
    it('works as inline element', () => {
      render(
        <div>
          Loading <Skeleton className="inline-block h-4 w-[60px]" /> text
        </div>
      )
      
      const skeleton = document.querySelector('.inline-block')
      expect(skeleton).toBeInTheDocument()
    })

    it('works in flex containers', () => {
      render(
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      )
      
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(3)
    })

    it('works in grid layouts', () => {
      render(
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
      )
      
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(3)
    })
  })

  describe('Accessibility', () => {
    it('can have aria-label for screen readers', () => {
      const { container } = render(
        <Skeleton aria-label="Loading content" className="h-4 w-[200px]" />
      )
      
      expect(container.firstChild).toHaveAttribute('aria-label', 'Loading content')
    })

    it('can have role attribute', () => {
      const { container } = render(
        <Skeleton role="status" className="h-4 w-[200px]">
          <span className="sr-only">Loading...</span>
        </Skeleton>
      )
      
      expect(container.firstChild).toHaveAttribute('role', 'status')
      expect(screen.getByText('Loading...')).toHaveClass('sr-only')
    })

    it('works with live regions', () => {
      render(
        <div aria-live="polite" aria-busy="true">
          <Skeleton className="h-4 w-[200px]" />
        </div>
      )
      
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('Edge Cases', () => {
    it('renders without dimensions', () => {
      const { container } = render(<Skeleton />)
      
      expect(container.firstChild).toBeInTheDocument()
      expect(container.firstChild).toHaveClass('animate-pulse')
    })

    it('renders with only width', () => {
      const { container } = render(
        <Skeleton className="w-full" />
      )
      
      expect(container.firstChild).toHaveClass('w-full')
    })

    it('renders with only height', () => {
      const { container } = render(
        <Skeleton className="h-10" />
      )
      
      expect(container.firstChild).toHaveClass('h-10')
    })

    it('handles percentage dimensions', () => {
      const { container } = render(
        <Skeleton className="h-full w-1/2" />
      )
      
      expect(container.firstChild).toHaveClass('h-full')
      expect(container.firstChild).toHaveClass('w-1/2')
    })

    it('can be used multiple times', () => {
      render(
        <>
          <Skeleton key="1" className="h-4" />
          <Skeleton key="2" className="h-4" />
          <Skeleton key="3" className="h-4" />
        </>
      )
      
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(3)
    })
  })

  describe('Performance', () => {
    it('renders many skeletons efficiently', () => {
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full mb-2" />
          ))}
        </div>
      )
      
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(100)
    })
  })
})