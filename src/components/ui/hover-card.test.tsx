import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('HoverCard', () => {
  describe('Basic Functionality', () => {
    it('renders trigger element', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Card content</HoverCardContent>
        </HoverCard>
      )

      expect(screen.getByText('Hover me')).toBeInTheDocument()
    })

    it('shows content on hover', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Hover trigger</HoverCardTrigger>
          <HoverCardContent>
            <div>Hover content appears</div>
          </HoverCardContent>
        </HoverCard>
      )

      const trigger = screen.getByText('Hover trigger')
      
      // Content should not be visible initially
      expect(screen.queryByText('Hover content appears')).not.toBeInTheDocument()

      // Hover over trigger
      await user.hover(trigger)

      // Content should appear
      await waitFor(() => {
        expect(screen.getByText('Hover content appears')).toBeInTheDocument()
      })
    })

    it('hides content on mouse leave', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Hover trigger</HoverCardTrigger>
          <HoverCardContent>Temporary content</HoverCardContent>
        </HoverCard>
      )

      const trigger = screen.getByText('Hover trigger')
      
      // Show content
      await user.hover(trigger)
      await waitFor(() => {
        expect(screen.getByText('Temporary content')).toBeInTheDocument()
      })

      // Hide content
      await user.unhover(trigger)
      await waitFor(() => {
        expect(screen.queryByText('Temporary content')).not.toBeInTheDocument()
      })
    })
  })

  describe('HoverCardTrigger', () => {
    it('can use custom element with asChild', () => {
      render(
        <HoverCard>
          <HoverCardTrigger asChild>
            <button>Custom button trigger</button>
          </HoverCardTrigger>
          <HoverCardContent>Content</HoverCardContent>
        </HoverCard>
      )

      const button = screen.getByRole('button', { name: 'Custom button trigger' })
      expect(button).toBeInTheDocument()
    })

    it('adds data-slot attribute', () => {
      const { container } = render(
        <HoverCard>
          <HoverCardTrigger>Trigger</HoverCardTrigger>
          <HoverCardContent>Content</HoverCardContent>
        </HoverCard>
      )

      const trigger = container.querySelector('[data-slot="hover-card-trigger"]')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('HoverCardContent', () => {
    it('renders in portal', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Show card</HoverCardTrigger>
          <HoverCardContent>Portal content</HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Show card'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toBeInTheDocument()
        expect(content).toHaveTextContent('Portal content')
      })
    })

    it('applies default styling', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Hover</HoverCardTrigger>
          <HoverCardContent>Styled content</HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Hover'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toHaveClass('bg-popover')
        expect(content).toHaveClass('text-popover-foreground')
        expect(content).toHaveClass('rounded-md')
        expect(content).toHaveClass('border')
        expect(content).toHaveClass('shadow-lg')
        expect(content).toHaveClass('p-4')
      })
    })

    it('accepts custom className', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Hover</HoverCardTrigger>
          <HoverCardContent className="custom-hover-card">
            Content
          </HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Hover'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toHaveClass('custom-hover-card')
      })
    })

    it('uses default alignment and offset', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Hover</HoverCardTrigger>
          <HoverCardContent>Content</HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Hover'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toBeInTheDocument()
      })
    })

    it('accepts custom alignment', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Hover</HoverCardTrigger>
          <HoverCardContent align="start" sideOffset={8}>
            Aligned content
          </HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Hover'))

      await waitFor(() => {
        expect(screen.getByText('Aligned content')).toBeInTheDocument()
      })
    })
  })

  describe('Animation', () => {
    it('has animation classes', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Animate</HoverCardTrigger>
          <HoverCardContent>Animated content</HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Animate'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toHaveClass('data-[state=open]:animate-in')
        expect(content).toHaveClass('data-[state=closed]:animate-out')
        expect(content).toHaveClass('data-[state=open]:fade-in-0')
        expect(content).toHaveClass('data-[state=closed]:fade-out-0')
      })
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <div className="p-8">
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="text-sm font-medium underline-offset-4 hover:underline">
                Hover for details
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@nextjs</h4>
                  <p className="text-sm text-muted-foreground">
                    The React Framework – created and maintained by @vercel.
                  </p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Joined December 2021
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>,
        { theme: 'light' }
      )

      await user.hover(screen.getByText('Hover for details'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toBeInTheDocument()
        
        // Check semantic colors
        expect(content).toHaveClass('bg-popover')
        expect(content).toHaveClass('text-popover-foreground')
        expect(content).toHaveClass('border')
        
        // Check muted text uses semantic colors
        const mutedText = screen.getByText(/The React Framework/)
        expect(mutedText.className).toContain('text-muted-foreground')
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <div className="p-8">
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="text-sm font-medium underline-offset-4 hover:underline">
                Hover for details
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@nextjs</h4>
                  <p className="text-sm text-muted-foreground">
                    The React Framework – created and maintained by @vercel.
                  </p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Joined December 2021
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>,
        { theme: 'dark' }
      )

      await user.hover(screen.getByText('Hover for details'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toBeInTheDocument()
        
        // Check semantic colors maintained in dark mode
        expect(content).toHaveClass('bg-popover')
        expect(content).toHaveClass('text-popover-foreground')
        expect(content).toHaveClass('border')
        
        // Check muted text maintains semantic colors
        const mutedText = screen.getByText(/The React Framework/)
        expect(mutedText.className).toContain('text-muted-foreground')
      })
    })

    it('maintains semantic colors for different hover card types', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <div className="flex gap-8 p-8">
          {/* User profile hover card */}
          <HoverCard>
            <HoverCardTrigger className="text-blue-500 underline cursor-pointer">
              @johndoe
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Software Developer</p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">142</strong> followers
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">67</strong> following
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* Link preview hover card */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <a href="#" className="font-medium underline underline-offset-4">
                Documentation
              </a>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-semibold">Getting Started Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to build your first application with our comprehensive guide.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>5 min read</span>
                  <span>•</span>
                  <span>Updated 2 days ago</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* Info tooltip hover card */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex h-5 w-5 items-center justify-center rounded-full border bg-background text-xs">
                ?
              </button>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="w-64">
              <p className="text-sm">
                This feature requires a premium subscription. 
                <span className="text-muted-foreground"> Learn more about our pricing plans.</span>
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>,
        { theme: 'dark' }
      )

      // Test user profile hover card
      await user.hover(screen.getByText('@johndoe'))
      await waitFor(() => {
        const profileContent = screen.getByText('Software Developer')
        expect(profileContent).toBeInTheDocument()
        expect(profileContent.className).toContain('text-muted-foreground')
        
        // Avatar placeholder uses semantic colors
        const avatar = profileContent.closest('[data-slot="hover-card-content"]')?.querySelector('.bg-muted')
        expect(avatar).toBeInTheDocument()
      })

      // Test link preview hover card
      await user.hover(screen.getByText('Documentation'))
      await waitFor(() => {
        const previewContent = screen.getByText(/comprehensive guide/)
        expect(previewContent).toBeInTheDocument()
        expect(previewContent.className).toContain('text-muted-foreground')
      })

      // Test info tooltip hover card
      await user.hover(screen.getByRole('button', { name: '?' }))
      await waitFor(() => {
        const infoContent = screen.getByText(/premium subscription/)
        expect(infoContent).toBeInTheDocument()
        
        // Check nested muted text
        const learnMore = screen.getByText(/Learn more about our pricing plans/)
        expect(learnMore.className).toContain('text-muted-foreground')
      })
    })

    it('ensures no hard-coded colors', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <div className="space-y-4">
          <HoverCard>
            <HoverCardTrigger className="inline-flex items-center gap-1">
              <span>View details</span>
              <svg className="h-4 w-4" />
            </HoverCardTrigger>
            <HoverCardContent align="start">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the dimensions for the layer.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-sm">Width</label>
                    <input className="col-span-2 h-8 rounded-md border bg-background px-3" />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-sm">Height</label>
                    <input className="col-span-2 h-8 rounded-md border bg-background px-3" />
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>,
        { theme: 'dark' }
      )

      await user.hover(screen.getByText('View details'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toBeInTheDocument()
        
        // Check all elements for hard-coded colors
        const allElements = content?.querySelectorAll('*') || []
        allElements.forEach(element => {
          const classList = element.className
          if (typeof classList === 'string') {
            // Should not contain hard-coded color values
            expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
            expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
          }
        })
        
        // Inputs should use semantic colors
        const inputs = content?.querySelectorAll('input')
        inputs?.forEach(input => {
          expect(input.className).toContain('bg-background')
          expect(input.className).toContain('border')
        })
      })
    })

    it('maintains theme consistency across different alignments and sides', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <div className="flex items-center justify-center gap-16 p-20">
          {/* Top aligned */}
          <HoverCard>
            <HoverCardTrigger>Top</HoverCardTrigger>
            <HoverCardContent side="top" className="text-center">
              <p className="text-sm text-muted-foreground">Top aligned content</p>
            </HoverCardContent>
          </HoverCard>

          {/* Right aligned */}
          <HoverCard>
            <HoverCardTrigger>Right</HoverCardTrigger>
            <HoverCardContent side="right">
              <p className="text-sm text-muted-foreground">Right aligned content</p>
            </HoverCardContent>
          </HoverCard>

          {/* Bottom aligned */}
          <HoverCard>
            <HoverCardTrigger>Bottom</HoverCardTrigger>
            <HoverCardContent side="bottom" align="end">
              <p className="text-sm text-muted-foreground">Bottom aligned content</p>
            </HoverCardContent>
          </HoverCard>

          {/* Left aligned */}
          <HoverCard>
            <HoverCardTrigger>Left</HoverCardTrigger>
            <HoverCardContent side="left" align="start">
              <p className="text-sm text-muted-foreground">Left aligned content</p>
            </HoverCardContent>
          </HoverCard>
        </div>,
        { theme: 'dark' }
      )

      // Test each alignment maintains semantic colors
      const triggers = ['Top', 'Right', 'Bottom', 'Left']
      
      for (const trigger of triggers) {
        await user.hover(screen.getByText(trigger))
        
        await waitFor(() => {
          const content = screen.getByText(`${trigger} aligned content`)
          expect(content).toBeInTheDocument()
          expect(content.className).toContain('text-muted-foreground')
          
          const container = content.closest('[data-slot="hover-card-content"]')
          expect(container).toHaveClass('bg-popover')
          expect(container).toHaveClass('text-popover-foreground')
        })
        
        // Move away to close
        await user.unhover(screen.getByText(trigger))
        await waitFor(() => {
          expect(screen.queryByText(`${trigger} aligned content`)).not.toBeInTheDocument()
        })
      }
    })

    it('works with custom styling while maintaining semantic colors', async () => {
      const user = userEvent.setup()
      
      const { rerender } = renderWithTheme(
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Custom Styled Trigger
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="bg-card border-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-card-foreground">Custom Card</h3>
              <p className="text-sm text-muted-foreground">
                This hover card uses custom semantic styling
              </p>
              <div className="rounded bg-muted p-2">
                <code className="text-xs">bg-muted</code>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>,
        { theme: 'light' }
      )

      // Test in light mode
      await user.hover(screen.getByText('Custom Styled Trigger'))
      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toHaveClass('bg-card')
        expect(content).toHaveClass('border-2')
        
        const heading = screen.getByText('Custom Card')
        expect(heading.className).toContain('text-card-foreground')
      })

      // Close hover card
      await user.unhover(screen.getByText('Custom Styled Trigger'))
      
      // Test in dark mode
      rerender(
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Custom Styled Trigger
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="bg-card border-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-card-foreground">Custom Card</h3>
              <p className="text-sm text-muted-foreground">
                This hover card uses custom semantic styling
              </p>
              <div className="rounded bg-muted p-2">
                <code className="text-xs">bg-muted</code>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Custom Styled Trigger'))
      await waitFor(() => {
        // Semantic colors should work in dark mode too
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toHaveClass('bg-card')
        
        const codeBlock = screen.getByText('bg-muted').parentElement
        expect(codeBlock?.className).toContain('bg-muted')
      })
    })
  })

  describe('Common Use Cases', () => {
    it('works as user profile card', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="underline cursor-pointer">@johndoe</span>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="space-y-2">
              <h4 className="font-semibold">John Doe</h4>
              <p className="text-sm">Software Developer</p>
              <p className="text-xs text-muted-foreground">
                Joined December 2021
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('@johndoe'))

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Software Developer')).toBeInTheDocument()
        expect(screen.getByText('Joined December 2021')).toBeInTheDocument()
      })
    })

    it('works as preview card', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger asChild>
            <a href="#" className="text-blue-500">Preview link</a>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div>
              <h3 className="font-bold">Article Title</h3>
              <p className="text-sm mt-2">
                This is a preview of the article content...
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Preview link'))

      await waitFor(() => {
        expect(screen.getByText('Article Title')).toBeInTheDocument()
        expect(screen.getByText(/preview of the article/)).toBeInTheDocument()
      })
    })

    it('works with interactive content', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Interactive</HoverCardTrigger>
          <HoverCardContent>
            <button onClick={handleClick}>Click me</button>
          </HoverCardContent>
        </HoverCard>
      )

      await user.hover(screen.getByText('Interactive'))
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('maintains keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger asChild>
            <button>Keyboard trigger</button>
          </HoverCardTrigger>
          <HoverCardContent>
            <a href="#">Link in content</a>
          </HoverCardContent>
        </HoverCard>
      )

      // Focus trigger
      const trigger = screen.getByRole('button', { name: 'Keyboard trigger' })
      trigger.focus()
      expect(document.activeElement).toBe(trigger)
    })

    it('supports ARIA attributes', () => {
      render(
        <HoverCard>
          <HoverCardTrigger aria-label="Show user details">
            User
          </HoverCardTrigger>
          <HoverCardContent>Details</HoverCardContent>
        </HoverCard>
      )

      const trigger = screen.getByText('User')
      expect(trigger).toHaveAttribute('aria-label', 'Show user details')
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid hover/unhover', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Rapid hover</HoverCardTrigger>
          <HoverCardContent>Content</HoverCardContent>
        </HoverCard>
      )

      const trigger = screen.getByText('Rapid hover')
      
      // Rapid hover/unhover
      await user.hover(trigger)
      await user.unhover(trigger)
      await user.hover(trigger)
      
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument()
      })
    })

    it('handles empty content', async () => {
      const user = userEvent.setup()
      
      render(
        <HoverCard>
          <HoverCardTrigger>Empty</HoverCardTrigger>
          <HoverCardContent />
        </HoverCard>
      )

      await user.hover(screen.getByText('Empty'))

      await waitFor(() => {
        const content = document.querySelector('[data-slot="hover-card-content"]')
        expect(content).toBeInTheDocument()
      })
    })

    it('works with multiple hover cards', async () => {
      const user = userEvent.setup()
      
      render(
        <>
          <HoverCard>
            <HoverCardTrigger>First</HoverCardTrigger>
            <HoverCardContent>First content</HoverCardContent>
          </HoverCard>
          <HoverCard>
            <HoverCardTrigger>Second</HoverCardTrigger>
            <HoverCardContent>Second content</HoverCardContent>
          </HoverCard>
        </>
      )

      // Hover first
      await user.hover(screen.getByText('First'))
      await waitFor(() => {
        expect(screen.getByText('First content')).toBeInTheDocument()
      })

      // Move to second
      await user.hover(screen.getByText('Second'))
      await waitFor(() => {
        expect(screen.queryByText('First content')).not.toBeInTheDocument()
        expect(screen.getByText('Second content')).toBeInTheDocument()
      })
    })
  })
})