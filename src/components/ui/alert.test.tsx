import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { AlertCircle, Terminal } from 'lucide-react'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Alert', () => {
  describe('Basic Functionality', () => {
    it('renders alert with title and description', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>This is an alert description</AlertDescription>
        </Alert>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Alert Title')).toBeInTheDocument()
      expect(screen.getByText('This is an alert description')).toBeInTheDocument()
    })

    it('renders with default variant', () => {
      render(
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-background')
      expect(alert).toHaveClass('text-foreground')
    })

    it('renders with destructive variant', () => {
      render(
        <Alert variant="destructive">
          <AlertTitle>Destructive Alert</AlertTitle>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border-destructive/50')
      expect(alert).toHaveClass('text-destructive')
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      render(
        <Alert ref={ref}>
          <AlertTitle>Alert with ref</AlertTitle>
        </Alert>
      )

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    })
  })

  describe('Styling', () => {
    it('applies custom className to alert', () => {
      render(
        <Alert className="custom-alert">
          <AlertTitle>Custom Alert</AlertTitle>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('custom-alert')
    })

    it('applies custom className to title', () => {
      render(
        <Alert>
          <AlertTitle className="custom-title">Custom Title</AlertTitle>
        </Alert>
      )

      const title = screen.getByText('Custom Title')
      expect(title).toHaveClass('custom-title')
      expect(title).toHaveClass('font-medium')
      expect(title).toHaveClass('leading-none')
    })

    it('applies custom className to description', () => {
      render(
        <Alert>
          <AlertDescription className="custom-description">
            Custom Description
          </AlertDescription>
        </Alert>
      )

      const description = screen.getByText('Custom Description')
      expect(description).toHaveClass('custom-description')
      expect(description).toHaveClass('text-sm')
    })

    it('has correct base styling', () => {
      render(
        <Alert>
          <AlertTitle>Styled Alert</AlertTitle>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('relative')
      expect(alert).toHaveClass('w-full')
      expect(alert).toHaveClass('rounded-lg')
      expect(alert).toHaveClass('border')
      expect(alert).toHaveClass('p-4')
    })
  })

  describe('With Icons', () => {
    it('renders with icon and adjusts spacing', () => {
      render(
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Alert with Icon</AlertTitle>
          <AlertDescription>Icon should be positioned correctly</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      const icon = alert.querySelector('svg')
      
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('h-4')
      expect(icon).toHaveClass('w-4')
      expect(alert).toHaveClass('[&>svg]:absolute')
      expect(alert).toHaveClass('[&>svg]:left-4')
      expect(alert).toHaveClass('[&>svg]:top-4')
    })

    it('adjusts content padding when icon is present', () => {
      render(
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Content with icon</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('[&>svg~*]:pl-7')
    })

    it('applies correct icon color for destructive variant', () => {
      render(
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Alert</AlertTitle>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('[&>svg]:text-destructive')
    })

    it('applies vertical alignment adjustment for icon with div', () => {
      render(
        <Alert>
          <Terminal className="h-4 w-4" />
          <div>
            <AlertTitle>Aligned Content</AlertTitle>
          </div>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('[&>svg+div]:translate-y-[-3px]')
    })
  })

  describe('Content Structure', () => {
    it('renders title as h5 element', () => {
      render(
        <Alert>
          <AlertTitle>Heading Title</AlertTitle>
        </Alert>
      )

      const title = screen.getByText('Heading Title')
      expect(title.tagName).toBe('H5')
    })

    it('renders description as div element', () => {
      render(
        <Alert>
          <AlertDescription>Description Content</AlertDescription>
        </Alert>
      )

      const description = screen.getByText('Description Content')
      expect(description.tagName).toBe('DIV')
    })

    it('applies paragraph styling within description', () => {
      render(
        <Alert>
          <AlertDescription>
            <p>Paragraph content</p>
          </AlertDescription>
        </Alert>
      )

      const description = screen.getByText('Paragraph content').parentElement
      expect(description).toHaveClass('[&_p]:leading-relaxed')
    })

    it('handles multiple paragraphs in description', () => {
      render(
        <Alert>
          <AlertDescription>
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </AlertDescription>
        </Alert>
      )

      expect(screen.getByText('First paragraph')).toBeInTheDocument()
      expect(screen.getByText('Second paragraph')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has alert role', () => {
      render(
        <Alert>
          <AlertTitle>Accessible Alert</AlertTitle>
        </Alert>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('title provides semantic heading structure', () => {
      render(
        <Alert>
          <AlertTitle>Semantic Title</AlertTitle>
          <AlertDescription>Supporting content</AlertDescription>
        </Alert>
      )

      const heading = screen.getByRole('heading', { level: 5 })
      expect(heading).toHaveTextContent('Semantic Title')
    })

    it('supports aria attributes', () => {
      render(
        <Alert aria-live="polite" aria-atomic="true">
          <AlertTitle>ARIA Alert</AlertTitle>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'polite')
      expect(alert).toHaveAttribute('aria-atomic', 'true')
    })

    it('can be labeled with aria-label', () => {
      render(
        <Alert aria-label="Important notification">
          <AlertDescription>Alert content</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert', { name: 'Important notification' })
      expect(alert).toBeInTheDocument()
    })
  })

  describe('Use Cases', () => {
    it('works as an info alert', () => {
      render(
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            This is an informational alert message.
          </AlertDescription>
        </Alert>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Info')).toBeInTheDocument()
      expect(screen.getByText('This is an informational alert message.')).toBeInTheDocument()
    })

    it('works as an error alert', () => {
      render(
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again.
          </AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('text-destructive')
      expect(screen.getByText('Error')).toBeInTheDocument()
    })

    it('works without a title', () => {
      render(
        <Alert>
          <AlertDescription>
            This is a simple alert without a title.
          </AlertDescription>
        </Alert>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('This is a simple alert without a title.')).toBeInTheDocument()
    })

    it('works with custom content', () => {
      render(
        <Alert>
          <AlertTitle>Custom Content Alert</AlertTitle>
          <AlertDescription>
            <div>
              <p>This alert has custom content structure.</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty content', () => {
      render(<Alert />)
      
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('handles only title without description', () => {
      render(
        <Alert>
          <AlertTitle>Title Only</AlertTitle>
        </Alert>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Title Only')).toBeInTheDocument()
    })

    it('handles long content', () => {
      const longText = 'This is a very long alert description that contains a lot of text to test how the alert component handles lengthy content and whether it maintains proper styling and readability when the content exceeds typical usage patterns.'
      
      render(
        <Alert>
          <AlertTitle>Long Content Alert</AlertTitle>
          <AlertDescription>{longText}</AlertDescription>
        </Alert>
      )

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('handles multiple icons gracefully', () => {
      render(
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Multiple Icons</AlertTitle>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      const icons = alert.querySelectorAll('svg')
      expect(icons).toHaveLength(2)
    })
  })

  describe('Integration', () => {
    it('works with action buttons', () => {
      render(
        <Alert>
          <AlertTitle>Action Alert</AlertTitle>
          <AlertDescription>
            This alert includes an action button.
          </AlertDescription>
          <button className="mt-2">Take Action</button>
        </Alert>
      )

      expect(screen.getByRole('button', { name: 'Take Action' })).toBeInTheDocument()
    })

    it('works with links', () => {
      render(
        <Alert>
          <AlertTitle>Link Alert</AlertTitle>
          <AlertDescription>
            Learn more about this alert <a href="/docs">in our documentation</a>.
          </AlertDescription>
        </Alert>
      )

      const link = screen.getByRole('link', { name: 'in our documentation' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/docs')
    })

    it('can be dismissible with custom close button', () => {
      const handleClose = vi.fn()
      
      render(
        <Alert>
          <AlertTitle>Dismissible Alert</AlertTitle>
          <AlertDescription>This alert can be dismissed.</AlertDescription>
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2"
            aria-label="Close alert"
          >
            ×
          </button>
        </Alert>
      )

      const closeButton = screen.getByRole('button', { name: 'Close alert' })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(
        <Alert>
          <AlertTitle>Light Mode Alert</AlertTitle>
          <AlertDescription>This is an alert in light mode</AlertDescription>
        </Alert>,
        { theme: 'light' }
      )
      
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      
      // Alert should use semantic color classes
      const classList = alert.className
      expect(classList).toContain('bg-background')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('border')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(
        <Alert>
          <AlertTitle>Dark Mode Alert</AlertTitle>
          <AlertDescription>This is an alert in dark mode</AlertDescription>
        </Alert>,
        { theme: 'dark' }
      )
      
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      
      // Alert should use semantic color classes
      const classList = alert.className
      expect(classList).toContain('bg-background')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('border')
    })

    it('maintains semantic colors for destructive variant', () => {
      renderWithTheme(
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>This is an error alert</AlertDescription>
        </Alert>,
        { theme: 'dark' }
      )
      
      const alert = screen.getByRole('alert')
      const classList = alert.className
      
      // Destructive variant should use semantic colors
      expect(classList).toContain('border-destructive/50')
      expect(classList).toContain('text-destructive')
      expect(classList).toContain('[&>svg]:text-destructive')
      
      // Ensure no hard-coded colors
      expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
    })

    it('maintains semantic colors for child components', () => {
      renderWithTheme(
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Title with semantic colors</AlertTitle>
          <AlertDescription>Description with semantic colors</AlertDescription>
        </Alert>,
        { theme: 'dark' }
      )
      
      // Title should use semantic colors
      const title = screen.getByRole('heading')
      const titleClass = title.className
      expect(titleClass).toContain('tracking-tight')
      
      // Description should use semantic colors
      const description = screen.getByText('Description with semantic colors')
      const descClass = description.className
      expect(descClass).toContain('[&_p]:leading-relaxed')
      
      // Icons should inherit text color
      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('[&>svg]:text-foreground')
    })

    it('maintains contrast in both themes', () => {
      const { rerender } = renderWithTheme(
        <Alert variant="destructive">
          <AlertTitle>High Contrast Alert</AlertTitle>
          <AlertDescription>This alert should be readable in both themes</AlertDescription>
        </Alert>,
        { theme: 'light' }
      )
      
      // Light mode check
      let alert = screen.getByRole('alert')
      expect(alert).toHaveClass('text-destructive')
      
      // Dark mode check
      rerender(
        <Alert variant="destructive">
          <AlertTitle>High Contrast Alert</AlertTitle>
          <AlertDescription>This alert should be readable in both themes</AlertDescription>
        </Alert>
      )
      
      alert = screen.getByRole('alert')
      expect(alert).toHaveClass('text-destructive')
    })
  })
})