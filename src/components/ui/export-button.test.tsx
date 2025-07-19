import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ExportButton } from './export-button'
import { renderWithTheme } from '@/test/theme-test-utils'
import * as exportUtils from '@/lib/export-utils'

// Mock export utilities
vi.mock('@/lib/export-utils', () => ({
  exportToJSON: vi.fn(),
  exportToCSV: vi.fn(),
  exportPageHTML: vi.fn(),
}))

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

describe('ExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost/test' },
      writable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('renders single format button', () => {
      render(
        <ExportButton
          data={{ test: 'data' }}
          filename="test-export"
          formats={['json']}
        />
      )

      const button = screen.getByRole('button', { name: /Export/i })
      expect(button).toBeInTheDocument()
      // The Download icon should have these classes
      const icon = button.querySelector('svg')
      expect(icon).toHaveClass('h-4')
      expect(icon).toHaveClass('w-4')
    })

    it('renders dropdown for multiple formats', async () => {
      const user = userEvent.setup()
      
      render(
        <ExportButton
          data={{ test: 'data' }}
          filename="test-export"
          formats={['json', 'csv']}
          csvHeaders={{ test: 'Test' }}
        />
      )

      const trigger = screen.getByRole('button', { name: /Export/i })
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Export as JSON')).toBeInTheDocument()
        expect(screen.getByText('Export as CSV')).toBeInTheDocument()
      })
    })

    it('exports JSON format', async () => {
      const user = userEvent.setup()
      const testData = { id: 1, name: 'Test' }
      
      render(
        <ExportButton
          data={testData}
          filename="test-export"
          formats={['json']}
          pageType="test"
          pageTitle="Test Page"
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      expect(exportUtils.exportToJSON).toHaveBeenCalledWith(
        testData,
        'test-export',
        {
          pageUrl: 'http://localhost/test',
          pageTitle: 'Test Page',
          description: 'Exported test data from WCI@NYP'
        }
      )
    })

    it('exports CSV format', async () => {
      const user = userEvent.setup()
      const testData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]
      const headers = { id: 'ID', name: 'Name' }
      
      render(
        <ExportButton
          data={testData}
          filename="test-export"
          formats={['csv']}
          csvHeaders={headers}
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      expect(exportUtils.exportToCSV).toHaveBeenCalledWith(
        testData,
        headers,
        'test-export'
      )
    })

    it('exports HTML format', async () => {
      const user = userEvent.setup()
      const htmlContent = '<div>Test content</div>'
      
      render(
        <ExportButton
          data={{}}
          filename="test-export"
          formats={['html']}
          htmlContent={htmlContent}
          pageType="test"
          pageTitle="Test Page"
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      expect(exportUtils.exportPageHTML).toHaveBeenCalledWith(
        'test',
        'Test Page',
        htmlContent
      )
    })
  })

  describe('Async Data', () => {
    it('handles async data function', async () => {
      const user = userEvent.setup()
      const asyncData = vi.fn().mockResolvedValue({ async: 'data' })
      
      render(
        <ExportButton
          data={asyncData}
          filename="async-export"
          formats={['json']}
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      await waitFor(() => {
        expect(asyncData).toHaveBeenCalled()
        expect(exportUtils.exportToJSON).toHaveBeenCalledWith(
          { async: 'data' },
          'async-export',
          expect.any(Object)
        )
      })
    })

    it('handles async data errors', async () => {
      const user = userEvent.setup()
      const asyncData = vi.fn().mockRejectedValue(new Error('Async error'))
      const { logger } = await import('@/lib/logger')
      
      render(
        <ExportButton
          data={asyncData}
          filename="error-export"
          formats={['json']}
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          'Export failed',
          expect.any(Error),
          'ExportButton'
        )
      })
    })
  })

  describe('Format Filtering', () => {
    it('only shows CSV option when headers provided', async () => {
      const user = userEvent.setup()
      
      render(
        <ExportButton
          data={[]}
          filename="test"
          formats={['json', 'csv']}
          // No csvHeaders provided
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      await waitFor(() => {
        expect(screen.getByText('Export as JSON')).toBeInTheDocument()
        expect(screen.queryByText('Export as CSV')).not.toBeInTheDocument()
      })
    })

    it('only shows HTML option when content provided', async () => {
      const user = userEvent.setup()
      
      render(
        <ExportButton
          data={{}}
          filename="test"
          formats={['json', 'html']}
          // No htmlContent provided
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      await waitFor(() => {
        expect(screen.getByText('Export as JSON')).toBeInTheDocument()
        expect(screen.queryByText('Export as HTML')).not.toBeInTheDocument()
      })
    })
  })

  describe('Styling and Variants', () => {
    it('applies variant prop', () => {
      render(
        <ExportButton
          data={{}}
          filename="test"
          formats={['json']}
          variant="ghost"
        />
      )

      const button = screen.getByRole('button')
      // Check that the button has the ghost variant styles applied
      expect(button).toHaveClass('hover:bg-muted/50')
    })

    it('applies size prop', () => {
      render(
        <ExportButton
          data={{}}
          filename="test"
          formats={['json']}
          size="lg"
        />
      )

      const button = screen.getByRole('button')
      // Check that the button has large size styling
      expect(button).toHaveClass('h-11')
      expect(button).toHaveClass('px-8')
    })

    it('applies custom className', () => {
      render(
        <ExportButton
          data={{}}
          filename="test"
          formats={['json']}
          className="custom-export"
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-export')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      const { container } = renderWithTheme(
        <ExportButton
          data={[{ id: 1, name: 'Test Item' }]}
          filename="test-export"
          formats={['json', 'csv', 'html']}
          csvHeaders={{ id: 'ID', name: 'Name' }}
          htmlContent="<div>Test content</div>"
          pageType="test"
          pageTitle="Test Page"
        />,
        { theme: 'light' }
      )

      const button = screen.getByRole('button', { name: /Export/i })
      
      // Check button uses semantic colors
      expect(button.className).toContain('bg-primary')
      expect(button.className).toContain('text-primary-foreground')
      expect(button.className).toContain('hover:bg-primary/90')
      
      // Check icon uses semantic colors
      const icon = button.querySelector('svg')
      expect(icon).toBeInTheDocument()
      expect(icon?.parentElement?.className).not.toMatch(/text-gray-\d+/)
      
      // Open dropdown for multiple formats
      await user.click(button)
      
      await waitFor(() => {
        // Check dropdown uses semantic colors
        const dropdown = screen.getByText('Export as JSON').closest('[role="menu"]')
        expect(dropdown?.className).toContain('bg-popover')
        expect(dropdown?.className).toContain('text-popover-foreground')
        expect(dropdown?.className).toContain('border')
        
        // Check menu items use semantic hover states
        const menuItems = screen.getAllByRole('menuitem')
        menuItems.forEach(item => {
          expect(item.className).toContain('hover:bg-accent')
          expect(item.className).toContain('hover:text-accent-foreground')
        })
        
        // Check icons in dropdown items
        const icons = dropdown?.querySelectorAll('svg')
        icons?.forEach(icon => {
          expect(icon.className).toContain('h-4')
          expect(icon.className).toContain('w-4')
        })
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      const { container } = renderWithTheme(
        <ExportButton
          data={{ test: 'data' }}
          filename="dark-export"
          formats={['json']}
          variant="outline"
        />,
        { theme: 'dark' }
      )

      const button = screen.getByRole('button', { name: /Export/i })
      
      // Check outline variant uses semantic colors in dark mode
      expect(button.className).toContain('border')
      expect(button.className).toContain('bg-background')
      expect(button.className).toContain('hover:bg-accent')
      expect(button.className).toContain('hover:text-accent-foreground')
      
      // Single format should not show dropdown trigger
      expect(button.textContent).toContain('Export')
      
      // Icon should maintain visibility in dark mode
      const icon = button.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('maintains semantic colors for all button variants', () => {
      const variants = ['default', 'secondary', 'outline', 'ghost'] as const
      
      renderWithTheme(
        <div className="space-y-2">
          {variants.map(variant => (
            <ExportButton
              key={variant}
              data={{}}
              filename="test"
              formats={['json']}
              variant={variant}
            />
          ))}
        </div>,
        { theme: 'dark' }
      )
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(4)
      
      // Default variant
      expect(buttons[0].className).toContain('bg-primary')
      expect(buttons[0].className).toContain('text-primary-foreground')
      
      // Secondary variant
      expect(buttons[1].className).toContain('bg-secondary')
      expect(buttons[1].className).toContain('text-secondary-foreground')
      
      // Outline variant
      expect(buttons[2].className).toContain('border')
      expect(buttons[2].className).toContain('bg-background')
      
      // Ghost variant
      expect(buttons[3].className).toContain('hover:bg-accent')
      expect(buttons[3].className).toContain('hover:text-accent-foreground')
    })

    it('maintains semantic colors for all button sizes', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const
      
      renderWithTheme(
        <div className="space-x-2">
          {sizes.map(size => (
            <ExportButton
              key={size}
              data={{}}
              filename="test"
              formats={['json']}
              size={size}
            />
          ))}
        </div>,
        { theme: 'light' }
      )
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(4)
      
      // All sizes should maintain semantic colors
      buttons.forEach(button => {
        expect(button.className).toContain('bg-primary')
        expect(button.className).toContain('text-primary-foreground')
      })
      
      // Check size-specific classes
      expect(buttons[0].className).toContain('h-10') // default
      expect(buttons[1].className).toContain('h-9')  // sm
      expect(buttons[2].className).toContain('h-11') // lg
      expect(buttons[3].className).toContain('h-10') // icon
    })

    it('ensures no hard-coded colors', async () => {
      const user = userEvent.setup()
      const { container } = renderWithTheme(
        <ExportButton
          data={[{ id: 1, name: 'Item' }]}
          filename="test"
          formats={['json', 'csv', 'html']}
          csvHeaders={{ id: 'ID', name: 'Name' }}
          htmlContent="<div>Content</div>"
          pageType="test"
          className="custom-class"
        />,
        { theme: 'dark' }
      )
      
      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string') {
          // Should not contain hard-coded color values
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone)-\d+/)
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone)-\d+/)
          expect(classList).not.toMatch(/border-(gray|slate|zinc|neutral|stone)-\d+/)
        }
      })
      
      // Open dropdown to check more elements
      await user.click(screen.getByRole('button', { name: /Export/i }))
      
      await waitFor(() => {
        const dropdown = document.querySelector('[role="menu"]')
        const dropdownElements = dropdown?.querySelectorAll('*') || []
        dropdownElements.forEach(element => {
          const classList = element.className
          if (typeof classList === 'string') {
            expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone)-\d+/)
          }
        })
      })
    })

    it('maintains theme consistency with disabled state', () => {
      renderWithTheme(
        <div className="space-y-2">
          <ExportButton
            data={{}}
            filename="test"
            formats={['json']}
            disabled={true}
          />
          <ExportButton
            data={{}}
            filename="test"
            formats={['json']}
            variant="outline"
            disabled={true}
          />
        </div>,
        { theme: 'dark' }
      )
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeDisabled()
        expect(button.className).toContain('disabled:opacity-50')
        expect(button.className).toContain('disabled:pointer-events-none')
      })
    })

    it('works with custom styling while maintaining semantic colors', async () => {
      const user = userEvent.setup()
      const { container } = renderWithTheme(
        <div className="p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Export Data</h3>
            <ExportButton
              data={[{ id: 1, value: 100 }]}
              filename="report"
              formats={['json', 'csv']}
              csvHeaders={{ id: 'ID', value: 'Value' }}
              variant="outline"
              size="sm"
              className="ml-auto"
            />
          </div>
          <p className="text-muted-foreground">
            Click the export button to download your data
          </p>
        </div>,
        { theme: 'dark' }
      )
      
      // Card should use semantic bg-card
      const card = container.querySelector('.bg-card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('border')
      
      // Title should maintain semantic styling
      const title = screen.getByText('Export Data')
      expect(title.className).toContain('font-semibold')
      
      // Helper text should use semantic muted color
      const helperText = screen.getByText(/Click the export button/)
      expect(helperText.className).toContain('text-muted-foreground')
      
      // Button should maintain outline variant styling
      const button = screen.getByRole('button', { name: /Export/i })
      expect(button).toHaveClass('ml-auto')
      expect(button.className).toContain('border')
      expect(button.className).toContain('bg-background')
      
      // Test dropdown
      await user.click(button)
      
      await waitFor(() => {
        const dropdown = screen.getByText('Export as JSON').closest('[role="menu"]')
        expect(dropdown?.className).toContain('bg-popover')
      })
    })

    it('maintains semantic colors for export format icons', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <ExportButton
          data={{}}
          filename="test"
          formats={['json', 'csv', 'html']}
          csvHeaders={{ test: 'Test' }}
          htmlContent="<div>Test</div>"
          pageType="test"
        />,
        { theme: 'dark' }
      )
      
      await user.click(screen.getByRole('button', { name: /Export/i }))
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem')
        
        menuItems.forEach(item => {
          const icon = item.querySelector('svg')
          expect(icon).toBeInTheDocument()
          // Icons should inherit text color from parent
          expect(icon?.className).toContain('mr-2')
          expect(icon?.className).toContain('h-4')
          expect(icon?.className).toContain('w-4')
          
          // Parent item should handle text color semantically
          expect(item.className).toContain('flex')
          expect(item.className).toContain('items-center')
        })
      })
    })
  })

  describe('Icons', () => {
    it('shows correct icons in dropdown', async () => {
      const user = userEvent.setup()
      
      render(
        <ExportButton
          data={{}}
          filename="test"
          formats={['json', 'csv', 'html']}
          csvHeaders={{ test: 'Test' }}
          htmlContent="<div>Test</div>"
          pageType="test"
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      await waitFor(() => {
        // Check for icon presence by checking menu items
        const jsonItem = screen.getByText('Export as JSON').closest('div')
        const csvItem = screen.getByText('Export as CSV').closest('div')
        const htmlItem = screen.getByText('Export as HTML').closest('div')
        
        expect(jsonItem?.querySelector('svg')).toBeInTheDocument()
        expect(csvItem?.querySelector('svg')).toBeInTheDocument()
        expect(htmlItem?.querySelector('svg')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty data', async () => {
      const user = userEvent.setup()
      
      render(
        <ExportButton
          data={null}
          filename="empty"
          formats={['json']}
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      expect(exportUtils.exportToJSON).toHaveBeenCalledWith(
        null,
        'empty',
        expect.any(Object)
      )
    })

    it('handles non-array data for CSV', async () => {
      const user = userEvent.setup()
      
      render(
        <ExportButton
          data={{ not: 'array' }}
          filename="test"
          formats={['csv']}
          csvHeaders={{ test: 'Test' }}
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      expect(exportUtils.exportToCSV).not.toHaveBeenCalled()
    })

    it('uses default values when optional props missing', async () => {
      const user = userEvent.setup()
      document.title = 'Default Title'
      
      render(
        <ExportButton
          data={{}}
          filename="test"
          formats={['json']}
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      expect(exportUtils.exportToJSON).toHaveBeenCalledWith(
        {},
        'test',
        {
          pageUrl: 'http://localhost/test',
          pageTitle: 'Default Title',
          description: 'Exported page data from WCI@NYP'
        }
      )
    })
  })
})