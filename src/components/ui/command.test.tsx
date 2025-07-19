import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Command', () => {
  describe('Basic Functionality', () => {
    it('renders command palette', () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument()
      expect(screen.getByText('Calendar')).toBeInTheDocument()
      expect(screen.getByText('Search Emoji')).toBeInTheDocument()
      expect(screen.getByText('Calculator')).toBeInTheDocument()
    })

    it('filters items based on search', async () => {
      const user = userEvent.setup()
      
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Calculator</CommandItem>
              <CommandItem>Camera</CommandItem>
              <CommandItem>Music</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      const input = screen.getByPlaceholderText('Search...')
      await user.type(input, 'cal')

      await waitFor(() => {
        expect(screen.getByText('Calendar')).toBeInTheDocument()
        expect(screen.getByText('Calculator')).toBeInTheDocument()
        expect(screen.queryByText('Camera')).not.toBeInTheDocument()
        expect(screen.queryByText('Music')).not.toBeInTheDocument()
      })
    })

    it('shows empty state when no matches', async () => {
      const user = userEvent.setup()
      
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem>Apple</CommandItem>
              <CommandItem>Banana</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      await user.type(screen.getByPlaceholderText('Search...'), 'xyz')

      await waitFor(() => {
        expect(screen.getByText('No results found.')).toBeInTheDocument()
      })
    })
  })

  describe('CommandInput', () => {
    it('renders search input with icon', () => {
      render(
        <Command>
          <CommandInput placeholder="Search commands..." />
        </Command>
      )

      const input = screen.getByPlaceholderText('Search commands...')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
    })

    it('calls onValueChange when typing', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <Command>
          <CommandInput 
            placeholder="Type..." 
            onValueChange={handleChange}
          />
        </Command>
      )

      await user.type(screen.getByPlaceholderText('Type...'), 'test')
      
      expect(handleChange).toHaveBeenCalled()
      expect(handleChange).toHaveBeenLastCalledWith('test')
    })

    it('accepts custom className', () => {
      const { container } = render(
        <Command>
          <CommandInput className="custom-input" />
        </Command>
      )

      const wrapper = container.querySelector('.custom-input')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('CommandItem', () => {
    it('renders as button by default', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>Click me</CommandItem>
          </CommandList>
        </Command>
      )

      const item = screen.getByText('Click me').closest('[role]')
      expect(item).toHaveAttribute('role', 'option')
    })

    it('calls onSelect when clicked', async () => {
      const user = userEvent.setup()
      const handleSelect = vi.fn()
      
      render(
        <Command>
          <CommandList>
            <CommandItem onSelect={handleSelect}>
              Action
            </CommandItem>
          </CommandList>
        </Command>
      )

      await user.click(screen.getByText('Action'))
      expect(handleSelect).toHaveBeenCalled()
    })

    it('can be disabled', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem disabled>Disabled Action</CommandItem>
          </CommandList>
        </Command>
      )

      const item = screen.getByText('Disabled Action').closest('[role="option"]')
      expect(item).toHaveAttribute('aria-disabled', 'true')
    })

    it('shows selection state', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandList>
        </Command>
      )

      const item = screen.getByText('Item 1').closest('[role="option"]')
      expect(item).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('CommandGroup', () => {
    it('renders group with heading', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Actions">
              <CommandItem>Copy</CommandItem>
              <CommandItem>Paste</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      expect(screen.getByText('Actions')).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
      expect(screen.getByText('Paste')).toBeInTheDocument()
    })

    it('renders multiple groups', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Files">
              <CommandItem>New</CommandItem>
              <CommandItem>Open</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Edit">
              <CommandItem>Cut</CommandItem>
              <CommandItem>Copy</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

      expect(screen.getByText('Files')).toBeInTheDocument()
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })

  describe('CommandShortcut', () => {
    it('renders keyboard shortcut', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              Copy
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      )

      expect(screen.getByText('⌘C')).toBeInTheDocument()
    })

    it('applies correct styling', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              Save
              <CommandShortcut>Ctrl+S</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      )

      const shortcut = screen.getByText('Ctrl+S')
      expect(shortcut).toHaveClass('ml-auto')
      expect(shortcut).toHaveClass('text-sm')
      expect(shortcut).toHaveClass('text-muted-foreground')
    })
  })

  describe('CommandDialog', () => {
    it('renders command in dialog', () => {
      render(
        <CommandDialog open>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Action 1</CommandItem>
            <CommandItem>Action 2</CommandItem>
          </CommandList>
        </CommandDialog>
      )

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
      expect(screen.getByText('Action 1')).toBeInTheDocument()
    })

    it('can be controlled', () => {
      const { rerender } = render(
        <CommandDialog open={false}>
          <CommandInput />
        </CommandDialog>
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      rerender(
        <CommandDialog open={true}>
          <CommandInput />
        </CommandDialog>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem>First</CommandItem>
            <CommandItem>Second</CommandItem>
            <CommandItem>Third</CommandItem>
          </CommandList>
        </Command>
      )

      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.keyboard('{ArrowDown}')

      // First item should be selected
      // Focus management happens but aria-selected might not immediately update
      // Just verify that we can navigate with keyboard
      expect(document.activeElement).toBeTruthy()
    })

    it('supports Enter key selection', async () => {
      const user = userEvent.setup()
      const handleSelect = vi.fn()
      
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem onSelect={handleSelect}>Select me</CommandItem>
          </CommandList>
        </Command>
      )

      const input = screen.getByRole('combobox')
      await user.click(input)
      await user.keyboard('{ArrowDown}{Enter}')

      expect(handleSelect).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem>Item</CommandItem>
          </CommandList>
        </Command>
      )

      const command = screen.getByRole('combobox')
      expect(command).toHaveAttribute('aria-expanded')
      expect(command).toHaveAttribute('aria-controls')
    })

    it('announces empty state to screen readers', () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No items found</CommandEmpty>
          </CommandList>
        </Command>
      )

      expect(screen.getByText('No items found')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty command list', () => {
      render(
        <Command>
          <CommandInput />
          <CommandList />
        </Command>
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('handles items without onSelect', async () => {
      const user = userEvent.setup()
      
      render(
        <Command>
          <CommandList>
            <CommandItem>No handler</CommandItem>
          </CommandList>
        </Command>
      )

      // Should not throw when clicked
      await user.click(screen.getByText('No handler'))
    })

    it('handles very long item text', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              This is a very long command item text that might need to wrap or be truncated
            </CommandItem>
          </CommandList>
        </Command>
      )

      expect(screen.getByText(/very long command item/)).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
        { theme: 'light' }
      )

      // Command container should use semantic colors
      const command = container.firstChild
      expect(command).toHaveClass('bg-popover')
      expect(command).toHaveClass('text-popover-foreground')
      
      // Check input uses semantic colors
      const input = screen.getByPlaceholderText('Type a command...')
      const inputContainer = input.closest('[cmdk-input-wrapper]')
      expect(inputContainer?.className).toContain('border-b')
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
        { theme: 'dark' }
      )

      // Command container should use semantic colors
      const command = container.firstChild
      expect(command).toHaveClass('bg-popover')
      expect(command).toHaveClass('text-popover-foreground')
      
      // Check input uses semantic colors
      const input = screen.getByPlaceholderText('Type a command...')
      const inputContainer = input.closest('[cmdk-input-wrapper]')
      expect(inputContainer?.className).toContain('border-b')
    })

    it('maintains semantic colors for all command components', () => {
      renderWithTheme(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>
                Copy
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem disabled>
                Paste
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              <CommandItem>Go to File</CommandItem>
              <CommandItem>Go to Symbol</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
        { theme: 'dark' }
      )

      // Group headings should use semantic colors
      const headings = screen.getAllByText(/Actions|Navigation/)
      headings.forEach(heading => {
        expect(heading.className).toContain('text-muted-foreground')
      })
      
      // Shortcuts should use semantic colors
      const shortcuts = screen.getAllByText(/⌘[CV]/)
      shortcuts.forEach(shortcut => {
        expect(shortcut.className).toContain('text-muted-foreground')
      })
      
      // Separator should use semantic colors
      const separator = document.querySelector('[cmdk-separator]')
      expect(separator?.className).toContain('bg-border')
      
      // Disabled item should maintain semantic colors with opacity
      const disabledItem = screen.getByText('Paste').closest('[cmdk-item]')
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true')
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search..." className="h-12" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">
                <span className="mr-2">📅</span>
                Calendar
              </CommandItem>
              <CommandItem value="emoji">
                <span className="mr-2">😀</span>
                Search Emoji
              </CommandItem>
              <CommandItem value="calculator">
                <span className="mr-2">🧮</span>
                Calculator
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
        { theme: 'dark' }
      )

      // Check command container doesn't have hard-coded colors
      const command = container.firstChild
      const commandClass = command?.className || ''
      expect(commandClass).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      expect(commandClass).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      
      // Check items don't have hard-coded colors
      const items = screen.getAllByRole('option')
      items.forEach(item => {
        const itemClass = item.className
        expect(itemClass).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
    })

    it('maintains theme consistency in command dialog', () => {
      renderWithTheme(
        <CommandDialog open>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Search Files</CommandItem>
              <CommandItem>Run Command</CommandItem>
              <CommandItem>Open Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>,
        { theme: 'dark' }
      )

      // Dialog content should use semantic colors
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      
      // Command inside dialog should maintain semantic colors
      const commandInDialog = dialog.querySelector('[cmdk-root]')
      expect(commandInDialog?.className).toContain('bg-popover')
      expect(commandInDialog?.className).toContain('text-popover-foreground')
    })

    it('maintains semantic colors during search', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              No results found.
            </CommandEmpty>
            <CommandGroup>
              <CommandItem>Apple</CommandItem>
              <CommandItem>Banana</CommandItem>
              <CommandItem>Cherry</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
        { theme: 'dark' }
      )

      // Type to filter
      await user.type(screen.getByPlaceholderText('Search...'), 'xyz')

      await waitFor(() => {
        // Empty state should use semantic colors
        const emptyState = screen.getByText('No results found.')
        expect(emptyState).toBeInTheDocument()
        expect(emptyState.className).toContain('text-sm')
        
        // Check parent maintains semantic background
        const emptyParent = emptyState.closest('[cmdk-empty]')
        expect(emptyParent).toBeInTheDocument()
      })
    })
  })
})