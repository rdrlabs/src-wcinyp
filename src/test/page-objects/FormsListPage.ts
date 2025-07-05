import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * Page Object Model for Forms List
 * Abstracts form template interactions
 */
export class FormsListPage {
  // Form template card helpers
  getFormTemplateCard(templateId: number) {
    return screen.getByTestId(`form-template-${templateId}`)
  }

  getPreviewButton(templateId: number) {
    return screen.getByTestId(`preview-button-${templateId}`)
  }

  getFillButton(templateId: number) {
    return screen.getByTestId(`fill-button-${templateId}`)
  }

  // Actions
  async previewForm(templateId: number) {
    const user = userEvent.setup()
    await user.click(this.getPreviewButton(templateId))
  }

  async fillForm(templateId: number) {
    const user = userEvent.setup()
    await user.click(this.getFillButton(templateId))
  }

  // Category helpers
  getCategorySection(categoryName: string) {
    const heading = screen.getByRole('heading', { 
      name: categoryName.replace('-', ' '), 
      level: 3 
    })
    return heading.parentElement
  }

  getFormsInCategory(categoryName: string) {
    const section = this.getCategorySection(categoryName)
    if (!section) return []
    
    return within(section).getAllByRole('article')
  }

  // Form details helpers
  getFormDetails(templateId: number) {
    const card = this.getFormTemplateCard(templateId)
    if (!card) return null

    const title = within(card).getByRole('heading')
    const description = within(card).getByText(/^[A-Z]/)
    const fieldCount = within(card).getByText(/\d+ fields/)
    const submissionCount = within(card).getByText(/\d+ submissions/)

    return {
      name: title.textContent || '',
      description: description.textContent || '',
      fields: parseInt(fieldCount.textContent?.match(/\d+/)?.[0] || '0'),
      submissions: parseInt(submissionCount.textContent?.match(/\d+/)?.[0] || '0')
    }
  }

  // Assertions
  expectFormTemplateVisible(templateName: string) {
    expect(screen.getByText(templateName)).toBeInTheDocument()
  }

  expectCategoryExists(categoryName: string) {
    const formattedName = categoryName.replace('-', ' ')
    expect(screen.getByRole('heading', { name: formattedName, level: 3 })).toBeInTheDocument()
  }

  expectFormCount(count: number) {
    const forms = screen.getAllByRole('article')
    expect(forms).toHaveLength(count)
  }

  expectFormCountInCategory(categoryName: string, count: number) {
    const forms = this.getFormsInCategory(categoryName)
    expect(forms).toHaveLength(count)
  }

  expectFormHasFields(templateId: number, fieldCount: number) {
    const details = this.getFormDetails(templateId)
    expect(details?.fields).toBe(fieldCount)
  }

  expectFormHasSubmissions(templateId: number, submissionCount: number) {
    const details = this.getFormDetails(templateId)
    expect(details?.submissions).toBe(submissionCount)
  }

  // Utility methods
  getAllFormTemplates() {
    return screen.getAllByRole('article')
  }

  getAllCategories() {
    return screen.getAllByRole('heading', { level: 3 })
      .map(heading => heading.textContent || '')
      .filter(text => text.length > 0)
  }

  findFormByName(formName: string) {
    const heading = screen.getByText(formName)
    return heading.closest('[data-testid^="form-template-"]')
  }
}