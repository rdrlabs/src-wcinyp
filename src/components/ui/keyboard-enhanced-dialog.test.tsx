import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { KeyboardEnhancedDialogContent } from './keyboard-enhanced-dialog'
import { Dialog, DialogTrigger } from './dialog'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('KeyboardEnhancedDialogContent', () => {
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
    it('renders dialog content with children', () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <div>Dialog content</div>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      expect(screen.getByText('Dialog content')).toBeInTheDocument()
    })

    it('wraps children in focus container', () => {
      const { container } = render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <button>Button</button>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      const button = screen.getByRole('button', { name: 'Button' })
      expect(button.parentElement).toBeInTheDocument()
    })

    it('forwards ref correctly', () => {
      const ref = vi.fn()
      
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent ref={ref}>
            Content
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      expect(ref).toHaveBeenCalled()
    })

    it('passes through props to DialogContent', () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent className="custom-dialog" aria-label="Custom dialog">
            Content
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('custom-dialog')
      expect(dialog).toHaveAttribute('aria-label', 'Custom dialog')
    })
  })

  describe('Focus Management', () => {
    it('focuses first focusable element on mount', async () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <button>First button</button>
            <input type="text" placeholder="Input" />
            <button>Last button</button>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      await waitFor(() => {
        const firstButton = screen.getByRole('button', { name: 'First button' })
        expect(HTMLElement.prototype.focus).toHaveBeenCalled()
        expect(document.activeElement).toBe(firstButton)
      })
    })

    it('handles no focusable elements gracefully', () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <div>No focusable content</div>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      // Should not throw error
      expect(screen.getByText('No focusable content')).toBeInTheDocument()
    })

    it('focuses elements with tabindex', async () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <div tabIndex={0}>Focusable div</div>
            <button>Button</button>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      await waitFor(() => {
        const focusableDiv = screen.getByText('Focusable div')
        expect(document.activeElement).toBe(focusableDiv)
      })
    })

    it('skips elements with tabindex="-1"', async () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <button tabIndex={-1}>Skipped button</button>
            <button>Focused button</button>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      await waitFor(() => {
        const focusedButton = screen.getByRole('button', { name: 'Focused button' })
        expect(document.activeElement).toBe(focusedButton)
      })
    })
  })

  describe('Tab Trapping', () => {
    it('traps tab navigation within dialog', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <button>First</button>
            <button>Middle</button>
            <button>Last</button>
          </KeyboardEnhancedDialogContent>
        </Dialog>
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
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <button>First</button>
            <button>Middle</button>
            <button>Last</button>
          </KeyboardEnhancedDialogContent>
        </Dialog>
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
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <button>First</button>
            <button>Middle</button>
            <button>Last</button>
          </KeyboardEnhancedDialogContent>
        </Dialog>
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

  describe('Complex Content', () => {
    it('handles forms with multiple inputs', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <form>
              <input name="name" placeholder="Name" />
              <input name="email" placeholder="Email" />
              <textarea name="message" placeholder="Message" />
              <button type="submit">Submit</button>
            </form>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      const nameInput = screen.getByPlaceholderText('Name')
      const emailInput = screen.getByPlaceholderText('Email')

      await waitFor(() => {
        expect(document.activeElement).toBe(nameInput)
      })

      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(emailInput)
    })

    it('handles mixed focusable elements', async () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <a href="#">Link</a>
            <select>
              <option>Option 1</option>
            </select>
            <div tabIndex={0}>Focusable div</div>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      await waitFor(() => {
        const link = screen.getByRole('link')
        expect(document.activeElement).toBe(link)
      })
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const { container } = renderWithTheme(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent className="max-w-md">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Dialog Title</h2>
              <p className="text-muted-foreground">
                This dialog demonstrates keyboard-enhanced navigation with semantic colors.
              </p>
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
                  Confirm
                </button>
              </div>
            </div>
          </KeyboardEnhancedDialogContent>
        </Dialog>,
        { theme: 'light' }
      )

      // Check dialog uses semantic colors
      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('bg-background')
      expect(dialog.className).toContain('text-foreground')
      expect(dialog.className).toContain('border')
      
      // Check content uses semantic colors
      const title = screen.getByText('Dialog Title')
      expect(title.className).toContain('font-semibold')
      
      const description = screen.getByText(/This dialog demonstrates/)
      expect(description.className).toContain('text-muted-foreground')
      
      // Check buttons use semantic colors
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      expect(cancelButton.className).toContain('bg-secondary')
      expect(cancelButton.className).toContain('text-secondary-foreground')
      
      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      expect(confirmButton.className).toContain('bg-primary')
      expect(confirmButton.className).toContain('text-primary-foreground')
      
      // Verify focus behavior works with themed elements
      await waitFor(() => {
        expect(document.activeElement).toBe(cancelButton)
      })
    })

    it('renders correctly in dark mode', async () => {
      const { container } = renderWithTheme(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="w-full mt-1 px-3 py-2 bg-background border rounded-md"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full mt-1 px-3 py-2 bg-background border rounded-md"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </KeyboardEnhancedDialogContent>
        </Dialog>,
        { theme: 'dark' }
      )

      // Check dialog maintains semantic colors in dark mode
      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('bg-background')
      
      // Check form elements use semantic colors
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input.className).toContain('bg-background')
        expect(input.className).toContain('border')
      })
      
      // Check labels use semantic styling
      const labels = container.querySelectorAll('label')
      labels.forEach(label => {
        expect(label.className).toContain('font-medium')
      })
      
      // Check buttons maintain hover states
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      expect(cancelButton.className).toContain('hover:bg-accent')
      expect(cancelButton.className).toContain('hover:text-accent-foreground')
    })

    it('maintains focus styles with semantic colors', async () => {
      const { container } = renderWithTheme(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded">
                First Button
              </button>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded">
                Second Button
              </button>
              <button className="w-full px-4 py-2 border bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded">
                Third Button
              </button>
            </div>
          </KeyboardEnhancedDialogContent>
        </Dialog>,
        { theme: 'dark' }
      )
      
      // Check all buttons have semantic focus styles
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button.className).toContain('focus:ring-ring')
        expect(button.className).toContain('focus:ring-offset-background')
      })
      
      // Verify first button gets focused
      await waitFor(() => {
        const firstButton = screen.getByRole('button', { name: 'First Button' })
        expect(document.activeElement).toBe(firstButton)
      })
    })

    it('ensures no hard-coded colors', () => {
      const { container } = renderWithTheme(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent className="w-[500px]">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your account settings and preferences.
                </p>
              </div>
              
              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded">
                      Toggle
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Privacy</p>
                      <p className="text-sm text-muted-foreground">
                        Make profile private
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded">
                      Toggle
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end border-t pt-4">
                <button className="px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded">
                  Save Changes
                </button>
              </div>
            </div>
          </KeyboardEnhancedDialogContent>
        </Dialog>,
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
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <div className="space-y-4">
              <input
                className="w-full px-3 py-2 bg-background border rounded"
                placeholder="First input"
              />
              <textarea
                className="w-full px-3 py-2 bg-background border rounded"
                placeholder="Textarea"
                rows={3}
              />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">
                  Secondary
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
                  Primary
                </button>
              </div>
            </div>
          </KeyboardEnhancedDialogContent>
        </Dialog>,
        { theme: 'light' }
      )
      
      const firstInput = screen.getByPlaceholderText('First input')
      const textarea = screen.getByPlaceholderText('Textarea')
      const primaryButton = screen.getByRole('button', { name: 'Primary' })
      
      // Wait for initial focus
      await waitFor(() => {
        expect(document.activeElement).toBe(firstInput)
      })
      
      // Tab through all elements
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(textarea)
      
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Secondary' }))
      
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(primaryButton)
      
      // Tab from last element should wrap to first
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(firstInput)
    })

    it('works with complex themed content', async () => {
      renderWithTheme(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent className="max-w-2xl">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">!</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">Important Notice</h2>
                  <p className="text-muted-foreground">
                    This action will permanently delete your account and all associated data.
                    This cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Type "DELETE" to confirm:</p>
                <input
                  className="w-full px-3 py-2 bg-background border rounded"
                  placeholder="Type DELETE"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded">
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded"
                  disabled
                >
                  Delete Account
                </button>
              </div>
            </div>
          </KeyboardEnhancedDialogContent>
        </Dialog>,
        { theme: 'dark' }
      )
      
      // Check icon container uses semantic colors
      const iconContainer = screen.getByText('!').parentElement
      expect(iconContainer?.className).toContain('bg-primary/10')
      
      // Check warning box uses semantic colors
      const warningBox = screen.getByText(/Type "DELETE" to confirm/).parentElement
      expect(warningBox?.className).toContain('bg-muted/50')
      
      // Check destructive button uses semantic colors
      const deleteButton = screen.getByRole('button', { name: 'Delete Account' })
      expect(deleteButton.className).toContain('bg-destructive')
      expect(deleteButton.className).toContain('text-destructive-foreground')
      
      // Verify focus goes to input (first focusable element)
      await waitFor(() => {
        const input = screen.getByPlaceholderText('Type DELETE')
        expect(document.activeElement).toBe(input)
      })
    })

    it('dialog overlay uses semantic colors', () => {
      const { baseElement } = renderWithTheme(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <p>Content</p>
          </KeyboardEnhancedDialogContent>
        </Dialog>,
        { theme: 'dark' }
      )
      
      // Check overlay uses semantic opacity
      const overlay = baseElement.querySelector('[data-radix-dialog-overlay]')
      expect(overlay?.className).toContain('bg-background/80')
    })
  })

  describe('Common Use Cases', () => {
    it('works with confirmation dialog', async () => {
      const handleConfirm = vi.fn()
      const handleCancel = vi.fn()
      
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <h2>Are you sure?</h2>
            <p>This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleConfirm}>Confirm</button>
            </div>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        expect(document.activeElement).toBe(cancelButton)
      })
    })

    it('works with form dialog', () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <h2>Edit Profile</h2>
            <form>
              <label>
                Name:
                <input type="text" />
              </label>
              <label>
                Bio:
                <textarea />
              </label>
              <button type="submit">Save</button>
            </form>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('maintains dialog semantics', () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent aria-labelledby="dialog-title">
            <h2 id="dialog-title">Accessible Dialog</h2>
            <p>Dialog content</p>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title')
    })

    it('supports aria-describedby', () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent aria-describedby="dialog-desc">
            <h2>Title</h2>
            <p id="dialog-desc">Description</p>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-describedby', 'dialog-desc')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty dialog', () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent />
        </Dialog>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    it('handles dialog with only non-focusable content', () => {
      render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <div>Text only</div>
            <span>More text</span>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      expect(screen.getByText('Text only')).toBeInTheDocument()
    })

    it('cleans up event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      
      const { unmount } = render(
        <Dialog defaultOpen>
          <KeyboardEnhancedDialogContent>
            <button>Button</button>
          </KeyboardEnhancedDialogContent>
        </Dialog>
      )

      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })
})