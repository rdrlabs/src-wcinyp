import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FormsPage from './page'
import { axe } from 'jest-axe'
import formTemplatesData from '@/data/form-templates.json'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    <a href={href}>{children}</a>
}))

describe('Forms Page', () => {
  describe('Page Structure', () => {
    it('renders page title and description', () => {
      render(<FormsPage />)
      
      expect(screen.getByText('Form Generator')).toBeInTheDocument()
      expect(screen.getByText('Automate document creation and streamline the self-pay form process')).toBeInTheDocument()
    })

    it('displays action buttons', () => {
      render(<FormsPage />)
      
      expect(screen.getByRole('button', { name: 'Create New Form' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Import Template' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Bulk Export' })).toBeInTheDocument()
    })

    it('displays self-pay automation section', () => {
      render(<FormsPage />)
      
      expect(screen.getByText('Self-Pay Form Automation')).toBeInTheDocument()
      expect(screen.getByText(/Streamline the self-pay process/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Configure Self-Pay Workflow' })).toBeInTheDocument()
    })
  })

  describe('Form Templates Table', () => {
    it('renders table with correct headers', () => {
      render(<FormsPage />)
      
      expect(screen.getByRole('columnheader', { name: 'Form Name' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Fields' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Submissions' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Last Used' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()
    })

    it('displays correct number of templates', () => {
      render(<FormsPage />)
      
      const caption = screen.getByText(`${formTemplatesData.templates.length} form templates available for automation`)
      expect(caption).toBeInTheDocument()
      
      // Check actual rows (excluding header)
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(formTemplatesData.templates.length + 1) // +1 for header
    })

    it('displays template data correctly', () => {
      render(<FormsPage />)
      
      const firstTemplate = formTemplatesData.templates[0]
      
      // Find the row containing the first template
      const row = screen.getByText(firstTemplate.name).closest('tr')
      
      expect(within(row!).getByText(firstTemplate.name)).toBeInTheDocument()
      expect(within(row!).getByText(firstTemplate.category)).toBeInTheDocument()
      expect(within(row!).getByText(firstTemplate.fields.toString())).toBeInTheDocument()
      expect(within(row!).getByText(firstTemplate.submissions.toString())).toBeInTheDocument()
      expect(within(row!).getByText(firstTemplate.lastUsed)).toBeInTheDocument()
      expect(within(row!).getByText(firstTemplate.status)).toBeInTheDocument()
    })

    it('displays category badges with correct styling', () => {
      render(<FormsPage />)
      
      const categoryBadges = screen.getAllByText(formTemplatesData.templates[0].category)
      const firstBadge = categoryBadges[0]
      
      expect(firstBadge).toHaveClass('bg-purple-50', 'text-purple-700')
    })

    it('displays status badges with correct styling for active status', () => {
      render(<FormsPage />)
      
      const activeTemplate = formTemplatesData.templates.find(t => t.status === 'active')
      if (activeTemplate) {
        // Find the row with the active template
        const row = screen.getByText(activeTemplate.name).closest('tr')
        const activeBadge = within(row!).getByText('active')
        expect(activeBadge).toHaveClass('bg-green-50', 'text-green-700')
      }
    })

    it('displays status badges with correct styling for inactive status', () => {
      render(<FormsPage />)
      
      const inactiveTemplate = formTemplatesData.templates.find(t => t.status !== 'active')
      if (inactiveTemplate) {
        const inactiveBadge = screen.getByText(inactiveTemplate.status)
        expect(inactiveBadge).toHaveClass('bg-yellow-50', 'text-yellow-700')
      }
    })
  })

  describe('Template Actions', () => {
    it('renders action buttons for each template', () => {
      render(<FormsPage />)
      
      const firstTemplate = formTemplatesData.templates[0]
      const row = screen.getByText(firstTemplate.name).closest('tr')
      
      within(row!).getByRole('link', { name: 'Edit' })
      within(row!).getByRole('link', { name: 'Preview' })
      within(row!).getByRole('button', { name: 'Clone' })
    })

    it('links to correct edit URL', () => {
      render(<FormsPage />)
      
      const firstTemplate = formTemplatesData.templates[0]
      const row = screen.getByText(firstTemplate.name).closest('tr')
      const editLink = within(row!).getByRole('link', { name: 'Edit' })
      
      expect(editLink).toHaveAttribute('href', `/forms/${firstTemplate.id}`)
    })

    it('links to correct preview URL', () => {
      render(<FormsPage />)
      
      const firstTemplate = formTemplatesData.templates[0]
      const row = screen.getByText(firstTemplate.name).closest('tr')
      const previewLink = within(row!).getByRole('link', { name: 'Preview' })
      
      expect(previewLink).toHaveAttribute('href', `/forms/${firstTemplate.id}`)
    })
  })

  describe('Responsive Design', () => {
    it('uses container with responsive padding', () => {
      const { container } = render(<FormsPage />)
      
      const wrapper = container.querySelector('.container.mx-auto')
      expect(wrapper).toBeInTheDocument()
    })

    it('action buttons are displayed in flex layout', () => {
      render(<FormsPage />)
      
      const buttonContainer = screen.getByRole('button', { name: 'Create New Form' }).parentElement
      expect(buttonContainer).toHaveClass('flex', 'gap-4')
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<FormsPage />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('table has proper caption', () => {
      render(<FormsPage />)
      
      const caption = screen.getByText(/form templates available for automation/)
      expect(caption.tagName).toBe('CAPTION')
    })

    it('all interactive elements are keyboard accessible', () => {
      render(<FormsPage />)
      
      // All buttons should be focusable
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveProperty('tabIndex', 0)
      })
      
      // All links should be focusable
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveProperty('tabIndex', 0)
      })
    })
  })
})