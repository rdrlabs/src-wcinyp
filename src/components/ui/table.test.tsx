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
      expect(footer).toHaveClass('border-t', 'bg-muted/50', 'font-medium')
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
})