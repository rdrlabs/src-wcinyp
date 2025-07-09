import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, User } from 'lucide-react'

describe('Visual Proportions Tests', () => {
  describe('Badge Component', () => {
    it('has correct padding for text-xs', () => {
      render(<Badge>Test Badge</Badge>)
      const badge = screen.getByText('Test Badge')
      expect(badge).toHaveClass('px-2.5', 'py-0.5', 'text-xs')
    })

    it('has proper proportions with icons', () => {
      render(
        <Badge>
          <User className="h-4 w-4" />
          Provider
        </Badge>
      )
      const badge = screen.getByText('Provider').closest('div')
      expect(badge).toHaveClass('px-2.5')
      expect(badge).toHaveClass('py-0.5')
    })
  })

  describe('Button Component', () => {
    it('has correct height for each size', () => {
      const { rerender } = render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-9')

      rerender(<Button size="default">Default</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-10')

      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-11')
    })

    it('has proper icon size proportions', () => {
      render(
        <Button>
          <FileText className="h-4 w-4" />
          Download
        </Button>
      )
      const button = screen.getByRole('button')
      const svg = button.querySelector('svg')
      expect(svg).toHaveClass('h-4', 'w-4')
    })
  })

  describe('Table Component', () => {
    it('has correct padding and height for headers', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      )
      const th = screen.getByText('Name')
      expect(th).toHaveClass('h-12', 'px-3')
    })

    it('has correct padding for cells', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const td = screen.getByText('Content')
      expect(td).toHaveClass('p-3')
    })
  })

  describe('Proportional Relationships', () => {
    it('maintains visual hierarchy with consistent text-sm', () => {
      render(
        <div>
          <h1 className="text-2xl font-semibold">Page Title</h1>
          <p className="text-base">Body text content</p>
          <Badge>Status Badge</Badge>
          <Button size="sm">Action Button</Button>
        </div>
      )

      const title = screen.getByText('Page Title')
      const body = screen.getByText('Body text content')
      const badge = screen.getByText('Status Badge')
      const button = screen.getByText('Action Button')

      // Check that all elements maintain proper hierarchy
      expect(title).toHaveClass('text-2xl')
      expect(body).toHaveClass('text-base')
      expect(badge).toHaveClass('text-xs')
      expect(button).toHaveClass('text-sm')
    })

    it('uses consistent icon sizes with text', () => {
      render(
        <div>
          <span className="inline-flex items-center gap-2 text-sm">
            <User className="h-4 w-4" data-testid="small-icon" />
            Text with small icon
          </span>
          <span className="inline-flex items-center gap-2 text-base">
            <User className="h-6 w-6" data-testid="medium-icon" />
            Text with medium icon
          </span>
        </div>
      )

      // Icons should scale proportionally with text size
      const smallIcon = screen.getByTestId('small-icon')
      const mediumIcon = screen.getByTestId('medium-icon')

      expect(smallIcon).toHaveClass('h-4', 'w-4')
      expect(mediumIcon).toHaveClass('h-6', 'w-6')
    })
  })
})