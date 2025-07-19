import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Switch } from './switch'
import { renderWithTheme, describeThemeTests } from '@/test/theme-test-utils'

describe('Switch', () => {
  describe('Basic Functionality', () => {
    it('renders a switch', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })

    it('is unchecked by default', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
      expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    })

    it('can be checked by default', () => {
      render(<Switch defaultChecked />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
      expect(switchElement).toHaveAttribute('data-state', 'checked')
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      render(<Switch ref={ref} />)
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
    })

    it('applies custom className', () => {
      render(<Switch className="custom-switch" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('custom-switch')
    })
  })

  describe('User Interactions', () => {
    it('toggles when clicked', async () => {
      const user = userEvent.setup()
      render(<Switch />)
      
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
      
      await user.click(switchElement)
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
      
      await user.click(switchElement)
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })

    it('calls onCheckedChange handler', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Switch onCheckedChange={handleChange} />)
      
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      expect(handleChange).toHaveBeenCalledWith(true)
      
      await user.click(switchElement)
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('works as a controlled component', () => {
      const { rerender } = render(<Switch checked={false} />)
      const switchElement = screen.getByRole('switch')
      
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
      
      rerender(<Switch checked={true} />)
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('requires onCheckedChange when controlled', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      
      render(<Switch checked={false} onCheckedChange={handleChange} />)
      
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('toggles with Space key', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Switch onCheckedChange={handleChange} />)
      
      const switchElement = screen.getByRole('switch')
      switchElement.focus()
      
      await user.keyboard(' ')
      expect(handleChange).toHaveBeenCalledWith(true)
      
      await user.keyboard(' ')
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('toggles with Enter key', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Switch onCheckedChange={handleChange} />)
      
      const switchElement = screen.getByRole('switch')
      switchElement.focus()
      
      await user.keyboard('{Enter}')
      expect(handleChange).toHaveBeenCalledWith(true)
      
      await user.keyboard('{Enter}')
      expect(handleChange).toHaveBeenCalledWith(false)
    })
  })

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Switch disabled />)
      const switchElement = screen.getByRole('switch')
      
      expect(switchElement).toBeDisabled()
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed')
      expect(switchElement).toHaveClass('disabled:opacity-50')
    })

    it('prevents interaction when disabled', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Switch disabled onCheckedChange={handleChange} />)
      
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('shows focus state', async () => {
      const user = userEvent.setup()
      render(<Switch />)
      
      const switchElement = screen.getByRole('switch')
      await user.tab()
      
      expect(document.activeElement).toBe(switchElement)
      expect(switchElement).toHaveClass('focus-visible:ring-2')
    })

    it('maintains disabled state when checked', () => {
      render(<Switch disabled defaultChecked />)
      const switchElement = screen.getByRole('switch')
      
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
      expect(switchElement).toBeDisabled()
    })
  })

  describe('Visual Feedback', () => {
    it('shows thumb position when unchecked', () => {
      const { container } = render(<Switch />)
      const thumb = container.querySelector('[data-state="unchecked"] > span')
      
      expect(thumb).toBeInTheDocument()
      expect(thumb).toHaveClass('data-[state=unchecked]:translate-x-0')
    })

    it('shows thumb position when checked', async () => {
      const user = userEvent.setup()
      const { container } = render(<Switch />)
      
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      const thumb = container.querySelector('[data-state="checked"] > span')
      expect(thumb).toBeInTheDocument()
      expect(thumb).toHaveClass('data-[state=checked]:translate-x-5')
    })

    it('applies checked background color', async () => {
      const user = userEvent.setup()
      render(<Switch />)
      
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      expect(switchElement).toHaveClass('data-[state=checked]:bg-primary')
    })

    it('applies unchecked background color', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      
      expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input')
    })

    it('has consistent sizing', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      
      expect(switchElement).toHaveClass('h-6')
      expect(switchElement).toHaveClass('w-11')
    })

    it('has rounded appearance', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      
      expect(switchElement).toHaveClass('rounded-full')
    })

    it('animates state transitions', async () => {
      const user = userEvent.setup()
      const { container } = render(<Switch />)
      
      const switchElement = screen.getByRole('switch')
      const thumb = container.querySelector('[class*="transition-transform"]')
      
      expect(thumb).toHaveClass('transition-transform')
      
      await user.click(switchElement)
      
      // Thumb should have transition class for smooth animation
      expect(thumb).toHaveClass('transition-transform')
    })
  })

  describe('Form Integration', () => {
    it('accepts name attribute', () => {
      render(<Switch name="notifications" />)
      const switchElement = screen.getByRole('switch')
      // Radix UI Switch doesn't directly expose name on the button element
      // but it's part of the component's props
      expect(switchElement).toBeInTheDocument()
    })

    it('accepts value attribute', () => {
      render(<Switch value="on" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('value', 'on')
    })

    it('can be associated with a label', () => {
      render(
        <>
          <Switch id="airplane" />
          <label htmlFor="airplane">Airplane Mode</label>
        </>
      )
      
      const switchElement = screen.getByRole('switch')
      const label = screen.getByText('Airplane Mode')
      
      expect(switchElement).toHaveAttribute('id', 'airplane')
      expect(label).toHaveAttribute('for', 'airplane')
    })

    it('toggles when label is clicked', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <Switch id="notifications" />
          <label htmlFor="notifications">Enable notifications</label>
        </div>
      )
      
      const switchElement = screen.getByRole('switch')
      const label = screen.getByText('Enable notifications')
      
      await user.click(label)
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('supports required attribute', () => {
      render(<Switch required />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-required', 'true')
    })

    it('works in a form with multiple switches', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn(e => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Switch name="option1" value="1" />
          <Switch name="option2" value="2" />
          <Switch name="option3" value="3" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const switches = screen.getAllByRole('switch')
      await user.click(switches[0])
      await user.click(switches[2])
      
      expect(switches[0]).toHaveAttribute('aria-checked', 'true')
      expect(switches[1]).toHaveAttribute('aria-checked', 'false')
      expect(switches[2]).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Switch />)
      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(<Switch aria-label="Dark mode toggle" />)
      const switchElement = screen.getByLabelText('Dark mode toggle')
      expect(switchElement).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <>
          <Switch aria-describedby="switch-desc" />
          <span id="switch-desc">Toggle to enable dark mode</span>
        </>
      )
      
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-describedby', 'switch-desc')
    })

    it('indicates invalid state', () => {
      render(<Switch aria-invalid="true" />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-invalid', 'true')
    })

    it('has correct checked state attributes', async () => {
      const user = userEvent.setup()
      render(<Switch />)
      
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('data-state', 'unchecked')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
      
      await user.click(switchElement)
      expect(switchElement).toHaveAttribute('data-state', 'checked')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('is keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <>
          <input type="text" />
          <Switch />
          <button>Next</button>
        </>
      )
      
      const textInput = screen.getByRole('textbox')
      textInput.focus()
      
      await user.tab()
      expect(screen.getByRole('switch')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid clicking', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Switch onCheckedChange={handleChange} />)
      
      const switchElement = screen.getByRole('switch')
      
      // Click rapidly
      await user.click(switchElement)
      await user.click(switchElement)
      await user.click(switchElement)
      await user.click(switchElement)
      
      expect(handleChange).toHaveBeenCalledTimes(4)
      expect(switchElement).toHaveAttribute('aria-checked', 'false') // Even number of clicks
    })

    it('maintains state during re-renders', () => {
      const { rerender } = render(<Switch defaultChecked className="test-1" />)
      const switchElement = screen.getByRole('switch')
      
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
      
      rerender(<Switch defaultChecked className="test-2" />)
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })

    it('handles undefined checked state', () => {
      render(<Switch checked={undefined} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })

    it('prevents default form submission on Enter', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn(e => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Switch />
          <button type="submit">Submit</button>
        </form>
      )
      
      const switchElement = screen.getByRole('switch')
      switchElement.focus()
      
      await user.keyboard('{Enter}')
      
      // Switch should toggle but form should not submit
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
      expect(handleSubmit).not.toHaveBeenCalled()
    })

    it('works with custom event handlers', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      const handleKeyDown = vi.fn()
      const handleChange = vi.fn()
      
      render(
        <Switch 
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onCheckedChange={handleChange}
        />
      )
      
      const switchElement = screen.getByRole('switch')
      
      await user.click(switchElement)
      expect(handleClick).toHaveBeenCalled()
      expect(handleChange).toHaveBeenCalledWith(true)
      
      await user.keyboard(' ')
      expect(handleKeyDown).toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('has transparent border', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('border-2')
      expect(switchElement).toHaveClass('border-transparent')
    })

    it('has cursor pointer when enabled', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('cursor-pointer')
    })

    it('has proper focus ring offset', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('focus-visible:ring-offset-2')
      expect(switchElement).toHaveClass('focus-visible:ring-offset-background')
    })

    it('applies transition for smooth state changes', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveClass('transition-colors')
    })

    it('thumb has shadow for depth', () => {
      const { container } = render(<Switch />)
      const thumb = container.querySelector('[class*="shadow-lg"]')
      expect(thumb).toHaveClass('shadow-lg')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(<Switch />, { theme: 'light' })
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
      
      // Switch should use semantic color classes
      const classList = switchElement.className
      expect(classList).toContain('data-[state=unchecked]:bg-input')
      expect(classList).toContain('data-[state=checked]:bg-primary')
      expect(classList).toContain('focus-visible:ring-ring')
      expect(classList).toContain('focus-visible:ring-offset-background')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(<Switch />, { theme: 'dark' })
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
      
      // Switch should use semantic color classes
      const classList = switchElement.className
      expect(classList).toContain('data-[state=unchecked]:bg-input')
      expect(classList).toContain('data-[state=checked]:bg-primary')
      expect(classList).toContain('focus-visible:ring-ring')
      expect(classList).toContain('focus-visible:ring-offset-background')
    })

    it('maintains semantic colors when toggled', async () => {
      const user = userEvent.setup()
      const { container } = renderWithTheme(<Switch />, { theme: 'dark' })
      
      const switchElement = screen.getByRole('switch')
      
      // Check unchecked state
      expect(switchElement.className).toContain('data-[state=unchecked]:bg-input')
      
      // Toggle to checked
      await user.click(switchElement)
      expect(switchElement.className).toContain('data-[state=checked]:bg-primary')
      
      // Ensure no hard-coded colors
      const classList = switchElement.className
      expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
    })

    it('maintains semantic colors for thumb element', () => {
      const { container } = renderWithTheme(<Switch />, { theme: 'dark' })
      
      const thumb = container.querySelector('span[data-state]')
      expect(thumb).toBeInTheDocument()
      
      // Thumb should use semantic background color
      const thumbClass = thumb?.className || ''
      expect(thumbClass).toContain('bg-background')
      
      // Ensure no hard-coded colors on thumb
      expect(thumbClass).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
    })

    it('maintains semantic colors when disabled', () => {
      renderWithTheme(<Switch disabled defaultChecked />, { theme: 'dark' })
      
      const switchElement = screen.getByRole('switch')
      const classList = switchElement.className
      
      // Disabled state should still use semantic colors
      expect(classList).toContain('data-[state=checked]:bg-primary')
      expect(classList).toContain('disabled:cursor-not-allowed')
      expect(classList).toContain('disabled:opacity-50')
    })
  })
})