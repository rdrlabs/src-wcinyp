import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FormBuilderUI } from './FormBuilderUI'
import { axe } from 'jest-axe'

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

describe('FormBuilderUI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('renders form settings section', () => {
      render(<FormBuilderUI />)
      
      expect(screen.getByText('Form Settings')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter form name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter form description')).toBeInTheDocument()
    })

    it('renders form fields section', () => {
      render(<FormBuilderUI />)
      
      expect(screen.getByText('Form Fields')).toBeInTheDocument()
      expect(screen.getByText('Add and configure form fields')).toBeInTheDocument()
    })

    it('starts with no fields', () => {
      render(<FormBuilderUI />)
      
      const fieldCards = screen.queryAllByText(/Field label/i)
      expect(fieldCards).toHaveLength(0)
    })

    it('displays action buttons', () => {
      render(<FormBuilderUI />)
      
      expect(screen.getByRole('button', { name: /Add Field/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Preview/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Save Form/i })).toBeInTheDocument()
    })
  })

  describe('Form Settings', () => {
    it('updates form name', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      const nameInput = screen.getByPlaceholderText('Enter form name')
      await user.type(nameInput, 'Patient Registration')
      
      expect(nameInput).toHaveValue('Patient Registration')
    })

    it('updates form description', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      const descInput = screen.getByPlaceholderText('Enter form description')
      await user.type(descInput, 'Collect patient information')
      
      expect(descInput).toHaveValue('Collect patient information')
    })
  })

  describe('Field Management', () => {
    it('adds a new field', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      const addButton = screen.getByRole('button', { name: /Add Field/i })
      await user.click(addButton)
      
      // Should create a new field with default values
      expect(screen.getByDisplayValue('New Field')).toBeInTheDocument()
      // The select component displays the value differently
      const selectTrigger = screen.getByRole('combobox')
      expect(selectTrigger).toHaveTextContent('Text Input')
    })

    it('updates field label', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Add a field first
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      const labelInput = screen.getByDisplayValue('New Field')
      await user.clear(labelInput)
      await user.type(labelInput, 'Patient Name')
      
      expect(labelInput).toHaveValue('Patient Name')
    })

    it('changes field type', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Add a field
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      const typeSelect = screen.getByRole('combobox')
      
      // The select should show "Text Input" initially
      expect(typeSelect).toHaveTextContent('Text Input')
      
      // Click to open the dropdown
      await user.click(typeSelect)
      
      // Wait for the dropdown to be rendered and click on Email option
      const emailOption = await screen.findByRole('option', { name: 'Email' })
      await user.click(emailOption)
      
      // Verify the selection changed
      expect(typeSelect).toHaveTextContent('Email')
    })

    it('updates placeholder text', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Add a field
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      const placeholderInput = screen.getByPlaceholderText('Placeholder text')
      await user.type(placeholderInput, 'Enter your email')
      
      expect(placeholderInput).toHaveValue('Enter your email')
    })

    it('toggles required field', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Add a field
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      const requiredCheckbox = screen.getByRole('checkbox')
      expect(requiredCheckbox).not.toBeChecked()
      
      await user.click(requiredCheckbox)
      expect(requiredCheckbox).toBeChecked()
    })

    it('deletes a field', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Add a field
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      expect(screen.getByDisplayValue('New Field')).toBeInTheDocument()
      
      // Find the card containing the field
      const fieldCard = screen.getByDisplayValue('New Field').closest('.p-4')
      // Find all buttons in the card - the last one should be delete
      const buttons = within(fieldCard!).getAllByRole('button')
      const deleteButton = buttons[buttons.length - 1]
      
      await user.click(deleteButton)
      
      expect(screen.queryByDisplayValue('New Field')).not.toBeInTheDocument()
    })

    it('moves field up', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Add two fields
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      // Update labels to distinguish them
      const labelInputs = screen.getAllByDisplayValue('New Field')
      await user.clear(labelInputs[0])
      await user.type(labelInputs[0], 'Field 1')
      await user.clear(labelInputs[1])
      await user.type(labelInputs[1], 'Field 2')
      
      // Find the second field's card
      const field2Input = screen.getByDisplayValue('Field 2')
      const secondCard = field2Input.closest('.p-4')
      const moveUpButton = within(secondCard!).getAllByRole('button')[0]
      
      await user.click(moveUpButton)
      
      // Field 2 should now be first
      const updatedInputs = screen.getAllByPlaceholderText('Field label')
      expect(updatedInputs[0]).toHaveValue('Field 2')
      expect(updatedInputs[1]).toHaveValue('Field 1')
    })

    it('disables move up for first field', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      const fieldCard = screen.getByDisplayValue('New Field').closest('.p-4')
      const moveUpButton = within(fieldCard!).getAllByRole('button')[0]
      
      expect(moveUpButton).toBeDisabled()
    })

    it('disables move down for last field', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      const fieldCard = screen.getByDisplayValue('New Field').closest('.p-4')
      const moveDownButton = within(fieldCard!).getAllByRole('button')[1]
      
      expect(moveDownButton).toBeDisabled()
    })
  })

  describe('Preview Mode', () => {
    it('switches to preview mode', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      const previewButton = screen.getByRole('button', { name: /Preview/i })
      await user.click(previewButton)
      
      expect(screen.getByText('Preview Mode')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Back to Editor' })).toBeInTheDocument()
    })

    it('displays form name in preview', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Set form name
      await user.type(screen.getByPlaceholderText('Enter form name'), 'Test Form')
      
      // Switch to preview
      await user.click(screen.getByRole('button', { name: /Preview/i }))
      
      expect(screen.getByText('Test Form')).toBeInTheDocument()
    })

    it('displays "Untitled Form" when no name is set', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      await user.click(screen.getByRole('button', { name: /Preview/i }))
      
      expect(screen.getByText('Untitled Form')).toBeInTheDocument()
    })

    it('renders form fields in preview', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Add a field
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      const fieldInput = screen.getByDisplayValue('New Field')
      await user.clear(fieldInput)
      await user.type(fieldInput, 'Email Address')
      
      // Switch to preview
      await user.click(screen.getByRole('button', { name: /Preview/i }))
      
      // Check that the field label is displayed
      expect(screen.getByText('Email Address')).toBeInTheDocument()
      // And there should be an input field
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('shows required asterisk in preview', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Add required field
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      await user.click(screen.getByRole('checkbox'))
      
      // Switch to preview
      await user.click(screen.getByRole('button', { name: /Preview/i }))
      
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('returns to editor from preview', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Go to preview
      await user.click(screen.getByRole('button', { name: /Preview/i }))
      
      // Come back
      await user.click(screen.getByRole('button', { name: 'Back to Editor' }))
      
      expect(screen.getByText('Form Settings')).toBeInTheDocument()
    })
  })

  describe('Save Functionality', () => {
    it('saves form with all data', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      // Set form data
      await user.type(screen.getByPlaceholderText('Enter form name'), 'Test Form')
      await user.type(screen.getByPlaceholderText('Enter form description'), 'Test Description')
      
      // Add a field
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      // Save
      await user.click(screen.getByRole('button', { name: /Save Form/i }))
      
      // Check that toast was called
      expect(toast.success).toHaveBeenCalledWith(
        'Form template saved!',
        { description: 'Your form has been saved successfully.' }
      )
    })

    it('save button is disabled when form name is empty', () => {
      render(<FormBuilderUI />)
      
      const saveButton = screen.getByRole('button', { name: /Save Form/i })
      expect(saveButton).toBeDisabled()
    })

    it('save button is disabled when no fields exist', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      await user.type(screen.getByPlaceholderText('Enter form name'), 'Test Form')
      
      const saveButton = screen.getByRole('button', { name: /Save Form/i })
      expect(saveButton).toBeDisabled()
    })

    it('save button is enabled when form has name and fields', async () => {
      const user = userEvent.setup()
      render(<FormBuilderUI />)
      
      await user.type(screen.getByPlaceholderText('Enter form name'), 'Test Form')
      await user.click(screen.getByRole('button', { name: /Add Field/i }))
      
      const saveButton = screen.getByRole('button', { name: /Save Form/i })
      expect(saveButton).not.toBeDisabled()
    })
  })

  describe('Field Types', () => {
    const fieldTypes = [
      { value: 'text', label: 'Text Input' },
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'date', label: 'Date' },
      { value: 'select', label: 'Dropdown' },
      { value: 'checkbox', label: 'Checkbox' },
      { value: 'textarea', label: 'Text Area' },
    ]

    fieldTypes.forEach(({ value: _value, label }) => {
      it(`supports ${label} field type`, async () => {
        const user = userEvent.setup()
        render(<FormBuilderUI />)
        
        await user.click(screen.getByRole('button', { name: /Add Field/i }))
        
        const typeSelect = screen.getByRole('combobox')
        
        // Skip test if this is the default value (Text Input)
        if (label === 'Text Input') {
          expect(typeSelect).toHaveTextContent(label)
          return
        }
        
        // Click to open dropdown
        await user.click(typeSelect)
        
        // Click on the specific field type option
        const option = await screen.findByRole('option', { name: label })
        await user.click(option)
        
        expect(typeSelect).toHaveTextContent(label)
      })
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<FormBuilderUI />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('form inputs have proper labels', () => {
      render(<FormBuilderUI />)
      
      // Check that labels exist for the inputs
      expect(screen.getByText('Form Name')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      
      // And that the corresponding inputs exist
      expect(screen.getByPlaceholderText('Enter form name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter form description')).toBeInTheDocument()
    })

    it('buttons have accessible names', () => {
      render(<FormBuilderUI />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })
  })
})