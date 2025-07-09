import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UpdatesPage from './page'
import { axe } from 'jest-axe'

describe('Updates Page', () => {
  describe('Page Structure', () => {
    it('renders page title and description', () => {
      render(<UpdatesPage />)
      
      expect(screen.getByRole('heading', { name: 'Updates' })).toBeInTheDocument()
      expect(screen.getByText('Stay informed with the latest news, operational updates, and important communications')).toBeInTheDocument()
    })

    it('displays coming soon message', () => {
      render(<UpdatesPage />)
      
      expect(screen.getByRole('heading', { name: 'Coming Soon' })).toBeInTheDocument()
    })

    it('renders all communication sections', () => {
      render(<UpdatesPage />)
      
      const expectedSections = [
        'Marketing Blog Posts',
        'Operational Updates',
        'General Announcements',
        'Upcoming Events',
        'Policy Updates',
        'System Notifications'
      ]
      
      expectedSections.forEach(section => {
        expect(screen.getByText(section)).toBeInTheDocument()
      })
    })
  })

  describe('Section Cards', () => {
    it('displays section descriptions', () => {
      render(<UpdatesPage />)
      
      expect(screen.getByText(/Latest articles and blog posts/i)).toBeInTheDocument()
      expect(screen.getByText(/Important departmental emails/i)).toBeInTheDocument()
      expect(screen.getByText(/Facility-wide communications/i)).toBeInTheDocument()
      expect(screen.getByText(/Department meetings, training sessions/i)).toBeInTheDocument()
      expect(screen.getByText(/Changes to clinical protocols/i)).toBeInTheDocument()
      expect(screen.getByText(/Technical updates, scheduled downtime/i)).toBeInTheDocument()
    })

    it('displays status indicators for each section', () => {
      render(<UpdatesPage />)
      
      expect(screen.getByText('3 new posts this week')).toBeInTheDocument()
      expect(screen.getByText('Last update: 2 days ago')).toBeInTheDocument()
      expect(screen.getByText('5 active announcements')).toBeInTheDocument()
      expect(screen.getByText('Next event: Tomorrow')).toBeInTheDocument()
      expect(screen.getByText('Updated this month')).toBeInTheDocument()
      expect(screen.getByText('All systems operational')).toBeInTheDocument()
    })

    it('renders icons for each section', () => {
      const { container } = render(<UpdatesPage />)
      
      // Check that icon containers exist
      const iconContainers = container.querySelectorAll('.p-2.rounded-lg.bg-primary\\/10')
      expect(iconContainers).toHaveLength(6)
      
      // Check that icons exist within containers
      iconContainers.forEach(container => {
        const icon = container.querySelector('svg')
        expect(icon).toBeInTheDocument()
        expect(icon).toHaveClass('h-6', 'w-6', 'text-primary')
      })
    })
  })

  describe('Layout and Styling', () => {
    it('uses proper container and spacing', () => {
      const { container } = render(<UpdatesPage />)
      
      expect(container.querySelector('.container.mx-auto.py-8')).toBeInTheDocument()
      expect(container.querySelector('.text-center.py-12')).toBeInTheDocument()
    })

    it('applies responsive grid layout', () => {
      const { container } = render(<UpdatesPage />)
      
      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('section cards have hover effects', () => {
      const { container } = render(<UpdatesPage />)
      
      const cards = container.querySelectorAll('.p-6.border.rounded-lg')
      cards.forEach(card => {
        expect(card).toHaveClass('hover:shadow-md', 'transition-shadow')
      })
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<UpdatesPage />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('uses semantic HTML structure', () => {
      render(<UpdatesPage />)
      
      // Main heading
      expect(screen.getByRole('heading', { level: 1, name: 'Updates' })).toBeInTheDocument()
      
      // Secondary heading
      expect(screen.getByRole('heading', { level: 2, name: 'Coming Soon' })).toBeInTheDocument()
      
      // Section headings
      const h3Headings = screen.getAllByRole('heading', { level: 3 })
      expect(h3Headings).toHaveLength(6)
    })
  })

  describe('Content Accuracy', () => {
    it('displays accurate placeholder content', () => {
      render(<UpdatesPage />)
      
      // Check that the page clearly indicates it's coming soon
      expect(screen.getByRole('heading', { name: 'Coming Soon' })).toBeInTheDocument()
      expect(screen.getByText(/Stay informed with the latest news/i)).toBeInTheDocument()
    })

    it('maintains consistent terminology', () => {
      render(<UpdatesPage />)
      
      // Ensure consistent use of "operational updates" terminology
      expect(screen.getByText('Operational Updates')).toBeInTheDocument()
      expect(screen.getByText(/operational announcements/i)).toBeInTheDocument()
    })
  })
})