import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders card with content', () => {
      render(<Card>Card content</Card>)
      
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-card">Test</Card>)
      
      const card = container.firstChild
      expect(card).toHaveClass('custom-card')
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-card')
    })
  })

  describe('CardHeader', () => {
    it('renders header content', () => {
      render(<CardHeader>Header content</CardHeader>)
      
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('applies header styles', () => {
      const { container } = render(<CardHeader className="custom-header">Header</CardHeader>)
      
      const header = container.firstChild
      expect(header).toHaveClass('custom-header')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('renders title text', () => {
      render(<CardTitle>Card Title</CardTitle>)
      
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('applies title styles', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>)
      
      const title = screen.getByText('Title')
      expect(title).toHaveClass('custom-title')
      expect(title).toHaveClass('font-semibold', 'leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('renders description text', () => {
      render(<CardDescription>Card description text</CardDescription>)
      
      expect(screen.getByText('Card description text')).toBeInTheDocument()
    })

    it('applies description styles', () => {
      render(<CardDescription className="custom-desc">Description</CardDescription>)
      
      const desc = screen.getByText('Description')
      expect(desc).toHaveClass('custom-desc')
      expect(desc).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('renders content', () => {
      render(<CardContent>Main content</CardContent>)
      
      expect(screen.getByText('Main content')).toBeInTheDocument()
    })

    it('applies content styles', () => {
      const { container } = render(<CardContent className="custom-content">Content</CardContent>)
      
      const content = container.firstChild
      expect(content).toHaveClass('custom-content')
      expect(content).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renders footer content', () => {
      render(<CardFooter>Footer content</CardFooter>)
      
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('applies footer styles', () => {
      const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>)
      
      const footer = container.firstChild
      expect(footer).toHaveClass('custom-footer')
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })

    it('renders multiple children in footer', () => {
      render(
        <CardFooter>
          <button>Cancel</button>
          <button>Save</button>
        </CardFooter>
      )
      
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })
  })

  describe('Complete Card', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Complete Card</CardTitle>
            <CardDescription>This is a complete card example</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card body content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      )
      
      expect(screen.getByText('Complete Card')).toBeInTheDocument()
      expect(screen.getByText('This is a complete card example')).toBeInTheDocument()
      expect(screen.getByText('Card body content goes here')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})