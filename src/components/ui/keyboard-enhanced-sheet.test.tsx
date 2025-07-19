import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { KeyboardEnhancedSheetContent } from './keyboard-enhanced-sheet'
import { Sheet, SheetTrigger } from './sheet'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('KeyboardEnhancedSheetContent', () => {
  // Store original focus method to restore later
  let originalFocus: typeof HTMLElement.prototype.focus

  beforeEach(() => {
    originalFocus = HTMLElement.prototype.focus
    // Mock focus to track calls
    HTMLElement.prototype.focus = vi.fn(function(this: HTMLElement) {
      originalFocus.call(this)
    })
  })

  afterEach(() => {
    HTMLElement.prototype.focus = originalFocus
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('renders sheet content with children', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <div>Sheet content</div>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      expect(screen.getByText('Sheet content')).toBeInTheDocument()
    })

    it('wraps children in focus container', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button>Button in sheet</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      const button = screen.getByRole('button', { name: 'Button in sheet' })
      expect(button.parentElement).toBeInTheDocument()
    })

    it('passes through props to SheetContent', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent 
            side="left" 
            className="custom-sheet"
            aria-label="Custom sheet"
          >
            Content
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('custom-sheet')
      expect(dialog).toHaveAttribute('aria-label', 'Custom sheet')
    })
  })

  describe('Focus Management', () => {
    it('focuses first focusable element on mount', async () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button>First button</button>
            <input type="text" placeholder="Input" />
            <button>Last button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      await waitFor(() => {
        const firstButton = screen.getByRole('button', { name: 'First button' })
        expect(HTMLElement.prototype.focus).toHaveBeenCalled()
        expect(document.activeElement).toBe(firstButton)
      })
    })

    it('handles no focusable elements gracefully', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <div>No focusable content</div>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      // Should not throw error
      expect(screen.getByText('No focusable content')).toBeInTheDocument()
    })

    it('focuses elements with tabindex', async () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <div tabIndex={0}>Focusable div</div>
            <button>Button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      await waitFor(() => {
        const focusableDiv = screen.getByText('Focusable div')
        expect(document.activeElement).toBe(focusableDiv)
      })
    })

    it('skips elements with tabindex="-1"', async () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button tabIndex={-1}>Skipped button</button>
            <button>Focused button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      await waitFor(() => {
        const focusedButton = screen.getByRole('button', { name: 'Focused button' })
        expect(document.activeElement).toBe(focusedButton)
      })
    })
  })

  describe('Tab Trapping', () => {
    it('traps tab navigation within sheet', async () => {
      const user = userEvent.setup()
      
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button>First</button>
            <button>Middle</button>
            <button>Last</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      const firstButton = screen.getByRole('button', { name: 'First' })
      const lastButton = screen.getByRole('button', { name: 'Last' })

      // Wait for initial focus
      await waitFor(() => {
        expect(document.activeElement).toBe(firstButton)
      })

      // Tab from last element should go to first
      lastButton.focus()
      await user.keyboard('{Tab}')
      
      expect(document.activeElement).toBe(firstButton)
    })

    it('handles shift+tab from first element', async () => {
      const user = userEvent.setup()
      
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button>First</button>
            <button>Middle</button>
            <button>Last</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      const firstButton = screen.getByRole('button', { name: 'First' })
      const lastButton = screen.getByRole('button', { name: 'Last' })

      // Wait for initial focus
      await waitFor(() => {
        expect(document.activeElement).toBe(firstButton)
      })

      // Shift+Tab from first element should go to last
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      
      expect(document.activeElement).toBe(lastButton)
    })

    it('allows normal tab navigation in middle', async () => {
      const user = userEvent.setup()
      
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button>First</button>
            <button>Middle</button>
            <button>Last</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      const firstButton = screen.getByRole('button', { name: 'First' })
      const middleButton = screen.getByRole('button', { name: 'Middle' })

      // Wait for initial focus
      await waitFor(() => {
        expect(document.activeElement).toBe(firstButton)
      })

      // Normal tab navigation
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(middleButton)
    })
  })

  describe('Different Sheet Sides', () => {
    it('works with left side sheet', async () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="left">
            <button>Left sheet button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'Left sheet button' })
        expect(document.activeElement).toBe(button)
      })
    })

    it('works with top side sheet', async () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="top">
            <button>Top sheet button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'Top sheet button' })
        expect(document.activeElement).toBe(button)
      })
    })

    it('works with bottom side sheet', async () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="bottom">
            <button>Bottom sheet button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'Bottom sheet button' })
        expect(document.activeElement).toBe(button)
      })
    })
  })

  describe('Complex Content', () => {
    it('handles forms with multiple inputs', async () => {
      const user = userEvent.setup()
      
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <form>
              <input name="username" placeholder="Username" />
              <input name="password" type="password" placeholder="Password" />
              <button type="submit">Login</button>
            </form>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      const usernameInput = screen.getByPlaceholderText('Username')
      const passwordInput = screen.getByPlaceholderText('Password')

      await waitFor(() => {
        expect(document.activeElement).toBe(usernameInput)
      })

      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(passwordInput)
    })

    it('handles navigation menu', async () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <nav>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      await waitFor(() => {
        const homeLink = screen.getByRole('link', { name: 'Home' })
        expect(document.activeElement).toBe(homeLink)
      })
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const { container } = renderWithTheme(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="right" className="w-80">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Sheet Title</h2>
                <p className="text-sm text-muted-foreground">
                  This sheet demonstrates keyboard navigation with semantic colors.
                </p>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded">
                    Option 1
                  </button>
                  <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded">
                    Option 2
                  </button>
                </div>
              </div>
              <div className="p-4 border-t">
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded">
                  Apply
                </button>
              </div>
            </div>
          </KeyboardEnhancedSheetContent>
        </Sheet>,
        { theme: 'light' }
      )

      // Check sheet uses semantic colors
      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('bg-background')
      expect(dialog.className).toContain('text-foreground')
      expect(dialog.className).toContain('border-l')
      
      // Check header section
      const title = screen.getByText('Sheet Title')
      expect(title.className).toContain('font-semibold')
      
      const description = screen.getByText(/This sheet demonstrates/)
      expect(description.className).toContain('text-muted-foreground')
      
      // Check buttons use semantic colors
      const option1 = screen.getByRole('button', { name: 'Option 1' })
      expect(option1.className).toContain('bg-secondary')
      expect(option1.className).toContain('text-secondary-foreground')
      expect(option1.className).toContain('hover:bg-secondary/80')
      
      const applyButton = screen.getByRole('button', { name: 'Apply' })
      expect(applyButton.className).toContain('bg-primary')
      expect(applyButton.className).toContain('text-primary-foreground')
      
      // Verify focus behavior works with themed elements
      await waitFor(() => {
        expect(document.activeElement).toBe(option1)
      })
    })

    it('renders correctly in dark mode', async () => {
      const { container } = renderWithTheme(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="left">
            <nav className="h-full bg-background">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-6">Navigation</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="#dashboard" className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="#profile" className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a href="#settings" className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                      Settings
                    </a>
                  </li>
                </ul>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded">
                  Logout
                </button>
              </div>
            </nav>
          </KeyboardEnhancedSheetContent>
        </Sheet>,
        { theme: 'dark' }
      )

      // Check sheet maintains semantic colors in dark mode
      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('bg-background')
      
      // Check nav container
      const nav = container.querySelector('nav')
      expect(nav?.className).toContain('bg-background')
      
      // Check links use semantic hover states
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link.className).toContain('hover:bg-accent')
        expect(link.className).toContain('hover:text-accent-foreground')
      })
      
      // Check logout button
      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      expect(logoutButton.className).toContain('bg-secondary')
      expect(logoutButton.className).toContain('text-secondary-foreground')
      
      // Verify first link gets focus
      await waitFor(() => {
        expect(document.activeElement).toBe(links[0])
      })
    })

    it('maintains semantic colors for different sheet sides', () => {
      const sides = ['top', 'right', 'bottom', 'left'] as const
      
      sides.forEach(side => {
        const { unmount } = renderWithTheme(
          <Sheet defaultOpen>
            <KeyboardEnhancedSheetContent side={side}>
              <div className="p-4">
                <h3 className="font-medium mb-2">{side} Sheet</h3>
                <p className="text-muted-foreground">Content for {side} sheet</p>
              </div>
            </KeyboardEnhancedSheetContent>
          </Sheet>,
          { theme: 'dark' }
        )
        
        const dialog = screen.getByRole('dialog')
        expect(dialog.className).toContain('bg-background')
        
        const heading = screen.getByText(`${side} Sheet`)
        expect(heading.className).toContain('font-medium')
        
        const content = screen.getByText(`Content for ${side} sheet`)
        expect(content.className).toContain('text-muted-foreground')
        
        unmount()
      })
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent className="w-96">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">Filters</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Refine your search results
                </p>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Category
                    </label>
                    <select className="w-full px-3 py-2 bg-background border rounded">
                      <option>All Categories</option>
                      <option>Electronics</option>
                      <option>Clothing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range
                    </label>
                    <input type="range" className="w-full" min="0" max="1000" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>$0</span>
                      <span>$1000</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Brand
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Brand A</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Brand B</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t space-y-2">
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded">
                  Apply Filters
                </button>
                <button className="w-full px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                  Clear All
                </button>
              </div>
            </div>
          </KeyboardEnhancedSheetContent>
        </Sheet>,
        { theme: 'dark' }
      )
      
      // Check all elements for hard-coded colors
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const classList = element.className
        if (typeof classList === 'string') {
          // Should not contain hard-coded color values
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone)-\d+/)
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone)-\d+/)
          expect(classList).not.toMatch(/border-(gray|slate|zinc|neutral|stone)-\d+/)
        }
      })
    })

    it('tab trapping works correctly with themed elements', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <div className="p-4 space-y-4">
              <h3 className="font-semibold">Quick Actions</h3>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded">
                Create New
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded">
                Import
              </button>
              <button className="w-full px-4 py-2 border bg-background hover:bg-accent rounded">
                Export
              </button>
            </div>
          </KeyboardEnhancedSheetContent>
        </Sheet>,
        { theme: 'light' }
      )
      
      const createButton = screen.getByRole('button', { name: 'Create New' })
      const importButton = screen.getByRole('button', { name: 'Import' })
      const exportButton = screen.getByRole('button', { name: 'Export' })
      
      // Wait for initial focus
      await waitFor(() => {
        expect(document.activeElement).toBe(createButton)
      })
      
      // Tab through all elements
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(importButton)
      
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(exportButton)
      
      // Tab from last element should wrap to first
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(createButton)
      
      // Shift+Tab should go backwards
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(document.activeElement).toBe(exportButton)
    })

    it('works with complex themed forms', async () => {
      renderWithTheme(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="right" className="w-[400px]">
            <form className="h-full flex flex-col">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold mb-1">Add New Item</h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below
                </p>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-background border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-background border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={4}
                    placeholder="Enter description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select className="w-full px-3 py-2 bg-background border rounded focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t flex gap-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </KeyboardEnhancedSheetContent>
        </Sheet>,
        { theme: 'dark' }
      )
      
      // Check form elements use semantic colors
      const inputs = container.querySelectorAll('input, textarea, select')
      inputs.forEach(input => {
        expect(input.className).toContain('bg-background')
        expect(input.className).toContain('border')
        expect(input.className).toContain('focus:ring-ring')
      })
      
      // Check labels
      const labels = container.querySelectorAll('label')
      labels.forEach(label => {
        if (label.className) {
          expect(label.className).toContain('font-medium')
        }
      })
      
      // Verify focus goes to first input
      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Enter title')
        expect(document.activeElement).toBe(titleInput)
      })
    })

    it('sheet overlay uses semantic colors', () => {
      const { baseElement } = renderWithTheme(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <p>Content</p>
          </KeyboardEnhancedSheetContent>
        </Sheet>,
        { theme: 'dark' }
      )
      
      // Check overlay uses semantic opacity
      const overlay = baseElement.querySelector('[data-radix-dialog-overlay]')
      expect(overlay?.className).toContain('bg-background/80')
    })

    it('works with mobile navigation pattern', async () => {
      const { container } = renderWithTheme(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="left" className="w-72">
            <div className="h-full bg-background">
              <div className="p-4 bg-primary/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">U</span>
                  </div>
                  <div>
                    <p className="font-medium">User Name</p>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                </div>
              </div>
              
              <nav className="flex-1 p-4">
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                      <span className="text-muted-foreground">🏠</span>
                      <span>Home</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                      <span className="text-muted-foreground">👤</span>
                      <span>Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                      <span className="text-muted-foreground">⚙️</span>
                      <span>Settings</span>
                    </a>
                  </li>
                </ul>
              </nav>
              
              <div className="p-4 border-t">
                <button className="w-full px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded">
                  Sign Out
                </button>
              </div>
            </div>
          </KeyboardEnhancedSheetContent>
        </Sheet>,
        { theme: 'dark' }
      )
      
      // Check user section uses semantic colors
      const userSection = container.querySelector('.bg-primary\\/10')
      expect(userSection).toBeInTheDocument()
      
      const avatar = container.querySelector('.bg-primary\\/20')
      expect(avatar).toBeInTheDocument()
      
      // Check email uses muted color
      const email = screen.getByText('user@example.com')
      expect(email.className).toContain('text-muted-foreground')
      
      // Check sign out button uses destructive variant
      const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
      expect(signOutButton.className).toContain('bg-destructive')
      expect(signOutButton.className).toContain('text-destructive-foreground')
    })
  })

  describe('Common Use Cases', () => {
    it('works as settings panel', async () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <h2>Settings</h2>
            <div>
              <label>
                <input type="checkbox" /> Enable notifications
              </label>
              <label>
                <input type="checkbox" /> Dark mode
              </label>
              <button>Save settings</button>
            </div>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      await waitFor(() => {
        const firstCheckbox = screen.getAllByRole('checkbox')[0]
        expect(document.activeElement).toBe(firstCheckbox)
      })
    })

    it('works as mobile navigation', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="left">
            <div className="nav-menu">
              <h2>Menu</h2>
              <ul>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#profile">Profile</a></li>
                <li><a href="#settings">Settings</a></li>
                <li><button>Logout</button></li>
              </ul>
            </div>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      expect(screen.getByText('Menu')).toBeInTheDocument()
    })

    it('works as filter panel', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent side="right">
            <h2>Filters</h2>
            <form>
              <select>
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Clothing</option>
              </select>
              <input type="range" min="0" max="1000" />
              <button type="submit">Apply Filters</button>
            </form>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      expect(screen.getByText('Filters')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('maintains sheet dialog semantics', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent aria-labelledby="sheet-title">
            <h2 id="sheet-title">Accessible Sheet</h2>
            <p>Sheet content</p>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'sheet-title')
    })

    it('supports aria-describedby', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent aria-describedby="sheet-desc">
            <h2>Title</h2>
            <p id="sheet-desc">Description</p>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-describedby', 'sheet-desc')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty sheet', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent />
        </Sheet>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    it('handles sheet with only non-focusable content', () => {
      render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <div>Text only</div>
            <span>More text</span>
            <p>Paragraph</p>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      expect(screen.getByText('Text only')).toBeInTheDocument()
    })

    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      
      const { unmount } = render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button>Button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('handles dynamic content updates', () => {
      const { rerender } = render(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button>Initial button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      rerender(
        <Sheet defaultOpen>
          <KeyboardEnhancedSheetContent>
            <button>Updated button</button>
            <button>New button</button>
          </KeyboardEnhancedSheetContent>
        </Sheet>
      )

      expect(screen.getByRole('button', { name: 'Updated button' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'New button' })).toBeInTheDocument()
    })
  })
})