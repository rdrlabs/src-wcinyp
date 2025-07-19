import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
import { renderWithTheme } from '@/test/theme-test-utils'

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
      expect(card).toHaveClass('rounded-xl', 'text-card-foreground')
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
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-2', 'p-6')
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

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(
        <Card>
          <CardHeader>
            <CardTitle>Light Theme Card</CardTitle>
            <CardDescription>Testing in light mode</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>,
        { theme: 'light' }
      )
      
      const card = screen.getByText('Light Theme Card').closest('[data-slot="card"]')
      expect(card).toBeInTheDocument()
      
      // Card should use semantic bg-card color
      expect(card?.className).toContain('bg-card')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(
        <Card>
          <CardHeader>
            <CardTitle>Dark Theme Card</CardTitle>
            <CardDescription>Testing in dark mode</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>,
        { theme: 'dark' }
      )
      
      const card = screen.getByText('Dark Theme Card').closest('[data-slot="card"]')
      expect(card).toBeInTheDocument()
      
      // Card should use semantic bg-card color
      expect(card?.className).toContain('bg-card')
    })

    it('maintains semantic colors for all card components', () => {
      const { container } = renderWithTheme(
        <Card>
          <CardHeader>
            <CardTitle>Semantic Colors</CardTitle>
            <CardDescription>Description text</CardDescription>
          </CardHeader>
          <CardContent>Content here</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>,
        { theme: 'dark' }
      )
      
      // Check Card uses semantic colors
      const card = container.querySelector('[data-slot="card"]')
      expect(card?.className).toContain('bg-card')
      expect(card?.className).toContain('text-card-foreground')
      
      // Check CardDescription uses semantic colors
      const description = screen.getByText('Description text')
      expect(description.className).toContain('text-muted-foreground')
    })
  })
})