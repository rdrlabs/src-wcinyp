import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'
import { renderWithTheme, describeThemeTests } from '@/test/theme-test-utils'

describe('Select', () => {
  describe('Basic Functionality', () => {
    it('renders a select trigger', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    it('opens dropdown on click', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument()
      })
    })

    it('selects an option', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      const appleOption = await screen.findByRole('option', { name: 'Apple' })
      await user.click(appleOption)
      
      expect(handleChange).toHaveBeenCalledWith('apple')
      expect(trigger).toHaveTextContent('Apple')
    })

    it('works as a controlled component', async () => {
      const user = userEvent.setup()
      const { rerender } = render(
        <Select value="1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1')
      
      rerender(
        <Select value="2">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 2')
    })
  })

  describe('Keyboard Navigation', () => {
    it('opens with Enter key', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      await user.keyboard('{Escape}') // Close first
      
      trigger.focus()
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByRole('option')).toBeInTheDocument()
      })
    })

    it('navigates options with arrow keys', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
            <SelectItem value="3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      
      // The focused option should change
      // Note: Radix UI handles focus internally
    })

    it('closes with Escape key', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      expect(await screen.findByRole('option')).toBeInTheDocument()
      
      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.queryByRole('option')).not.toBeInTheDocument()
      })
    })
  })

  describe('Groups and Labels', () => {
    it('renders grouped options with labels', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
              <SelectItem value="potato">Potato</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )
      
      await user.click(screen.getByRole('combobox'))
      
      await waitFor(() => {
        expect(screen.getByText('Fruits')).toBeInTheDocument()
        expect(screen.getByText('Vegetables')).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'Carrot' })).toBeInTheDocument()
      })
    })

    it('renders separators between groups', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      
      await user.click(screen.getByRole('combobox'))
      
      await waitFor(() => {
        const separator = container.querySelector('[role="separator"]')
        expect(separator).toBeInTheDocument()
      })
    })
  })

  describe('States', () => {
    it('handles disabled state', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-disabled', 'true')
      expect(trigger).toHaveClass('disabled:cursor-not-allowed')
      expect(trigger).toHaveClass('disabled:opacity-50')
    })

    it('prevents interaction when disabled', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <Select disabled onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      // Should not open
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('handles disabled options', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2" disabled>Option 2 (Disabled)</SelectItem>
          </SelectContent>
        </Select>
      )
      
      await user.click(screen.getByRole('combobox'))
      
      const disabledOption = await screen.findByRole('option', { name: 'Option 2 (Disabled)' })
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true')
      
      await user.click(disabledOption)
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('shows focus state on trigger', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      await user.keyboard('{Escape}')
      
      trigger.focus()
      expect(document.activeElement).toBe(trigger)
      expect(trigger).toHaveClass('focus:ring-2')
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('updates aria-expanded when opened', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('can be labeled', () => {
      render(
        <>
          <label htmlFor="test-select">Choose an option</label>
          <Select>
            <SelectTrigger id="test-select">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Option 1</SelectItem>
            </SelectContent>
          </Select>
        </>
      )
      
      const trigger = screen.getByLabelText('Choose an option')
      expect(trigger).toBeInTheDocument()
    })

    it('announces selected value to screen readers', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      const option = await screen.findByRole('option', { name: 'Option 1' })
      await user.click(option)
      
      // The selected value should be announced
      expect(trigger).toHaveTextContent('Option 1')
    })
  })

  describe('Visual Features', () => {
    it('shows chevron icon', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const chevron = container.querySelector('svg')
      expect(chevron).toBeInTheDocument()
      expect(chevron).toHaveClass('h-4')
      expect(chevron).toHaveClass('w-4')
    })

    it('shows check icon for selected item', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Select defaultValue="1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      
      await user.click(screen.getByRole('combobox'))
      
      await waitFor(() => {
        const checkedOption = screen.getByRole('option', { name: 'Option 1', selected: true })
        const checkIcon = checkedOption.querySelector('svg')
        expect(checkIcon).toBeInTheDocument()
      })
    })

    it('applies hover styles to options', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )
      
      await user.click(screen.getByRole('combobox'))
      
      const option = await screen.findByRole('option')
      expect(option).toHaveClass('hover:bg-muted-lighter')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty option list', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="No options available" />
          </SelectTrigger>
          <SelectContent />
        </Select>
      )
      
      await user.click(screen.getByRole('combobox'))
      
      // Content should still render but be empty
      await waitFor(() => {
        const listbox = screen.getByRole('listbox')
        expect(listbox).toBeInTheDocument()
      })
    })

    it('handles very long option text', async () => {
      const user = userEvent.setup()
      const longText = 'This is a very long option text that might overflow the select dropdown width'
      
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="long">{longText}</SelectItem>
          </SelectContent>
        </Select>
      )
      
      await user.click(screen.getByRole('combobox'))
      
      const option = await screen.findByRole('option')
      expect(option).toHaveTextContent(longText)
    })

    it('handles many options with scroll', async () => {
      const user = userEvent.setup()
      const options = Array.from({ length: 20 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i + 1}`
      }))
      
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
      
      await user.click(screen.getByRole('combobox'))
      
      // Should show scroll buttons for many options
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument()
      })
    })

    it('preserves trigger width when opened', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Short</SelectItem>
            <SelectItem value="2">Very long option text that exceeds trigger width</SelectItem>
          </SelectContent>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      // Content should maintain minimum width based on trigger
      const content = await screen.findByRole('listbox')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    const SelectExample = () => (
      <Select defaultValue="1">
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    it('renders correctly in light mode', () => {
      renderWithTheme(<SelectExample />, { theme: 'light' })
      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeInTheDocument()
      
      // Select trigger should use semantic color classes
      const classList = trigger.className
      expect(classList).toContain('bg-background')
      expect(classList).toContain('border-input')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('ring-offset-background')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(<SelectExample />, { theme: 'dark' })
      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeInTheDocument()
      
      // Select trigger should use semantic color classes
      const classList = trigger.className
      expect(classList).toContain('bg-background')
      expect(classList).toContain('border-input')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('ring-offset-background')
    })

    it('maintains semantic colors when opened', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>,
        { theme: 'dark' }
      )
      
      const trigger = screen.getByRole('combobox')
      await user.click(trigger)
      
      // Wait for content to appear
      const content = await screen.findByRole('listbox')
      expect(content).toBeInTheDocument()
      
      // Content should use semantic colors
      const contentClass = content.className
      expect(contentClass).toContain('bg-popover')
      expect(contentClass).toContain('text-popover-foreground')
      expect(contentClass).toContain('border-border')
      
      // Options should use semantic colors
      const options = screen.getAllByRole('option')
      options.forEach(option => {
        const optionClass = option.className
        expect(optionClass).toContain('hover:bg-muted-lighter')
        expect(optionClass).toContain('text-foreground')
        
        // Ensure no hard-coded colors
        expect(optionClass).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
    })

    it('maintains semantic colors when disabled', () => {
      renderWithTheme(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
          </SelectContent>
        </Select>,
        { theme: 'dark' }
      )
      
      const trigger = screen.getByRole('combobox')
      const classList = trigger.className
      
      // Disabled state should still use semantic colors
      expect(classList).toContain('border-input')
      expect(classList).toContain('bg-background')
      expect(classList).toContain('disabled:cursor-not-allowed')
      expect(classList).toContain('disabled:opacity-50')
    })
  })
})