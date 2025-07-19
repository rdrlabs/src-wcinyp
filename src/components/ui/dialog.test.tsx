import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './dialog'
import { Button } from './button'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Dialog', () => {
  describe('Basic Functionality', () => {
    it('renders trigger and opens dialog on click', async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>This is a test dialog</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )

      const trigger = screen.getByRole('button', { name: 'Open Dialog' })
      expect(trigger).toBeInTheDocument()

      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Test Dialog')).toBeInTheDocument()
        expect(screen.getByText('This is a test dialog')).toBeInTheDocument()
      })
    })

    it('closes dialog when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      const closeButton = screen.getByRole('button', { name: 'Close' })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('works as a controlled component', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      const { rerender } = render(
        <Dialog open={false} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)

      expect(handleOpenChange).toHaveBeenCalledWith(true)

      rerender(
        <Dialog open={true} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('closes on Escape key', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      render(
        <Dialog defaultOpen onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogTitle>Escape Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })

    it('traps focus within dialog', async () => {
      const user = userEvent.setup()
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Focus Trap Test</DialogTitle>
            </DialogHeader>
            <div>
              <input type="text" placeholder="First input" />
              <button>Action Button</button>
              <input type="text" placeholder="Last input" />
            </div>
          </DialogContent>
        </Dialog>
      )

      // Focus should be within the dialog
      const firstInput = screen.getByPlaceholderText('First input')
      const actionButton = screen.getByRole('button', { name: 'Action Button' })
      const lastInput = screen.getByPlaceholderText('Last input')

      firstInput.focus()
      expect(document.activeElement).toBe(firstInput)

      await user.tab()
      expect(document.activeElement).toBe(actionButton)

      await user.tab()
      expect(document.activeElement).toBe(lastInput)
    })
  })

  describe('Content Structure', () => {
    it('renders all dialog sections correctly', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Header Title</DialogTitle>
              <DialogDescription>Header description text</DialogDescription>
            </DialogHeader>
            <div>Main content area</div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Header Title')).toBeInTheDocument()
      expect(screen.getByText('Header description text')).toBeInTheDocument()
      expect(screen.getByText('Main content area')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })

    it('applies correct styling to header', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader className="custom-header">
              <DialogTitle>Styled Header</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )

      const header = screen.getByText('Styled Header').parentElement
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('space-y-2')
      expect(header).toHaveClass('custom-header')
    })

    it('applies correct styling to footer', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogFooter className="custom-footer">
              <Button>Action</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      const footer = screen.getByRole('button', { name: 'Action' }).parentElement
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('flex-col-reverse')
      expect(footer).toHaveClass('sm:flex-row')
      expect(footer).toHaveClass('sm:justify-end')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Overlay Behavior', () => {
    it('renders overlay behind content', () => {
      const { container } = render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Overlay Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const overlay = container.querySelector('[class*="fixed inset-0"]')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('z-50')
      expect(overlay).toHaveClass('bg-background/80')
      expect(overlay).toHaveClass('backdrop-blur-sm')
    })

    it('closes dialog when overlay is clicked', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      const { container } = render(
        <Dialog defaultOpen onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogTitle>Click Outside Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const overlay = container.querySelector('[class*="fixed inset-0"]')
      if (overlay) {
        await user.click(overlay)
        expect(handleOpenChange).toHaveBeenCalledWith(false)
      }
    })

    it('does not close when content is clicked', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      render(
        <Dialog defaultOpen onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogTitle>Content Click Test</DialogTitle>
            <div>Click me</div>
          </DialogContent>
        </Dialog>
      )

      await user.click(screen.getByText('Click me'))
      expect(handleOpenChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>Dialog description for screen readers</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-describedby')
    })

    it('announces dialog to screen readers', async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Accessible Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Screen Reader Test</DialogTitle>
            <DialogDescription>This should be announced</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      await user.click(screen.getByRole('button', { name: 'Open Accessible Dialog' }))

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
        expect(dialog).toHaveAttribute('aria-modal', 'true')
      })
    })

    it('close button has accessible label', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Close Button Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const closeButton = screen.getByRole('button', { name: 'Close' })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton.querySelector('.sr-only')).toHaveTextContent('Close')
    })
  })

  describe('Animation States', () => {
    it('applies open animation classes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Animation Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('data-[state=open]:animate-in')
      expect(content).toHaveClass('data-[state=open]:fade-in-0')
      expect(content).toHaveClass('data-[state=open]:zoom-in-95')
    })

    it('has correct positioning classes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Position Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('fixed')
      expect(content).toHaveClass('left-[50%]')
      expect(content).toHaveClass('top-[50%]')
      expect(content).toHaveClass('translate-x-[-50%]')
      expect(content).toHaveClass('translate-y-[-50%]')
    })
  })

  describe('Custom Styling', () => {
    it('accepts custom className on content', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent className="custom-dialog-content">
            <DialogTitle>Custom Styled</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('custom-dialog-content')
    })

    it('accepts custom className on title', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle className="custom-title">Custom Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const title = screen.getByText('Custom Title')
      expect(title).toHaveClass('custom-title')
      expect(title).toHaveClass('text-lg')
      expect(title).toHaveClass('font-semibold')
    })

    it('accepts custom className on description', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogDescription className="custom-description">
              Custom Description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )

      const description = screen.getByText('Custom Description')
      expect(description).toHaveClass('custom-description')
      expect(description).toHaveClass('text-sm')
      expect(description).toHaveClass('text-muted-foreground')
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid open/close', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      render(
        <Dialog onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Toggle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Rapid Toggle Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const trigger = screen.getByRole('button', { name: 'Toggle' })
      
      await user.click(trigger)
      await user.click(trigger)
      await user.click(trigger)
      
      expect(handleOpenChange).toHaveBeenCalledTimes(3)
    })

    it('handles missing required children gracefully', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <div>Content without title</div>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Content without title')).toBeInTheDocument()
    })

    it('supports custom close button', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()
      
      render(
        <Dialog defaultOpen onOpenChange={handleClose}>
          <DialogContent>
            <DialogTitle>Custom Close</DialogTitle>
            <DialogClose asChild>
              <Button>Custom Close Button</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )

      await user.click(screen.getByRole('button', { name: 'Custom Close Button' }))
      expect(handleClose).toHaveBeenCalledWith(false)
    })

    it('handles long content with scrolling', () => {
      const longContent = Array(50).fill('Long content line').join('\n')
      
      render(
        <Dialog defaultOpen>
          <DialogContent className="max-h-[200px] overflow-y-auto">
            <DialogTitle>Scrollable Dialog</DialogTitle>
            <div>{longContent}</div>
          </DialogContent>
        </Dialog>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('max-h-[200px]')
      expect(content).toHaveClass('overflow-y-auto')
    })
  })

  describe('Integration', () => {
    it('works with form elements', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <DialogHeader>
                <DialogTitle>Form Dialog</DialogTitle>
                <DialogDescription>Fill out the form below</DialogDescription>
              </DialogHeader>
              <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )

      const input = screen.getByLabelText('Name')
      await user.type(input, 'Test User')
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('supports nested dialogs', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open First</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>First Dialog</DialogTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Second</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Second Dialog</DialogTitle>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>
      )

      await user.click(screen.getByRole('button', { name: 'Open First' }))
      
      await waitFor(() => {
        expect(screen.getByText('First Dialog')).toBeInTheDocument()
      })
      
      await user.click(screen.getByRole('button', { name: 'Open Second' }))
      
      await waitFor(() => {
        expect(screen.getByText('Second Dialog')).toBeInTheDocument()
      })
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Light Mode Dialog</DialogTitle>
              <DialogDescription>This dialog is in light mode</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
        { theme: 'light' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }))
      
      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
        
        // Dialog content should use semantic color classes
        const classList = dialog.className
        expect(classList).toContain('bg-background')
        expect(classList).toContain('border')
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dark Mode Dialog</DialogTitle>
              <DialogDescription>This dialog is in dark mode</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
        { theme: 'dark' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }))
      
      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
        
        // Dialog content should use semantic color classes
        const classList = dialog.className
        expect(classList).toContain('bg-background')
        expect(classList).toContain('border')
      })
    })

    it('maintains semantic colors for overlay', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Overlay Test</DialogTitle>
          </DialogContent>
        </Dialog>,
        { theme: 'dark' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open' }))
      
      await waitFor(() => {
        // Find the overlay element (backdrop)
        const overlay = document.querySelector('[data-radix-dialog-overlay]')
        expect(overlay).toBeInTheDocument()
        
        // Overlay should use semantic colors
        const overlayClass = overlay?.className || ''
        expect(overlayClass).toContain('bg-background/80')
      })
    })

    it('maintains semantic colors for all dialog components', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Component Colors Test</DialogTitle>
              <DialogDescription>Testing semantic colors</DialogDescription>
            </DialogHeader>
            <div>Dialog body content</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
        { theme: 'dark' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open' }))
      
      await waitFor(() => {
        // Title should use semantic colors
        const title = screen.getByText('Component Colors Test')
        const titleClass = title.className
        expect(titleClass).toContain('font-semibold')
        
        // Description should use semantic colors
        const description = screen.getByText('Testing semantic colors')
        const descClass = description.className
        expect(descClass).toContain('text-muted-foreground')
        
        // Close button should use semantic colors
        const closeButton = screen.getByRole('button', { name: 'Close' })
        const closeClass = closeButton.className
        expect(closeClass).toContain('hover:bg-accent')
        expect(closeClass).toContain('hover:text-accent-foreground')
        
        // Ensure no hard-coded colors
        const dialog = screen.getByRole('dialog')
        const classList = dialog.className
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
    })

    it('maintains theme consistency when toggling', async () => {
      const user = userEvent.setup()
      const { rerender } = renderWithTheme(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Theme Toggle Test</DialogTitle>
            <DialogDescription>Should maintain consistency</DialogDescription>
          </DialogContent>
        </Dialog>,
        { theme: 'light' }
      )
      
      // Check light mode
      let dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('bg-background')
      
      // Switch to dark mode
      rerender(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Theme Toggle Test</DialogTitle>
            <DialogDescription>Should maintain consistency</DialogDescription>
          </DialogContent>
        </Dialog>
      )
      
      dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('bg-background')
    })
  })
})