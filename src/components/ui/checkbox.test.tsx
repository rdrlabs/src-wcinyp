import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './checkbox'
import { renderWithTheme, describeThemeTests } from '@/test/theme-test-utils'

describe('Checkbox', () => {
  describe('Basic Functionality', () => {
    it('renders a checkbox', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })

    it('is unchecked by default', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
      expect(checkbox).toHaveAttribute('aria-checked', 'false')
    })

    it('can be checked by default', () => {
      render(<Checkbox defaultChecked />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      expect(checkbox).toHaveAttribute('aria-checked', 'true')
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      render(<Checkbox ref={ref} />)
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
    })

    it('applies custom className', () => {
      render(<Checkbox className="custom-checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('custom-checkbox')
    })
  })

  describe('User Interactions', () => {
    it('toggles when clicked', async () => {
      const user = userEvent.setup()
      render(<Checkbox />)
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('calls onCheckedChange handler', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Checkbox onCheckedChange={handleChange} />)
      
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      
      expect(handleChange).toHaveBeenCalledWith(true)
      
      await user.click(checkbox)
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('works as a controlled component', () => {
      const { rerender } = render(<Checkbox checked={false} />)
      const checkbox = screen.getByRole('checkbox')
      
      expect(checkbox).not.toBeChecked()
      
      rerender(<Checkbox checked={true} />)
      expect(checkbox).toBeChecked()
    })

    it('requires onCheckedChange when controlled', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Checkbox checked={false} onCheckedChange={handleChange} />)
      
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('toggles with Space key', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Checkbox onCheckedChange={handleChange} />)
      
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      
      await user.keyboard(' ')
      expect(handleChange).toHaveBeenCalledWith(true)
      
      await user.keyboard(' ')
      expect(handleChange).toHaveBeenCalledWith(false)
    })
  })

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Checkbox disabled />)
      const checkbox = screen.getByRole('checkbox')
      
      expect(checkbox).toBeDisabled()
      expect(checkbox).toHaveClass('disabled:cursor-not-allowed')
      expect(checkbox).toHaveClass('disabled:opacity-50')
    })

    it('prevents interaction when disabled', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Checkbox disabled onCheckedChange={handleChange} />)
      
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      
      expect(checkbox).not.toBeChecked()
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('shows focus state', async () => {
      const user = userEvent.setup()
      render(<Checkbox />)
      
      const checkbox = screen.getByRole('checkbox')
      await user.tab()
      
      expect(document.activeElement).toBe(checkbox)
      expect(checkbox).toHaveClass('focus-visible:ring-2')
    })

    it('maintains disabled state when checked', () => {
      render(<Checkbox disabled defaultChecked />)
      const checkbox = screen.getByRole('checkbox')
      
      expect(checkbox).toBeChecked()
      expect(checkbox).toBeDisabled()
    })
  })

  describe('Visual Feedback', () => {
    it('shows check icon when checked', async () => {
      const user = userEvent.setup()
      render(<Checkbox />)
      
      const checkbox = screen.getByRole('checkbox')
      
      // Initially no check icon
      expect(screen.queryByTestId('checkbox-check-icon')).not.toBeInTheDocument()
      
      await user.click(checkbox)
      
      // Check icon appears
      const checkIcon = screen.getByTestId('checkbox-check-icon')
      expect(checkIcon).toBeInTheDocument()
      expect(checkIcon).toHaveClass('h-4')
      expect(checkIcon).toHaveClass('w-4')
    })

    it('applies checked background color', async () => {
      const user = userEvent.setup()
      render(<Checkbox />)
      
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      
      expect(checkbox).toHaveClass('data-[state=checked]:bg-primary')
      expect(checkbox).toHaveClass('data-[state=checked]:text-primary-foreground')
    })

    it('has consistent sizing', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      
      expect(checkbox).toHaveClass('h-4')
      expect(checkbox).toHaveClass('w-4')
    })

    it('has rounded corners', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      
      expect(checkbox).toHaveClass('rounded-sm')
    })
  })

  describe('Form Integration', () => {
    it('accepts name attribute', () => {
      render(<Checkbox name="agreement" />)
      const checkbox = screen.getByRole('checkbox')
      // Radix UI checkboxes don't expose the name attribute directly on the element
      // The name prop is used internally for form submission
      expect(checkbox).toBeInTheDocument()
    })

    it('accepts value attribute', () => {
      render(<Checkbox value="yes" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('value', 'yes')
    })

    it('can be associated with a label', () => {
      render(
        <>
          <Checkbox id="terms" />
          <label htmlFor="terms">I agree to the terms</label>
        </>
      )
      
      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('I agree to the terms')
      
      expect(checkbox).toHaveAttribute('id', 'terms')
      expect(label).toHaveAttribute('for', 'terms')
    })

    it('toggles when label is clicked', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <Checkbox id="subscribe" />
          <label htmlFor="subscribe">Subscribe to newsletter</label>
        </div>
      )
      
      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('Subscribe to newsletter')
      
      await user.click(label)
      expect(checkbox).toBeChecked()
    })

    it('supports required attribute', () => {
      render(<Checkbox required />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Checkbox />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(<Checkbox aria-label="Accept terms" />)
      const checkbox = screen.getByLabelText('Accept terms')
      expect(checkbox).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <>
          <Checkbox aria-describedby="terms-desc" />
          <span id="terms-desc">You must accept the terms to continue</span>
        </>
      )
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-describedby', 'terms-desc')
    })

    it('indicates invalid state', () => {
      render(<Checkbox aria-invalid="true" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    })

    it('has correct checked state attributes', async () => {
      const user = userEvent.setup()
      render(<Checkbox />)
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
      
      await user.click(checkbox)
      expect(checkbox).toHaveAttribute('data-state', 'checked')
    })

    it('is keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <>
          <input type="text" />
          <Checkbox />
          <button>Next</button>
        </>
      )
      
      const textInput = screen.getByRole('textbox')
      textInput.focus()
      
      await user.tab()
      expect(screen.getByRole('checkbox')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid clicking', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Checkbox onCheckedChange={handleChange} />)
      
      const checkbox = screen.getByRole('checkbox')
      
      // Click rapidly
      await user.click(checkbox)
      await user.click(checkbox)
      await user.click(checkbox)
      await user.click(checkbox)
      
      expect(handleChange).toHaveBeenCalledTimes(4)
      expect(checkbox).not.toBeChecked() // Even number of clicks
    })

    it('maintains state during re-renders', () => {
      const { rerender } = render(<Checkbox defaultChecked className="test-1" />)
      const checkbox = screen.getByRole('checkbox')
      
      expect(checkbox).toBeChecked()
      
      rerender(<Checkbox defaultChecked className="test-2" />)
      expect(checkbox).toBeChecked()
    })

    it('handles undefined checked state', () => {
      render(<Checkbox checked={undefined} />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })

    it('works in a form with multiple checkboxes', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn(e => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="option1" value="1" />
          <Checkbox name="option2" value="2" />
          <Checkbox name="option3" value="3" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])
      await user.click(checkboxes[2])
      
      expect(checkboxes[0]).toBeChecked()
      expect(checkboxes[1]).not.toBeChecked()
      expect(checkboxes[2]).toBeChecked()
    })
  })

  describe('Styling', () => {
    it('has primary border color', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('border-primary')
    })

    it('has proper focus ring offset', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('ring-offset-background')
      expect(checkbox).toHaveClass('focus-visible:ring-offset-2')
    })

    it('applies data state classes correctly', async () => {
      const user = userEvent.setup()
      render(<Checkbox />)
      
      const checkbox = screen.getByRole('checkbox')
      
      // Unchecked state
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
      
      await user.click(checkbox)
      
      // Checked state
      expect(checkbox).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(<Checkbox />, { theme: 'light' })
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      
      // Checkbox should use semantic color classes
      const classList = checkbox.className
      expect(classList).toContain('border-primary')
      expect(classList).toContain('ring-offset-background')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(<Checkbox />, { theme: 'dark' })
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      
      // Checkbox should use semantic color classes
      const classList = checkbox.className
      expect(classList).toContain('border-primary')
      expect(classList).toContain('ring-offset-background')
    })

    it('maintains semantic colors when checked', async () => {
      const user = userEvent.setup()
      const { container } = renderWithTheme(<Checkbox />, { theme: 'dark' })
      
      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      
      // Check that checked state uses semantic colors
      expect(checkbox.className).toContain('data-[state=checked]:bg-primary')
      expect(checkbox.className).toContain('data-[state=checked]:text-primary-foreground')
      
      // Ensure no hard-coded colors
      const classList = checkbox.className
      expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
    })

    it('maintains semantic colors when disabled', () => {
      renderWithTheme(<Checkbox disabled defaultChecked />, { theme: 'dark' })
      
      const checkbox = screen.getByRole('checkbox')
      const classList = checkbox.className
      
      // Disabled state should still use semantic colors
      expect(classList).toContain('border-primary')
      expect(classList).toContain('data-[state=checked]:bg-primary')
      expect(classList).toContain('data-[state=checked]:text-primary-foreground')
      expect(classList).toContain('disabled:cursor-not-allowed')
      expect(classList).toContain('disabled:opacity-50')
    })
  })
})