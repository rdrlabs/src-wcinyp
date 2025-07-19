import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Popover', () => {
  describe('Basic Functionality', () => {
    it('renders trigger and opens popover on click', async () => {
      const user = userEvent.setup()
      render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Popover content</div>
          </PopoverContent>
        </Popover>
      )

      const trigger = screen.getByRole('button', { name: 'Open Popover' })
      expect(trigger).toBeInTheDocument()

      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument()
      })
    })

    it('closes popover when clicking outside', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <Popover defaultOpen>
            <PopoverTrigger asChild>
              <Button>Trigger</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>Popover content</div>
            </PopoverContent>
          </Popover>
          <button>Outside button</button>
        </div>
      )

      expect(screen.getByText('Popover content')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Outside button' }))

      await waitFor(() => {
        expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
      })
    })

    it('works as a controlled component', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      const { rerender } = render(
        <Popover open={false} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Controlled popover</div>
          </PopoverContent>
        </Popover>
      )

      expect(screen.queryByText('Controlled popover')).not.toBeInTheDocument()

      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)

      expect(handleOpenChange).toHaveBeenCalledWith(true)

      rerender(
        <Popover open={true} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Controlled popover</div>
          </PopoverContent>
        </Popover>
      )

      await waitFor(() => {
        expect(screen.getByText('Controlled popover')).toBeInTheDocument()
      })
    })

    it('toggles on repeated clicks', async () => {
      const user = userEvent.setup()
      render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Toggle</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Toggle content</div>
          </PopoverContent>
        </Popover>
      )

      const trigger = screen.getByRole('button', { name: 'Toggle' })
      
      // Open
      await user.click(trigger)
      await waitFor(() => {
        expect(screen.getByText('Toggle content')).toBeInTheDocument()
      })

      // Close
      await user.click(trigger)
      await waitFor(() => {
        expect(screen.queryByText('Toggle content')).not.toBeInTheDocument()
      })
    })
  })

  describe('Positioning', () => {
    it('applies default center alignment', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Centered content</div>
          </PopoverContent>
        </Popover>
      )

      const content = screen.getByText('Centered content').parentElement
      expect(content).toBeInTheDocument()
    })

    it('accepts custom alignment', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div>Start aligned</div>
          </PopoverContent>
        </Popover>
      )

      expect(screen.getByText('Start aligned')).toBeInTheDocument()
    })

    it('applies default side offset', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Offset content</div>
          </PopoverContent>
        </Popover>
      )

      const content = screen.getByText('Offset content').parentElement
      expect(content).toBeInTheDocument()
    })

    it('accepts custom side offset', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent sideOffset={10}>
            <div>Custom offset</div>
          </PopoverContent>
        </Popover>
      )

      expect(screen.getByText('Custom offset')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies default styling', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Styled content</div>
          </PopoverContent>
        </Popover>
      )

      const content = screen.getByText('Styled content').parentElement
      expect(content).toHaveClass('z-50')
      expect(content).toHaveClass('w-72')
      expect(content).toHaveClass('rounded-md')
      expect(content).toHaveClass('border')
      expect(content).toHaveClass('bg-popover')
      expect(content).toHaveClass('p-4')
      expect(content).toHaveClass('shadow-md')
    })

    it('accepts custom className', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent className="custom-popover">
            <div>Custom styled</div>
          </PopoverContent>
        </Popover>
      )

      const content = screen.getByText('Custom styled').parentElement
      expect(content).toHaveClass('custom-popover')
    })

    it('has animation classes', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Animated content</div>
          </PopoverContent>
        </Popover>
      )

      const content = screen.getByText('Animated content').parentElement
      expect(content).toHaveClass('data-[state=open]:animate-in')
      expect(content).toHaveClass('data-[state=closed]:animate-out')
      expect(content).toHaveClass('data-[state=open]:fade-in-0')
      expect(content).toHaveClass('data-[state=closed]:fade-out-0')
    })
  })

  describe('Keyboard Navigation', () => {
    it('closes on Escape key', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      render(
        <Popover defaultOpen onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Press Escape</div>
          </PopoverContent>
        </Popover>
      )

      expect(screen.getByText('Press Escape')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })

    it('contains focusable elements when open', async () => {
      const user = userEvent.setup()
      render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <input type="text" placeholder="Focusable input" />
            <button>Focusable button</button>
          </PopoverContent>
        </Popover>
      )

      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Focusable input')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Focusable button' })).toBeInTheDocument()
      })
    })
  })

  describe('Content Types', () => {
    it('renders text content', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            Simple text content
          </PopoverContent>
        </Popover>
      )

      expect(screen.getByText('Simple text content')).toBeInTheDocument()
    })

    it('renders complex content', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <h3>Popover Title</h3>
              <p>Popover description</p>
              <button>Action</button>
            </div>
          </PopoverContent>
        </Popover>
      )

      expect(screen.getByText('Popover Title')).toBeInTheDocument()
      expect(screen.getByText('Popover description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('renders form content', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <input type="text" name="field" placeholder="Enter value" />
              <button type="submit">Submit</button>
            </form>
          </PopoverContent>
        </Popover>
      )

      const input = screen.getByPlaceholderText('Enter value')
      await user.type(input, 'test value')
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {
      const user = userEvent.setup()
      render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Accessible content</div>
          </PopoverContent>
        </Popover>
      )

      const trigger = screen.getByRole('button', { name: 'Open' })
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await user.click(trigger)

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('supports custom aria-label', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent aria-label="Information popover">
            <div>Content</div>
          </PopoverContent>
        </Popover>
      )

      const content = screen.getByText('Content').parentElement
      expect(content).toHaveAttribute('aria-label', 'Information popover')
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid open/close', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      render(
        <Popover onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button>Rapid Toggle</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Content</div>
          </PopoverContent>
        </Popover>
      )

      const trigger = screen.getByRole('button', { name: 'Rapid Toggle' })
      
      await user.click(trigger)
      await user.click(trigger)
      await user.click(trigger)
      
      expect(handleOpenChange).toHaveBeenCalledTimes(3)
    })

    it('handles empty content', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent />
        </Popover>
      )

      // Popover should still render even with empty content
      const trigger = screen.getByRole('button', { name: 'Trigger' })
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('handles long content with scrolling', () => {
      const longContent = Array(20).fill('Long content line').join('\n')
      
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent className="max-h-[200px] overflow-y-auto">
            <div className="whitespace-pre-wrap">{longContent}</div>
          </PopoverContent>
        </Popover>
      )

      const content = screen.getByText(/Long content line/).parentElement?.parentElement
      expect(content).toHaveClass('max-h-[200px]')
      expect(content).toHaveClass('overflow-y-auto')
    })
  })

  describe('Integration', () => {
    it('works with multiple triggers', () => {
      render(
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button>First Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>First content</div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button>Second Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div>Second content</div>
            </PopoverContent>
          </Popover>
        </div>
      )

      expect(screen.getByRole('button', { name: 'First Popover' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Second Popover' })).toBeInTheDocument()
    })

    it('works as a dropdown menu', async () => {
      const user = userEvent.setup()
      const handleAction = vi.fn()
      
      render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Menu</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleAction('edit')}>Edit</button>
              <button onClick={() => handleAction('delete')}>Delete</button>
              <button onClick={() => handleAction('share')}>Share</button>
            </div>
          </PopoverContent>
        </Popover>
      )

      await user.click(screen.getByRole('button', { name: 'Menu' }))
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: 'Edit' }))
      expect(handleAction).toHaveBeenCalledWith('edit')
    })

    it('works as an info tooltip alternative', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <button aria-label="More info">ℹ</button>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <h4 className="font-medium">Information</h4>
              <p className="text-sm">This is additional information about the feature.</p>
            </div>
          </PopoverContent>
        </Popover>
      )

      expect(screen.getByText('Information')).toBeInTheDocument()
      expect(screen.getByText('This is additional information about the feature.')).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Light mode popover content</div>
          </PopoverContent>
        </Popover>,
        { theme: 'light' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open Popover' }))
      
      await waitFor(() => {
        const content = screen.getByText('Light mode popover content')
        const popover = content.closest('[data-radix-popover-content]')
        expect(popover).toBeInTheDocument()
        
        // Popover should use semantic color classes
        const classList = popover?.className || ''
        expect(classList).toContain('bg-popover')
        expect(classList).toContain('text-popover-foreground')
        expect(classList).toContain('border')
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Dark mode popover content</div>
          </PopoverContent>
        </Popover>,
        { theme: 'dark' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open Popover' }))
      
      await waitFor(() => {
        const content = screen.getByText('Dark mode popover content')
        const popover = content.closest('[data-radix-popover-content]')
        expect(popover).toBeInTheDocument()
        
        // Popover should use semantic color classes
        const classList = popover?.className || ''
        expect(classList).toContain('bg-popover')
        expect(classList).toContain('text-popover-foreground')
        expect(classList).toContain('border')
      })
    })

    it('maintains semantic colors for different alignments', async () => {
      const user = userEvent.setup()
      const alignments = ['start', 'center', 'end'] as const
      
      for (const align of alignments) {
        const { unmount } = renderWithTheme(
          <Popover defaultOpen>
            <PopoverTrigger asChild>
              <Button>Trigger</Button>
            </PopoverTrigger>
            <PopoverContent align={align}>
              <div>{align} aligned popover</div>
            </PopoverContent>
          </Popover>,
          { theme: 'dark' }
        )
        
        const content = screen.getByText(`${align} aligned popover`)
        const popover = content.closest('[data-radix-popover-content]')
        const classList = popover?.className || ''
        
        // All alignments should use semantic colors
        expect(classList).toContain('bg-popover')
        expect(classList).toContain('text-popover-foreground')
        
        unmount()
      }
    })

    it('maintains semantic colors with custom content', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Popover Title</h4>
              <p className="text-sm text-muted-foreground">
                This is a description with semantic colors
              </p>
              <div className="flex gap-2">
                <Button size="sm">Action</Button>
                <Button size="sm" variant="outline">Cancel</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>,
        { theme: 'dark' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open' }))
      
      await waitFor(() => {
        // Check that custom content maintains semantic colors
        const title = screen.getByText('Popover Title')
        expect(title.className).toContain('font-medium')
        
        const description = screen.getByText('This is a description with semantic colors')
        expect(description.className).toContain('text-muted-foreground')
        
        // Ensure no hard-coded colors
        const popover = title.closest('[data-radix-popover-content]')
        const classList = popover?.className || ''
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
    })

    it('maintains theme consistency when toggling', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithTheme(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Theme toggle test</div>
          </PopoverContent>
        </Popover>,
        { theme: 'light' }
      )
      
      // Check light mode
      let content = screen.getByText('Theme toggle test')
      let popover = content.closest('[data-radix-popover-content]')
      expect(popover?.className).toContain('bg-popover')
      
      // Close popover first
      await user.click(document.body)
      await waitFor(() => {
        expect(screen.queryByText('Theme toggle test')).not.toBeInTheDocument()
      })
      
      // Switch to dark mode
      rerender(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Trigger</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Theme toggle test</div>
          </PopoverContent>
        </Popover>
      )
      
      // Open again
      await user.click(screen.getByRole('button', { name: 'Trigger' }))
      
      await waitFor(() => {
        content = screen.getByText('Theme toggle test')
        popover = content.closest('[data-radix-popover-content]')
        expect(popover?.className).toContain('bg-popover')
      })
    })
  })
})