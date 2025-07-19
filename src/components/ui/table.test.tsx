import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableCaption 
} from './table'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Table Components', () => {
  describe('Table', () => {
    it('renders table element', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const table = container.querySelector('table')
      expect(table).toBeInTheDocument()
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('wraps table in overflow container', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('relative', 'w-full', 'overflow-auto')
    })
  })

  describe('TableFooter', () => {
    it('renders table footer', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Body</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer content</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      
      const footer = container.querySelector('tfoot')
      expect(footer).toBeInTheDocument()
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('applies footer styles', () => {
      const { container } = render(
        <Table>
          <TableFooter className="custom-footer">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      
      const footer = container.querySelector('tfoot')
      expect(footer).toHaveClass('custom-footer')
      expect(footer).toHaveClass('border-t-2', 'border-border', 'bg-muted/50', 'font-semibold')
    })
  })

  describe('Complete Table', () => {
    it('renders a complete table with all components', () => {
      render(
        <Table>
          <TableCaption>A list of recent transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2025-07-04</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-07-03</TableCell>
              <TableCell>$150.00</TableCell>
              <TableCell>Pending</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>$400.00</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
      
      // Check caption
      expect(screen.getByText('A list of recent transactions')).toBeInTheDocument()
      
      // Check headers
      expect(screen.getByText('Date')).toBeInTheDocument()
      expect(screen.getByText('Amount')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      
      // Check body
      expect(screen.getByText('2025-07-04')).toBeInTheDocument()
      expect(screen.getByText('$250.00')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
      
      // Check footer
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('$400.00')).toBeInTheDocument()
    })

    it('handles data-state attributes', () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-state="selected">
              <TableCell>Selected row</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      
      const row = screen.getByText('Selected row').closest('tr')
      expect(row).toHaveAttribute('data-state', 'selected')
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <Table>
          <TableCaption>Monthly transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2025-07-01</TableCell>
              <TableCell>Payment received</TableCell>
              <TableCell className="text-right">$1,250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-07-02</TableCell>
              <TableCell>Invoice #001</TableCell>
              <TableCell className="text-right">$750.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
        { theme: 'light' }
      )
      
      // Table wrapper should exist
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('relative', 'w-full', 'overflow-auto')
      
      // Check table has proper semantic classes
      const table = container.querySelector('table')
      expect(table).toHaveClass('w-full')
      expect(table).toHaveClass('caption-bottom')
      
      // Check header uses semantic colors
      const header = container.querySelector('thead')
      expect(header?.className).toContain('border-b')
      
      // Table cells should not have hard-coded colors
      const cells = container.querySelectorAll('td, th')
      cells.forEach(cell => {
        expect(cell.className).not.toMatch(/text-(gray|slate)-\d+/)
      })
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <Table>
          <TableCaption>Monthly transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2025-07-01</TableCell>
              <TableCell>Payment received</TableCell>
              <TableCell className="text-right">$1,250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-07-02</TableCell>
              <TableCell>Invoice #001</TableCell>
              <TableCell className="text-right">$750.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
        { theme: 'dark' }
      )
      
      // Check semantic colors are maintained in dark mode
      const header = container.querySelector('thead')
      expect(header?.className).toContain('border-b')
      
      // Caption should use semantic colors
      const caption = screen.getByText('Monthly transactions')
      expect(caption.className).toContain('text-muted-foreground')
    })

    it('maintains semantic colors for all table components', () => {
      const { container } = renderWithTheme(
        <Table>
          <TableCaption>Transaction summary</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>Office supplies</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow data-state="selected">
              <TableCell className="font-medium">INV002</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Software license</TableCell>
              <TableCell className="text-right">$1,200.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$1,450.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
        { theme: 'dark' }
      )
      
      // TableHeader should use semantic colors
      const headers = container.querySelectorAll('th')
      headers.forEach(header => {
        expect(header.className).toContain('text-muted-foreground')
        expect(header.className).toContain('font-medium')
      })
      
      // TableRow with data-state should use semantic hover colors
      const selectedRow = container.querySelector('tr[data-state="selected"]')
      expect(selectedRow?.className).toContain('data-[state=selected]:bg-muted')
      
      // TableFooter should use semantic colors
      const footer = container.querySelector('tfoot')
      expect(footer?.className).toContain('bg-muted/50')
      expect(footer?.className).toContain('border-t-2')
      expect(footer?.className).toContain('border-border')
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead>Column 1</TableHead>
              <TableHead>Column 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b transition-colors hover:bg-muted/50">
              <TableCell>Data 1</TableCell>
              <TableCell>Data 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
        { theme: 'dark' }
      )
      
      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string') {
          // Should not contain hard-coded color values
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
          expect(classList).not.toMatch(/border-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        }
      })
    })

    it('maintains theme consistency with different table states', () => {
      renderWithTheme(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Regular row</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
            <TableRow data-state="selected">
              <TableCell>Selected row</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
            <TableRow className="opacity-50">
              <TableCell>Disabled row</TableCell>
              <TableCell>Inactive</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
        { theme: 'dark' }
      )
      
      // Regular rows should have hover state with semantic colors
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(0)
      
      // Selected row should use semantic muted background
      const selectedRow = screen.getByText('Selected row').closest('tr')
      expect(selectedRow?.className).toContain('data-[state=selected]:bg-muted')
      
      // Disabled row should maintain semantic colors with opacity
      const disabledRow = screen.getByText('Disabled row').closest('tr')
      expect(disabledRow?.className).toContain('opacity-50')
    })

    it('works correctly with responsive tables', () => {
      const { container } = renderWithTheme(
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Date</TableHead>
                <TableHead className="min-w-[200px]">Description</TableHead>
                <TableHead className="min-w-[150px]">Category</TableHead>
                <TableHead className="min-w-[100px] text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2025-07-19</TableCell>
                <TableCell>Responsive table test with long description</TableCell>
                <TableCell>Development</TableCell>
                <TableCell className="text-right">$500.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>,
        { theme: 'dark' }
      )
      
      // Table should maintain semantic colors in responsive container
      const table = container.querySelector('table')
      expect(table).toBeInTheDocument()
      
      // Headers should still use semantic colors with min-width
      const headers = container.querySelectorAll('th')
      headers.forEach(header => {
        expect(header.className).toContain('text-muted-foreground')
      })
    })
  })
})