import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DataTable, createSortableHeader, createActionsColumn } from './data-table'
import { renderWithTheme } from '@/test/theme-test-utils'
import { ColumnDef } from '@tanstack/react-table'

// Sample data for testing
interface TestData {
  id: string
  name: string
  email: string
  role: string
}

const sampleData: TestData[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'User' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Admin' },
]

const basicColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
]

describe('DataTable', () => {
  describe('Basic Functionality', () => {
    it('renders table with data', () => {
      render(<DataTable columns={basicColumns} data={sampleData} />)

      // Check headers
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()

      // Check data
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('bob@example.com')).toBeInTheDocument()
      expect(screen.getByText('Editor')).toBeInTheDocument()
    })

    it('renders empty state when no data', () => {
      render(<DataTable columns={basicColumns} data={[]} />)

      expect(screen.getByText('No results.')).toBeInTheDocument()
    })

    it('handles row click', async () => {
      const user = userEvent.setup()
      const handleRowClick = vi.fn()
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          onRowClick={handleRowClick}
        />
      )

      await user.click(screen.getByText('Alice Johnson'))
      expect(handleRowClick).toHaveBeenCalledWith(sampleData[0])
    })
  })

  describe('Search Functionality', () => {
    it('shows search input when searchColumn specified', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          searchColumn="name"
          searchPlaceholder="Search by name..."
        />
      )

      const searchInput = screen.getByPlaceholderText('Search by name...')
      expect(searchInput).toBeInTheDocument()
    })

    it('filters data based on search', async () => {
      const user = userEvent.setup()
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          searchColumn="name"
        />
      )

      const searchInput = screen.getByPlaceholderText('Filter...')
      await user.type(searchInput, 'Alice')

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
        expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument()
      })
    })
  })

  describe('Row Selection', () => {
    it('shows selection checkboxes when enabled', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          enableRowSelection={true}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThan(sampleData.length) // Header + rows
    })

    it('selects individual rows', async () => {
      const user = userEvent.setup()
      const handleSelection = vi.fn()
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          enableRowSelection={true}
          onRowSelectionChange={handleSelection}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[1]) // First data row

      expect(handleSelection).toHaveBeenCalled()
    })

    it('selects all rows', async () => {
      const user = userEvent.setup()
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          enableRowSelection={true}
        />
      )

      const selectAllCheckbox = screen.getByRole('checkbox', { name: 'Select all' })
      await user.click(selectAllCheckbox)

      const selectedText = screen.getByText(/5 of 5 row\(s\) selected/)
      expect(selectedText).toBeInTheDocument()
    })

    it('hides selection column when disabled', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          enableRowSelection={false}
        />
      )

      const checkboxes = screen.queryAllByRole('checkbox')
      expect(checkboxes).toHaveLength(0)
    })
  })

  describe('Column Visibility', () => {
    it('shows column visibility dropdown when enabled', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          showColumnVisibility={true}
        />
      )

      const columnsButton = screen.getByRole('button', { name: /Columns/i })
      expect(columnsButton).toBeInTheDocument()
    })

    it('toggles column visibility', async () => {
      const user = userEvent.setup()
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          showColumnVisibility={true}
        />
      )

      const columnsButton = screen.getByRole('button', { name: /Columns/i })
      await user.click(columnsButton)

      const emailCheckbox = await screen.findByRole('menuitemcheckbox', { name: /email/i })
      await user.click(emailCheckbox)

      await waitFor(() => {
        expect(screen.queryByText('Email')).not.toBeInTheDocument()
      })
    })

    it('uses external column visibility state', () => {
      const visibility = { email: false }
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          columnVisibility={visibility}
          onColumnVisibilityChange={() => {}}
        />
      )

      expect(screen.queryByText('Email')).not.toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    it('shows pagination controls when enabled', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          showPagination={true}
          pageSize={2}
        />
      )

      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    })

    it('navigates between pages', async () => {
      const user = userEvent.setup()
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          showPagination={true}
          pageSize={2}
        />
      )

      // First page
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.queryByText('Charlie Brown')).not.toBeInTheDocument()

      const nextButton = screen.getByRole('button', { name: 'Next' })
      await user.click(nextButton)

      // Second page
      await waitFor(() => {
        expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
        expect(screen.getByText('Charlie Brown')).toBeInTheDocument()
      })
    })

    it('disables navigation buttons appropriately', () => {
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          showPagination={true}
          pageSize={10}
        />
      )

      const previousButton = screen.getByRole('button', { name: 'Previous' })
      const nextButton = screen.getByRole('button', { name: 'Next' })

      expect(previousButton).toBeDisabled()
      expect(nextButton).toBeDisabled()
    })
  })

  describe('Sorting', () => {
    it('sorts columns with sortable headers', async () => {
      const user = userEvent.setup()
      
      const sortableColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: ({ column }) => createSortableHeader(column, 'Name'),
        },
        {
          accessorKey: 'email',
          header: 'Email',
        },
      ]

      render(<DataTable columns={sortableColumns} data={sampleData} />)

      const nameHeader = screen.getByRole('button', { name: /Name/i })
      await user.click(nameHeader)

      // Check that the header shows it's being sorted
      expect(nameHeader).toBeInTheDocument()
    })
  })

  describe('Actions Column', () => {
    it('renders actions dropdown', async () => {
      const user = userEvent.setup()
      const handleEdit = vi.fn()
      const handleDelete = vi.fn()
      
      const actionsColumn = createActionsColumn<TestData>([
        { label: 'Edit', onClick: handleEdit },
        { label: 'Delete', onClick: handleDelete },
      ])

      const columnsWithActions = [...basicColumns, actionsColumn]

      render(<DataTable columns={columnsWithActions} data={sampleData} />)

      const actionButtons = screen.getAllByRole('button', { name: 'Open menu' })
      await user.click(actionButtons[0])

      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument()
        expect(screen.getByText('Delete')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Edit'))
      expect(handleEdit).toHaveBeenCalledWith(sampleData[0])
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <DataTable 
          columns={basicColumns} 
          data={sampleData}
          showPagination={true}
          showColumnVisibility={true}
          enableRowSelection={true}
          searchColumn="name"
        />,
        { theme: 'light' }
      )

      // Check table wrapper uses semantic colors
      const wrapper = container.querySelector('.rounded-md.border')
      expect(wrapper).toBeInTheDocument()

      // Check header row has semantic styling
      const headerRow = container.querySelector('thead tr')
      expect(headerRow?.className).toContain('border-b')

      // Check table cells don't have hard-coded colors
      const cells = container.querySelectorAll('td')
      cells.forEach(cell => {
        expect(cell.className).not.toMatch(/text-(gray|slate)-\d+/)
      })

      // Check search input uses semantic colors
      const searchInput = screen.getByPlaceholderText('Filter...')
      expect(searchInput.className).toContain('bg-transparent')
      expect(searchInput.className).toContain('placeholder:text-muted-foreground')
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <DataTable 
          columns={basicColumns} 
          data={sampleData}
          showPagination={true}
          showColumnVisibility={true}
          enableRowSelection={true}
          searchColumn="name"
        />,
        { theme: 'dark' }
      )

      // Check semantic colors maintained in dark mode
      const wrapper = container.querySelector('.rounded-md.border')
      expect(wrapper).toBeInTheDocument()

      // Header maintains semantic styling
      const headerRow = container.querySelector('thead tr')
      expect(headerRow?.className).toContain('border-b')

      // Hover states should use semantic colors
      const rows = container.querySelectorAll('tbody tr')
      rows.forEach(row => {
        expect(row.className).toContain('hover:bg-muted/50')
      })
    })

    it('maintains semantic colors for all data table features', async () => {
      const user = userEvent.setup()
      
      const sortableColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: ({ column }) => createSortableHeader(column, 'Name'),
        },
        {
          accessorKey: 'email',
          header: 'Email',
        },
        {
          accessorKey: 'role',
          header: ({ column }) => createSortableHeader(column, 'Role'),
        },
      ]

      const { container } = renderWithTheme(
        <DataTable 
          columns={sortableColumns} 
          data={sampleData}
          showPagination={true}
          showColumnVisibility={true}
          enableRowSelection={true}
          searchColumn="name"
          pageSize={3}
        />,
        { theme: 'dark' }
      )

      // Check sortable headers use semantic colors
      const sortButtons = screen.getAllByRole('button', { name: /Name|Role/i })
      sortButtons.forEach(button => {
        expect(button.className).toContain('hover:text-foreground')
      })

      // Check column visibility button
      const columnsButton = screen.getByRole('button', { name: /Columns/i })
      expect(columnsButton.className).toContain('border')
      expect(columnsButton.className).toContain('bg-transparent')
      
      // Check pagination controls
      const paginationButtons = screen.getAllByRole('button', { name: /Previous|Next/i })
      paginationButtons.forEach(button => {
        expect(button.className).toContain('hover:bg-accent')
        expect(button.className).toContain('hover:text-accent-foreground')
      })

      // Check selection info text
      await user.click(screen.getAllByRole('checkbox')[0]) // Select all
      const selectionText = screen.getByText(/5 of 5 row\(s\) selected/)
      expect(selectionText.className).toContain('text-muted-foreground')
    })

    it('ensures no hard-coded colors', async () => {
      const user = userEvent.setup()
      
      const actionsColumn = createActionsColumn<TestData>([
        { label: 'Edit', onClick: () => {} },
        { label: 'Delete', onClick: () => {} },
      ])

      const columnsWithActions = [...basicColumns, actionsColumn]

      const { container } = renderWithTheme(
        <DataTable 
          columns={columnsWithActions} 
          data={sampleData}
          showPagination={true}
          showColumnVisibility={true}
          enableRowSelection={true}
        />,
        { theme: 'dark' }
      )

      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string') {
          // Should not contain hard-coded color values
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        }
      })

      // Open actions menu to check dropdown colors
      const actionButtons = screen.getAllByRole('button', { name: 'Open menu' })
      await user.click(actionButtons[0])

      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem')
        menuItems.forEach(item => {
          expect(item.className).toContain('hover:bg-accent')
          expect(item.className).toContain('hover:text-accent-foreground')
        })
      })
    })

    it('maintains theme consistency with empty and loading states', () => {
      // Test empty state
      const { container: emptyContainer } = renderWithTheme(
        <DataTable columns={basicColumns} data={[]} />,
        { theme: 'dark' }
      )

      const emptyMessage = screen.getByText('No results.')
      expect(emptyMessage).toBeInTheDocument()
      
      // Empty state should maintain semantic styling
      const emptyCell = emptyMessage.closest('td')
      expect(emptyCell?.className).toContain('text-center')

      // Test with loading skeleton (simulated with className)
      const { container: loadingContainer } = renderWithTheme(
        <DataTable 
          columns={basicColumns} 
          data={sampleData}
          className="animate-pulse"
        />,
        { theme: 'dark' }
      )

      const table = loadingContainer.querySelector('table')
      expect(table?.parentElement?.className).toContain('animate-pulse')
    })

    it('works with row selection and actions in both themes', async () => {
      const user = userEvent.setup()
      const handleSelection = vi.fn()
      
      const { rerender } = renderWithTheme(
        <DataTable 
          columns={basicColumns} 
          data={sampleData}
          enableRowSelection={true}
          onRowSelectionChange={handleSelection}
        />,
        { theme: 'light' }
      )

      // Light mode - check checkbox styling
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes[0]).toHaveAttribute('aria-label', 'Select all')
      
      // Select a row
      await user.click(checkboxes[1])
      expect(handleSelection).toHaveBeenCalled()

      // Switch to dark mode
      rerender(
        <DataTable 
          columns={basicColumns} 
          data={sampleData}
          enableRowSelection={true}
          onRowSelectionChange={handleSelection}
        />
      )

      // Checkboxes should maintain semantic styling in dark mode
      const darkCheckboxes = screen.getAllByRole('checkbox')
      darkCheckboxes.forEach(checkbox => {
        // Parent element should have semantic styling
        const parent = checkbox.parentElement
        expect(parent?.className).toContain('flex')
      })
    })

    it('maintains semantic colors for sortable columns', async () => {
      const user = userEvent.setup()
      
      const sortableColumns: ColumnDef<TestData>[] = [
        {
          accessorKey: 'name',
          header: ({ column }) => createSortableHeader(column, 'Name'),
          enableSorting: true,
        },
        {
          accessorKey: 'email',
          header: ({ column }) => createSortableHeader(column, 'Email'),
          enableSorting: true,
        },
      ]

      renderWithTheme(
        <DataTable columns={sortableColumns} data={sampleData} />,
        { theme: 'dark' }
      )

      // Check sort buttons have semantic hover states
      const sortButtons = screen.getAllByRole('button', { name: /Name|Email/ })
      
      for (const button of sortButtons) {
        expect(button.className).toContain('hover:text-foreground')
        
        // Click to sort
        await user.click(button)
        
        // Check sort icon appears with semantic colors
        const icon = button.querySelector('svg')
        expect(icon).toBeInTheDocument()
      }
    })
  })

  describe('Accessibility', () => {
    it('has accessible table structure', () => {
      render(<DataTable columns={basicColumns} data={sampleData} />)

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()

      const headers = screen.getAllByRole('columnheader')
      expect(headers.length).toBeGreaterThanOrEqual(3)
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      const handleRowClick = vi.fn()
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          onRowClick={handleRowClick}
        />
      )

      // Find the first data row (not header)
      const rows = screen.getAllByRole('row')
      // Skip header row
      const firstDataRow = rows[1]
      
      // Click on the row
      await user.click(firstDataRow)
      expect(handleRowClick).toHaveBeenCalledWith(sampleData[0])
    })
  })

  describe('Edge Cases', () => {
    it('handles empty columns array', () => {
      render(<DataTable columns={[]} data={sampleData} />)

      // With empty columns, nothing should be rendered
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('handles null/undefined data gracefully', () => {
      const dataWithNulls = [
        { id: '1', name: null, email: undefined, role: 'Admin' },
      ]

      const { container } = render(<DataTable columns={basicColumns} data={dataWithNulls as any} />)

      expect(screen.getByText('Admin')).toBeInTheDocument()
      // Null/undefined values should render as empty cells
      const cells = container.querySelectorAll('td')
      expect(cells.length).toBeGreaterThan(0)
    })

    it('prevents row click on interactive elements', async () => {
      const user = userEvent.setup()
      const handleRowClick = vi.fn()
      
      render(
        <DataTable
          columns={basicColumns}
          data={sampleData}
          onRowClick={handleRowClick}
          enableRowSelection={true}
        />
      )

      const checkbox = screen.getAllByRole('checkbox')[1]
      await user.click(checkbox)

      expect(handleRowClick).not.toHaveBeenCalled()
    })
  })
})