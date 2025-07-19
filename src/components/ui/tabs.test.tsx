import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('Tabs', () => {
  describe('Basic Functionality', () => {
    it('renders tabs with default value', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
    })

    it('switches tabs on click', async () => {
      const user = userEvent.setup()
      
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }))

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false')
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('supports controlled mode', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      const { rerender } = render(
        <Tabs value="tab1" onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }))
      expect(handleChange).toHaveBeenCalledWith('tab2')

      // Update controlled value
      rerender(
        <Tabs value="tab2" onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )

      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })
  })

  describe('TabsList', () => {
    it('renders as tablist', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      )

      expect(screen.getByRole('tablist')).toBeInTheDocument()
    })

    it('applies default styling', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      )

      const tabsList = screen.getByRole('tablist')
      expect(tabsList).toHaveClass('inline-flex')
      expect(tabsList).toHaveClass('items-center')
      expect(tabsList).toHaveClass('justify-center')
      expect(tabsList).toHaveClass('rounded-md')
      expect(tabsList).toHaveClass('bg-muted')
      expect(tabsList).toHaveClass('p-2')
    })

    it('accepts custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-tabs-list">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      )

      expect(screen.getByRole('tablist')).toHaveClass('custom-tabs-list')
    })
  })

  describe('TabsTrigger', () => {
    it('renders as tab button', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>
      )

      const trigger = screen.getByRole('tab', { name: 'Tab 1' })
      expect(trigger.tagName).toBe('BUTTON')
    })

    it('can be disabled', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      )

      const disabledTab = screen.getByRole('tab', { name: 'Tab 2' })
      expect(disabledTab).toBeDisabled()
      expect(disabledTab).toHaveClass('disabled:pointer-events-none')
      expect(disabledTab).toHaveClass('disabled:opacity-50')
    })

    it('shows active state styling', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Active Tab</TabsTrigger>
            <TabsTrigger value="tab2">Inactive Tab</TabsTrigger>
          </TabsList>
        </Tabs>
      )

      const activeTab = screen.getByRole('tab', { name: 'Active Tab' })
      const inactiveTab = screen.getByRole('tab', { name: 'Inactive Tab' })

      expect(activeTab).toHaveClass('data-[state=active]:bg-background')
      expect(activeTab).toHaveClass('data-[state=active]:text-foreground')
      expect(activeTab).toHaveClass('data-[state=active]:shadow-sm')
      
      // Inactive tab should not have active state
      expect(inactiveTab).toHaveAttribute('data-state', 'inactive')
    })
  })

  describe('TabsContent', () => {
    it('renders as tabpanel', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      )

      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
    })

    it('only shows content for active tab', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      )

      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Content 3')).not.toBeInTheDocument()
    })

    it('applies focus ring styling', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      )

      const content = screen.getByRole('tabpanel')
      expect(content).toHaveClass('ring-offset-background')
      expect(content).toHaveClass('focus-visible:outline-none')
      expect(content).toHaveClass('focus-visible:ring-2')
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      )

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
      await user.click(tab1)
      
      await user.keyboard('{ArrowRight}')
      expect(document.activeElement).toHaveTextContent('Tab 2')

      await user.keyboard('{ArrowRight}')
      expect(document.activeElement).toHaveTextContent('Tab 3')

      await user.keyboard('{ArrowLeft}')
      expect(document.activeElement).toHaveTextContent('Tab 2')
    })

    it('supports Home and End keys', async () => {
      const user = userEvent.setup()
      
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
        </Tabs>
      )

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
      await user.click(tab2)

      await user.keyboard('{Home}')
      expect(document.activeElement).toHaveTextContent('Tab 1')

      await user.keyboard('{End}')
      expect(document.activeElement).toHaveTextContent('Tab 3')
    })
  })

  describe('Theme Support', () => {
    it('renders correctly in light theme', () => {
      renderWithTheme(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Light Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Light content</TabsContent>
        </Tabs>,
        { theme: 'light' }
      )

      expect(screen.getByText('Light Tab')).toBeInTheDocument()
      expect(screen.getByText('Light content')).toBeInTheDocument()
    })

    it('renders correctly in dark theme', () => {
      renderWithTheme(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Dark Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Dark content</TabsContent>
        </Tabs>,
        { theme: 'dark' }
      )

      expect(screen.getByText('Dark Tab')).toBeInTheDocument()
      expect(screen.getByText('Dark content')).toBeInTheDocument()
    })
  })

  describe('Common Use Cases', () => {
    it('renders account settings tabs', async () => {
      const user = userEvent.setup()
      
      render(
        <Tabs defaultValue="general" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4">
            <h3>General Settings</h3>
            <p>Manage your account settings</p>
          </TabsContent>
          <TabsContent value="security" className="space-y-4">
            <h3>Security Settings</h3>
            <p>Manage your security preferences</p>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <h3>Notification Settings</h3>
            <p>Manage your notifications</p>
          </TabsContent>
        </Tabs>
      )

      expect(screen.getByText('General Settings')).toBeInTheDocument()

      await user.click(screen.getByRole('tab', { name: 'Security' }))
      expect(screen.getByText('Security Settings')).toBeInTheDocument()

      await user.click(screen.getByRole('tab', { name: 'Notifications' }))
      expect(screen.getByText('Notification Settings')).toBeInTheDocument()
    })

    it('renders with icons in triggers', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">
              <span className="mr-2">📁</span> Files
            </TabsTrigger>
            <TabsTrigger value="tab2">
              <span className="mr-2">⚙️</span> Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Files content</TabsContent>
          <TabsContent value="tab2">Settings content</TabsContent>
        </Tabs>
      )

      expect(screen.getByText('📁')).toBeInTheDocument()
      expect(screen.getByText('⚙️')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList aria-label="Account settings">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )

      const tabsList = screen.getByRole('tablist', { name: 'Account settings' })
      expect(tabsList).toBeInTheDocument()

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
      expect(tab1).toHaveAttribute('aria-selected', 'true')
      expect(tab1).toHaveAttribute('aria-controls')

      const panel = screen.getByRole('tabpanel')
      expect(panel).toHaveAttribute('aria-labelledby', tab1.id)
    })

    it('maintains focus management', async () => {
      const user = userEvent.setup()
      
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <button>Button in tab 1</button>
          </TabsContent>
          <TabsContent value="tab2">
            <button>Button in tab 2</button>
          </TabsContent>
        </Tabs>
      )

      await user.tab()
      expect(document.activeElement).toHaveTextContent('Tab 1')

      await user.tab()
      expect(document.activeElement).toHaveTextContent('Button in tab 1')
    })
  })

  describe('Edge Cases', () => {
    it('handles no default value', () => {
      render(
        <Tabs>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      )

      // No tab should be selected initially
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false')
    })

    it('handles single tab', () => {
      render(
        <Tabs defaultValue="only">
          <TabsList>
            <TabsTrigger value="only">Only Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="only">Only Content</TabsContent>
        </Tabs>
      )

      expect(screen.getByRole('tab', { name: 'Only Tab' })).toBeInTheDocument()
      expect(screen.getByText('Only Content')).toBeInTheDocument()
    })

    it('handles many tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            {Array.from({ length: 10 }, (_, i) => (
              <TabsTrigger key={i} value={`tab${i}`}>
                Tab {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )

      expect(screen.getAllByRole('tab')).toHaveLength(10)
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Light mode content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
        { theme: 'light' }
      )
      
      // TabsList should use semantic colors
      const tabsList = screen.getByRole('tablist')
      const listClass = tabsList.className
      expect(listClass).toContain('bg-muted')
      expect(listClass).toContain('text-muted-foreground')
      
      // Active tab should use semantic colors
      const activeTab = screen.getByRole('tab', { selected: true })
      const activeClass = activeTab.className
      expect(activeClass).toContain('bg-background')
      expect(activeClass).toContain('text-foreground')
      expect(activeClass).toContain('shadow-sm')
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Dark mode content</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
        { theme: 'dark' }
      )
      
      // TabsList should use semantic colors
      const tabsList = screen.getByRole('tablist')
      const listClass = tabsList.className
      expect(listClass).toContain('bg-muted')
      expect(listClass).toContain('text-muted-foreground')
      
      // Active tab should use semantic colors
      const activeTab = screen.getByRole('tab', { selected: true })
      const activeClass = activeTab.className
      expect(activeClass).toContain('bg-background')
      expect(activeClass).toContain('text-foreground')
      expect(activeClass).toContain('shadow-sm')
    })

    it('maintains semantic colors when switching tabs', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
        { theme: 'dark' }
      )
      
      // Click through tabs and check colors
      const tabs = ['Tab 2', 'Tab 3', 'Tab 1']
      
      for (const tabName of tabs) {
        await user.click(screen.getByRole('tab', { name: tabName }))
        
        const activeTab = screen.getByRole('tab', { selected: true })
        const activeClass = activeTab.className
        
        expect(activeClass).toContain('bg-background')
        expect(activeClass).toContain('text-foreground')
        
        // Inactive tabs should have muted colors
        const inactiveTabs = screen.getAllByRole('tab', { selected: false })
        inactiveTabs.forEach(tab => {
          expect(tab.className).not.toContain('bg-background')
        })
      }
    })

    it('maintains semantic colors with disabled tabs', () => {
      renderWithTheme(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Active Tab</TabsTrigger>
            <TabsTrigger value="tab2" disabled>Disabled Tab</TabsTrigger>
            <TabsTrigger value="tab3">Another Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>,
        { theme: 'dark' }
      )
      
      const disabledTab = screen.getByRole('tab', { name: 'Disabled Tab' })
      const disabledClass = disabledTab.className
      
      // Disabled tab should still use semantic colors with opacity
      expect(disabledClass).toContain('disabled:pointer-events-none')
      expect(disabledClass).toContain('disabled:opacity-50')
    })

    it('ensures no hard-coded colors', () => {
      renderWithTheme(
        <Tabs defaultValue="tab1">
          <TabsList className="custom-class">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-4">
              <h3 className="font-semibold">Tab Content</h3>
              <p className="text-muted-foreground">This content uses semantic colors</p>
            </div>
          </TabsContent>
        </Tabs>,
        { theme: 'dark' }
      )
      
      // Check TabsList
      const tabsList = screen.getByRole('tablist')
      expect(tabsList.className).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      
      // Check TabsTriggers
      const tabs = screen.getAllByRole('tab')
      tabs.forEach(tab => {
        expect(tab.className).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
      })
      
      // Check TabsContent
      const content = screen.getByRole('tabpanel')
      expect(content.className).toContain('text-foreground')
    })

    it('maintains theme consistency with custom orientations', () => {
      renderWithTheme(
        <Tabs defaultValue="tab1" orientation="vertical">
          <TabsList>
            <TabsTrigger value="tab1">Vertical Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Vertical Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Vertical content</TabsContent>
          <TabsContent value="tab2">More vertical content</TabsContent>
        </Tabs>,
        { theme: 'dark' }
      )
      
      const tabsList = screen.getByRole('tablist')
      
      // Vertical tabs should still use semantic colors
      expect(tabsList.className).toContain('bg-muted')
      
      const activeTab = screen.getByRole('tab', { selected: true })
      expect(activeTab.className).toContain('bg-background')
      expect(activeTab.className).toContain('text-foreground')
    })
  })
})