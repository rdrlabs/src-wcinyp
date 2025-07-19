import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  TableSearch,
  DateRangePicker,
  MultiSelect,
  ColumnVisibilityMenu,
  TableFilters,
  useTableFilters,
  type DateRange,
  type MultiSelectOption,
  type ColumnVisibilityOption,
  type FilterConfig,
} from './table-filters'
import { renderHook } from '@testing-library/react'
import { renderWithTheme } from '@/test/theme-test-utils'

// Mock date for consistent testing
const mockDate = new Date('2024-01-15T12:00:00Z')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(mockDate)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('TableSearch', () => {
  describe('Basic Functionality', () => {
    it('renders search input with placeholder', () => {
      render(
        <TableSearch
          value=""
          onChange={vi.fn()}
          placeholder="Search users..."
        />
      )

      const input = screen.getByPlaceholderText('Search users...')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'search')
    })

    it('displays current value', () => {
      render(
        <TableSearch
          value="test query"
          onChange={vi.fn()}
        />
      )

      expect(screen.getByDisplayValue('test query')).toBeInTheDocument()
    })

    it('shows search icon', () => {
      const { container } = render(
        <TableSearch value="" onChange={vi.fn()} />
      )

      const searchIcon = container.querySelector('svg')
      expect(searchIcon).toBeInTheDocument()
      expect(searchIcon).toHaveClass('h-4', 'w-4')
    })

    it('shows clear button when value exists', () => {
      render(
        <TableSearch
          value="search term"
          onChange={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
    })

    it('hides clear button when value is empty', () => {
      render(
        <TableSearch
          value=""
          onChange={vi.fn()}
        />
      )

      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('calls onChange with debounced value', async () => {
      const user = userEvent.setup({ delay: null })
      const handleChange = vi.fn()
      
      render(
        <TableSearch
          value=""
          onChange={handleChange}
          debounceMs={300}
        />
      )

      const input = screen.getByPlaceholderText('Search...')
      await user.type(input, 'test')

      // Should not call immediately
      expect(handleChange).not.toHaveBeenCalled()

      // Fast forward debounce timer
      act(() => {
        vi.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('test')
      })
    })

    it('clears search when clicking clear button', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      const handleClear = vi.fn()
      
      render(
        <TableSearch
          value="search term"
          onChange={handleChange}
          onClear={handleClear}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Clear search' }))

      expect(handleChange).toHaveBeenCalledWith('')
      expect(handleClear).toHaveBeenCalled()
    })

    it('maintains local state for immediate feedback', async () => {
      const user = userEvent.setup({ delay: null })
      
      render(
        <TableSearch
          value=""
          onChange={vi.fn()}
          debounceMs={1000}
        />
      )

      const input = screen.getByPlaceholderText('Search...')
      await user.type(input, 'immediate')

      // Input should update immediately
      expect(input).toHaveValue('immediate')
    })
  })

  describe('Edge Cases', () => {
    it('syncs with external value changes', () => {
      const { rerender } = render(
        <TableSearch value="initial" onChange={vi.fn()} />
      )

      expect(screen.getByDisplayValue('initial')).toBeInTheDocument()

      rerender(<TableSearch value="updated" onChange={vi.fn()} />)

      expect(screen.getByDisplayValue('updated')).toBeInTheDocument()
    })

    it('handles rapid typing', async () => {
      const user = userEvent.setup({ delay: null })
      const handleChange = vi.fn()
      
      render(
        <TableSearch
          value=""
          onChange={handleChange}
          debounceMs={100}
        />
      )

      const input = screen.getByPlaceholderText('Search...')
      
      // Type rapidly
      await user.type(input, 'a')
      await user.type(input, 'b')
      await user.type(input, 'c')

      // Only the final value should be passed after debounce
      act(() => {
        vi.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledTimes(1)
        expect(handleChange).toHaveBeenCalledWith('abc')
      })
    })
  })
})

describe('DateRangePicker', () => {
  describe('Basic Functionality', () => {
    it('renders with placeholder when no date selected', () => {
      render(
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('Select date range')).toBeInTheDocument()
    })

    it('displays single date when only from is selected', () => {
      render(
        <DateRangePicker
          value={{ from: new Date('2024-01-10'), to: undefined }}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument()
    })

    it('displays date range when both dates selected', () => {
      render(
        <DateRangePicker
          value={{
            from: new Date('2024-01-01'),
            to: new Date('2024-01-15')
          }}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('Jan 1, 2024 - Jan 15, 2024')).toBeInTheDocument()
    })

    it('shows calendar icon', () => {
      const { container } = render(
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={vi.fn()}
        />
      )

      const calendarIcon = container.querySelector('svg')
      expect(calendarIcon).toBeInTheDocument()
    })
  })

  describe('Popover Interaction', () => {
    it('opens calendar on click', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('Today')).toBeInTheDocument()
        expect(screen.getByText('Last 7 days')).toBeInTheDocument()
      })
    })

    it('selects preset date range', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('button'))
      await user.click(screen.getByText('Today'))

      expect(handleChange).toHaveBeenCalledWith({
        from: expect.any(Date),
        to: expect.any(Date)
      })

      const [call] = handleChange.mock.calls
      const { from, to } = call[0]
      expect(from.toDateString()).toBe(mockDate.toDateString())
      expect(to.toDateString()).toBe(mockDate.toDateString())
    })

    it('shows clear button when date is selected', () => {
      render(
        <DateRangePicker
          value={{ from: new Date('2024-01-01'), to: new Date('2024-01-15') }}
          onChange={vi.fn()}
        />
      )

      const clearButton = screen.getByRole('button').querySelector('svg.ml-auto')
      expect(clearButton).toBeInTheDocument()
    })

    it('clears date range when clicking clear', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <DateRangePicker
          value={{ from: new Date('2024-01-01'), to: new Date('2024-01-15') }}
          onChange={handleChange}
        />
      )

      const clearButton = screen.getByRole('button').querySelector('svg.ml-auto')!
      await user.click(clearButton)

      expect(handleChange).toHaveBeenCalledWith({
        from: undefined,
        to: undefined
      })
    })
  })

  describe('Presets', () => {
    it('uses default presets when none provided', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button'))

      const defaultPresets = [
        'Today',
        'Yesterday',
        'Last 7 days',
        'Last 30 days',
        'This month',
        'Last month',
        'This year'
      ]

      for (const preset of defaultPresets) {
        expect(screen.getByText(preset)).toBeInTheDocument()
      }
    })

    it('uses custom presets when provided', async () => {
      const user = userEvent.setup()
      const customPresets = [
        {
          label: 'Custom Range',
          getValue: () => ({
            from: new Date('2024-01-01'),
            to: new Date('2024-01-07')
          })
        }
      ]

      render(
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={vi.fn()}
          presets={customPresets}
        />
      )

      await user.click(screen.getByRole('button'))

      expect(screen.getByText('Custom Range')).toBeInTheDocument()
      expect(screen.queryByText('Today')).not.toBeInTheDocument()
    })
  })
})

