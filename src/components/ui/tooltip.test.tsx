import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { Button } from './button'
import { renderWithTheme } from '@/test/theme-test-utils'

// Wrapper component that includes TooltipProvider
const TooltipWrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>{children}</TooltipProvider>
)

describe('Tooltip', () => {
  describe('Basic Functionality', () => {
    it('shows tooltip on hover', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tooltip content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      const trigger = screen.getByRole('button', { name: 'Hover me' })
      expect(trigger).toBeInTheDocument()

      // Tooltip should not be visible initially
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()

      // Hover to show tooltip
      await user.hover(trigger)

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument()
      })
    })

    it('hides tooltip on unhover', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tooltip content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      const trigger = screen.getByRole('button', { name: 'Hover me' })
      
      await user.hover(trigger)
      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument()
      })

      await user.unhover(trigger)
      await waitFor(() => {
        expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument()
      })
    })

    it('shows tooltip on focus', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Focus me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Focused tooltip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      const trigger = screen.getByRole('button', { name: 'Focus me' })
      
      await user.tab()
      expect(document.activeElement).toBe(trigger)

      await waitFor(() => {
        expect(screen.getByText('Focused tooltip')).toBeInTheDocument()
      })
    })

    it('works with delay duration', async () => {
      const user = userEvent.setup()
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Instant tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>No delay</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      const trigger = screen.getByRole('button', { name: 'Instant tooltip' })
      await user.hover(trigger)

      // Should appear immediately with delayDuration={0}
      await waitFor(() => {
        expect(screen.getByText('No delay')).toBeInTheDocument()
      }, { timeout: 100 })
    })
  })

  describe('Positioning', () => {
    it('applies default side offset', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent>
              Default offset tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      expect(screen.getByText('Default offset tooltip')).toBeInTheDocument()
    })

    it('accepts custom side offset', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>
              Custom offset tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      expect(screen.getByText('Custom offset tooltip')).toBeInTheDocument()
    })

    it('supports different sides', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              top tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      expect(screen.getByText('top tooltip')).toBeInTheDocument()
    })

    it('supports alignment options', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent align="start">
              start aligned
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      expect(screen.getByText('start aligned')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies default styling', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent>
              Styled tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      const content = screen.getByText('Styled tooltip')
      expect(content).toHaveClass('z-50')
      expect(content).toHaveClass('rounded-md')
      expect(content).toHaveClass('bg-primary')
      expect(content).toHaveClass('px-3')
      expect(content).toHaveClass('py-1.5')
      expect(content).toHaveClass('text-sm')
      expect(content).toHaveClass('text-primary-foreground')
    })

    it('accepts custom className', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent className="custom-tooltip">
              Custom styled
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      const content = screen.getByText('Custom styled')
      expect(content).toHaveClass('custom-tooltip')
    })

    it('has animation classes', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent>
              Animated tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      const content = screen.getByText('Animated tooltip')
      expect(content).toHaveClass('animate-in')
      expect(content).toHaveClass('fade-in-0')
      expect(content).toHaveClass('zoom-in-95')
    })
  })

  describe('Content Types', () => {
    it('renders text content', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent>
              Simple text tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      expect(screen.getByText('Simple text tooltip')).toBeInTheDocument()
    })

    it('renders HTML content', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent>
              <strong>Bold text</strong> and <em>italic text</em>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      expect(screen.getByText('Bold text')).toBeInTheDocument()
      expect(screen.getByText('italic text')).toBeInTheDocument()
    })

    it('renders multiline content', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <p>Line 1</p>
                <p>Line 2</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      expect(screen.getByText('Line 1')).toBeInTheDocument()
      expect(screen.getByText('Line 2')).toBeInTheDocument()
    })
  })

  describe('Trigger Types', () => {
    it('works with button trigger', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Button trigger</Button>
            </TooltipTrigger>
            <TooltipContent>Button tooltip</TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      await user.hover(screen.getByRole('button', { name: 'Button trigger' }))
      await waitFor(() => {
        expect(screen.getByText('Button tooltip')).toBeInTheDocument()
      })
    })

    it('works with icon trigger', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <button aria-label="Info icon">ℹ</button>
            </TooltipTrigger>
            <TooltipContent>Information tooltip</TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      await user.hover(screen.getByRole('button', { name: 'Info icon' }))
      await waitFor(() => {
        expect(screen.getByText('Information tooltip')).toBeInTheDocument()
      })
    })

    it('works with link trigger', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="/help">Help link</a>
            </TooltipTrigger>
            <TooltipContent>Click for help</TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      await user.hover(screen.getByRole('link', { name: 'Help link' }))
      await waitFor(() => {
        expect(screen.getByText('Click for help')).toBeInTheDocument()
      })
    })

    it('works with disabled elements', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button disabled>Disabled button</Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>This button is disabled</TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      // Note: wrapping in span because disabled buttons can't be tooltip triggers directly
      await user.hover(screen.getByText('Disabled button').parentElement!)
      await waitFor(() => {
        expect(screen.getByText('This button is disabled')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Accessible trigger</Button>
            </TooltipTrigger>
            <TooltipContent>Accessible tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      const trigger = screen.getByRole('button', { name: 'Accessible trigger' })
      expect(trigger).toHaveAttribute('aria-describedby')
    })

    it('is keyboard accessible', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Keyboard trigger</Button>
            </TooltipTrigger>
            <TooltipContent>Keyboard tooltip</TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      await user.tab()
      expect(document.activeElement).toHaveTextContent('Keyboard trigger')

      await waitFor(() => {
        expect(screen.getByText('Keyboard tooltip')).toBeInTheDocument()
      })
    })

    it('supports custom aria-label', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent aria-label="Custom label">
              Content
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      const content = screen.getByText('Content')
      expect(content).toHaveAttribute('aria-label', 'Custom label')
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid hover/unhover', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Rapid hover</Button>
            </TooltipTrigger>
            <TooltipContent>Tooltip</TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      const trigger = screen.getByRole('button', { name: 'Rapid hover' })
      
      // Rapid hover/unhover
      await user.hover(trigger)
      await user.unhover(trigger)
      await user.hover(trigger)
      
      // Tooltip should eventually show
      await waitFor(() => {
        expect(screen.getByText('Tooltip')).toBeInTheDocument()
      })
    })

    it('handles empty content', () => {
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent />
          </Tooltip>
        </TooltipProvider>
      )

      // Should still render even with empty content
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toHaveAttribute('aria-describedby')
    })

    it('handles long content', () => {
      const longContent = 'This is a very long tooltip content that might wrap to multiple lines'
      
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Trigger</Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              {longContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )

      const content = screen.getByText(longContent)
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('max-w-xs')
    })
  })

  describe('Multiple Tooltips', () => {
    it('handles multiple tooltips independently', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>First trigger</Button>
              </TooltipTrigger>
              <TooltipContent>First tooltip</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>Second trigger</Button>
              </TooltipTrigger>
              <TooltipContent>Second tooltip</TooltipContent>
            </Tooltip>
          </div>
        </TooltipWrapper>
      )

      // Hover first trigger
      await user.hover(screen.getByRole('button', { name: 'First trigger' }))
      await waitFor(() => {
        expect(screen.getByText('First tooltip')).toBeInTheDocument()
        expect(screen.queryByText('Second tooltip')).not.toBeInTheDocument()
      })

      // Move to second trigger
      await user.unhover(screen.getByRole('button', { name: 'First trigger' }))
      await user.hover(screen.getByRole('button', { name: 'Second trigger' }))
      
      await waitFor(() => {
        expect(screen.queryByText('First tooltip')).not.toBeInTheDocument()
        expect(screen.getByText('Second tooltip')).toBeInTheDocument()
      })
    })
  })

  describe('Integration', () => {
    it('works in forms', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <form>
            <label>
              Username
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" aria-label="Username help">?</button>
                </TooltipTrigger>
                <TooltipContent>
                  Your username must be unique
                </TooltipContent>
              </Tooltip>
            </label>
            <input type="text" name="username" />
          </form>
        </TooltipWrapper>
      )

      await user.hover(screen.getByRole('button', { name: 'Username help' }))
      await waitFor(() => {
        expect(screen.getByText('Your username must be unique')).toBeInTheDocument()
      })
    })

    it('works with icon buttons', async () => {
      const user = userEvent.setup()
      render(
        <TooltipWrapper>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" aria-label="Edit">✏️</Button>
            </TooltipTrigger>
            <TooltipContent>Edit action</TooltipContent>
          </Tooltip>
        </TooltipWrapper>
      )

      await user.hover(screen.getByRole('button', { name: 'Edit' }))
      await waitFor(() => {
        expect(screen.getByText('Edit action')).toBeInTheDocument()
      })
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover for tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              Light mode tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
        { theme: 'light' }
      )
      
      await user.hover(screen.getByRole('button', { name: 'Hover for tooltip' }))
      
      await waitFor(() => {
        const content = screen.getByText('Light mode tooltip')
        const tooltip = content.closest('[role="tooltip"]')
        expect(tooltip).toBeInTheDocument()
        
        // Tooltip should use semantic color classes
        const classList = tooltip?.className || ''
        expect(classList).toContain('bg-popover')
        expect(classList).toContain('text-popover-foreground')
        expect(classList).toContain('border')
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover for tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              Dark mode tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
        { theme: 'dark' }
      )
      
      await user.hover(screen.getByRole('button', { name: 'Hover for tooltip' }))
      
      await waitFor(() => {
        const content = screen.getByText('Dark mode tooltip')
        const tooltip = content.closest('[role="tooltip"]')
        expect(tooltip).toBeInTheDocument()
        
        // Tooltip should use semantic color classes
        const classList = tooltip?.className || ''
        expect(classList).toContain('bg-popover')
        expect(classList).toContain('text-popover-foreground')
        expect(classList).toContain('border')
      })
    })

    it('maintains semantic colors for different sides', async () => {
      const user = userEvent.setup()
      const sides = ['top', 'right', 'bottom', 'left'] as const
      
      for (const side of sides) {
        const { unmount } = renderWithTheme(
          <TooltipProvider delayDuration={0}>
            <Tooltip defaultOpen>
              <TooltipTrigger asChild>
                <Button>Trigger</Button>
              </TooltipTrigger>
              <TooltipContent side={side}>
                {side} side tooltip
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>,
          { theme: 'dark' }
        )
        
        const content = screen.getByText(`${side} side tooltip`)
        const tooltip = content.closest('[role="tooltip"]')
        const classList = tooltip?.className || ''
        
        // All sides should use semantic colors
        expect(classList).toContain('bg-popover')
        expect(classList).toContain('text-popover-foreground')
        
        unmount()
      }
    })

    it('maintains semantic colors with custom content', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover me</Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold">Tooltip Title</p>
                <p className="text-sm text-muted-foreground">
                  This is a more detailed tooltip with semantic colors
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
        { theme: 'dark' }
      )
      
      await user.hover(screen.getByRole('button', { name: 'Hover me' }))
      
      await waitFor(() => {
        // Check that custom content maintains semantic colors
        const title = screen.getByText('Tooltip Title')
        expect(title.className).toContain('font-semibold')
        
        const description = screen.getByText('This is a more detailed tooltip with semantic colors')
        expect(description.className).toContain('text-muted-foreground')
        
        // Ensure no hard-coded colors
        const tooltip = title.closest('[role="tooltip"]')
        const classList = tooltip?.className || ''
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
    })

    it('maintains theme consistency across multiple tooltips', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <TooltipProvider delayDuration={0}>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default">Default</Button>
              </TooltipTrigger>
              <TooltipContent>Default button tooltip</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Outline</Button>
              </TooltipTrigger>
              <TooltipContent>Outline button tooltip</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">Ghost</Button>
              </TooltipTrigger>
              <TooltipContent>Ghost button tooltip</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>,
        { theme: 'dark' }
      )
      
      // Test each tooltip maintains semantic colors
      const buttons = ['Default', 'Outline', 'Ghost']
      
      for (const buttonText of buttons) {
        await user.hover(screen.getByRole('button', { name: buttonText }))
        
        await waitFor(() => {
          const content = screen.getByText(`${buttonText} button tooltip`)
          const tooltip = content.closest('[role="tooltip"]')
          const classList = tooltip?.className || ''
          
          expect(classList).toContain('bg-popover')
          expect(classList).toContain('text-popover-foreground')
        })
        
        await user.unhover(screen.getByRole('button', { name: buttonText }))
        
        // Wait for tooltip to disappear before testing next one
        await waitFor(() => {
          expect(screen.queryByText(`${buttonText} button tooltip`)).not.toBeInTheDocument()
        })
      }
    })
  })
})