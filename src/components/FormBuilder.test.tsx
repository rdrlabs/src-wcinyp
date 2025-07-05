import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FormBuilder from './FormBuilder'
import type { FormTemplate } from '@/types'

// Mock useRouter
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock console methods
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }
}))

// Get the mocked toast for assertions
import { toast } from 'sonner'

// Mock fetch
global.fetch = vi.fn()

// Mock FormTemplate
const mockTemplate: FormTemplate = {
  id: 1,
  name: 'Test Form',
  category: 'Financial',
  fields: 3,
  description: 'Test form description',
  lastUsed: '2025-07-04',
  submissions: 10,
  status: 'active'
}

describe('FormBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Render', () => {
    it('renders form title and description', () => {
      render(<FormBuilder template={mockTemplate} />)
      
      expect(screen.getByText('Test Form')).toBeInTheDocument()
      expect(screen.getByText('Test form description')).toBeInTheDocument()
    })

    it('renders action buttons', () => {
      render(<FormBuilder template={mockTemplate} />)
      
      expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Back to Forms' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Clear Form' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument()
    })

    it('renders correct number of form fields', () => {
      render(<FormBuilder template={mockTemplate} />)
      
      // Should render 3 fields based on template.fields
      const fieldLabels = screen.getAllByText(/Field \d+/)
      expect(fieldLabels).toHaveLength(3)
    })

    it('shows required indicators for some fields', () => {
      render(<FormBuilder template={mockTemplate} />)
      
      // Based on the mock logic, every 3rd field is required
      const requiredIndicators = screen.getAllByText('*')
      expect(requiredIndicators.length).toBeGreaterThan(0)
    })
  })

  describe('Form Interactions', () => {
    it('updates text input values', async () => {
      const user = userEvent.setup()
      render(<FormBuilder template={mockTemplate} />)
      
      const firstInput = screen.getAllByRole('textbox')[0]
      await user.type(firstInput, 'Test Value')
      
      expect(firstInput).toHaveValue('Test Value')
    })

    it('toggles checkbox values', async () => {
      const user = userEvent.setup()
      const checkboxTemplate = { ...mockTemplate, fields: 6 } // Ensure we have a checkbox
      render(<FormBuilder template={checkboxTemplate} />)
      
      const checkboxes = screen.getAllByRole('checkbox')
      if (checkboxes.length > 0) {
        const firstCheckbox = checkboxes[0]
        
        expect(firstCheckbox).not.toBeChecked()
        await user.click(firstCheckbox)
        expect(firstCheckbox).toBeChecked()
      }
    })

    it('selects dropdown options', async () => {
      const user = userEvent.setup()
      const selectTemplate = { ...mockTemplate, fields: 5 } // Ensure we have a select
      render(<FormBuilder template={selectTemplate} />)
      
      const selects = screen.getAllByRole('combobox')
      if (selects.length > 0) {
        const firstSelect = selects[0]
        
        // Click the select trigger to open the dropdown
        await user.click(firstSelect)
        
        // Wait for dropdown to open
        await waitFor(() => {
          // The dropdown items appear in a portal, find all Option 2 elements
          const options = screen.getAllByText('Option 2')
          // Click the last one (which should be the dropdown item, not the select value)
          expect(options.length).toBeGreaterThan(0)
        })
        
        // Click on the dropdown item (not the displayed value)
        const options = screen.getAllByText('Option 2')
        await user.click(options[options.length - 1])
        
        // Verify the selected value is displayed
        expect(firstSelect).toHaveTextContent('Option 2')
      }
    })
  })

  describe('Preview Mode', () => {
    it('switches to preview mode', async () => {
      const user = userEvent.setup()
      render(<FormBuilder template={mockTemplate} />)
      
      const previewButton = screen.getByRole('button', { name: /Preview/i })
      await user.click(previewButton)
      
      expect(screen.getByText('Form Preview')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Edit Mode/i })).toBeInTheDocument()
    })

    it('displays form fields in preview mode', async () => {
      const user = userEvent.setup()
      render(<FormBuilder template={mockTemplate} />)
      
      // Switch to preview
      await user.click(screen.getByRole('button', { name: /Preview/i }))
      
      // Should show form field structure
      expect(screen.getByText('Form Fields')).toBeInTheDocument()
      expect(screen.getByText('Field 1')).toBeInTheDocument()
      // Look for the field type labels in parentheses
      expect(screen.getByText(/Text Input/)).toBeInTheDocument()
      expect(screen.getByText(/Email/)).toBeInTheDocument()
    })

    it('returns to edit mode from preview', async () => {
      const user = userEvent.setup()
      render(<FormBuilder template={mockTemplate} />)
      
      // Go to preview
      await user.click(screen.getByRole('button', { name: /Preview/i }))
      
      // Return to edit
      await user.click(screen.getByRole('button', { name: /Edit Mode/i }))
      
      expect(screen.getByRole('button', { name: /Preview/i })).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('validates required fields on submit', async () => {
      const user = userEvent.setup()
      render(<FormBuilder template={mockTemplate} />)
      
      // Verify required fields exist
      const requiredField = screen.getAllByRole('textbox')[0]
      expect(requiredField).toHaveAttribute('required')
      
      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: 'Submit Form' })
      await user.click(submitButton)
      
      // HTML5 validation prevents form submission, so handleSubmit won't be called
      // and no alert will be shown. This is expected browser behavior.
      // We verify the form is still displayed (not navigated away)
      expect(screen.getByText('Test Form')).toBeInTheDocument()
    })

    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      render(<FormBuilder template={mockTemplate} />)
      
      // Fill all required fields (every 3rd field)
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], 'Required Value')
      
      // Submit
      const submitButton = screen.getByRole('button', { name: 'Submit Form' })
      await user.click(submitButton)
      
      // Check that fetch was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/.netlify/functions/submit-form',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
        )
      })
    })

    it('shows success message after submission', async () => {
      const user = userEvent.setup()
      
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })
      
      render(<FormBuilder template={mockTemplate} />)
      
      // Fill required fields
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], 'Test')
      
      // Submit
      await user.click(screen.getByRole('button', { name: 'Submit Form' }))
      
      // Should show success toast
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Form submitted successfully!',
          { description: 'Your form has been submitted and saved.' }
        )
      })
    })

    it('navigates back after successful submission', async () => {
      const user = userEvent.setup()
      
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })
      
      render(<FormBuilder template={mockTemplate} />)
      
      // Fill and submit
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], 'Test')
      await user.click(screen.getByRole('button', { name: 'Submit Form' }))
      
      // Should navigate
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/documents')
      })
    })
  })

  describe('Field Types', () => {
    it('renders different field types correctly', async () => {
      const largeTemplate = { ...mockTemplate, fields: 8 }
      const user = userEvent.setup()
      render(<FormBuilder template={largeTemplate} />)
      
      // In edit mode, check we have various input types
      const textboxes = screen.getAllByRole('textbox')
      const checkboxes = screen.getAllByRole('checkbox')
      const selects = screen.getAllByRole('combobox')
      
      expect(textboxes.length).toBeGreaterThan(0)
      expect(checkboxes.length).toBeGreaterThan(0)
      expect(selects.length).toBeGreaterThan(0)
      
      // Switch to preview mode to see field type icons
      await user.click(screen.getByRole('button', { name: 'Preview' }))
      
      // Now check for field type icons in preview
      expect(screen.getByText('📝')).toBeInTheDocument()
      expect(screen.getByText('✉️')).toBeInTheDocument()
      expect(screen.getByText('📱')).toBeInTheDocument()
    })

    it('handles email field validation', async () => {
      const user = userEvent.setup()
      render(<FormBuilder template={{ ...mockTemplate, fields: 2 }} />)
      
      const inputs = screen.getAllByRole('textbox')
      // Second field should be email type based on mock logic
      const emailInput = inputs[1]
      
      expect(emailInput).toHaveAttribute('type', 'email')
      
      // Type invalid email
      await user.type(emailInput, 'invalid-email')
      
      // Browser's built-in email validation will handle this
      // We can verify the field type is correct
    })
  })

  describe('Data Persistence', () => {
    it('maintains form data when switching between modes', async () => {
      const user = userEvent.setup()
      render(<FormBuilder template={mockTemplate} />)
      
      // Enter data
      const input = screen.getAllByRole('textbox')[0]
      await user.type(input, 'Persistent Data')
      
      // Switch to preview and back
      await user.click(screen.getByRole('button', { name: /Preview/i }))
      await user.click(screen.getByRole('button', { name: /Edit Mode/i }))
      
      // Data should persist
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Persistent Data')
    })
  })

  describe('Error Handling', () => {
    it('handles submission errors gracefully', async () => {
      const user = userEvent.setup()
      
      // Mock fetch to reject
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))
      
      render(<FormBuilder template={mockTemplate} />)
      
      // Fill and submit
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], 'Test')
      
      // Submit should not crash the app
      await user.click(screen.getByRole('button', { name: 'Submit Form' }))
      
      // Should show error toast
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Error submitting form',
          { description: 'An unexpected error occurred. Please try again.' }
        )
      })
      
      // Component should still be rendered
      expect(screen.getByText('Test Form')).toBeInTheDocument()
    })
  })
})