describe('MultiSelect', () => {
  const mockOptions: MultiSelectOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending', icon: <span>⏳</span> },
  ]

  describe('Basic Functionality', () => {
    it('renders with placeholder when nothing selected', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('Select items...')).toBeInTheDocument()
    })

    it('shows single selected label', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={['active']}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('shows count for multiple selections', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={['active', 'pending']}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('2 selected')).toBeInTheDocument()
    })

    it('shows badge with selection count', () => {
      render(
        <MultiSelect
          options={mockOptions}
          value={['active', 'inactive']}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('Dropdown Interaction', () => {
    it('opens dropdown and shows all options', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument()
        expect(screen.getByText('Inactive')).toBeInTheDocument()
        expect(screen.getByText('Pending')).toBeInTheDocument()
      })
    })

    it('shows checkboxes for each option', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelect
          options={mockOptions}
          value={['active']}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes).toHaveLength(mockOptions.length)
        expect(checkboxes[0]).toBeChecked()
        expect(checkboxes[1]).not.toBeChecked()
      })
    })

    it('toggles selection on click', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Active'))

      expect(handleChange).toHaveBeenCalledWith(['active'])
    })

    it('removes from selection when clicking selected item', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelect
          options={mockOptions}
          value={['active']}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Active'))

      expect(handleChange).toHaveBeenCalledWith([])
    })
  })

  describe('Bulk Actions', () => {
    it('shows select all and clear all buttons', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('Select all')).toBeInTheDocument()
        expect(screen.getByText('Clear all')).toBeInTheDocument()
      })
    })

    it('selects all options when clicking select all', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Select all'))

      expect(handleChange).toHaveBeenCalledWith(['active', 'inactive', 'pending'])
    })

    it('clears all selections when clicking clear all', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <MultiSelect
          options={mockOptions}
          value={['active', 'pending']}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByText('Clear all'))

      expect(handleChange).toHaveBeenCalledWith([])
    })
  })

  describe('Search Functionality', () => {
    it('filters options based on search', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))
      
      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'act')

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument()
        expect(screen.getByText('Inactive')).toBeInTheDocument()
        expect(screen.queryByText('Pending')).not.toBeInTheDocument()
      })
    })

    it('shows no items found message', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))
      
      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'xyz')

      await waitFor(() => {
        expect(screen.getByText('No items found.')).toBeInTheDocument()
      })
    })
  })

  describe('Visual Features', () => {
    it('displays option icons', async () => {
      const user = userEvent.setup()
      render(
        <MultiSelect
          options={mockOptions}
          value={[]}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        expect(screen.getByText('⏳')).toBeInTheDocument()
      })
    })

    it('respects maxHeight prop', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <MultiSelect
          options={Array(20).fill(null).map((_, i) => ({
            value: `option${i}`,
            label: `Option ${i}`
          }))}
          value={[]}
          onChange={vi.fn()}
          maxHeight={200}
        />
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const scrollArea = container.querySelector('.max-h-64')
        expect(scrollArea).toBeInTheDocument()
      })
    })
  })
})

