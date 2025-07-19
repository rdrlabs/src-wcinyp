import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Collapsible', () => {
  describe('Basic Functionality', () => {
    it('renders collapsible with trigger and content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Collapsible content</div>
          </CollapsibleContent>
        </Collapsible>
      )

      expect(screen.getByText('Toggle')).toBeInTheDocument()
      // Content should be hidden by default
      expect(screen.queryByText('Collapsible content')).not.toBeInTheDocument()
    })

    it('toggles content visibility on trigger click', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Hidden content</div>
          </CollapsibleContent>
        </Collapsible>
      )

      const trigger = screen.getByText('Toggle')
      
      // Initially hidden
      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()

      // Click to open
      await user.click(trigger)
      await waitFor(() => {
        expect(screen.getByText('Hidden content')).toBeInTheDocument()
      })

      // Click to close
      await user.click(trigger)
      await waitFor(() => {
        expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
      })
    })

    it('starts open when defaultOpen is true', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Initially visible</div>
          </CollapsibleContent>
        </Collapsible>
      )

      expect(screen.getByText('Initially visible')).toBeInTheDocument()
    })
  })

  describe('Controlled Mode', () => {
    it('can be controlled with open prop', () => {
      const { rerender } = render(
        <Collapsible open={false}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      )

      expect(screen.queryByText('Content')).not.toBeInTheDocument()

      rerender(
        <Collapsible open={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('calls onOpenChange when toggled', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>Content</div>
          </CollapsibleContent>
        </Collapsible>
      )

      await user.click(screen.getByText('Toggle'))
      expect(handleOpenChange).toHaveBeenCalledWith(true)

      await user.click(screen.getByText('Toggle'))
      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('CollapsibleTrigger', () => {
    it('renders as button by default', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Click me</CollapsibleTrigger>
        </Collapsible>
      )

      const trigger = screen.getByRole('button', { name: 'Click me' })
      expect(trigger).toBeInTheDocument()
    })

    it('can use asChild to render custom element', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger asChild>
            <div role="button" tabIndex={0}>Custom trigger</div>
          </CollapsibleTrigger>
        </Collapsible>
      )

      const trigger = screen.getByRole('button', { name: 'Custom trigger' })
      expect(trigger.tagName).toBe('DIV')
    })

    it('has correct aria attributes', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await user.click(trigger)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('can be disabled', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger>Disabled trigger</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toBeDisabled()
    })
  })

  describe('CollapsibleContent', () => {
    it('renders children when open', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Open</CollapsibleTrigger>
          <CollapsibleContent>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </CollapsibleContent>
        </Collapsible>
      )

      await user.click(screen.getByText('Open'))

      await waitFor(() => {
        expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
        expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
      })
    })

    it('applies animation classes', async () => {
      const user = userEvent.setup()
      
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent className="custom-content">
            Content
          </CollapsibleContent>
        </Collapsible>
      )

      await user.click(screen.getByText('Toggle'))

      await waitFor(() => {
        const content = container.querySelector('.custom-content')
        expect(content).toBeInTheDocument()
      })
    })

    it('supports forceMount prop', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent forceMount>
            <div data-state="closed">Always in DOM</div>
          </CollapsibleContent>
        </Collapsible>
      )

      // Content should be in DOM even when closed
      const content = document.querySelector('[data-state="closed"]')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(
        <div className="space-y-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-2 font-medium hover:bg-muted/80">
              <span>Light mode collapsible</span>
              <span className="text-muted-foreground">▼</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-2">
              <p className="text-muted-foreground">This is the collapsible content in light mode.</p>
            </CollapsibleContent>
          </Collapsible>
        </div>,
        { theme: 'light' }
      )

      const trigger = screen.getByText('Light mode collapsible')
      expect(trigger).toBeInTheDocument()
      
      // Trigger should use semantic colors
      const triggerContainer = trigger.closest('button')
      expect(triggerContainer?.className).toContain('bg-muted')
      expect(triggerContainer?.className).toContain('hover:bg-muted/80')
      
      // Content should be visible and use semantic colors
      const content = screen.getByText('This is the collapsible content in light mode.')
      expect(content.className).toContain('text-muted-foreground')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(
        <div className="space-y-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-2 font-medium hover:bg-muted/80">
              <span>Dark mode collapsible</span>
              <span className="text-muted-foreground">▼</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-2">
              <p className="text-muted-foreground">This is the collapsible content in dark mode.</p>
            </CollapsibleContent>
          </Collapsible>
        </div>,
        { theme: 'dark' }
      )

      const trigger = screen.getByText('Dark mode collapsible')
      expect(trigger).toBeInTheDocument()
      
      // Trigger should use semantic colors
      const triggerContainer = trigger.closest('button')
      expect(triggerContainer?.className).toContain('bg-muted')
      expect(triggerContainer?.className).toContain('hover:bg-muted/80')
      
      // Content should be visible and use semantic colors
      const content = screen.getByText('This is the collapsible content in dark mode.')
      expect(content.className).toContain('text-muted-foreground')
    })

    it('maintains semantic colors for different trigger styles', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <div className="space-y-4">
          {/* Default style */}
          <Collapsible>
            <CollapsibleTrigger className="text-sm font-medium underline underline-offset-4">
              Show more details
            </CollapsibleTrigger>
            <CollapsibleContent className="text-sm text-muted-foreground">
              Additional details here
            </CollapsibleContent>
          </Collapsible>
          
          {/* Card style */}
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border bg-card p-4 text-left hover:bg-accent">
              <span className="font-semibold">Expandable Card</span>
              <span className="text-muted-foreground">+</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-x border-b rounded-b-lg bg-card p-4">
              <p>Card content with semantic colors</p>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Minimal style */}
          <Collapsible>
            <CollapsibleTrigger className="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <span className="transition-transform group-data-[state=open]:rotate-90">›</span>
              <span>Toggle section</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 pt-2">
              <p className="text-sm">Section content</p>
            </CollapsibleContent>
          </Collapsible>
        </div>,
        { theme: 'dark' }
      )

      // All triggers should be present
      expect(screen.getByText('Show more details')).toBeInTheDocument()
      expect(screen.getByText('Expandable Card')).toBeInTheDocument()
      expect(screen.getByText('Toggle section')).toBeInTheDocument()
      
      // Card style should use semantic colors
      const cardTrigger = screen.getByText('Expandable Card').closest('button')
      expect(cardTrigger?.className).toContain('bg-card')
      expect(cardTrigger?.className).toContain('hover:bg-accent')
      
      // Minimal style should use semantic text colors
      const minimalTrigger = screen.getByText('Toggle section').closest('button')
      expect(minimalTrigger?.className).toContain('text-muted-foreground')
      expect(minimalTrigger?.className).toContain('hover:text-foreground')
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <div className="space-y-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-secondary px-4 py-2 font-medium transition-colors hover:bg-secondary/80">
              <span>FAQ Question</span>
              <span className="text-xs text-muted-foreground">▼</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-2 pb-4">
              <p className="leading-relaxed text-muted-foreground">
                This is the answer to the frequently asked question.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>,
        { theme: 'dark' }
      )

      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string') {
          // Should not contain hard-coded color values
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        }
      })
    })

    it('maintains theme consistency when toggling', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithTheme(
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 rounded bg-accent px-3 py-1.5 text-sm font-medium">
            <span>Click to expand</span>
            <span className="text-muted-foreground">→</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded border bg-muted/50 p-3">
            <p className="text-sm">Hidden content revealed!</p>
          </CollapsibleContent>
        </Collapsible>,
        { theme: 'light' }
      )

      // Toggle open in light mode
      await user.click(screen.getByText('Click to expand'))
      
      // Check content appears with semantic colors
      await waitFor(() => {
        const content = screen.getByText('Hidden content revealed!')
        const contentContainer = content.closest('[data-state]')
        expect(contentContainer?.className).toContain('bg-muted/50')
      })

      // Switch to dark mode while open
      rerender(
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2 rounded bg-accent px-3 py-1.5 text-sm font-medium">
            <span>Click to expand</span>
            <span className="text-muted-foreground">→</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded border bg-muted/50 p-3">
            <p className="text-sm">Hidden content revealed!</p>
          </CollapsibleContent>
        </Collapsible>
      )

      // Content should still be visible with semantic colors in dark mode
      const darkContent = screen.getByText('Hidden content revealed!')
      const darkContentContainer = darkContent.closest('[data-state]')
      expect(darkContentContainer?.className).toContain('bg-muted/50')
    })

    it('works with disabled state in both themes', () => {
      renderWithTheme(
        <div className="space-y-4">
          <Collapsible disabled>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-2 font-medium opacity-50 cursor-not-allowed">
              <span>Disabled collapsible</span>
              <span className="text-muted-foreground">▼</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p>This content cannot be accessed</p>
            </CollapsibleContent>
          </Collapsible>
        </div>,
        { theme: 'dark' }
      )

      const trigger = screen.getByRole('button', { name: /Disabled collapsible/ })
      expect(trigger).toBeDisabled()
      
      // Disabled state should still use semantic colors with opacity
      expect(trigger.className).toContain('bg-muted')
      expect(trigger.className).toContain('opacity-50')
    })
  })

  describe('Common Use Cases', () => {
    it('works as FAQ accordion item', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Collapsible>
            <CollapsibleTrigger className="text-left w-full">
              What is your return policy?
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <p>We offer a 30-day return policy on all items.</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )

      await user.click(screen.getByText('What is your return policy?'))
      
      await waitFor(() => {
        expect(screen.getByText(/30-day return policy/)).toBeInTheDocument()
      })
    })

    it('works with custom chevron icon', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2">
            <span>Show more</span>
            <span className="chevron">›</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            Additional content
          </CollapsibleContent>
        </Collapsible>
      )

      const chevron = screen.getByText('›')
      expect(chevron).toBeInTheDocument()

      await user.click(screen.getByText('Show more'))
      await waitFor(() => {
        expect(screen.getByText('Additional content')).toBeInTheDocument()
      })
    })

    it('works for expandable card', async () => {
      const user = userEvent.setup()
      
      render(
        <div className="card">
          <div className="card-header">
            <h3>Card Title</h3>
            <Collapsible>
              <CollapsibleTrigger>View details</CollapsibleTrigger>
              <CollapsibleContent>
                <div className="card-details">
                  <p>Detail 1</p>
                  <p>Detail 2</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )

      await user.click(screen.getByText('View details'))
      
      await waitFor(() => {
        expect(screen.getByText('Detail 1')).toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('can be triggered with Enter key', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Press Enter</CollapsibleTrigger>
          <CollapsibleContent>Keyboard content</CollapsibleContent>
        </Collapsible>
      )

      const trigger = screen.getByRole('button')
      trigger.focus()
      
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByText('Keyboard content')).toBeInTheDocument()
      })
    })

    it('can be triggered with Space key', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Press Space</CollapsibleTrigger>
          <CollapsibleContent>Space content</CollapsibleContent>
        </Collapsible>
      )

      const trigger = screen.getByRole('button')
      trigger.focus()
      
      await user.keyboard(' ')
      
      await waitFor(() => {
        expect(screen.getByText('Space content')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Accessible trigger</CollapsibleTrigger>
          <CollapsibleContent>Accessible content</CollapsibleContent>
        </Collapsible>
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-controls')
    })

    it('maintains focus on trigger after toggle', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Focus test</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )

      const trigger = screen.getByRole('button')
      await user.click(trigger)
      
      expect(document.activeElement).toBe(trigger)
    })

    it('supports custom aria-label', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger aria-label="Expand section">
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', 'Expand section')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty content', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Empty</CollapsibleTrigger>
          <CollapsibleContent />
        </Collapsible>
      )

      await user.click(screen.getByText('Empty'))
      // Should not throw
    })

    it('handles multiple triggers', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Trigger 1</CollapsibleTrigger>
          <CollapsibleTrigger>Trigger 2</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      )

      expect(screen.getByRole('button', { name: 'Trigger 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Trigger 2' })).toBeInTheDocument()
    })

    it('handles nested collapsibles', async () => {
      const user = userEvent.setup()
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Outer</CollapsibleTrigger>
          <CollapsibleContent>
            <Collapsible>
              <CollapsibleTrigger>Inner</CollapsibleTrigger>
              <CollapsibleContent>Nested content</CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      )

      await user.click(screen.getByText('Outer'))
      await user.click(screen.getByText('Inner'))
      
      await waitFor(() => {
        expect(screen.getByText('Nested content')).toBeInTheDocument()
      })
    })
  })
})