import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './input'
import { renderWithTheme, describeThemeTests } from '@/test/theme-test-utils'

describe('Input', () => {
  describe('Basic Functionality', () => {
    it('renders a text input by default', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
    })

    it('accepts different input types', () => {
      const { rerender } = render(<Input type="email" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
      
      rerender(<Input type="password" />)
      // Password inputs don't have a role
      const passwordInput = document.querySelector('input[type="password"]')
      expect(passwordInput).toBeInTheDocument()
      
      rerender(<Input type="number" />)
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
      
      rerender(<Input type="search" />)
      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search')
    })

    it('displays placeholder text', () => {
      render(<Input placeholder="Enter your name" />)
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      render(<Input ref={ref} />)
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
    })

    it('applies custom className', () => {
      render(<Input className="custom-class" />)
      expect(screen.getByRole('textbox')).toHaveClass('custom-class')
    })
  })

  describe('User Interactions', () => {
    it('accepts user input', async () => {
      const user = userEvent.setup()
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello World')
      
      expect(input).toHaveValue('Hello World')
    })

    it('calls onChange handler', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test')
      
      expect(handleChange).toHaveBeenCalledTimes(4) // Once for each character
    })

    it('works as a controlled component', () => {
      const { rerender } = render(<Input value="initial" onChange={() => {}} />)
      const input = screen.getByRole('textbox')
      
      expect(input).toHaveValue('initial')
      
      rerender(<Input value="updated" onChange={() => {}} />)
      expect(input).toHaveValue('updated')
    })

    it('handles paste events', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.paste('Pasted text')
      
      expect(input).toHaveValue('Pasted text')
    })

    it('handles clear/select all', async () => {
      const user = userEvent.setup()
      render(<Input defaultValue="Initial text" />)
      
      const input = screen.getByRole('textbox')
      await user.tripleClick(input) // Select all
      await user.keyboard('{Delete}')
      
      expect(input).toHaveValue('')
    })
  })

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Input disabled />)
      const input = screen.getByRole('textbox')
      
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:cursor-not-allowed')
      expect(input).toHaveClass('disabled:opacity-50')
    })

    it('prevents input when disabled', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      render(<Input disabled onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test')
      
      expect(input).toHaveValue('')
      expect(handleChange).not.toHaveBeenCalled()
    })

    it('handles readonly state', async () => {
      const user = userEvent.setup()
      render(<Input readOnly value="Read only text" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('readonly')
      
      await user.type(input, 'New text')
      expect(input).toHaveValue('Read only text')
    })

    it('shows focus state', async () => {
      const user = userEvent.setup()
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      
      expect(document.activeElement).toBe(input)
      expect(input).toHaveClass('focus-visible:ring-2')
    })
  })

  describe('Variants', () => {
    it('applies default variant styles', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      
      expect(input).toHaveClass('border')
      expect(input).toHaveClass('border-border')
    })

    it('applies primary variant styles', () => {
      render(<Input variant="primary" />)
      const input = screen.getByRole('textbox')
      
      expect(input).toHaveClass('border-primary/50')
      expect(input).toHaveClass('ring-primary/20')
    })

    it('changes styles on hover', async () => {
      const user = userEvent.setup()
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.hover(input)
      
      expect(input).toHaveClass('hover:ring-border/50')
    })
  })

  describe('Validation', () => {
    it('accepts HTML5 validation attributes', () => {
      render(
        <Input 
          type="email" 
          required 
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('pattern')
    })

    it('supports min/max for number inputs', () => {
      render(<Input type="number" min={0} max={100} />)
      
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('min', '0')
      expect(input).toHaveAttribute('max', '100')
    })

    it('supports maxLength', async () => {
      const user = userEvent.setup()
      render(<Input maxLength={5} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello World')
      
      expect(input).toHaveValue('Hello')
    })
  })

  describe('Accessibility', () => {
    it('can be labeled with aria-label', () => {
      render(<Input aria-label="Email address" />)
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    })

    it('can be described with aria-describedby', () => {
      render(
        <>
          <Input aria-describedby="email-help" />
          <span id="email-help">Enter a valid email address</span>
        </>
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'email-help')
    })

    it('indicates invalid state with aria-invalid', () => {
      render(<Input aria-invalid="true" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('supports autoComplete attribute', () => {
      render(<Input autoComplete="email" type="email" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email')
    })

    it('can be associated with a label', () => {
      render(
        <>
          <label htmlFor="test-input">Name</label>
          <Input id="test-input" />
        </>
      )
      
      const input = screen.getByLabelText('Name')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Special Input Types', () => {
    it('handles file input', () => {
      render(<Input type="file" accept="image/*" />)
      
      const input = document.querySelector('input[type="file"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('accept', 'image/*')
    })

    it('handles date input', () => {
      render(<Input type="date" min="2024-01-01" max="2024-12-31" />)
      
      const input = document.querySelector('input[type="date"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('min', '2024-01-01')
      expect(input).toHaveAttribute('max', '2024-12-31')
    })

    it('handles color input', () => {
      render(<Input type="color" defaultValue="#ff0000" />)
      
      const input = document.querySelector('input[type="color"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('#ff0000')
    })

    it('handles range input', () => {
      render(<Input type="range" min={0} max={100} defaultValue={50} />)
      
      const input = screen.getByRole('slider')
      expect(input).toHaveAttribute('type', 'range')
      expect(input).toHaveValue('50')
    })
  })

  describe('Event Handlers', () => {
    it('calls onFocus handler', async () => {
      const handleFocus = vi.fn()
      const user = userEvent.setup()
      render(<Input onFocus={handleFocus} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      
      expect(handleFocus).toHaveBeenCalled()
    })

    it('calls onBlur handler', async () => {
      const handleBlur = vi.fn()
      const user = userEvent.setup()
      render(<Input onBlur={handleBlur} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.tab()
      
      expect(handleBlur).toHaveBeenCalled()
    })

    it('calls onKeyDown handler', async () => {
      const handleKeyDown = vi.fn()
      const user = userEvent.setup()
      render(<Input onKeyDown={handleKeyDown} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.keyboard('{Enter}')
      
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Enter'
        })
      )
    })

    it('supports form submission on Enter', async () => {
      const handleSubmit = vi.fn(e => e.preventDefault())
      const user = userEvent.setup()
      
      render(
        <form onSubmit={handleSubmit}>
          <Input />
          <button type="submit">Submit</button>
        </form>
      )
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'Test{Enter}')
      
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('handles very long input values', async () => {
      const user = userEvent.setup()
      const longText = 'a'.repeat(1000)
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, longText)
      
      expect(input).toHaveValue(longText)
    })

    it('handles special characters', async () => {
      const user = userEvent.setup()
      const specialChars = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./'
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, specialChars)
      
      expect(input).toHaveValue(specialChars)
    })

    it('handles emoji input', async () => {
      const user = userEvent.setup()
      const emoji = '😀🎉🌟'
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, emoji)
      
      expect(input).toHaveValue(emoji)
    })

    it('maintains value when type changes', () => {
      const { rerender } = render(<Input type="text" defaultValue="test@example.com" />)
      const input = screen.getByRole('textbox')
      
      expect(input).toHaveValue('test@example.com')
      
      rerender(<Input type="email" defaultValue="test@example.com" />)
      expect(input).toHaveValue('test@example.com')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(<Input placeholder="Light mode input" />, { theme: 'light' })
      const input = screen.getByPlaceholderText('Light mode input')
      expect(input).toBeInTheDocument()
      
      // Input should use semantic color classes
      const classList = input.className
      expect(classList).toContain('bg-transparent')
      expect(classList).toContain('border-border')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('placeholder:text-muted-foreground')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(<Input placeholder="Dark mode input" />, { theme: 'dark' })
      const input = screen.getByPlaceholderText('Dark mode input')
      expect(input).toBeInTheDocument()
      
      // Input should use semantic color classes
      const classList = input.className
      expect(classList).toContain('bg-transparent')
      expect(classList).toContain('border-border')
      expect(classList).toContain('text-foreground')
      expect(classList).toContain('placeholder:text-muted-foreground')
    })

    it('maintains semantic colors across variants', () => {
      const variants = ['default', 'primary'] as const
      
      variants.forEach(variant => {
        const { unmount } = renderWithTheme(
          <Input variant={variant} placeholder={`${variant} input`} />,
          { theme: 'dark' }
        )
        
        const input = screen.getByPlaceholderText(`${variant} input`)
        const classList = input.className
        
        // Check for semantic color classes based on variant
        if (variant === 'default') {
          expect(classList).toContain('border-border')
          expect(classList).toContain('ring-ring')
        } else if (variant === 'primary') {
          expect(classList).toContain('border-primary/50')
          expect(classList).toContain('ring-primary/20')
        }
        
        // Common semantic colors for all variants
        expect(classList).toContain('bg-transparent')
        expect(classList).toContain('text-foreground')
        expect(classList).toContain('placeholder:text-muted-foreground')
        
        // Ensure no hard-coded colors
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        
        unmount()
      })
    })
  })
})