describe('ColumnVisibilityMenu', () => {
  const mockColumns: ColumnVisibilityOption[] = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email', group: 'Contact' },
    { id: 'phone', label: 'Phone', group: 'Contact' },
    { id: 'status', label: 'Status' },
  ]

  describe('Basic Functionality', () => {
    it('renders trigger button with text and icon', () => {
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{}}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('Columns')).toBeInTheDocument()
      const button = screen.getByRole('button')
      expect(button.querySelector('svg')).toBeInTheDocument()
    })

    it('shows visible count badge when columns are hidden', () => {
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{ email: false, phone: false }}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('2/4')).toBeInTheDocument()
    })

    it('does not show badge when all columns visible', () => {
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{}}
          onChange={vi.fn()}
        />
      )

      expect(screen.queryByText(/\/4/)).not.toBeInTheDocument()
    })
  })

  describe('Dropdown Interaction', () => {
    it('opens menu and shows all columns', async () => {
      const user = userEvent.setup()
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{}}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('Toggle columns')).toBeInTheDocument()
        mockColumns.forEach(col => {
          expect(screen.getByText(col.label)).toBeInTheDocument()
        })
      })
    })

    it('shows columns grouped by category', async () => {
      const user = userEvent.setup()
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{}}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('Contact')).toBeInTheDocument()
      })
    })

    it('toggles column visibility on click', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{ name: true }}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('button'))
      
      const nameCheckbox = screen.getByRole('menuitemcheckbox', { name: 'Name' })
      await user.click(nameCheckbox)

      expect(handleChange).toHaveBeenCalledWith({ name: false })
    })

    it('shows checked state for visible columns', async () => {
      const user = userEvent.setup()
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{ email: false }}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        const nameItem = screen.getByRole('menuitemcheckbox', { name: 'Name' })
        const emailItem = screen.getByRole('menuitemcheckbox', { name: 'Email' })
        
        expect(nameItem).toHaveAttribute('aria-checked', 'true')
        expect(emailItem).toHaveAttribute('aria-checked', 'false')
      })
    })
  })

  describe('Bulk Actions', () => {
    it('shows bulk action buttons', async () => {
      const user = userEvent.setup()
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{}}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('Show all')).toBeInTheDocument()
        expect(screen.getByText('Hide all')).toBeInTheDocument()
        expect(screen.getByText('Reset')).toBeInTheDocument()
      })
    })

    it('shows all columns when clicking show all', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{ name: false, email: false }}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('button'))
      await user.click(screen.getByText('Show all'))

      expect(handleChange).toHaveBeenCalledWith({
        name: true,
        email: true,
        phone: true,
        status: true
      })
    })

    it('hides all columns when clicking hide all', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{}}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('button'))
      await user.click(screen.getByText('Hide all'))

      expect(handleChange).toHaveBeenCalledWith({
        name: false,
        email: false,
        phone: false,
        status: false
      })
    })

    it('resets visibility when clicking reset', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{ name: false, email: false }}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByRole('button'))
      await user.click(screen.getByText('Reset'))

      expect(handleChange).toHaveBeenCalledWith({})
    })
  })

  describe('Search Functionality', () => {
    it('filters columns based on search', async () => {
      const user = userEvent.setup()
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{}}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button'))
      
      const searchInput = screen.getByPlaceholderText('Search columns...')
      await user.type(searchInput, 'mail')

      await waitFor(() => {
        expect(screen.getByText('Email')).toBeInTheDocument()
        expect(screen.queryByText('Name')).not.toBeInTheDocument()
        expect(screen.queryByText('Phone')).not.toBeInTheDocument()
      })
    })

    it('removes grouping when searching', async () => {
      const user = userEvent.setup()
      render(
        <ColumnVisibilityMenu
          columns={mockColumns}
          visibility={{}}
          onChange={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button'))
      
      const searchInput = screen.getByPlaceholderText('Search columns...')
      await user.type(searchInput, 'e')

      await waitFor(() => {
        // Contact group should not be shown when searching
        expect(screen.queryByText('Contact')).not.toBeInTheDocument()
        // But Email and Phone should still be visible
        expect(screen.getByText('Email')).toBeInTheDocument()
        expect(screen.getByText('Phone')).toBeInTheDocument()
      })
    })
  })
})

