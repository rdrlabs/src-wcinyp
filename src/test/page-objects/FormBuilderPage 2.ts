import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Page Object Model for Form Builder
 * Abstracts form interactions and validations
 */
export class FormBuilderPage {
  // Control buttons
  get previewToggleButton() {
    return screen.getByTestId('toggle-preview-button')
  }

  get backToFormsButton() {
    return screen.getByTestId('back-to-forms-button')
  }

  get clearFormButton() {
    return screen.getByTestId('clear-form-button')
  }

  get submitFormButton() {
    return screen.getByTestId('submit-form-button')
  }

  // Form field getters
  getFormInput(fieldId: string) {
    return screen.getByTestId(`form-input-${fieldId}`)
  }

  getFormSelect(fieldId: string) {
    return screen.getByTestId(`form-select-${fieldId}`)
  }

  getFormCheckbox(fieldId: string) {
    return screen.getByTestId(`form-checkbox-${fieldId}`)
  }

  getFormTextarea(fieldId: string) {
    return screen.getByTestId(`form-textarea-${fieldId}`)
  }

  // Actions
  async togglePreviewMode() {
    const user = userEvent.setup()
    await user.click(this.previewToggleButton)
  }

  async goBackToForms() {
    const user = userEvent.setup()
    await user.click(this.backToFormsButton)
  }

  async clearForm() {
    const user = userEvent.setup()
    await user.click(this.clearFormButton)
  }

  async submitForm() {
    const user = userEvent.setup()
    await user.click(this.submitFormButton)
  }

  async fillTextField(fieldId: string, value: string) {
    const user = userEvent.setup()
    const input = this.getFormInput(fieldId)
    await user.clear(input)
    await user.type(input, value)
  }

  async selectOption(fieldId: string, optionValue: string) {
    const user = userEvent.setup()
    const select = this.getFormSelect(fieldId)
    await user.selectOptions(select, optionValue)
  }

  async toggleCheckbox(fieldId: string) {
    const user = userEvent.setup()
    const checkbox = this.getFormCheckbox(fieldId)
    await user.click(checkbox)
  }

  async fillTextarea(fieldId: string, value: string) {
    const user = userEvent.setup()
    const textarea = this.getFormTextarea(fieldId)
    await user.clear(textarea)
    await user.type(textarea, value)
  }

  // State checks
  isInPreviewMode() {
    return screen.getByText('Edit Mode').isVisible
  }

  isInEditMode() {
    return screen.getByText('Preview').isVisible
  }

  // Form data helpers
  async fillFormData(data: Record<string, any>) {
    for (const [fieldId, value] of Object.entries(data)) {
      if (typeof value === 'boolean') {
        const checkbox = this.getFormCheckbox(fieldId)
        if (checkbox.checked !== value) {
          await this.toggleCheckbox(fieldId)
        }
      } else if (fieldId.includes('select')) {
        await this.selectOption(fieldId, value)
      } else if (fieldId.includes('textarea')) {
        await this.fillTextarea(fieldId, value)
      } else {
        await this.fillTextField(fieldId, value)
      }
    }
  }

  // Validation helpers
  expectFieldRequired(fieldId: string) {
    const field = this.getFormInput(fieldId) || 
                  this.getFormSelect(fieldId) || 
                  this.getFormTextarea(fieldId)
    expect(field).toHaveAttribute('required')
  }

  expectFormCleared() {
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach(input => {
      expect(input).toHaveValue('')
    })
  }
}