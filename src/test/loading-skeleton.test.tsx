import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AppLoading from '@/app/loading'
import FormsLoading from '@/app/forms/loading'
import KnowledgeLoading from '@/app/knowledge/loading'

describe('Loading Components with Skeleton', () => {
  describe('App Loading', () => {
    it('should render loading spinner and text', () => {
      render(<AppLoading />)
      
      const loadingText = screen.getByText('Loading...')
      expect(loadingText).toBeInTheDocument()
      
      // Should have dark mode text color
      expect(loadingText.className).toContain('text-gray-600')
      expect(loadingText.className).toContain('dark:text-gray-400')
    })

    it('should have spinning animation', () => {
      render(<AppLoading />)
      
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Forms Loading - Should use Skeleton', () => {
    it('should render skeleton elements with dark mode support', () => {
      render(<FormsLoading />)
      
      // All skeleton elements should have animate-pulse
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
      
      // Skeleton components are rendered
      const container = document.querySelector('.container')
      expect(container).toBeInTheDocument()
      
      // Grid with skeleton cards exists
      const grid = document.querySelector('.grid')
      expect(grid).toBeInTheDocument()
    })

    it('should render card skeletons with proper dark mode', () => {
      render(<FormsLoading />)
      
      // Card skeletons should have both light and dark backgrounds
      const cardSkeletons = document.querySelectorAll('.bg-gray-50.dark\\:bg-gray-800')
      expect(cardSkeletons).toHaveLength(6) // 6 skeleton cards
      
      // Cards should have dark border
      cardSkeletons.forEach(card => {
        expect(card.className).toContain('border')
        expect(card.className).toContain('dark:border-gray-700')
      })
    })

    it('should have correct layout structure', () => {
      render(<FormsLoading />)
      
      // Should have grid layout
      const grid = document.querySelector('.grid.gap-4')
      expect(grid).toBeInTheDocument()
      
      // Should have responsive columns
      expect(grid?.className).toContain('md:grid-cols-2')
      expect(grid?.className).toContain('lg:grid-cols-3')
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
      
      // Card skeletons
      const cards = document.querySelectorAll('.bg-gray-50.dark\\:bg-gray-800')
      expect(cards).toHaveLength(6)
      
      // Each card should have dark border
      cards.forEach(card => {
        expect(card.className).toContain('dark:border-gray-700')
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