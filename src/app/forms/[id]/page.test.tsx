import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FormBuilderPage, { generateStaticParams } from './page'
import formTemplatesData from '@/data/form-templates.json'

// Mock the FormBuilder component
vi.mock('@/components/FormBuilder', () => ({
  default: ({ template }: { template: { name: string; description: string; fields: number } }) => (
    <div data-testid="form-builder">
      <h1>{template.name}</h1>
      <p>{template.description}</p>
      <p>Fields: {template.fields}</p>
    </div>
  ),
}))

// Mock notFound
const mockNotFound = vi.fn()
vi.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

describe('Forms Dynamic Route Page', () => {
  beforeEach(() => {
    mockNotFound.mockClear()
  })

  describe('Valid Form ID', () => {
    it('renders form template when valid ID is provided', async () => {
      const validTemplate = formTemplatesData.templates[0]
      const params = Promise.resolve({ id: validTemplate.id.toString() })
      
      // Render the async component
      const Component = await FormBuilderPage({ params })
      render(Component)
      
      // Check that FormBuilder received the correct template
      expect(screen.getByTestId('form-builder')).toBeInTheDocument()
      expect(screen.getByText(validTemplate.name)).toBeInTheDocument()
      expect(screen.getByText(validTemplate.description)).toBeInTheDocument()
      expect(screen.getByText(`Fields: ${validTemplate.fields}`)).toBeInTheDocument()
    })

    it('renders different templates based on ID', async () => {
      const secondTemplate = formTemplatesData.templates[1]
      const params = Promise.resolve({ id: secondTemplate.id.toString() })
      
      const Component = await FormBuilderPage({ params })
      render(Component)
      
      expect(screen.getByText(secondTemplate.name)).toBeInTheDocument()
      expect(screen.getByText(secondTemplate.description)).toBeInTheDocument()
    })
  })

  describe('Invalid Form ID', () => {
    it('calls notFound when template ID does not exist', async () => {
      const params = Promise.resolve({ id: '999' })
      
      await FormBuilderPage({ params })
      
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    })

    it('calls notFound for non-numeric ID', async () => {
      const params = Promise.resolve({ id: 'abc' })
      
      await FormBuilderPage({ params })
      
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    })
  })

  describe('Static Params Generation', () => {
    it('generates params for all templates', async () => {
      const staticParams = await generateStaticParams()
      
      // Should generate params for each template
      expect(staticParams).toHaveLength(formTemplatesData.templates.length)
      
      // Each param should have the correct structure
      staticParams.forEach((param, index) => {
        expect(param).toEqual({
          id: formTemplatesData.templates[index].id.toString()
        })
      })
    })

    it('generates string IDs for static params', async () => {
      const staticParams = await generateStaticParams()
      
      // All IDs should be strings
      staticParams.forEach(param => {
        expect(typeof param.id).toBe('string')
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles ID "0"', async () => {
      const params = Promise.resolve({ id: '0' })
      
      await FormBuilderPage({ params })
      
      // Template with ID 0 doesn't exist
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    })

    it('handles negative ID', async () => {
      const params = Promise.resolve({ id: '-1' })
      
      await FormBuilderPage({ params })
      
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    })

    it('handles decimal ID', async () => {
      const params = Promise.resolve({ id: '1.5' })
      
      await FormBuilderPage({ params })
      
      // Number(1.5) = 1.5, which won't match any template ID
      expect(mockNotFound).toHaveBeenCalledTimes(1)
    })
  })
})