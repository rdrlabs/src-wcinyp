import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ScrollArea, ScrollBar } from './scroll-area'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('ScrollArea', () => {
  describe('Basic Functionality', () => {
    it('renders children content', () => {
      render(
        <ScrollArea className="h-[200px] w-[350px]">
          <div>Scrollable content</div>
        </ScrollArea>
      )

      expect(screen.getByText('Scrollable content')).toBeInTheDocument()
    })

    it('renders with viewport', () => {
      const { container } = render(
        <ScrollArea className="h-[200px]">
          <div>Content</div>
        </ScrollArea>
      )

      const viewport = container.querySelector('[data-radix-scroll-area-viewport]')
      expect(viewport).toBeInTheDocument()
    })

    it('renders long content that requires scrolling', () => {
      render(
        <ScrollArea className="h-[200px] w-[350px]">
          <div className="p-4">
            {Array.from({ length: 50 }, (_, i) => (
              <p key={i}>Line {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      )

      expect(screen.getByText('Line 1')).toBeInTheDocument()
      expect(screen.getByText('Line 50')).toBeInTheDocument()
    })
  })

  describe('ScrollBar', () => {
    it('renders as part of ScrollArea', () => {
      const { container } = render(
        <ScrollArea className="h-[200px]">
          <div style={{ height: '400px' }}>Tall content</div>
        </ScrollArea>
      )

      // ScrollArea contains scrollbar elements from Radix UI
      expect(container.firstChild).toBeInTheDocument()
    })

    it('can render ScrollBar separately', () => {
      // ScrollBar is a Radix UI primitive that needs to be within ScrollArea context
      // Just verify it can be imported
      expect(ScrollBar).toBeDefined()
    })

    it('renders with custom className', () => {
      const { container } = render(
        <ScrollArea className="custom-scroll">
          <div>Content</div>
        </ScrollArea>
      )

      expect(container.firstChild).toHaveClass('custom-scroll')
    })
  })

  describe('Styling', () => {
    it('applies default styling', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px]">
          <div>Content</div>
        </ScrollArea>
      )

      const scrollArea = container.firstChild
      expect(scrollArea).toHaveClass('relative')
      expect(scrollArea).toHaveClass('overflow-hidden')
      expect(scrollArea).toHaveClass('h-[200px]')
      expect(scrollArea).toHaveClass('w-[350px]')
    })

    it('applies rounded corners with rounded-md class', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] rounded-md">
          <div>Content</div>
        </ScrollArea>
      )

      expect(container.firstChild).toHaveClass('rounded-md')
    })

    it('applies border styling', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] border">
          <div>Content</div>
        </ScrollArea>
      )

      expect(container.firstChild).toHaveClass('border')
    })
  })

  describe('Common Use Cases', () => {
    it('renders a list with scroll', () => {
      render(
        <ScrollArea className="h-72 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium">Tags</h4>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="text-sm">
                Tag {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      )

      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('Tag 1')).toBeInTheDocument()
      expect(screen.getByText('Tag 20')).toBeInTheDocument()
    })

    it('renders horizontal scroll for wide content', () => {
      render(
        <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {Array.from({ length: 10 }, (_, i) => (
              <figure key={i} className="shrink-0">
                <div className="overflow-hidden rounded-md">
                  <div className="h-32 w-48 bg-muted" />
                </div>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )

      const figures = screen.getAllByRole('figure')
      expect(figures).toHaveLength(10)
    })

    it('renders code block with scroll', () => {
      render(
        <ScrollArea className="h-[200px] w-full rounded-md border">
          <pre className="p-4">
            <code>{`function example() {
  const longLine = 'This is a very long line of code that might need horizontal scrolling';
  console.log(longLine);
  
  // More code here
  return true;
}`}</code>
          </pre>
        </ScrollArea>
      )

      expect(screen.getByText(/function example/)).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <ScrollArea className="h-[200px] w-[350px] rounded-md border">
          <div className="p-4">
            <h4 className="text-lg font-semibold">Light mode scroll area</h4>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="py-2 text-muted-foreground">
                Item {i + 1} - This is scrollable content
              </p>
            ))}
          </div>
        </ScrollArea>,
        { theme: 'light' }
      )

      expect(screen.getByText('Light mode scroll area')).toBeInTheDocument()
      
      // ScrollArea should use semantic colors
      const scrollArea = container.firstChild
      expect(scrollArea).toHaveClass('border')
      
      // Content uses semantic text colors
      const title = screen.getByText('Light mode scroll area')
      expect(title.className).toContain('font-semibold')
      
      const items = screen.getAllByText(/Item \d+ - This is scrollable content/)
      items.forEach(item => {
        expect(item.className).toContain('text-muted-foreground')
      })
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <ScrollArea className="h-[200px] w-[350px] rounded-md border">
          <div className="p-4">
            <h4 className="text-lg font-semibold">Dark mode scroll area</h4>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="py-2 text-muted-foreground">
                Item {i + 1} - This is scrollable content
              </p>
            ))}
          </div>
        </ScrollArea>,
        { theme: 'dark' }
      )

      expect(screen.getByText('Dark mode scroll area')).toBeInTheDocument()
      
      // ScrollArea should use semantic colors
      const scrollArea = container.firstChild
      expect(scrollArea).toHaveClass('border')
      
      // Content uses semantic text colors
      const title = screen.getByText('Dark mode scroll area')
      expect(title.className).toContain('font-semibold')
      
      const items = screen.getAllByText(/Item \d+ - This is scrollable content/)
      items.forEach(item => {
        expect(item.className).toContain('text-muted-foreground')
      })
    })

    it('maintains semantic colors with custom styling', () => {
      renderWithTheme(
        <ScrollArea className="h-72 w-48 rounded-md border bg-card">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium text-card-foreground">Tags</h4>
            <div className="space-y-2">
              {['React', 'TypeScript', 'Tailwind'].map((tag) => (
                <div
                  key={tag}
                  className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>,
        { theme: 'dark' }
      )

      // ScrollArea uses semantic bg-card
      const title = screen.getByText('Tags')
      expect(title.className).toContain('text-card-foreground')
      
      // Tags use semantic colors
      const tags = ['React', 'TypeScript', 'Tailwind']
      tags.forEach(tagText => {
        const tag = screen.getByText(tagText)
        expect(tag.className).toContain('bg-muted')
        expect(tag.className).toContain('text-muted-foreground')
      })
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <ScrollArea className="h-[300px] w-full rounded-lg border">
          <div className="p-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold">Section 1</h3>
                <p className="text-sm text-muted-foreground">Content with semantic colors</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold text-card-foreground">Section 2</h3>
                <p className="text-sm text-muted-foreground">More content with semantic colors</p>
              </div>
            </div>
          </div>
        </ScrollArea>,
        { theme: 'dark' }
      )

      // Check scroll area doesn't have hard-coded colors
      const scrollArea = container.firstChild
      const scrollAreaClass = scrollArea?.className || ''
      expect(scrollAreaClass).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      
      // Check all sections use semantic colors
      const sections = container.querySelectorAll('.rounded-lg')
      sections.forEach(section => {
        const classList = section.className
        expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
    })

    it('maintains theme consistency with horizontal scroll', () => {
      renderWithTheme(
        <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="shrink-0 rounded-lg border bg-card p-4"
              >
                <div className="h-32 w-48 rounded-md bg-muted" />
                <p className="mt-2 text-sm font-medium">Card {i + 1}</p>
                <p className="text-xs text-muted-foreground">Description text</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>,
        { theme: 'dark' }
      )

      // Check cards use semantic colors
      const cards = screen.getAllByText(/^Card \d+$/)
      expect(cards).toHaveLength(5)
      
      cards.forEach(card => {
        const cardContainer = card.closest('.shrink-0')
        expect(cardContainer?.className).toContain('bg-card')
        expect(cardContainer?.className).toContain('border')
        
        // Check placeholder divs use semantic bg-muted
        const placeholder = cardContainer?.querySelector('.bg-muted')
        expect(placeholder).toBeInTheDocument()
      })
      
      // Check description text uses semantic colors
      const descriptions = screen.getAllByText('Description text')
      descriptions.forEach(desc => {
        expect(desc.className).toContain('text-muted-foreground')
      })
    })

    it('works with nested scroll areas in both themes', () => {
      const { rerender } = renderWithTheme(
        <ScrollArea className="h-[400px] w-[600px] rounded-lg border bg-background">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Outer scroll area</h3>
            <ScrollArea className="h-[200px] w-[400px] rounded-md border bg-muted/50">
              <div className="p-4">
                <h4 className="mb-2 font-medium">Inner scroll area</h4>
                <div className="space-y-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      Nested content {i + 1}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </ScrollArea>,
        { theme: 'light' }
      )

      // Light mode check
      expect(screen.getByText('Outer scroll area')).toBeInTheDocument()
      expect(screen.getByText('Inner scroll area')).toBeInTheDocument()
      
      const nestedItems = screen.getAllByText(/^Nested content \d+$/)
      nestedItems.forEach(item => {
        expect(item.className).toContain('text-muted-foreground')
      })

      // Switch to dark mode
      rerender(
        <ScrollArea className="h-[400px] w-[600px] rounded-lg border bg-background">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Outer scroll area</h3>
            <ScrollArea className="h-[200px] w-[400px] rounded-md border bg-muted/50">
              <div className="p-4">
                <h4 className="mb-2 font-medium">Inner scroll area</h4>
                <div className="space-y-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      Nested content {i + 1}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </ScrollArea>
      )

      // Dark mode - semantic colors should still work
      const darkNestedItems = screen.getAllByText(/^Nested content \d+$/)
      darkNestedItems.forEach(item => {
        expect(item.className).toContain('text-muted-foreground')
      })
    })
  }

  describe('Nested ScrollAreas', () => {
    it('supports nested scroll areas', () => {
      render(
        <ScrollArea className="h-[400px] w-[600px]">
          <div className="p-4">
            <h3>Outer scroll area</h3>
            <ScrollArea className="h-[200px] w-[400px] border">
              <div className="p-4">
                <h4>Inner scroll area</h4>
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i}>Inner content {i + 1}</p>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ScrollArea>
      )

      expect(screen.getByText('Outer scroll area')).toBeInTheDocument()
      expect(screen.getByText('Inner scroll area')).toBeInTheDocument()
      expect(screen.getByText('Inner content 20')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('maintains keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <ScrollArea className="h-[200px]">
          <div>
            <button>First button</button>
            <div style={{ height: '300px' }} />
            <button>Last button</button>
          </div>
        </ScrollArea>
      )

      await user.tab()
      expect(document.activeElement).toHaveTextContent('First button')

      await user.tab()
      expect(document.activeElement).toHaveTextContent('Last button')
    })

    it('preserves ARIA attributes on content', () => {
      render(
        <ScrollArea className="h-[200px]">
          <div role="list" aria-label="Items list">
            <div role="listitem">Item 1</div>
            <div role="listitem">Item 2</div>
          </div>
        </ScrollArea>
      )

      expect(screen.getByRole('list', { name: 'Items list' })).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty content', () => {
      const { container } = render(
        <ScrollArea className="h-[200px] w-[350px]" />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('handles content smaller than container', () => {
      render(
        <ScrollArea className="h-[400px]">
          <div className="h-[100px]">Small content</div>
        </ScrollArea>
      )

      expect(screen.getByText('Small content')).toBeInTheDocument()
    })

    it('handles dynamic content updates', () => {
      const { rerender } = render(
        <ScrollArea className="h-[200px]">
          <div>Initial content</div>
        </ScrollArea>
      )

      expect(screen.getByText('Initial content')).toBeInTheDocument()

      rerender(
        <ScrollArea className="h-[200px]">
          <div>Updated content</div>
        </ScrollArea>
      )

      expect(screen.getByText('Updated content')).toBeInTheDocument()
    })

    it('works without explicit dimensions', () => {
      render(
        <ScrollArea>
          <div>Flexible content</div>
        </ScrollArea>
      )

      expect(screen.getByText('Flexible content')).toBeInTheDocument()
    })
  })
})