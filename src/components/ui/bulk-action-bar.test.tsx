import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BulkActionBar } from './bulk-action-bar'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('BulkActionBar', () => {
  describe('Basic Functionality', () => {
    it('renders nothing when no items selected', () => {
      const { container } = render(
        <BulkActionBar
          selectedCount={0}
          onClearSelection={() => {}}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('renders when items are selected', () => {
      render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByText('1 item selected')).toBeInTheDocument()
    })

    it('shows correct plural for multiple items', () => {
      render(
        <BulkActionBar
          selectedCount={5}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByText('5 items selected')).toBeInTheDocument()
    })

    it('calls onClearSelection when clear button clicked', async () => {
      const user = userEvent.setup()
      const handleClear = vi.fn()
      
      render(
        <BulkActionBar
          selectedCount={3}
          onClearSelection={handleClear}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Clear selection' }))
      expect(handleClear).toHaveBeenCalled()
    })
  })

  describe('Action Buttons', () => {
    it('shows download button when onDownload provided', () => {
      render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
          onDownload={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /Download/ })).toBeInTheDocument()
    })

    it('shows archive button when onArchive provided', () => {
      render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
          onArchive={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /Archive/ })).toBeInTheDocument()
    })

    it('shows delete button when onDelete provided', () => {
      render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
          onDelete={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument()
    })

    it('calls action handlers when buttons clicked', async () => {
      const user = userEvent.setup()
      const handleDownload = vi.fn()
      const handleArchive = vi.fn()
      const handleDelete = vi.fn()
      
      render(
        <BulkActionBar
          selectedCount={2}
          onClearSelection={() => {}}
          onDownload={handleDownload}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      )

      await user.click(screen.getByRole('button', { name: /Download/ }))
      expect(handleDownload).toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: /Archive/ }))
      expect(handleArchive).toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: /Delete/ }))
      expect(handleDelete).toHaveBeenCalled()
    })
  })

  describe('Dropdown Menu', () => {
    it('shows more actions dropdown', async () => {
      const user = userEvent.setup()
      
      render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
        />
      )

      const moreButton = screen.getByRole('button', { name: /More/ })
      expect(moreButton).toBeInTheDocument()

      await user.click(moreButton)

      await waitFor(() => {
        expect(screen.getByText('Export as CSV')).toBeInTheDocument()
        expect(screen.getByText('Export as PDF')).toBeInTheDocument()
        expect(screen.getByText('Move to folder')).toBeInTheDocument()
        expect(screen.getByText('Add tags')).toBeInTheDocument()
      })
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
          className="custom-class"
        />
      )

      const bar = container.firstChild
      expect(bar).toHaveClass('custom-class')
    })

    it('has fixed positioning styles', () => {
      const { container } = render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
        />
      )

      const bar = container.firstChild
      expect(bar).toHaveClass('fixed')
      expect(bar).toHaveClass('bottom-6')
      expect(bar).toHaveClass('left-1/2')
      expect(bar).toHaveClass('-translate-x-1/2')
      expect(bar).toHaveClass('z-50')
    })

    it('has slide-in animation', () => {
      const { container } = render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
        />
      )

      const bar = container.firstChild
      expect(bar).toHaveClass('animate-in')
      expect(bar).toHaveClass('slide-in-from-bottom-4')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <BulkActionBar
          selectedCount={3}
          onClearSelection={() => {}}
          onDownload={() => {}}
          onDelete={() => {}}
          onArchive={() => {}}
        />,
        { theme: 'light' }
      )

      // Check container uses semantic colors
      const bar = container.firstChild as HTMLElement
      expect(bar).toBeInTheDocument()
      expect(bar.className).toContain('bg-background')
      expect(bar.className).toContain('border')
      expect(bar.className).toContain('shadow-lg')
      
      // Check selected count text uses semantic colors
      const selectedText = screen.getByText('3 items selected')
      expect(selectedText.className).toContain('text-sm')
      expect(selectedText.className).toContain('font-medium')
      
      // Check action buttons use semantic colors
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        if (button.textContent?.includes('Delete')) {
          expect(button.className).toContain('hover:bg-destructive/90')
        } else if (!button.getAttribute('aria-label')?.includes('Clear')) {
          expect(button.className).toContain('hover:bg-primary/90')
        }
      })
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <BulkActionBar
          selectedCount={5}
          onClearSelection={() => {}}
          onArchive={() => {}}
          onDownload={() => {}}
        />,
        { theme: 'dark' }
      )

      // Check container maintains semantic colors in dark mode
      const bar = container.firstChild as HTMLElement
      expect(bar.className).toContain('bg-background')
      expect(bar.className).toContain('border')
      
      // Check all text maintains readability
      const selectedText = screen.getByText('5 items selected')
      expect(selectedText.className).toContain('font-medium')
      
      // Check button group styling
      const buttonGroup = container.querySelector('.flex.items-center.gap-2')
      expect(buttonGroup).toBeInTheDocument()
    })

    it('maintains semantic colors for all action states', async () => {
      const user = userEvent.setup()
      
      const { container } = renderWithTheme(
        <div className="space-y-4">
          {/* Single selection */}
          <BulkActionBar
            selectedCount={1}
            onClearSelection={() => {}}
            onDownload={() => {}}
          />
          
          {/* Multiple selection with all actions */}
          <BulkActionBar
            selectedCount={10}
            onClearSelection={() => {}}
            onDownload={() => {}}
            onArchive={() => {}}
            onDelete={() => {}}
          />
          
          {/* Large selection count */}
          <BulkActionBar
            selectedCount={999}
            onClearSelection={() => {}}
            onDelete={() => {}}
          />
        </div>,
        { theme: 'dark' }
      )
      
      // Check all bars use consistent styling
      const bars = container.querySelectorAll('[class*="fixed bottom-4"]')
      expect(bars).toHaveLength(3)
      bars.forEach(bar => {
        expect(bar.className).toContain('bg-background')
        expect(bar.className).toContain('border')
      })
      
      // Check delete buttons use destructive variant
      const deleteButtons = screen.getAllByText(/Delete/)
      deleteButtons.forEach(button => {
        expect(button.className).toContain('bg-destructive')
        expect(button.className).toContain('text-destructive-foreground')
      })
      
      // Check other action buttons use primary variant
      const downloadButtons = screen.getAllByText(/Download/)
      downloadButtons.forEach(button => {
        expect(button.className).toContain('bg-primary')
        expect(button.className).toContain('text-primary-foreground')
      })
      
      // Check clear buttons use ghost variant
      const clearButtons = screen.getAllByRole('button', { name: 'Clear selection' })
      clearButtons.forEach(button => {
        expect(button.className).toContain('hover:bg-accent')
        expect(button.className).toContain('hover:text-accent-foreground')
      })
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <BulkActionBar
          selectedCount={25}
          onClearSelection={() => {}}
          onDownload={() => {}}
          onArchive={() => {}}
          onDelete={() => {}}
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
      
      // Check specific elements use semantic colors
      const selectedText = screen.getByText('25 items selected')
      expect(selectedText.className).not.toMatch(/text-gray-\d+/)
      
      const separator = container.querySelector('hr')
      expect(separator?.className).toContain('bg-border')
    })

    it('maintains theme consistency with animations', async () => {
      const user = userEvent.setup()
      
      // Start with no selection
      const { rerender } = renderWithTheme(
        <div style={{ height: '200px' }}>
          <BulkActionBar
            selectedCount={0}
            onClearSelection={() => {}}
          />
        </div>,
        { theme: 'dark' }
      )
      
      // Should not render when count is 0
      expect(screen.queryByText(/items? selected/)).not.toBeInTheDocument()
      
      // Update to show selection
      rerender(
        <div style={{ height: '200px' }}>
          <BulkActionBar
            selectedCount={3}
            onClearSelection={() => {}}
            onDownload={() => {}}
          />
        </div>
      )
      
      // Bar should appear with animation classes
      await waitFor(() => {
        const bar = screen.getByText('3 items selected').closest('[class*="fixed"]')
        expect(bar).toBeInTheDocument()
        expect(bar?.className).toContain('animate-in')
        expect(bar?.className).toContain('slide-in-from-bottom')
        expect(bar?.className).toContain('fade-in')
      })
      
      // Check styling is maintained during animation
      const bar = screen.getByText('3 items selected').closest('[class*="fixed"]')
      expect(bar?.className).toContain('bg-background')
      expect(bar?.className).toContain('border')
    })

    it('works with custom styling while maintaining semantic colors', () => {
      const { container } = renderWithTheme(
        <div className="relative h-[400px] bg-muted/20 rounded-lg overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Data Table</h3>
            <p className="text-muted-foreground">Table content here...</p>
          </div>
          
          <BulkActionBar
            selectedCount={7}
            onClearSelection={() => {}}
            onDownload={() => {}}
            onArchive={() => {}}
            onDelete={() => {}}
          />
        </div>,
        { theme: 'dark' }
      )
      
      // Check bulk action bar maintains semantic colors in custom container
      const bar = screen.getByText('7 items selected').closest('[class*="fixed"]')
      expect(bar?.className).toContain('bg-background')
      expect(bar?.className).toContain('border')
      expect(bar?.className).toContain('shadow-lg')
      
      // Check it doesn't inherit parent styles
      const parentContainer = container.querySelector('.bg-muted\\/20')
      expect(parentContainer).toBeInTheDocument()
      expect(bar?.className).not.toContain('bg-muted')
      
      // Check action buttons maintain their semantic colors
      const deleteButton = screen.getByText(/Delete/)
      expect(deleteButton.className).toContain('bg-destructive')
      
      const archiveButton = screen.getByText(/Archive/)
      expect(archiveButton.className).toContain('bg-primary')
    })
  })

  describe('Common Use Cases', () => {
    it('renders minimal bar with only clear action', () => {
      render(
        <BulkActionBar
          selectedCount={10}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByText('10 items selected')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /More/ })).toBeInTheDocument()
    })

    it('renders full bar with all actions', () => {
      render(
        <BulkActionBar
          selectedCount={5}
          onClearSelection={() => {}}
          onDownload={() => {}}
          onArchive={() => {}}
          onDelete={() => {}}
        />
      )

      expect(screen.getByRole('button', { name: /Download/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Archive/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument()
    })

    it('updates count dynamically', () => {
      const { rerender } = render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByText('1 item selected')).toBeInTheDocument()

      rerender(
        <BulkActionBar
          selectedCount={5}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByText('5 items selected')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has accessible clear button', () => {
      render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
        />
      )

      const clearButton = screen.getByRole('button', { name: 'Clear selection' })
      expect(clearButton).toBeInTheDocument()
    })

    it('maintains focus management', async () => {
      const user = userEvent.setup()
      
      render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
          onDownload={() => {}}
        />
      )

      const downloadButton = screen.getByRole('button', { name: /Download/ })
      await user.click(downloadButton)
      
      expect(document.activeElement).toBe(downloadButton)
    })
  })

  describe('Edge Cases', () => {
    it('handles zero selected count', () => {
      const { container } = render(
        <BulkActionBar
          selectedCount={0}
          onClearSelection={() => {}}
          onDownload={() => {}}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('handles large selected counts', () => {
      render(
        <BulkActionBar
          selectedCount={999}
          onClearSelection={() => {}}
        />
      )

      expect(screen.getByText('999 items selected')).toBeInTheDocument()
    })

    it('works without any action handlers', () => {
      render(
        <BulkActionBar
          selectedCount={1}
          onClearSelection={() => {}}
        />
      )

      // Should only show clear button and more menu
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2) // Clear and More
    })
  })
})