import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from './sheet'
import { Button } from './button'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Sheet', () => {
  describe('Basic Functionality', () => {
    it('renders trigger and opens sheet on click', async () => {
      const user = userEvent.setup()
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Test Sheet</SheetTitle>
              <SheetDescription>This is a test sheet</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const trigger = screen.getByRole('button', { name: 'Open Sheet' })
      expect(trigger).toBeInTheDocument()

      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Test Sheet')).toBeInTheDocument()
        expect(screen.getByText('This is a test sheet')).toBeInTheDocument()
      })
    })

    it('closes sheet when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Test Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
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
        <Sheet open={false} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Controlled Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      const trigger = screen.getByRole('button', { name: 'Open' })
      await user.click(trigger)

      expect(handleOpenChange).toHaveBeenCalledWith(true)

      rerender(
        <Sheet open={true} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Controlled Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })
  })

  describe('Side Variations', () => {
    it('renders from right side by default', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Right Side Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('right-0')
      expect(content).toHaveClass('inset-y-0')
      expect(content).toHaveClass('border-l')
    })

    it('renders from left side', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent side="left">
            <SheetTitle>Left Side Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('left-0')
      expect(content).toHaveClass('inset-y-0')
      expect(content).toHaveClass('border-r')
    })

    it('renders from top side', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent side="top">
            <SheetTitle>Top Side Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('top-0')
      expect(content).toHaveClass('inset-x-0')
      expect(content).toHaveClass('border-b')
    })

    it('renders from bottom side', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent side="bottom">
            <SheetTitle>Bottom Side Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('bottom-0')
      expect(content).toHaveClass('inset-x-0')
      expect(content).toHaveClass('border-t')
    })
  })

  describe('Keyboard Navigation', () => {
    it('closes on Escape key', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      render(
        <Sheet defaultOpen onOpenChange={handleOpenChange}>
          <SheetContent>
            <SheetTitle>Escape Test</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(handleOpenChange).toHaveBeenCalledWith(false)
    })

    it('traps focus within sheet', async () => {
      const user = userEvent.setup()
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Focus Trap Test</SheetTitle>
            </SheetHeader>
            <div>
              <input type="text" placeholder="First input" />
              <button>Action Button</button>
              <input type="text" placeholder="Last input" />
            </div>
          </SheetContent>
        </Sheet>
      )

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
    it('renders all sheet sections correctly', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Header Title</SheetTitle>
              <SheetDescription>Header description text</SheetDescription>
            </SheetHeader>
            <div>Main content area</div>
            <SheetFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByText('Header Title')).toBeInTheDocument()
      expect(screen.getByText('Header description text')).toBeInTheDocument()
      expect(screen.getByText('Main content area')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })

    it('applies correct styling to header', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetHeader className="custom-header">
              <SheetTitle>Styled Header</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const header = screen.getByText('Styled Header').parentElement
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('gap-1.5')
      expect(header).toHaveClass('p-4')
      expect(header).toHaveClass('custom-header')
    })

    it('applies correct styling to footer', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetFooter className="custom-footer">
              <Button>Action</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

      const footer = screen.getByRole('button', { name: 'Action' }).parentElement
      expect(footer).toHaveClass('mt-auto')
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('flex-col')
      expect(footer).toHaveClass('gap-2')
      expect(footer).toHaveClass('p-4')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Overlay Behavior', () => {
    it('renders overlay behind content', () => {
      const { container } = render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Overlay Test</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const overlay = container.querySelector('[data-slot="sheet-overlay"]')
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass('fixed')
      expect(overlay).toHaveClass('inset-0')
      expect(overlay).toHaveClass('z-50')
      expect(overlay).toHaveClass('bg-black/50')
    })

    it('closes sheet when overlay is clicked', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      const { container } = render(
        <Sheet defaultOpen onOpenChange={handleOpenChange}>
          <SheetContent>
            <SheetTitle>Click Outside Test</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const overlay = container.querySelector('[data-slot="sheet-overlay"]')
      if (overlay) {
        await user.click(overlay)
        expect(handleOpenChange).toHaveBeenCalledWith(false)
      }
    })

    it('does not close when content is clicked', async () => {
      const user = userEvent.setup()
      const handleOpenChange = vi.fn()
      
      render(
        <Sheet defaultOpen onOpenChange={handleOpenChange}>
          <SheetContent>
            <SheetTitle>Content Click Test</SheetTitle>
            <div>Click me</div>
          </SheetContent>
        </Sheet>
      )

      await user.click(screen.getByText('Click me'))
      expect(handleOpenChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Accessible Sheet</SheetTitle>
            <SheetDescription>Sheet description for screen readers</SheetDescription>
          </SheetContent>
        </Sheet>
      )

      const sheet = screen.getByRole('dialog')
      expect(sheet).toHaveAttribute('aria-labelledby')
      expect(sheet).toHaveAttribute('aria-describedby')
    })

    it('announces sheet to screen readers', async () => {
      const user = userEvent.setup()
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Accessible Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Screen Reader Test</SheetTitle>
            <SheetDescription>This should be announced</SheetDescription>
          </SheetContent>
        </Sheet>
      )

      await user.click(screen.getByRole('button', { name: 'Open Accessible Sheet' }))

      await waitFor(() => {
        const sheet = screen.getByRole('dialog')
        expect(sheet).toBeInTheDocument()
        expect(sheet).toHaveAttribute('aria-modal', 'true')
      })
    })

    it('close button has accessible label', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Close Button Test</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const closeButton = screen.getByRole('button', { name: 'Close' })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton.querySelector('.sr-only')).toHaveTextContent('Close')
    })
  })

  describe('Animation States', () => {
    it('applies open animation classes', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Animation Test</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('data-[state=open]:animate-in')
      expect(content).toHaveClass('data-[state=open]:duration-500')
    })

    it('applies close animation classes', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle>Animation Test</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('data-[state=closed]:animate-out')
      expect(content).toHaveClass('data-[state=closed]:duration-300')
    })

    it('has slide animations for right side', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent side="right">
            <SheetTitle>Right Animation</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('data-[state=closed]:slide-out-to-right')
      expect(content).toHaveClass('data-[state=open]:slide-in-from-right')
    })
  })

  describe('Custom Styling', () => {
    it('accepts custom className on content', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent className="custom-sheet-content">
            <SheetTitle>Custom Styled</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('custom-sheet-content')
    })

    it('accepts custom className on title', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetTitle className="custom-title">Custom Title</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const title = screen.getByText('Custom Title')
      expect(title).toHaveClass('custom-title')
      expect(title).toHaveClass('font-semibold')
    })

    it('accepts custom className on description', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <SheetDescription className="custom-description">
              Custom Description
            </SheetDescription>
          </SheetContent>
        </Sheet>
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
        <Sheet onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button>Toggle</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Rapid Toggle Test</SheetTitle>
          </SheetContent>
        </Sheet>
      )

      const trigger = screen.getByRole('button', { name: 'Toggle' })
      
      await user.click(trigger)
      await user.click(trigger)
      await user.click(trigger)
      
      expect(handleOpenChange).toHaveBeenCalledTimes(3)
    })

    it('handles missing required children gracefully', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <div>Content without title</div>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Content without title')).toBeInTheDocument()
    })

    it('supports custom close button', async () => {
      const user = userEvent.setup()
      const handleClose = vi.fn()
      
      render(
        <Sheet defaultOpen onOpenChange={handleClose}>
          <SheetContent>
            <SheetTitle>Custom Close</SheetTitle>
            <SheetClose asChild>
              <Button>Custom Close Button</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      )

      await user.click(screen.getByRole('button', { name: 'Custom Close Button' }))
      expect(handleClose).toHaveBeenCalledWith(false)
    })

    it('handles long content with scrolling', () => {
      const longContent = Array(50).fill('Long content line').join('\n')
      
      render(
        <Sheet defaultOpen>
          <SheetContent className="overflow-y-auto">
            <SheetTitle>Scrollable Sheet</SheetTitle>
            <div className="whitespace-pre-wrap">{longContent}</div>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('overflow-y-auto')
    })
  })

  describe('Integration', () => {
    it('works with form elements', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      
      render(
        <Sheet defaultOpen>
          <SheetContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <SheetHeader>
                <SheetTitle>Form Sheet</SheetTitle>
                <SheetDescription>Fill out the form below</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" className="w-full" />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </SheetClose>
                <Button type="submit">Submit</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      )

      const input = screen.getByLabelText('Name')
      await user.type(input, 'Test User')
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('works as navigation drawer', () => {
      render(
        <Sheet defaultOpen>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Light Mode Sheet</SheetTitle>
              <SheetDescription>This sheet is in light mode</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>,
        { theme: 'light' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open Sheet' }))
      
      await waitFor(() => {
        const sheet = screen.getByRole('dialog')
        expect(sheet).toBeInTheDocument()
        
        // Sheet content should use semantic color classes
        const classList = sheet.className
        expect(classList).toContain('bg-background')
        expect(classList).toContain('border-l')
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Dark Mode Sheet</SheetTitle>
              <SheetDescription>This sheet is in dark mode</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>,
        { theme: 'dark' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open Sheet' }))
      
      await waitFor(() => {
        const sheet = screen.getByRole('dialog')
        expect(sheet).toBeInTheDocument()
        
        // Sheet content should use semantic color classes
        const classList = sheet.className
        expect(classList).toContain('bg-background')
        expect(classList).toContain('border-l')
      })
    })

    it('maintains semantic colors for overlay', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Overlay Test</SheetTitle>
          </SheetContent>
        </Sheet>,
        { theme: 'dark' }
      )
      
      await user.click(screen.getByRole('button', { name: 'Open' }))
      
      await waitFor(() => {
        // Find the overlay element (backdrop)
        const overlay = document.querySelector('[data-radix-sheet-overlay]')
        expect(overlay).toBeInTheDocument()
        
        // Overlay should use semantic colors
        const overlayClass = overlay?.className || ''
        expect(overlayClass).toContain('bg-background/80')
      })
    })

    it('maintains semantic colors for all sheet components', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Component Colors Test</SheetTitle>
              <SheetDescription>Testing semantic colors</SheetDescription>
            </SheetHeader>
            <div className="py-4">Sheet body content</div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button>Save</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>,
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
        expect(closeClass).toContain('hover:bg-secondary')
        
        // Ensure no hard-coded colors
        const sheet = screen.getByRole('dialog')
        const classList = sheet.className
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
    })

    it('maintains semantic colors for different sides', async () => {
      const user = userEvent.setup()
      const sides = ['left', 'right', 'top', 'bottom'] as const
      
      for (const side of sides) {
        const { unmount } = renderWithTheme(
          <Sheet defaultOpen>
            <SheetContent side={side}>
              <SheetTitle>{side} Sheet</SheetTitle>
              <SheetDescription>Testing {side} side</SheetDescription>
            </SheetContent>
          </Sheet>,
          { theme: 'dark' }
        )
        
        const sheet = screen.getByRole('dialog')
        const classList = sheet.className
        
        // All sides should use semantic colors
        expect(classList).toContain('bg-background')
        
        // Check border positioning based on side
        if (side === 'left') expect(classList).toContain('border-r')
        if (side === 'right') expect(classList).toContain('border-l')
        if (side === 'top') expect(classList).toContain('border-b')
        if (side === 'bottom') expect(classList).toContain('border-t')
        
        unmount()
      }
    })
  })
})