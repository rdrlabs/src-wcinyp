import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from './textarea'
import { renderWithTheme, describeThemeTests } from '@/test/theme-test-utils'

describe('Textarea', () => {
  describe('Basic Functionality', () => {
    it('renders a textarea element', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('displays placeholder text', () => {
      render(<Textarea placeholder="Enter your message..." />)
      expect(screen.getByPlaceholderText('Enter your message...')).toBeInTheDocument()
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      render(<Textarea ref={ref} />)
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement))
    })

    it('applies custom className', () => {
      render(<Textarea className="custom-textarea" />)
      expect(screen.getByRole('textbox')).toHaveClass('custom-textarea')
    })

    it('has default minimum height', () => {
      render(<Textarea />)
      expect(screen.getByRole('textbox')).toHaveClass('min-h-[80px]')
    })
  })

  describe('User Interactions', () => {
    it('accepts user input', async () => {
      const user = userEvent.setup()
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'This is a test message')
      
      expect(textarea).toHaveValue('This is a test message')
    })

    it('handles multiline input', async () => {
      const user = userEvent.setup()
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3')
      
      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3')
    })

    it('calls onChange handler', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Textarea onChange={handleChange} />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test')
      
      expect(handleChange).toHaveBeenCalledTimes(4) // Once for each character
    })

    it('works as a controlled component', () => {
      const { rerender } = render(<Textarea value="initial" onChange={() => {}} />)
      const textarea = screen.getByRole('textbox')
      
      expect(textarea).toHaveValue('initial')
      
      rerender(<Textarea value="updated content" onChange={() => {}} />)
      expect(textarea).toHaveValue('updated content')
    })

    it('handles paste events', async () => {
      const user = userEvent.setup()
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      await user.click(textarea)
      await user.paste('This is\npasted\ncontent')
      
      expect(textarea).toHaveValue('This is\npasted\ncontent')
    })

    it('handles select all and delete', async () => {
      const user = userEvent.setup()
      render(<Textarea defaultValue="Initial content to be deleted" />)
      
      const textarea = screen.getByRole('textbox')
      await user.tripleClick(textarea) // Select all
      await user.keyboard('{Delete}')
      
      expect(textarea).toHaveValue('')
    })
  })

  describe('Configuration', () => {
    it('accepts rows attribute', () => {
      render(<Textarea rows={10} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '10')
    })

    it('accepts cols attribute', () => {
      render(<Textarea cols={50} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('cols', '50')
    })

    it('supports maxLength', async () => {
      const user = userEvent.setup()
      render(<Textarea maxLength={10} />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'This is a very long text')
      
      expect(textarea).toHaveValue('This is a ')
    })

    it('supports minLength attribute', () => {
      render(<Textarea minLength={10} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('minlength', '10')
    })

    it('can be resizable', () => {
      render(<Textarea style={{ resize: 'both' }} />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveStyle({ resize: 'both' })
    })
  })

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Textarea disabled />)
      const textarea = screen.getByRole('textbox')
      
      expect(textarea).toBeDisabled()
      expect(textarea).toHaveClass('disabled:cursor-not-allowed')
      expect(textarea).toHaveClass('disabled:opacity-50')
    })

    it('prevents input when disabled', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Textarea disabled onChange={handleChange} />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test')
      
      expect(textarea).toHaveValue('')
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('handles readonly state', async () => {
      const user = userEvent.setup()
      render(<Textarea readOnly value="Read only content" />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('readonly')
      
      await user.type(textarea, 'New text')
      expect(textarea).toHaveValue('Read only content')
    })

    it('shows focus state', async () => {
      const user = userEvent.setup()
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      await user.click(textarea)
      
      expect(document.activeElement).toBe(textarea)
      expect(textarea).toHaveClass('focus-visible:ring-2')
    })

    it('applies hover styles', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      
      // Check that hover classes are present
      expect(textarea).toHaveClass('border-input')
    })
  })

  describe('Validation', () => {
    it('accepts required attribute', () => {
      render(<Textarea required />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('required')
    })

    it('supports pattern validation', () => {
      render(<Textarea pattern="[A-Za-z]+" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('pattern', '[A-Za-z]+')
    })

    it('integrates with form validation', () => {
      const handleSubmit = vi.fn(e => e.preventDefault())
      const { container } = render(
        <form onSubmit={handleSubmit}>
          <Textarea required name="message" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const form = container.querySelector('form')
      expect(form?.checkValidity()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('can be labeled with aria-label', () => {
      render(<Textarea aria-label="Message input" />)
      expect(screen.getByLabelText('Message input')).toBeInTheDocument()
    })

    it('can be described with aria-describedby', () => {
      render(
        <>
          <Textarea aria-describedby="message-help" />
          <span id="message-help">Enter your message here</span>
        </>
      )
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-describedby', 'message-help')
    })

    it('indicates invalid state with aria-invalid', () => {
      render(<Textarea aria-invalid="true" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })

    it('can be associated with a label', () => {
      render(
        <>
          <label htmlFor="message">Your Message</label>
          <Textarea id="message" />
        </>
      )
      
      const textarea = screen.getByLabelText('Your Message')
      expect(textarea).toBeInTheDocument()
    })

    it('supports aria-required', () => {
      render(<Textarea aria-required="true" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Event Handlers', () => {
    it('calls onFocus handler', async () => {
      const handleFocus = vi.fn()
      const user = userEvent.setup()
      render(<Textarea onFocus={handleFocus} />)
      
      const textarea = screen.getByRole('textbox')
      await user.click(textarea)
      
      expect(handleFocus).toHaveBeenCalled()
    })

    it('calls onBlur handler', async () => {
      const handleBlur = vi.fn()
      const user = userEvent.setup()
      render(<Textarea onBlur={handleBlur} />)
      
      const textarea = screen.getByRole('textbox')
      await user.click(textarea)
      await user.tab()
      
      expect(handleBlur).toHaveBeenCalled()
    })

    it('calls onKeyDown handler', async () => {
      const handleKeyDown = vi.fn()
      const user = userEvent.setup()
      render(<Textarea onKeyDown={handleKeyDown} />)
      
      const textarea = screen.getByRole('textbox')
      await user.click(textarea)
      await user.keyboard('{Enter}')
      
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Enter'
        })
      )
    })

    it('calls onSelect handler when text is selected', async () => {
      const handleSelect = vi.fn()
      const user = userEvent.setup()
      render(
        <Textarea 
          onSelect={handleSelect} 
          defaultValue="Select this text"
        />
      )
      
      const textarea = screen.getByRole('textbox')
      await user.tripleClick(textarea)
      
      // onSelect may be called multiple times during selection
      expect(handleSelect).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('handles very long content', async () => {
      const user = userEvent.setup()
      const longText = 'a'.repeat(5000)
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, longText)
      
      expect(textarea).toHaveValue(longText)
    })

    it('handles special characters and emoji', async () => {
      const user = userEvent.setup()
      const specialContent = 'Special chars: !@#$%^&*()\nEmoji: 😀🎉🌟\nUnicode: 你好世界'
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, specialContent)
      
      expect(textarea).toHaveValue(specialContent)
    })

    it('preserves whitespace and formatting', async () => {
      const user = userEvent.setup()
      const formattedText = '  Indented text\n\n\nMultiple blank lines\n\tTabbed content'
      render(<Textarea />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, formattedText)
      
      expect(textarea).toHaveValue(formattedText)
    })

    it('handles rapid typing', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Textarea onChange={handleChange} />)
      
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'abcdefghijklmnopqrstuvwxyz', { delay: 1 })
      
      expect(textarea).toHaveValue('abcdefghijklmnopqrstuvwxyz')
      expect(handleChange).toHaveBeenCalledTimes(26)
    })

    it('maintains scroll position', async () => {
      const user = userEvent.setup()
      const longContent = Array(50).fill('Line of text').join('\n')
      render(<Textarea defaultValue={longContent} rows={5} />)
      
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      
      // Scroll to bottom
      textarea.scrollTop = textarea.scrollHeight
      const scrollPosition = textarea.scrollTop
      
      // Type at the end
      await user.click(textarea)
      await user.keyboard('{End}')
      await user.type(textarea, '\nNew line')
      
      // Scroll position should be maintained or adjusted
      expect(textarea.scrollTop).toBeGreaterThanOrEqual(scrollPosition)
    })
  })

  describe('Styling', () => {
    it('has consistent border styling', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      
      expect(textarea).toHaveClass('border')
      expect(textarea).toHaveClass('border-input')
      expect(textarea).toHaveClass('rounded-md')
    })

    it('has proper padding', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      
      expect(textarea).toHaveClass('px-3')
      expect(textarea).toHaveClass('py-2')
    })

    it('uses consistent text sizing', () => {
      render(<Textarea />)
      const textarea = screen.getByRole('textbox')
      
      expect(textarea).toHaveClass('text-sm')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(<Textarea placeholder="Light mode textarea" />, { theme: 'light' })
      const textarea = screen.getByPlaceholderText('Light mode textarea')
      expect(textarea).toBeInTheDocument()
      
      // Textarea should use semantic color classes
      const classList = textarea.className
      expect(classList).toContain('border-input')
      expect(classList).toContain('bg-background')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('placeholder:text-muted-foreground')
      expect(classList).toContain('ring-offset-background')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(<Textarea placeholder="Dark mode textarea" />, { theme: 'dark' })
      const textarea = screen.getByPlaceholderText('Dark mode textarea')
      expect(textarea).toBeInTheDocument()
      
      // Textarea should use semantic color classes
      const classList = textarea.className
      expect(classList).toContain('border-input')
      expect(classList).toContain('bg-background')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('placeholder:text-muted-foreground')
      expect(classList).toContain('ring-offset-background')
    })

    it('maintains semantic colors on focus', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Textarea placeholder="Focus test" />, { theme: 'dark' })
      
      const textarea = screen.getByPlaceholderText('Focus test')
      await user.click(textarea)
      
      // Focus state should use semantic colors
      const classList = textarea.className
      expect(classList).toContain('focus-visible:ring-ring')
      
      // Ensure no hard-coded colors
      expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      expect(classList).not.toMatch(/border-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
    })

    it('maintains semantic colors when disabled', () => {
      renderWithTheme(<Textarea disabled placeholder="Disabled" />, { theme: 'dark' })
      
      const textarea = screen.getByPlaceholderText('Disabled')
      const classList = textarea.className
      
      // Disabled state should still use semantic colors
      expect(classList).toContain('border-input')
      expect(classList).toContain('bg-background')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('disabled:cursor-not-allowed')
      expect(classList).toContain('disabled:opacity-50')
    })
  })
})