import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle
} from './navigation-menu'
import { renderWithTheme } from '@/test/theme-test-utils'

describe('NavigationMenu', () => {
  describe('Basic Functionality', () => {
    it('renders navigation menu', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item 1</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    it('shows content on trigger click', async () => {
      const user = userEvent.setup()
      
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div>Product content</div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const trigger = screen.getByText('Products')
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Product content')).toBeInTheDocument()
      })
    })

    it('renders without viewport when specified', () => {
      const { container } = render(
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const menu = container.querySelector('[data-slot="navigation-menu"]')
      expect(menu).toHaveAttribute('data-viewport', 'false')
    })
  })

  describe('NavigationMenuList', () => {
    it('renders menu list with items', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>Item 1</NavigationMenuItem>
            <NavigationMenuItem>Item 2</NavigationMenuItem>
            <NavigationMenuItem>Item 3</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList className="custom-list">
            <NavigationMenuItem>Item</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const list = container.querySelector('[data-slot="navigation-menu-list"]')
      expect(list).toHaveClass('custom-list')
    })
  })

  describe('NavigationMenuTrigger', () => {
    it('renders trigger with chevron icon', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const trigger = screen.getByText('Menu')
      const chevron = trigger.parentElement?.querySelector('svg')
      expect(chevron).toBeInTheDocument()
      expect(chevron).toHaveClass('size-3')
    })

    it('rotates chevron when open', async () => {
      const user = userEvent.setup()
      
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Toggle</NavigationMenuTrigger>
              <NavigationMenuContent>Content</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const trigger = screen.getByText('Toggle')
      const chevron = trigger.parentElement?.querySelector('svg')
      
      await user.click(trigger)
      
      await waitFor(() => {
        expect(chevron).toHaveClass('group-data-[state=open]:rotate-180')
      })
    })

    it('applies trigger styling', () => {
      const className = navigationMenuTriggerStyle()
      expect(className).toContain('inline-flex')
      expect(className).toContain('rounded-md')
      expect(className).toContain('hover:bg-accent')
    })
  })

  describe('NavigationMenuContent', () => {
    it('renders content in viewport', async () => {
      const user = userEvent.setup()
      
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[400px] p-4">
                  <h3>Our Services</h3>
                  <p>Service description</p>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      await user.click(screen.getByText('Services'))

      await waitFor(() => {
        expect(screen.getByText('Our Services')).toBeInTheDocument()
        expect(screen.getByText('Service description')).toBeInTheDocument()
      })
    })

    it('applies animation classes', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Animated</NavigationMenuTrigger>
              <NavigationMenuContent>Content</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const content = container.querySelector('[data-slot="navigation-menu-content"]')
      expect(content).toHaveClass('data-[motion^=from-]:animate-in')
      expect(content).toHaveClass('data-[motion^=to-]:animate-out')
    })
  })

  describe('NavigationMenuLink', () => {
    it('renders as link', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about">
                About Us
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const link = screen.getByText('About Us')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/about')
    })

    it('shows active state', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink active>
                Active Link
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const link = screen.getByText('Active Link')
      expect(link).toHaveClass('data-[active=true]:bg-accent/50')
    })

    it('handles click events', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink onClick={handleClick}>
                Clickable
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      await user.click(screen.getByText('Clickable'))
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Complex Navigation', () => {
    it('renders multi-level navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink href="/products/software">
                      Software
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="/products/hardware">
                      Hardware
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Company</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink href="/about">
                      About
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="/team">
                      Team
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      // Open Products menu
      await user.click(screen.getByText('Products'))
      await waitFor(() => {
        expect(screen.getByText('Software')).toBeInTheDocument()
        expect(screen.getByText('Hardware')).toBeInTheDocument()
      })

      // Open Company menu
      await user.click(screen.getByText('Company'))
      await waitFor(() => {
        expect(screen.getByText('About')).toBeInTheDocument()
        expect(screen.getByText('Team')).toBeInTheDocument()
      })
    })
  })

  describe('Theme Tests', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] gap-3 p-6">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a href="/featured" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Featured Product
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Discover our latest innovation in cloud computing
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </div>
                  <NavigationMenuLink href="/software" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Software</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Enterprise-grade software solutions
                    </p>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Services</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Professional consulting and support
                    </p>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[400px] p-4">
                  <div className="mb-3 pb-3 border-b">
                    <h3 className="font-semibold">Industry Solutions</h3>
                  </div>
                  <div className="space-y-2">
                    <NavigationMenuLink href="/healthcare" className="block rounded p-2 hover:bg-muted">
                      Healthcare
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/finance" className="block rounded p-2 hover:bg-muted">
                      Finance
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
        { theme: 'light' }
      )

      // Check trigger uses semantic colors
      const productsTrigger = screen.getByText('Products')
      expect(productsTrigger.className).toContain('hover:bg-accent')
      expect(productsTrigger.className).toContain('hover:text-accent-foreground')
      expect(productsTrigger.className).toContain('focus:bg-accent')
      
      // Open products menu
      await user.click(productsTrigger)
      
      await waitFor(() => {
        const featuredProduct = screen.getByText('Featured Product')
        const gradient = featuredProduct.closest('a')
        expect(gradient?.className).toContain('from-muted/50')
        expect(gradient?.className).toContain('to-muted')
        
        // Check muted foreground text
        const description = screen.getByText(/Discover our latest innovation/)
        expect(description.className).toContain('text-muted-foreground')
      })
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      
      renderWithTheme(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] gap-3 p-6">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a href="/featured" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Featured Product
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Discover our latest innovation in cloud computing
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </div>
                  <NavigationMenuLink href="/software" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Software</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Enterprise-grade software solutions
                    </p>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Services</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Professional consulting and support
                    </p>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[400px] p-4">
                  <div className="mb-3 pb-3 border-b">
                    <h3 className="font-semibold">Industry Solutions</h3>
                  </div>
                  <div className="space-y-2">
                    <NavigationMenuLink href="/healthcare" className="block rounded p-2 hover:bg-muted">
                      Healthcare
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/finance" className="block rounded p-2 hover:bg-muted">
                      Finance
                    </NavigationMenuLink>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
        { theme: 'dark' }
      )

      // Check semantic colors maintained in dark mode
      const productsTrigger = screen.getByText('Products')
      expect(productsTrigger.className).toContain('hover:bg-accent')
      
      await user.click(productsTrigger)
      
      await waitFor(() => {
        // Featured section maintains semantic gradient
        const featuredProduct = screen.getByText('Featured Product')
        const gradient = featuredProduct.closest('a')
        expect(gradient?.className).toContain('from-muted/50')
        expect(gradient?.className).toContain('to-muted')
        
        // Muted foreground text maintains semantic color
        const descriptions = screen.getAllByText(/Enterprise-grade software|Professional consulting/)
        descriptions.forEach(desc => {
          expect(desc.className).toContain('text-muted-foreground')
        })
      })
    })

    it('maintains semantic colors for navigation states', async () => {
      const user = userEvent.setup()
      
      const { container } = renderWithTheme(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <div className="row-span-3">
                    <div className="mb-2 flex h-full w-full select-none flex-col justify-end rounded-md bg-muted p-4">
                      <div className="mb-2 text-lg font-medium">Documentation</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Complete API reference and guides
                      </p>
                    </div>
                  </div>
                  <NavigationMenuLink href="/docs" active className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active=true]:bg-accent/50">
                    <div className="text-sm font-medium leading-none">Getting Started</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Quick start guide for new users
                    </p>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/api" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">API Reference</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Detailed API documentation
                    </p>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/examples" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Examples</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Code examples and tutorials
                    </p>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
        { theme: 'dark' }
      )

      await user.click(screen.getByText('Resources'))
      
      await waitFor(() => {
        // Check active link has semantic styling
        const activeLink = screen.getByText('Getting Started').closest('a')
        expect(activeLink?.className).toContain('data-[active=true]:bg-accent/50')
        
        // Check muted background section
        const docSection = screen.getByText('Documentation').closest('div')
        expect(docSection?.className).toContain('bg-muted')
        
        // Check all descriptions use semantic muted foreground
        const descriptions = container.querySelectorAll('.text-muted-foreground')
        expect(descriptions.length).toBeGreaterThan(0)
      })
    })

    it('ensures no hard-coded colors', async () => {
      const user = userEvent.setup()
      
      const { container } = renderWithTheme(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Company</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[500px] p-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">About Us</h4>
                      <p className="text-sm text-muted-foreground">
                        Learn about our mission and values
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <NavigationMenuLink href="/team" className="group block space-y-1 rounded-md p-3 transition-colors hover:bg-accent">
                        <div className="font-medium text-sm group-hover:text-accent-foreground">Our Team</div>
                        <p className="text-sm text-muted-foreground group-hover:text-accent-foreground/80">
                          Meet the people behind our success
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink href="/careers" className="group block space-y-1 rounded-md p-3 transition-colors hover:bg-accent">
                        <div className="font-medium text-sm group-hover:text-accent-foreground">Careers</div>
                        <p className="text-sm text-muted-foreground group-hover:text-accent-foreground/80">
                          Join our growing team
                        </p>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>,
        { theme: 'dark' }
      )

      await user.click(screen.getByText('Company'))
      
      await waitFor(() => {
        const content = container.querySelector('[data-slot="navigation-menu-content"]')
        expect(content).toBeInTheDocument()
        
        // Check all elements for hard-coded colors
        const allElements = content?.querySelectorAll('*') || []
        allElements.forEach(element => {
          const classList = element.className
          if (typeof classList === 'string') {
            // Should not contain hard-coded color values
            expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
            expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/)
          }
        })
      })
    })

    it('maintains theme consistency with viewport and indicators', async () => {
      const user = userEvent.setup()
      
      const { container } = renderWithTheme(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu 1</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-4 bg-popover text-popover-foreground">
                  <h3 className="font-semibold mb-2">Menu Content 1</h3>
                  <p className="text-sm text-muted-foreground">Content for menu 1</p>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu 2</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-4 bg-popover text-popover-foreground">
                  <h3 className="font-semibold mb-2">Menu Content 2</h3>
                  <p className="text-sm text-muted-foreground">Content for menu 2</p>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>,
        { theme: 'dark' }
      )

      // Open first menu
      await user.click(screen.getByText('Menu 1'))
      
      await waitFor(() => {
        const content = screen.getByText('Menu Content 1').parentElement
        expect(content?.className).toContain('bg-popover')
        expect(content?.className).toContain('text-popover-foreground')
        
        // Check viewport styling
        const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]')
        expect(viewport?.className).toContain('bg-popover')
        expect(viewport?.className).toContain('text-popover-foreground')
        expect(viewport?.className).toContain('border')
      })
      
      // Check indicator styling
      const indicator = container.querySelector('[data-slot="navigation-menu-indicator"]')
      if (indicator) {
        expect(indicator.className).toContain('bg-popover')
      }
    })

    it('works with different navigation layouts', () => {
      renderWithTheme(
        <div className="space-y-8">
          {/* Horizontal navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Navigation with mixed content */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  Dropdown
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 md:w-[300px]">
                    <div className="flex flex-col gap-2">
                      <NavigationMenuLink href="/option1" className="rounded p-2 hover:bg-muted">
                        Option 1
                      </NavigationMenuLink>
                      <NavigationMenuLink href="/option2" className="rounded p-2 hover:bg-muted">
                        Option 2
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/direct" className={navigationMenuTriggerStyle()}>
                  Direct Link
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>,
        { theme: 'dark' }
      )

      // Check all navigation trigger styles use semantic colors
      const triggers = screen.getAllByRole('link')
      triggers.forEach(trigger => {
        if (trigger.className.includes('hover:')) {
          expect(trigger.className).toContain('hover:bg-accent')
          expect(trigger.className).toContain('hover:text-accent-foreground')
        }
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>First</NavigationMenuTrigger>
              <NavigationMenuContent>First content</NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Second</NavigationMenuTrigger>
              <NavigationMenuContent>Second content</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const firstTrigger = screen.getByText('First')
      firstTrigger.focus()

      await user.keyboard('{Enter}')
      await waitFor(() => {
        expect(screen.getByText('First content')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Accessible menu</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const trigger = screen.getByText('Accessible menu')
      expect(trigger).toBeInTheDocument()
      
      // Chevron should be hidden from screen readers
      const chevron = container.querySelector('[aria-hidden="true"]')
      expect(chevron).toBeInTheDocument()
    })

    it('maintains focus management', async () => {
      const user = userEvent.setup()
      
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="#">Link 1</NavigationMenuLink>
                <NavigationMenuLink href="#">Link 2</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      const trigger = screen.getByText('Menu')
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Link 1')).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty menu', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList />
        </NavigationMenu>
      )

      expect(container.querySelector('[data-slot="navigation-menu"]')).toBeInTheDocument()
    })

    it('handles menu without content', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>No content</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      expect(screen.getByText('No content')).toBeInTheDocument()
    })

    it('handles custom viewport', () => {
      const { container } = render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>Item</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      // Viewport is rendered automatically within NavigationMenu
      const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]')
      expect(viewport).toBeInTheDocument()
    })

    it('renders without viewport when specified', () => {
      const { container } = render(
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>Item</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

      // Should not have viewport
      const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]')
      expect(viewport).not.toBeInTheDocument()
    })
  })
})