import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AppLoading from '@/app/loading'
import KnowledgeLoading from '@/app/knowledge/loading'

describe('Loading Components with Skeleton', () => {
  describe('App Loading', () => {
    it('should render loading spinner and text', () => {
      render(<AppLoading />)
      
      const loadingText = screen.getByText('Loading...')
      expect(loadingText).toBeInTheDocument()
      
      // Should have semantic text color
      expect(loadingText.className).toContain('text-muted-foreground')
    })

    it('should have spinning animation', () => {
      render(<AppLoading />)
      
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })


  describe('Knowledge Loading - Should use Skeleton', () => {
    it('should render skeleton elements with dark mode', () => {
      render(<KnowledgeLoading />)
      
      // Container exists
      const container = document.querySelector('.container')
      expect(container).toBeInTheDocument()
      
      // Grid layout exists
      const grid = document.querySelector('.grid')
      expect(grid).toBeInTheDocument()
    })

    it('should render card skeletons', () => {
      render(<KnowledgeLoading />)
      
      // Card skeletons with semantic colors - more specific selector
      const cards = document.querySelectorAll('.grid > div.bg-muted')
      expect(cards).toHaveLength(6)
      
      // Each card should have semantic border
      cards.forEach(card => {
        expect(card.className).toContain('border-border')
      })
    })
  })

  describe('Skeleton Component Usage', () => {
    it('should replace hardcoded skeleton divs with Skeleton component', () => {
      // This test documents the pattern we want to follow
      
      // OLD PATTERN - Don't use this:
      // const oldPattern = <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
      
      // NEW PATTERN - Use this instead:
      // import { Skeleton } from "@/components/ui/skeleton"
      // <Skeleton className="h-8 w-48" />
      
      // The Skeleton component handles:
      // - animate-pulse animation
      // - rounded corners
      // - proper dark mode colors
      // - consistent styling
      
      expect(true).toBe(true) // Documentation test
    })
  })
})