describe('TableFilters', () => {
  const mockFilters: FilterConfig[] = [
    { type: 'search', key: 'name', label: 'Search names' },
    { 
      type: 'date-range', 
      key: 'created', 
      label: 'Created date',
      value: { from: undefined, to: undefined }
    },
    { 
      type: 'multi-select', 
      key: 'status', 
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      value: []
    }
  ]

  describe('Rendering', () => {
    it('renders all configured filters', () => {
      render(
        <TableFilters
          filters={mockFilters}
          values={{}}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByPlaceholderText('Search names')).toBeInTheDocument()
      expect(screen.getByText('Created date')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('uses filter values from props', () => {
      render(
        <TableFilters
          filters={mockFilters}
          values={{
            name: 'John',
            status: ['active']
          }}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('does not show clear button when no filters active', () => {
      render(
        <TableFilters
          filters={mockFilters}
          values={{}}
          onChange={vi.fn()}
        />
      )

      expect(screen.queryByText('Clear filters')).not.toBeInTheDocument()
    })

    it('shows clear button with active filter count', () => {
      render(
        <TableFilters
          filters={mockFilters}
          values={{
            name: 'John',
            status: ['active']
          }}
          onChange={vi.fn()}
        />
      )

      expect(screen.getByText('Clear filters')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('Filter Changes', () => {
    it('calls onChange when search filter changes', async () => {
      const user = userEvent.setup({ delay: null })
      const handleChange = vi.fn()
      
      render(
        <TableFilters
          filters={mockFilters}
          values={{}}
          onChange={handleChange}
        />
      )

      const searchInput = screen.getByPlaceholderText('Search names')
      await user.type(searchInput, 'test')

      act(() => {
        vi.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('name', 'test')
      })
    })

    it('calls onChange when date range changes', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <TableFilters
          filters={mockFilters}
          values={{}}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByText('Created date'))
      await user.click(screen.getByText('Today'))

      expect(handleChange).toHaveBeenCalledWith('created', {
        from: expect.any(Date),
        to: expect.any(Date)
      })
    })

    it('calls onChange when multi-select changes', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <TableFilters
          filters={mockFilters}
          values={{}}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByText('Status'))
      await user.click(screen.getByText('Active'))

      expect(handleChange).toHaveBeenCalledWith('status', ['active'])
    })
  })

  describe('Clear Functionality', () => {
    it('clears all filters when clicking clear button', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <TableFilters
          filters={mockFilters}
          values={{
            name: 'John',
            status: ['active']
          }}
          onChange={handleChange}
        />
      )

      await user.click(screen.getByText('Clear filters'))

      expect(handleChange).toHaveBeenCalledWith('name', '')
      expect(handleChange).toHaveBeenCalledWith('status', [])
    })

    it('uses custom onClearAll handler when provided', async () => {
      const user = userEvent.setup()
      const handleClearAll = vi.fn()
      
      render(
        <TableFilters
          filters={mockFilters}
          values={{ name: 'John' }}
          onChange={vi.fn()}
          onClearAll={handleClearAll}
        />
      )

      await user.click(screen.getByText('Clear filters'))

      expect(handleClearAll).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('handles unknown filter types gracefully', () => {
      const invalidFilters = [
        // @ts-ignore - Testing invalid type
        { type: 'invalid', key: 'test', label: 'Test' }
      ]

      render(
        <TableFilters
          filters={invalidFilters}
          values={{}}
          onChange={vi.fn()}
        />
      )

      // Should not crash
      expect(screen.getByRole('document')).toBeInTheDocument()
    })

    it('handles empty filters array', () => {
      render(
        <TableFilters
          filters={[]}
          values={{}}
          onChange={vi.fn()}
        />
      )

      // Should render without errors
      expect(screen.getByRole('document')).toBeInTheDocument()
    })
  })
})

describe('useTableFilters', () => {
  it('initializes with provided values', () => {
    const { result } = renderHook(() => 
      useTableFilters({
        search: '',
        status: [],
        date: { from: undefined, to: undefined }
      })
    )

    expect(result.current.values).toEqual({
      search: '',
      status: [],
      date: { from: undefined, to: undefined }
    })
  })

  it('updates individual filter values', () => {
    const { result } = renderHook(() => 
      useTableFilters({
        search: '',
        status: []
      })
    )

    act(() => {
      result.current.setFilter('search', 'test')
    })

    expect(result.current.values.search).toBe('test')
    expect(result.current.values.status).toEqual([])
  })

  it('clears all filters to initial values', () => {
    const { result } = renderHook(() => 
      useTableFilters({
        search: '',
        status: []
      })
    )

    act(() => {
      result.current.setFilter('search', 'test')
      result.current.setFilter('status', ['active'])
    })

    expect(result.current.values.search).toBe('test')
    expect(result.current.values.status).toEqual(['active'])

    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.values.search).toBe('')
    expect(result.current.values.status).toEqual([])
  })

  it('calculates active filter count correctly', () => {
    const { result } = renderHook(() => 
      useTableFilters({
        search: '',
        status: [],
        enabled: false,
        date: { from: undefined, to: undefined }
      })
    )

    expect(result.current.activeCount).toBe(0)

    act(() => {
      result.current.setFilter('search', 'test')
    })
    expect(result.current.activeCount).toBe(1)

    act(() => {
      result.current.setFilter('status', ['active'])
    })
    expect(result.current.activeCount).toBe(2)

    act(() => {
      result.current.setFilter('enabled', true)
    })
    expect(result.current.activeCount).toBe(3)

    act(() => {
      result.current.setFilter('date', { from: new Date(), to: undefined })
    })
    expect(result.current.activeCount).toBe(4)
  })

  it('does not count empty arrays as active', () => {
    const { result } = renderHook(() => 
      useTableFilters({
        status: ['active']
      })
    )

    expect(result.current.activeCount).toBe(1)

    act(() => {
      result.current.setFilter('status', [])
    })

    expect(result.current.activeCount).toBe(0)
  })

  it('does not count empty date ranges as active', () => {
    const { result } = renderHook(() => 
      useTableFilters({
        date: { from: new Date(), to: new Date() }
      })
    )

    expect(result.current.activeCount).toBe(1)

    act(() => {
      result.current.setFilter('date', { from: undefined, to: undefined })
    })

    expect(result.current.activeCount).toBe(0)
  })
})

describe('Theme Tests', () => {
  it('renders correctly in light mode', async () => {
    const user = userEvent.setup()
    const statusOptions: MultiSelectOption[] = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ]
    
    const columnOptions: ColumnVisibilityOption[] = [
      { value: 'name', label: 'Name', visible: true },
      { value: 'email', label: 'Email', visible: true },
      { value: 'status', label: 'Status', visible: false },
    ]
    
    const { container } = renderWithTheme(
      <div className="space-y-4">
        <TableSearch 
          value="" 
          onChange={vi.fn()} 
          placeholder="Search records..."
        />
        
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={vi.fn()}
        />
        
        <MultiSelect
          options={statusOptions}
          value={['active']}
          onChange={vi.fn()}
          placeholder="Select status..."
        />
        
        <ColumnVisibilityMenu
          columns={columnOptions}
          onChange={vi.fn()}
        />
      </div>,
      { theme: 'light' }
    )
    
    // Check search input uses semantic colors
    const searchInput = screen.getByPlaceholderText('Search records...')
    expect(searchInput.className).toContain('border-input')
    expect(searchInput.className).toContain('bg-background')
    
    // Check date picker button uses semantic colors
    const dateButton = screen.getByRole('button', { name: /pick a date/i })
    expect(dateButton.className).toContain('border-input')
    expect(dateButton.className).toContain('hover:bg-accent')
    expect(dateButton.className).toContain('hover:text-accent-foreground')
    
    // Check multi-select uses semantic colors
    const multiSelectButton = container.querySelector('[role="combobox"]')
    expect(multiSelectButton?.className).toContain('border-input')
    
    // Check column visibility uses semantic colors
    const columnButton = screen.getByRole('button', { name: /columns/i })
    expect(columnButton.className).toContain('border')
    expect(columnButton.className).toContain('bg-background')
  })

  it('renders correctly in dark mode', async () => {
    const user = userEvent.setup()
    const statusOptions: MultiSelectOption[] = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ]
    
    const columnOptions: ColumnVisibilityOption[] = [
      { value: 'name', label: 'Name', visible: true },
      { value: 'email', label: 'Email', visible: false },
    ]
    
    const { container } = renderWithTheme(
      <div className="space-y-4">
        <TableSearch 
          value="search text" 
          onChange={vi.fn()} 
        />
        
        <DateRangePicker
          value={{ from: new Date('2024-01-01'), to: new Date('2024-01-31') }}
          onChange={vi.fn()}
        />
        
        <MultiSelect
          options={statusOptions}
          value={['active', 'inactive']}
          onChange={vi.fn()}
          placeholder="Filter by status"
        />
        
        <ColumnVisibilityMenu
          columns={columnOptions}
          onChange={vi.fn()}
        />
      </div>,
      { theme: 'dark' }
    )
    
    // Check search has value and clear button
    const searchInput = screen.getByDisplayValue('search text')
    expect(searchInput.className).toContain('bg-background')
    
    const clearButton = screen.getByRole('button', { name: 'Clear search' })
    expect(clearButton).toBeInTheDocument()
    
    // Check date range shows selected dates
    const dateButton = screen.getByRole('button', { name: /jan 1.*jan 31/i })
    expect(dateButton.className).toContain('border-input')
    
    // Check multi-select shows count
    const multiSelectText = screen.getByText('2 selected')
    expect(multiSelectText).toBeInTheDocument()
    
    // All should maintain semantic colors in dark mode
    const buttons = container.querySelectorAll('button')
    buttons.forEach(button => {
      if (button.className.includes('hover:')) {
        expect(button.className).toMatch(/hover:(bg-accent|bg-muted|text-accent-foreground)/)
      }
    })
  })

  it('maintains semantic colors for all filter components', async () => {
    const user = userEvent.setup()
    const filterConfig: FilterConfig = {
      search: {
        placeholder: 'Search by name or email...',
        debounceMs: 300,
      },
      date: {
        placeholder: 'Select date range',
        presets: [
          { label: 'Last 7 days', value: { from: new Date(), to: new Date() } },
          { label: 'Last 30 days', value: { from: new Date(), to: new Date() } },
        ],
      },
      status: {
        options: [
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
          { value: 'inactive', label: 'Inactive' },
        ],
        placeholder: 'Filter by status',
      },
      columns: {
        options: [
          { value: 'id', label: 'ID', visible: true },
          { value: 'name', label: 'Name', visible: true },
          { value: 'email', label: 'Email', visible: true },
          { value: 'status', label: 'Status', visible: true },
          { value: 'date', label: 'Date', visible: false },
        ],
      },
    }
    
    renderWithTheme(
      <TableFilters
        filters={{}}
        onFilterChange={vi.fn()}
        config={filterConfig}
      />,
      { theme: 'dark' }
    )
    
    // Check search icon color
    const searchIcon = screen.getByPlaceholderText('Search by name or email...').previousElementSibling?.querySelector('svg')
    expect(searchIcon?.parentElement?.className).toContain('text-muted-foreground')
    
    // Open date picker
    const dateButton = screen.getByRole('button', { name: /select date range/i })
    await user.click(dateButton)
    
    await waitFor(() => {
      // Date picker presets should use semantic colors
      const presetButtons = screen.getAllByText(/Last \d+ days/)
      presetButtons.forEach(button => {
        expect(button.className).toContain('hover:bg-accent')
      })
    })
    
    // Close date picker
    await user.click(document.body)
    
    // Open multi-select
    const statusButton = screen.getByRole('combobox')
    await user.click(statusButton)
    
    await waitFor(() => {
      // Options should use semantic colors
      const options = screen.getAllByRole('option')
      options.forEach(option => {
        const checkbox = option.querySelector('[role="checkbox"]')
        expect(checkbox?.className).toContain('border-primary')
      })
    })
    
    // Close multi-select
    await user.click(document.body)
    
    // Open column visibility
    const columnsButton = screen.getByRole('button', { name: /columns/i })
    await user.click(columnsButton)
    
    await waitFor(() => {
      // Column checkboxes should use semantic colors
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach(checkbox => {
        expect(checkbox.className).toContain('border-primary')
        if (checkbox.getAttribute('data-state') === 'checked') {
          expect(checkbox.className).toContain('bg-primary')
          expect(checkbox.className).toContain('text-primary-foreground')
        }
      })
    })
  })

  it('ensures no hard-coded colors', async () => {
    const user = userEvent.setup()
    const { container } = renderWithTheme(
      <div className="space-y-4">
        <TableSearch value="test" onChange={vi.fn()} />
        <DateRangePicker 
          value={{ from: new Date(), to: new Date() }} 
          onChange={vi.fn()} 
        />
        <MultiSelect
          options={[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
          ]}
          value={['1']}
          onChange={vi.fn()}
        />
        <ColumnVisibilityMenu
          columns={[
            { value: 'col1', label: 'Column 1', visible: true },
          ]}
          onChange={vi.fn()}
        />
      </div>,
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
        
        // Exception for specific status colors which are intentional
        if (!classList.includes('bg-green-') && !classList.includes('bg-yellow-') && 
            !classList.includes('bg-red-') && !classList.includes('bg-blue-')) {
          expect(classList).not.toMatch(/bg-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        }
      }
    })
  })

  it('maintains theme consistency with dropdowns and popovers', async () => {
    const user = userEvent.setup()
    
    renderWithTheme(
      <div className="space-y-4">
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={vi.fn()}
        />
        <MultiSelect
          options={[
            { value: 'opt1', label: 'Option 1', description: 'First option' },
            { value: 'opt2', label: 'Option 2', description: 'Second option' },
          ]}
          value={[]}
          onChange={vi.fn()}
          placeholder="Select options..."
        />
      </div>,
      { theme: 'dark' }
    )
    
    // Open date picker popover
    const dateButton = screen.getByRole('button', { name: /pick a date/i })
    await user.click(dateButton)
    
    await waitFor(() => {
      // Calendar should be visible with semantic colors
      const calendar = document.querySelector('[role="grid"]')
      expect(calendar).toBeInTheDocument()
      
      // Month navigation should use semantic colors
      const navButtons = calendar?.querySelectorAll('button[name*="month"]')
      navButtons?.forEach(button => {
        expect(button.className).toContain('hover:bg-accent')
      })
    })
    
    // Close date picker
    await user.click(document.body)
    
    // Open multi-select dropdown
    const multiSelectButton = screen.getByRole('combobox')
    await user.click(multiSelectButton)
    
    await waitFor(() => {
      // Check option descriptions use semantic muted color
      const descriptions = screen.getAllByText(/First option|Second option/)
      descriptions.forEach(desc => {
        expect(desc.className).toContain('text-muted-foreground')
      })
      
      // Check dropdown container uses semantic colors
      const dropdown = document.querySelector('[role="listbox"]')
      expect(dropdown?.className).toContain('bg-popover')
      expect(dropdown?.className).toContain('text-popover-foreground')
    })
  })

  it('works with custom styling while maintaining semantic colors', () => {
    const { container } = renderWithTheme(
      <div className="rounded-lg bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          <span className="text-sm text-muted-foreground">3 active</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TableSearch 
            value="" 
            onChange={vi.fn()} 
            placeholder="Search..."
            className="md:col-span-2"
          />
          
          <DateRangePicker
            value={{ from: new Date(), to: new Date() }}
            onChange={vi.fn()}
          />
          
          <ColumnVisibilityMenu
            columns={[
              { value: 'id', label: 'ID', visible: true },
              { value: 'name', label: 'Name', visible: true },
            ]}
            onChange={vi.fn()}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <MultiSelect
            options={[
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
            ]}
            value={['active']}
            onChange={vi.fn()}
            placeholder="Status"
            className="w-[200px]"
          />
          
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Clear all filters
          </button>
        </div>
      </div>,
      { theme: 'dark' }
    )
    
    // Card container should use semantic colors
    const card = container.querySelector('.bg-card')
    expect(card).toBeInTheDocument()
    
    // Title and metadata should use semantic colors
    const title = screen.getByText('Filters')
    expect(title.parentElement?.className).toContain('font-semibold')
    
    const activeCount = screen.getByText('3 active')
    expect(activeCount.className).toContain('text-muted-foreground')
    
    // Clear button should use semantic hover colors
    const clearButton = screen.getByText('Clear all filters')
    expect(clearButton.className).toContain('text-muted-foreground')
    expect(clearButton.className).toContain('hover:text-foreground')
  })
})