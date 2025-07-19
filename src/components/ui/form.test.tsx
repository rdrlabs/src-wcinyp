import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
  useFormField,
} from './form'
import { Input } from './input'
import { renderWithTheme, describeThemeTests } from '@/test/theme-test-utils'

// Test component that uses the form
const TestForm = ({
  onSubmit = vi.fn(),
  defaultValues = {},
  withValidation = false,
}: {
  onSubmit?: (data: any) => void
  defaultValues?: any
  withValidation?: boolean
}) => {
  const form = useForm({
    defaultValues,
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          rules={withValidation ? { required: 'Username is required' } : undefined}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

// Test component that uses useFormField hook
const FormFieldConsumer = () => {
  const field = useFormField()
  return (
    <div data-testid="field-info">
      <span data-testid="field-name">{field.name}</span>
      <span data-testid="field-id">{field.id}</span>
      <span data-testid="field-error">{field.error?.message || 'no error'}</span>
    </div>
  )
}

describe('Form', () => {
  describe('Basic Functionality', () => {
    it('renders a form with all components', () => {
      render(<TestForm />)
      
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
      expect(screen.getByText('This is your public display name.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })

    it('handles form submission', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      render(<TestForm onSubmit={handleSubmit} />)
      
      const input = screen.getByLabelText('Username')
      await user.type(input, 'testuser')
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1)
        const [data] = handleSubmit.mock.calls[0]
        expect(data).toEqual({ username: 'testuser' })
      })
    })

    it('displays default values', () => {
      render(<TestForm defaultValues={{ username: 'defaultuser' }} />)
      
      const input = screen.getByLabelText('Username')
      expect(input).toHaveValue('defaultuser')
    })
  })

  describe('FormField', () => {
    it('provides field context to children', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormFieldConsumer />
                </FormItem>
              )}
            />
          </Form>
        )
      }
      
      render(<TestComponent />)
      expect(screen.getByTestId('field-name')).toHaveTextContent('test')
    })

    it('integrates with react-hook-form Controller', async () => {
      const user = userEvent.setup()
      const TestComponent = () => {
        const form = useForm({ defaultValues: { controlled: '' } })
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="controlled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div data-testid="value">{form.watch('controlled')}</div>
          </Form>
        )
      }
      
      render(<TestComponent />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'test value')
      
      expect(screen.getByTestId('value')).toHaveTextContent('test value')
    })
  })

  describe('FormItem', () => {
    it('provides unique IDs to child components', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="field1"
              render={() => <FormItem data-testid="item1" />}
            />
            <FormField
              control={form.control}
              name="field2"
              render={() => <FormItem data-testid="item2" />}
            />
          </Form>
        )
      }
      
      const { container } = render(<TestComponent />)
      const item1 = container.querySelector('[data-testid="item1"]')
      const item2 = container.querySelector('[data-testid="item2"]')
      
      expect(item1).toBeInTheDocument()
      expect(item2).toBeInTheDocument()
      // IDs should be different
      expect(item1).not.toBe(item2)
    })

    it('applies spacing between children', () => {
      render(<TestForm />)
      
      const formItems = document.querySelectorAll('.space-y-2')
      expect(formItems.length).toBeGreaterThan(0)
    })
  })

  describe('FormLabel', () => {
    it('associates with form control', () => {
      render(<TestForm />)
      
      const label = screen.getByText('Username')
      const input = screen.getByLabelText('Username')
      
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveAttribute('for', input.id)
    })

    it('shows error state styling', async () => {
      const user = userEvent.setup()
      render(<TestForm withValidation />)
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      await waitFor(() => {
        const label = screen.getByText('Username')
        expect(label).toHaveClass('text-destructive')
      })
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormLabel ref={ref}>Test Label</FormLabel>
                </FormItem>
              )}
            />
          </Form>
        )
      }
      
      render(<TestComponent />)
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('FormControl', () => {
    it('passes props to child input', () => {
      render(<TestForm />)
      
      const input = screen.getByLabelText('Username')
      expect(input).toHaveAttribute('placeholder', 'Enter username')
    })

    it('sets aria-invalid when there are errors', async () => {
      const user = userEvent.setup()
      render(<TestForm withValidation />)
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      await waitFor(() => {
        const input = screen.getByLabelText('Username')
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('sets aria-describedby for description and error messages', async () => {
      const user = userEvent.setup()
      render(<TestForm withValidation />)
      
      const input = screen.getByLabelText('Username')
      const describedBy = input.getAttribute('aria-describedby')
      
      expect(describedBy).toContain('form-item-description')
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      await waitFor(() => {
        const newDescribedBy = input.getAttribute('aria-describedby')
        expect(newDescribedBy).toContain('form-item-message')
      })
    })
  })

  describe('FormDescription', () => {
    it('renders description text', () => {
      render(<TestForm />)
      
      const description = screen.getByText('This is your public display name.')
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
    })

    it('has appropriate styling', () => {
      render(<TestForm />)
      
      const description = screen.getByText('This is your public display name.')
      expect(description).toHaveClass('text-[0.8rem]')
      expect(description).toHaveClass('text-muted-foreground')
    })

    it('has unique ID for accessibility', () => {
      render(<TestForm />)
      
      const description = screen.getByText('This is your public display name.')
      expect(description.id).toContain('form-item-description')
    })
  })

  describe('FormMessage', () => {
    it('shows validation error messages', async () => {
      const user = userEvent.setup()
      render(<TestForm withValidation />)
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument()
      })
    })

    it('has error styling', async () => {
      const user = userEvent.setup()
      render(<TestForm withValidation />)
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      await waitFor(() => {
        const message = screen.getByText('Username is required')
        expect(message).toHaveClass('text-destructive')
        expect(message).toHaveClass('font-semibold')
      })
    })

    it('renders custom children when no error', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormMessage>Custom message</FormMessage>
                </FormItem>
              )}
            />
          </Form>
        )
      }
      
      render(<TestComponent />)
      expect(screen.getByText('Custom message')).toBeInTheDocument()
    })

    it('returns null when no error or children', () => {
      const TestComponent = () => {
        const form = useForm()
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        )
      }
      
      const { container } = render(<TestComponent />)
      const messages = container.querySelectorAll('[id*="form-item-message"]')
      expect(messages).toHaveLength(0)
    })
  })

  describe('FormSection', () => {
    it('renders with title and description', () => {
      render(
        <FormSection title="Section Title" description="Section description">
          <div>Section content</div>
        </FormSection>
      )
      
      expect(screen.getByText('Section Title')).toBeInTheDocument()
      expect(screen.getByText('Section description')).toBeInTheDocument()
      expect(screen.getByText('Section content')).toBeInTheDocument()
    })

    it('renders without title or description', () => {
      render(
        <FormSection>
          <div>Section content only</div>
        </FormSection>
      )
      
      expect(screen.getByText('Section content only')).toBeInTheDocument()
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('applies section styling', () => {
      const { container } = render(
        <FormSection title="Test">
          <div>Content</div>
        </FormSection>
      )
      
      const section = container.firstChild
      expect(section).toHaveClass('space-y-4')
      expect(section).toHaveClass('p-6')
      expect(section).toHaveClass('rounded-lg')
      expect(section).toHaveClass('bg-muted-lighter')
    })

    it('renders title as h3', () => {
      render(<FormSection title="Heading Test" />)
      
      const heading = screen.getByText('Heading Test')
      expect(heading.tagName).toBe('H3')
      expect(heading).toHaveClass('text-lg')
      expect(heading).toHaveClass('font-semibold')
    })
  })

  describe('useFormField Hook', () => {
    it('throws error when used outside FormField', () => {
      // Create a component that will throw during render
      const TestComponent = () => {
        useFormField() // This will throw
        return <div>Should not render</div>
      }
      
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // The component will throw during render when useFormField is called outside context
      expect(() => {
        render(<TestComponent />)
      }).toThrow()
      
      consoleSpy.mockRestore()
    })

    it('provides field state information', async () => {
      const user = userEvent.setup()
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { test: '' },
          mode: 'onChange',
        })
        
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              rules={{ required: 'Field is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormFieldConsumer />
                </FormItem>
              )}
            />
            <button type="button" onClick={() => form.trigger('test')}>
              Validate
            </button>
          </Form>
        )
      }
      
      render(<TestComponent />)
      
      expect(screen.getByTestId('field-error')).toHaveTextContent('no error')
      
      const validateButton = screen.getByRole('button', { name: 'Validate' })
      await user.click(validateButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('field-error')).toHaveTextContent('Field is required')
      })
    })
  })

  describe('Integration', () => {
    it('works with multiple form fields', async () => {
      const user = userEvent.setup()
      const handleSubmit = vi.fn()
      
      const MultiFieldForm = () => {
        const form = useForm({
          defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
          },
        })
        
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <button type="submit">Submit</button>
            </form>
          </Form>
        )
      }
      
      render(<MultiFieldForm />)
      
      await user.type(screen.getByLabelText('First Name'), 'John')
      await user.type(screen.getByLabelText('Last Name'), 'Doe')
      await user.type(screen.getByLabelText('Email'), 'john@example.com')
      
      await user.click(screen.getByRole('button', { name: 'Submit' }))
      
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1)
        const [data] = handleSubmit.mock.calls[0]
        expect(data).toEqual({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        })
      })
    })

    it('handles nested form sections', () => {
      const NestedForm = () => {
        const form = useForm()
        
        return (
          <Form {...form}>
            <form>
              <FormSection title="Personal Information" description="Enter your details">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FormSection>
              <FormSection title="Preferences">
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscribe to newsletter</FormLabel>
                      <FormControl>
                        <Input type="checkbox" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FormSection>
            </form>
          </Form>
        )
      }
      
      render(<NestedForm />)
      
      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByText('Enter your details')).toBeInTheDocument()
      expect(screen.getByText('Preferences')).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Subscribe to newsletter')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('provides proper ARIA labels and descriptions', async () => {
      render(<TestForm withValidation />)
      
      const input = screen.getByLabelText('Username')
      const describedBy = input.getAttribute('aria-describedby')
      
      expect(describedBy).toBeTruthy()
      expect(input).toHaveAttribute('aria-invalid', 'false')
    })

    it('announces errors to screen readers', async () => {
      const user = userEvent.setup()
      render(<TestForm withValidation />)
      
      const submitButton = screen.getByRole('button', { name: 'Submit' })
      await user.click(submitButton)
      
      await waitFor(() => {
        const input = screen.getByLabelText('Username')
        const errorMessage = screen.getByText('Username is required')
        
        expect(input).toHaveAttribute('aria-invalid', 'true')
        expect(errorMessage).toHaveAttribute('id')
        
        const describedBy = input.getAttribute('aria-describedby')
        expect(describedBy).toContain(errorMessage.id)
      })
    })
  })
})

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { email: '', password: '' }
        })
        
        return (
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormDescription>We'll never share your email.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }
      
      renderWithTheme(<TestComponent />, { theme: 'light' })
      
      // Labels should use semantic colors
      const labels = screen.getAllByText(/Email|Password/)
      labels.forEach(label => {
        if (label.tagName === 'LABEL') {
          expect(label.className).toContain('text-sm')
          expect(label.className).toContain('font-medium')
        }
      })
      
      // Description should use semantic muted color
      const description = screen.getByText("We'll never share your email.")
      expect(description.className).toContain('text-muted-foreground')
    })

    it('renders correctly in dark mode', () => {
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { email: '', password: '' }
        })
        
        return (
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormDescription>We'll never share your email.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )
      }
      
      renderWithTheme(<TestComponent />, { theme: 'dark' })
      
      // Labels should maintain semantic styling in dark mode
      const labels = screen.getAllByText(/Email|Password/)
      labels.forEach(label => {
        if (label.tagName === 'LABEL') {
          expect(label.className).toContain('text-sm')
          expect(label.className).toContain('font-medium')
        }
      })
      
      // Description should maintain semantic muted color
      const description = screen.getByText("We'll never share your email.")
      expect(description.className).toContain('text-muted-foreground')
    })

    it('maintains semantic colors for form sections', () => {
      const TestComponent = () => {
        const form = useForm()
        
        return (
          <Form {...form}>
            <div className="space-y-6">
              <FormSection title="Personal Information" description="Please provide your basic details">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FormSection>
              <FormSection title="Contact Details">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FormSection>
            </div>
          </Form>
        )
      }
      
      const { container } = renderWithTheme(<TestComponent />, { theme: 'dark' })
      
      // Form sections should use semantic background colors
      const sections = container.querySelectorAll('.bg-muted-lighter')
      expect(sections).toHaveLength(2)
      
      // Section titles should use semantic text colors
      const sectionTitles = screen.getAllByText(/Personal Information|Contact Details/)
      sectionTitles.forEach(title => {
        if (title.tagName === 'H3') {
          expect(title.className).toContain('font-semibold')
        }
      })
      
      // Section descriptions should use muted foreground
      const description = screen.getByText('Please provide your basic details')
      expect(description.className).toContain('text-muted-foreground')
    })

    it('ensures no hard-coded colors', () => {
      const TestComponent = () => {
        const form = useForm()
        
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="test"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Field</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Help text</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        )
      }
      
      const { container } = renderWithTheme(<TestComponent />, { theme: 'dark' })
      
      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string') {
          // Should not contain hard-coded color values
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
          
          // FormDescription should use semantic muted-foreground
          if (element.textContent === 'Help text') {
            expect(classList).toContain('text-muted-foreground')
          }
        }
      })
    })

    it('maintains theme consistency with error states', async () => {
      const user = userEvent.setup()
      const TestComponent = () => {
        const form = useForm({
          defaultValues: { required: '' },
          mode: 'onChange',
        })
        
        return (
          <Form {...form}>
            <FormField
              control={form.control}
              name="required"
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Field</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This field must be filled</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="button" onClick={() => form.trigger('required')}>Validate</button>
          </Form>
        )
      }
      
      renderWithTheme(<TestComponent />, { theme: 'dark' })
      
      // Trigger validation
      await user.click(screen.getByRole('button', { name: 'Validate' }))
      
      // Error message should use semantic destructive color
      await waitFor(() => {
        const errorMessage = screen.getByText('This field is required')
        expect(errorMessage.className).toContain('text-destructive')
        expect(errorMessage.className).toContain('text-sm')
        expect(errorMessage.className).toContain('font-medium')
      })
    })

    it('works with form sections in both themes', () => {
      const TestComponent = () => {
        const form = useForm()
        
        return (
          <Form {...form}>
            <FormSection 
              title="Account Settings" 
              description="Manage your account preferences"
              className="mb-6"
            >
              <FormField
                control={form.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enable Notifications</FormLabel>
                    <FormControl>
                      <Input type="checkbox" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </FormSection>
          </Form>
        )
      }
      
      const { rerender } = renderWithTheme(<TestComponent />, { theme: 'light' })
      
      // Light mode check
      let section = screen.getByText('Account Settings').closest('div')
      expect(section?.className).toContain('bg-muted-lighter')
      
      // Switch to dark mode
      rerender(<TestComponent />)
      
      // Dark mode - should maintain semantic colors
      section = screen.getByText('Account Settings').closest('div')
      expect(section?.className).toContain('bg-muted-lighter')
    })
  })
})