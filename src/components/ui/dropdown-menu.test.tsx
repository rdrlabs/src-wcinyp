import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Button } from './button'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('DropdownMenu', () => {
  describe('Basic Functionality', () => {
    it('renders trigger and opens menu on click', async () => {
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByRole('button', { name: 'Open Menu' })
      expect(trigger).toBeInTheDocument()

      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
        expect(screen.getByText('Profile')).toBeInTheDocument()
        expect(screen.getByText('Settings')).toBeInTheDocument()
        expect(screen.getByText('Logout')).toBeInTheDocument()
      })
    })

    it('closes menu when pressing escape', async () => {
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: 'Menu' }))
      expect(screen.getByRole('menu')).toBeInTheDocument()

      // Press escape to close menu
      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })

    it('closes menu when selecting item', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleClick}>
              Action
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: 'Menu' }))
      await user.click(screen.getByText('Action'))

      expect(handleClick).toHaveBeenCalled()
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
  })

  describe('DropdownMenuItem', () => {
    it('renders as menuitem', async () => {
      const user = userEvent.setup()
      
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const item = await screen.findByRole('menuitem')
      expect(item).toHaveTextContent('Item')
    })

    it('can be disabled', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const item = await screen.findByText('Disabled')
      expect(item).toHaveAttribute('data-disabled')
    })

    it('shows keyboard shortcut', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Save
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await screen.findByText('Save')
      expect(screen.getByText('⌘S')).toBeInTheDocument()
    })
  })

  describe('DropdownMenuCheckboxItem', () => {
    it('toggles checked state', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={handleChange}
            >
              Show toolbar
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: 'Options' }))
      await user.click(screen.getByText('Show toolbar'))

      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('shows check indicator when checked', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>
              Checked item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const item = await screen.findByRole('menuitemcheckbox')
      expect(item).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('DropdownMenuRadioGroup', () => {
    it('selects radio items', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Size</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="medium" onValueChange={handleChange}>
              <DropdownMenuRadioItem value="small">Small</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="large">Large</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: 'Size' }))
      await user.click(screen.getByText('Large'))

      expect(handleChange).toHaveBeenCalledWith('large')
    })

    it('shows selection indicator', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const option1 = await screen.findByRole('menuitemradio', { name: /Option 1/ })
      const option2 = await screen.findByRole('menuitemradio', { name: /Option 2/ })
      
      expect(option1).toHaveAttribute('aria-checked', 'true')
      expect(option2).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('DropdownMenuSub', () => {
    it('renders submenu', async () => {
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item 1</DropdownMenuItem>
                <DropdownMenuItem>Sub item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: 'Menu' }))
      
      const subTrigger = await screen.findByText('More')
      await user.hover(subTrigger)

      await waitFor(() => {
        expect(screen.getByText('Sub item 1')).toBeInTheDocument()
        expect(screen.getByText('Sub item 2')).toBeInTheDocument()
      })
    })

    it('shows chevron indicator', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const subTrigger = await screen.findByText('Submenu')
      const chevron = subTrigger.parentElement?.querySelector('svg')
      expect(chevron).toBeInTheDocument()
    })
  })

  describe('Organization', () => {
    it('renders with labels and separators', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      expect(await screen.findByText('Account')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
      
      const separators = screen.getAllByRole('separator')
      expect(separators).toHaveLength(1)
    })

    it('renders groups', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>New</DropdownMenuItem>
              <DropdownMenuItem>Open</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Save</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      expect(await screen.findByText('New')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>First</DropdownMenuItem>
            <DropdownMenuItem>Second</DropdownMenuItem>
            <DropdownMenuItem>Third</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: 'Menu' }))
      await user.keyboard('{ArrowDown}')

      // Focus should move through items
      expect(document.activeElement).toHaveTextContent('First')
    })

    it('closes on Escape', async () => {
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole('button', { name: 'Menu' }))
      expect(screen.getByRole('menu')).toBeInTheDocument()

      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })
  })

  describe('Positioning', () => {
    it('supports different alignments', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      expect(await screen.findByRole('menu')).toBeInTheDocument()
    })

    it('supports custom width', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem>Wide menu item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const content = await screen.findByRole('menu')
      expect(content).toHaveClass('w-56')
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const menu = await screen.findByRole('menu')
      expect(menu).toBeInTheDocument()

      const item = screen.getByRole('menuitem')
      expect(item).toBeInTheDocument()
    })

    it('manages focus correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      const trigger = screen.getByRole('button', { name: 'Menu' })
      await user.click(trigger)

      // Menu should be focusable
      const menu = await screen.findByRole('menu')
      expect(menu).toBeInTheDocument()
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
        { theme: 'light' }
      )

      await user.click(screen.getByRole('button', { name: 'Open Menu' }))

      await waitFor(() => {
        const menu = screen.getByRole('menu')
        expect(menu).toBeInTheDocument()
        
        // Menu content should use semantic color classes
        const menuClass = menu.className
        expect(menuClass).toContain('bg-popover')
        expect(menuClass).toContain('text-popover-foreground')
        expect(menuClass).toContain('border')
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
        { theme: 'dark' }
      )

      await user.click(screen.getByRole('button', { name: 'Open Menu' }))

      await waitFor(() => {
        const menu = screen.getByRole('menu')
        expect(menu).toBeInTheDocument()
        
        // Menu content should use semantic color classes
        const menuClass = menu.className
        expect(menuClass).toContain('bg-popover')
        expect(menuClass).toContain('text-popover-foreground')
        expect(menuClass).toContain('border')
      })
    })

    it('maintains semantic colors for all menu items', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Normal Item</DropdownMenuItem>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
            <DropdownMenuItem>
              With Shortcut
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
        { theme: 'dark' }
      )

      await user.click(screen.getByRole('button', { name: 'Menu' }))

      await waitFor(() => {
        // Check normal item uses semantic colors on hover
        const normalItem = screen.getByText('Normal Item')
        expect(normalItem.className).toContain('hover:bg-accent')
        expect(normalItem.className).toContain('hover:text-accent-foreground')
        
        // Check disabled item maintains semantic colors
        const disabledItem = screen.getByText('Disabled Item')
        expect(disabledItem.className).toContain('opacity-50')
        
        // Check shortcut uses semantic colors
        const shortcut = screen.getByText('⌘K')
        expect(shortcut.className).toContain('text-muted-foreground')
      })
    })

    it('maintains semantic colors for checkbox and radio items', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>
              Show Toolbar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Show Sidebar
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value="medium">
              <DropdownMenuRadioItem value="small">Small</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="large">Large</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
        { theme: 'dark' }
      )

      await user.click(screen.getByRole('button', { name: 'Options' }))

      await waitFor(() => {
        // Checkbox items should use semantic colors
        const checkboxItems = screen.getAllByRole('menuitemcheckbox')
        checkboxItems.forEach(item => {
          expect(item.className).toContain('hover:bg-accent')
          expect(item.className).toContain('hover:text-accent-foreground')
        })
        
        // Radio items should use semantic colors
        const radioItems = screen.getAllByRole('menuitemradio')
        radioItems.forEach(item => {
          expect(item.className).toContain('hover:bg-accent')
          expect(item.className).toContain('hover:text-accent-foreground')
        })
        
        // Separator should use semantic colors
        const separator = screen.getByRole('separator')
        expect(separator.className).toContain('bg-muted')
      })
    })

    it('ensures no hard-coded colors', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Full Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
        { theme: 'dark' }
      )

      await user.click(screen.getByRole('button', { name: 'Full Menu' }))

      await waitFor(() => {
        const menu = screen.getByRole('menu')
        const menuClass = menu.className
        
        // Menu should not contain hard-coded colors
        expect(menuClass).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        expect(menuClass).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
        
        // Label should use semantic colors
        const label = screen.getByText('My Account')
        expect(label.className).toContain('font-semibold')
        
        // All separators should use semantic colors
        const separators = screen.getAllByRole('separator')
        separators.forEach(separator => {
          expect(separator.className).toContain('bg-muted')
        })
      })
    })

    it('maintains theme consistency with submenus', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                Share
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Twitter</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
        { theme: 'dark' }
      )

      await user.click(screen.getByRole('button', { name: 'Menu' }))
      
      const subTrigger = await screen.findByText('Share')
      await user.hover(subTrigger)

      await waitFor(() => {
        // Submenu should also use semantic colors
        const emailItem = screen.getByText('Email')
        expect(emailItem).toBeInTheDocument()
        
        // Find the submenu content by looking for the parent of email item
        const submenu = emailItem.closest('[role="menu"]')
        expect(submenu?.className).toContain('bg-popover')
        expect(submenu?.className).toContain('text-popover-foreground')
        
        // Sub trigger should have semantic hover colors
        expect(subTrigger.className).toContain('hover:bg-accent')
      })
    })
  })
})