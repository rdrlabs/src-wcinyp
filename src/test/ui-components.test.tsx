import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

describe('shadcn/ui Components Integration', () => {
  describe('Badge Component', () => {
    it('should render with default variant', () => {
      render(<Badge>Default Badge</Badge>)
      const badge = screen.getByText('Default Badge')
      expect(badge).toBeInTheDocument()
      expect(badge.className).toContain('inline-flex')
    })

    it('should apply custom className', () => {
      render(
        <Badge className="bg-blue-50 text-blue-700">
          Custom Badge
        </Badge>
      )
      const badge = screen.getByText('Custom Badge')
      expect(badge.className).toContain('bg-blue-50')
      expect(badge.className).toContain('text-blue-700')
    })

    it('should support different variants', () => {
      const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
      expect(screen.getByText('Secondary')).toBeInTheDocument()
      
      rerender(<Badge variant="destructive">Destructive</Badge>)
      expect(screen.getByText('Destructive')).toBeInTheDocument()
      
      rerender(<Badge variant="outline">Outline</Badge>)
      expect(screen.getByText('Outline')).toBeInTheDocument()
    })

    it('should support dark mode classes', () => {
      render(
        <Badge className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
          Dark Mode Badge
        </Badge>
      )
      const badge = screen.getByText('Dark Mode Badge')
      expect(badge.className).toContain('dark:bg-blue-950/50')
      expect(badge.className).toContain('dark:text-blue-300')
    })
  })

  describe('Skeleton Component', () => {
    it('should render with animation', () => {
      render(<Skeleton className="h-8 w-48" />)
      const skeleton = document.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('h-8', 'w-48')
    })

    it('should replace loading divs', () => {
      // Old pattern
      const oldPattern = render(
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
      )
      const oldDiv = oldPattern.container.querySelector('.animate-pulse')
      expect(oldDiv).toBeInTheDocument()
      oldPattern.unmount()

      // New pattern with Skeleton
      render(<Skeleton className="h-8 w-48" />)
      const skeleton = document.querySelector('.animate-pulse')
      expect(skeleton).toBeInTheDocument()
    })
  })

  describe('Select Component', () => {
    it('should render select trigger', () => {
      render(
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )
      
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    it('should support dark mode styling', () => {
      render(
        <Select>
          <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-200">
            <SelectValue placeholder="Dark mode select" />
          </SelectTrigger>
        </Select>
      )
      
      const trigger = screen.getByRole('combobox')
      expect(trigger.className).toContain('dark:bg-gray-700')
      expect(trigger.className).toContain('dark:text-gray-200')
    })
  })

  describe('Switch Component', () => {
    it('should render as a button with role switch', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
      expect(switchElement).toHaveAttribute('type', 'button')
    })

    it('should have unchecked state by default', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('Avatar Component', () => {
    it('should render with image', () => {
      render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="Test User" />
          <AvatarFallback>TU</AvatarFallback>
        </Avatar>
      )
      
      // Avatar renders as a div container
      const avatar = document.querySelector('.rounded-full')
      expect(avatar).toBeInTheDocument()
      
      // Fallback is always rendered but hidden when image loads
      expect(screen.getByText('TU')).toBeInTheDocument()
    })

    it('should show fallback when no image', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
      
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })

  describe('Separator Component', () => {
    it('should render horizontal separator by default', () => {
      render(<Separator decorative={false} />)
      const separator = screen.getByRole('separator')
      expect(separator).toBeInTheDocument()
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('should support vertical orientation', () => {
      render(<Separator orientation="vertical" decorative={false} />)
      const separator = screen.getByRole('separator')
      expect(separator).toHaveAttribute('data-orientation', 'vertical')
    })
  })
})