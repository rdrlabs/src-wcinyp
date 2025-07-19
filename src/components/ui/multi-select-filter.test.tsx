import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelectFilter, type FilterOption } from './multi-select-filter'
import { renderWithTheme } from '@/test/theme-test-utils'

const mockOptions: FilterOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2', count: 5 },
  { value: 'option3', label: 'Option 3', icon: <span>🎯</span>, count: 10 },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5', count: 0 },
]

describe('MultiSelectFilter', () => {
  describe('Basic Functionality', () => {
    it('renders with placeholder when no selection', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByText('Select filters...')).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
          placeholder="Choose categories..."
        />
      )

      expect(screen.getByText('Choose categories...')).toBeInTheDocument()
    })

    it('shows selected count when items are selected', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1', 'option2']}
          onSelectedChange={vi.fn()}
        />
      )

      expect(screen.getByText('2 filters selected')).toBeInTheDocument()
    })

    it('shows singular form for single selection', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1']}
          onSelectedChange={vi.fn()}
        />
      )

      expect(screen.getByText('1 filter selected')).toBeInTheDocument()
    })

    it('displays selected items as badges', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1', 'option3']}
          onSelectedChange={vi.fn()}
        />
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
      expect(screen.getByText('🎯')).toBeInTheDocument()
    })
  })

  describe('Dropdown Interaction', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search filters...')).toBeInTheDocument()
        mockOptions.forEach(option => {
          expect(screen.getByText(option.label)).toBeInTheDocument()
        })
      })
    })

    it('toggles item selection on click', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={handleChange}
        />
      )

      await user.click(screen.getByRole('combobox'))
      
      const option1 = await screen.findByText('Option 1')
      await user.click(option1)

      expect(handleChange).toHaveBeenCalledWith(['option1'])
    })

    it('removes item from selection when already selected', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1']}
          onSelectedChange={handleChange}
        />
      )

      await user.click(screen.getByRole('combobox'))
      
      const option1 = await screen.findByText('Option 1')
      await user.click(option1)

      expect(handleChange).toHaveBeenCalledWith([])
    })

    it('shows check marks for selected items', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1', 'option3']}
          onSelectedChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const checkmarks = container.querySelectorAll('.opacity-100')
        expect(checkmarks.length).toBeGreaterThanOrEqual(2)
      })
    })
  })

  describe('Search Functionality', () => {
    it('filters options based on search input', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))
      
      const searchInput = screen.getByPlaceholderText('Search filters...')
      await user.type(searchInput, '3')

      await waitFor(() => {
        expect(screen.getByText('Option 3')).toBeInTheDocument()
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument()
      })
    })

    it('shows empty message when no search results', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))
      
      const searchInput = screen.getByPlaceholderText('Search filters...')
      await user.type(searchInput, 'xyz')

      await waitFor(() => {
        expect(screen.getByText('No results found.')).toBeInTheDocument()
      })
    })

    it('shows custom empty text', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
          emptyText="No matches found"
        />
      )

      await user.click(screen.getByRole('combobox'))
      
      const searchInput = screen.getByPlaceholderText('Search filters...')
      await user.type(searchInput, 'xyz')

      await waitFor(() => {
        expect(screen.getByText('No matches found')).toBeInTheDocument()
      })
    })
  })

  describe('Badge Management', () => {
    it('removes item when clicking X on badge', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1', 'option2']}
          onSelectedChange={handleChange}
        />
      )

      const removeButtons = screen.getAllByRole('button', { name: '' })
      // Click the first X button (should be for option1)
      await user.click(removeButtons[0])

      expect(handleChange).toHaveBeenCalledWith(['option2'])
    })

    it('shows clear all button when multiple items selected', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1', 'option2']}
          onSelectedChange={vi.fn()}
        />
      )

      expect(screen.getByText('Clear all')).toBeInTheDocument()
    })

    it('hides clear all button for single selection', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1']}
          onSelectedChange={vi.fn()}
        />
      )

      expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
    })

    it('clears all selections when clicking clear all', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1', 'option2', 'option3']}
          onSelectedChange={handleChange}
        />
      )

      await user.click(screen.getByText('Clear all'))

      expect(handleChange).toHaveBeenCalledWith([])
    })
  })

  describe('Visual Features', () => {
    it('displays option icons', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('🎯')).toBeInTheDocument()
      })
    })

    it('displays option counts', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
        expect(screen.getByText('0')).toBeInTheDocument()
      })
    })

    it('shows icon in badge for selected items with icons', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option3']}
          onSelectedChange={vi.fn()}
        />
      )

      const badges = screen.getAllByText('🎯')
      expect(badges.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty options array', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={[]}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('No results found.')).toBeInTheDocument()
      })
    })

    it('ignores selected values not in options', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1', 'nonexistent']}
          onSelectedChange={vi.fn()}
        />
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.queryByText('nonexistent')).not.toBeInTheDocument()
    })

    it('handles rapid selection/deselection', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={handleChange}
        />
      )

      await user.click(screen.getByRole('combobox'))
      
      const option1 = await screen.findByText('Option 1')
      
      // Rapid clicks
      await user.click(option1)
      await user.click(option1)
      await user.click(option1)

      expect(handleChange).toHaveBeenCalledTimes(3)
    })

    it('maintains state when dropdown closes and reopens', async () => {
      const user = userEvent.setup()
      const { rerender } = render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1']}
          onSelectedChange={vi.fn()}
        />
      )

      // Open dropdown
      await user.click(screen.getByRole('combobox'))
      expect(await screen.findByText('Option 1')).toBeInTheDocument()

      // Close by clicking outside
      await user.click(document.body)

      // Reopen
      await user.click(screen.getByRole('combobox'))
      
      // Check mark should still be visible for option1
      const option1Item = screen.getByText('Option 1').closest('[role="option"]')
      const checkmark = option1Item?.querySelector('.opacity-100')
      expect(checkmark).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('updates aria-expanded when opened', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
        />
      )

      const trigger = screen.getByRole('combobox')
      trigger.focus()
      
      // Open with Enter
      await user.keyboard('{Enter}')
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search filters...')).toBeInTheDocument()
      })
    })
  })

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={[]}
          onSelectedChange={vi.fn()}
          className="custom-filter"
        />
      )

      const container = screen.getByRole('combobox').parentElement?.parentElement
      expect(container).toHaveClass('custom-filter')
    })

    it('maintains consistent badge styling', () => {
      render(
        <MultiSelectFilter
          options={mockOptions}
          selected={['option1', 'option2']}
          onSelectedChange={vi.fn()}
        />
      )

      const badges = screen.getAllByText(/Option [12]/)
      badges.forEach(badge => {
        const badgeElement = badge.closest('.gap-1.pr-1')
        expect(badgeElement).toHaveClass('gap-1')
        expect(badgeElement).toHaveClass('pr-1')
      })
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      const options: FilterOption[] = [
        { value: 'active', label: 'Active', count: 12 },
        { value: 'pending', label: 'Pending', count: 5 },
        { value: 'completed', label: 'Completed', count: 28 },
        { value: 'archived', label: 'Archived', icon: <span>📁</span> },
      ]
      
      const { container } = renderWithTheme(
        <MultiSelectFilter
          options={options}
          selected={['active', 'pending']}
          onSelectedChange={vi.fn()}
          placeholder="Filter by status"
        />,
        { theme: 'light' }
      )
      
      // Check trigger button uses semantic colors
      const trigger = screen.getByRole('combobox')
      expect(trigger.className).toContain('border')
      expect(trigger.className).toContain('bg-background')
      expect(trigger.className).toContain('hover:bg-accent')
      expect(trigger.className).toContain('hover:text-accent-foreground')
      
      // Check selected badges use semantic colors
      const badges = screen.getAllByText(/Active|Pending/)
      badges.forEach(badge => {
        const badgeElement = badge.closest('[class*="bg-"]')
        expect(badgeElement?.className).toContain('bg-secondary')
        expect(badgeElement?.className).toContain('text-secondary-foreground')
      })
      
      // Open dropdown
      await user.click(trigger)
      
      await waitFor(() => {
        // Check search input uses semantic colors
        const searchInput = screen.getByPlaceholderText('Search filters...')
        expect(searchInput.className).toContain('bg-background')
        
        // Check option counts use muted color
        const counts = screen.getAllByText(/\d+/)
        counts.forEach(count => {
          if (count.className) {
            expect(count.className).toContain('text-muted-foreground')
          }
        })
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      const options: FilterOption[] = [
        { value: 'high', label: 'High Priority', count: 3, icon: <span>🔴</span> },
        { value: 'medium', label: 'Medium Priority', count: 7 },
        { value: 'low', label: 'Low Priority', count: 15 },
      ]
      
      const { container } = renderWithTheme(
        <MultiSelectFilter
          options={options}
          selected={['high']}
          onSelectedChange={vi.fn()}
        />,
        { theme: 'dark' }
      )
      
      // Check trigger maintains semantic colors in dark mode
      const trigger = screen.getByRole('combobox')
      expect(trigger.className).toContain('bg-background')
      
      // Check badge maintains semantic colors
      const badge = screen.getByText('High Priority')
      const badgeElement = badge.closest('[class*="bg-"]')
      expect(badgeElement?.className).toContain('bg-secondary')
      
      // Open dropdown
      await user.click(trigger)
      
      await waitFor(() => {
        // Check dropdown content uses semantic colors
        const dropdown = document.querySelector('[role="listbox"]')
        expect(dropdown?.className).toContain('bg-popover')
        expect(dropdown?.className).toContain('text-popover-foreground')
        
        // Check options maintain hover states
        const options = screen.getAllByRole('option')
        options.forEach(option => {
          expect(option.className).toContain('hover:bg-accent')
          expect(option.className).toContain('hover:text-accent-foreground')
        })
      })
    })

    it('maintains semantic colors for all filter states', async () => {
      const user = userEvent.setup()
      const options: FilterOption[] = [
        { value: 'opt1', label: 'Option 1', count: 5 },
        { value: 'opt2', label: 'Option 2', count: 0 },
        { value: 'opt3', label: 'Option 3' },
        { value: 'opt4', label: 'Option 4', icon: <span>⭐</span>, count: 12 },
      ]
      
      renderWithTheme(
        <div className="space-y-4">
          {/* Empty state */}
          <MultiSelectFilter
            options={options}
            selected={[]}
            onSelectedChange={vi.fn()}
            placeholder="No filters selected"
          />
          
          {/* Single selection */}
          <MultiSelectFilter
            options={options}
            selected={['opt1']}
            onSelectedChange={vi.fn()}
          />
          
          {/* Multiple selections */}
          <MultiSelectFilter
            options={options}
            selected={['opt1', 'opt3', 'opt4']}
            onSelectedChange={vi.fn()}
          />
          
          {/* All selected */}
          <MultiSelectFilter
            options={options}
            selected={['opt1', 'opt2', 'opt3', 'opt4']}
            onSelectedChange={vi.fn()}
          />
        </div>,
        { theme: 'dark' }
      )
      
      // Check placeholder text uses muted color
      const placeholder = screen.getByText('No filters selected')
      expect(placeholder.className).toContain('text-muted-foreground')
      
      // Check selection count text
      const counts = screen.getAllByText(/\d+ filter[s]? selected/)
      counts.forEach(count => {
        expect(count.parentElement?.className).toContain('text-sm')
      })
      
      // Check badge remove buttons
      const removeButtons = screen.getAllByRole('button', { name: /×/ })
      removeButtons.forEach(button => {
        expect(button.className).toContain('hover:bg-secondary')
      })
      
      // Open a dropdown and check search functionality
      const triggers = screen.getAllByRole('combobox')
      await user.click(triggers[0])
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search filters...')
        expect(searchInput.className).not.toMatch(/text-gray-\d+/)
      })
    })

    it('ensures no hard-coded colors', async () => {
      const user = userEvent.setup()
      const { container } = renderWithTheme(
        <MultiSelectFilter
          options={[
            { value: '1', label: 'First', count: 10, icon: <span>1️⃣</span> },
            { value: '2', label: 'Second', count: 0 },
            { value: '3', label: 'Third' },
          ]}
          selected={['1', '2']}
          onSelectedChange={vi.fn()}
          placeholder="Custom placeholder"
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
      await user.click(screen.getByRole('combobox'))
      
      await waitFor(() => {
        const dropdown = document.querySelector('[role="listbox"]')
        const dropdownElements = dropdown?.querySelectorAll('*') || []
        dropdownElements.forEach(element => {
          const classList = element.className
          if (typeof classList === 'string') {
            expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone)-\d+/)
          }
        })
      })
    })

    it('maintains theme consistency with search and selection', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      renderWithTheme(
        <MultiSelectFilter
          options={[
            { value: 'apple', label: 'Apple', count: 5 },
            { value: 'banana', label: 'Banana', count: 3 },
            { value: 'cherry', label: 'Cherry', count: 7 },
            { value: 'date', label: 'Date', count: 2 },
          ]}
          selected={['apple']}
          onSelectedChange={handleChange}
        />,
        { theme: 'dark' }
      )
      
      // Open dropdown
      await user.click(screen.getByRole('combobox'))
      
      // Search for items
      const searchInput = screen.getByPlaceholderText('Search filters...')
      await user.type(searchInput, 'an')
      
      await waitFor(() => {
        // Should show filtered results
        expect(screen.getByText('Banana')).toBeInTheDocument()
        expect(screen.queryByText('Cherry')).not.toBeInTheDocument()
        
        // Check "Select all filtered" maintains semantic colors
        const selectAllButton = screen.getByText(/Select all filtered/)
        expect(selectAllButton.className).toContain('text-primary')
        expect(selectAllButton.className).toContain('hover:underline')
      })
      
      // Check selected item checkbox
      const appleOption = screen.getByRole('option', { name: /Apple/ })
      const checkbox = appleOption.querySelector('[data-state]')
      expect(checkbox?.className).toContain('bg-primary')
      expect(checkbox?.className).toContain('border-primary')
    })

    it('works with custom styling while maintaining semantic colors', () => {
      const { container } = renderWithTheme(
        <div className="rounded-lg bg-card p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter Options</label>
            <MultiSelectFilter
              options={[
                { value: 'draft', label: 'Draft', icon: <span>📝</span>, count: 4 },
                { value: 'published', label: 'Published', icon: <span>✅</span>, count: 12 },
                { value: 'archived', label: 'Archived', icon: <span>📦</span>, count: 8 },
              ]}
              selected={['published']}
              onSelectedChange={vi.fn()}
              className="w-[300px]"
              placeholder="Select post status..."
            />
            <p className="text-xs text-muted-foreground">
              Filter posts by their publication status
            </p>
          </div>
        </div>,
        { theme: 'dark' }
      )
      
      // Card should use semantic bg-card
      const card = container.querySelector('.bg-card')
      expect(card).toBeInTheDocument()
      
      // Label should use semantic styling
      const label = screen.getByText('Filter Options')
      expect(label.className).toContain('font-medium')
      
      // Help text should use semantic muted color
      const helpText = screen.getByText(/Filter posts by/)
      expect(helpText.className).toContain('text-muted-foreground')
      
      // Selected badge should show icon with semantic colors
      const badge = screen.getByText('Published')
      const icon = screen.getByText('✅')
      expect(icon).toBeInTheDocument()
      expect(badge.closest('[class*="bg-"]')?.className).toContain('bg-secondary')
    })
  })
})