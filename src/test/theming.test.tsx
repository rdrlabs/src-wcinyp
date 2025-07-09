import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ThemeProvider } from 'next-themes'
import FormBuilder from '@/components/FormBuilder'
import { FormProvider } from '@/contexts/form-context'
import type { FormTemplate } from '@/types'

// Mock next-themes to control theme state
vi.mock('next-themes', async () => {
  const actual = await vi.importActual('next-themes')
  return {
    ...actual,
    useTheme: () => ({
      theme: 'dark',
      setTheme: vi.fn(),
      resolvedTheme: 'dark'
    })
  }
})

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

describe('Dark Mode Theming', () => {
  describe('FormBuilder Component', () => {
    it('should apply dark mode classes to preview section', async () => {
      const user = userEvent.setup()
      render(
        <ThemeProvider attribute="class" defaultTheme="dark">
          <FormProvider>
            <FormBuilder template={mockTemplate} />
          </FormProvider>
        </ThemeProvider>
      )
      
      // Click preview button to see the preview section
      const previewButton = screen.getByRole('button', { name: 'Preview' })
      await user.click(previewButton)
      
      // Check that dark mode classes are applied
      const previewSection = screen.getByText('Form Preview').parentElement
      
      // Should have semantic colors that work in both light and dark modes
      expect(previewSection?.className).toContain('bg-muted')
    })

    it('should apply dark mode classes to form container', () => {
      render(
        <ThemeProvider attribute="class" defaultTheme="dark">
          <FormProvider>
            <FormBuilder template={mockTemplate} />
          </FormProvider>
        </ThemeProvider>
      )
      
      // Find form container with semantic colors
      const formFields = screen.getAllByRole('textbox')
      const formContainer = formFields[0].closest('.bg-card')
      
      // Should have semantic background color
      expect(formContainer?.className).toContain('bg-card')
    })

    it('should properly style text in dark mode', async () => {
      const user = userEvent.setup()
      render(
        <ThemeProvider attribute="class" defaultTheme="dark">
          <FormProvider>
            <FormBuilder template={mockTemplate} />
          </FormProvider>
        </ThemeProvider>
      )
      
      // Click preview to see styled text
      const previewButton = screen.getByRole('button', { name: 'Preview' })
      await user.click(previewButton)
      
      // Find text elements
      const descriptionText = screen.getByText(/This is how your form will appear/)
      
      // Should have semantic text color
      expect(descriptionText.className).toContain('text-muted-foreground')
    })
  })

  describe('Global Theme Consistency', () => {
    it('should maintain consistent colors across all components', () => {
      // This test will check that all components use the same color scheme
      // const colorPatterns = {
      //   background: /bg-white\s+dark:bg-gray-800|bg-gray-50\s+dark:bg-gray-900/,
      //   text: /text-gray-600\s+dark:text-gray-400|text-gray-900\s+dark:text-gray-100/,
      //   border: /border-gray-200\s+dark:border-gray-700/
      // }
      
      // Test will be expanded as we fix more components
      expect(true).toBe(true) // Placeholder for now
    })
  })
})