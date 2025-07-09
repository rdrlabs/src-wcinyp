import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RootLayout from './layout'

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    <a href={href}>{children}</a>
}))

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter-font' })
}))

// Mock custom components
vi.mock('@/components/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <div data-testid="providers">{children}</div>
}))

vi.mock('@/components/theme-body', () => ({
  ThemeBody: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

vi.mock('@/components/command-menu', () => ({
  CommandMenu: () => null
}))

vi.mock('sonner', () => ({
  Toaster: () => null
}))

vi.mock('@/components/theme-selector', () => ({
  ThemeSelector: () => <button data-testid="theme-selector">Toggle Theme</button>
}))

vi.mock('@/components/navbar', () => ({
  NavBar: () => (
    <nav>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/">WCI@NYP</a>
      <div className="hidden md:flex">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/knowledge">Knowledge Base</a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/directory">Directory</a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/documents">Documents</a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/updates">Updates</a>
      </div>
      <button data-testid="theme-selector">Toggle Theme</button>
    </nav>
  )
}))

vi.mock('@/components/footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>
}))

describe('RootLayout', () => {
  it('renders the layout structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    // Check that child content is rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders navigation with all links', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    // Check brand link
    expect(screen.getByRole('link', { name: 'WCI@NYP' })).toHaveAttribute('href', '/')
    
    // Check navigation links
    expect(screen.getByRole('link', { name: 'Knowledge Base' })).toHaveAttribute('href', '/knowledge')
    expect(screen.getByRole('link', { name: 'Directory' })).toHaveAttribute('href', '/directory')
    expect(screen.getByRole('link', { name: 'Updates' })).toHaveAttribute('href', '/updates')
    expect(screen.getByRole('link', { name: 'Documents' })).toHaveAttribute('href', '/documents')
  })

  it('includes theme selector', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('theme-selector')).toBeInTheDocument()
  })

  it('wraps content with providers', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('providers')).toBeInTheDocument()
    // RootProvider is now only used in knowledge layout for Fumadocs isolation
  })

  it('applies correct CSS classes', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    // Check for min-height screen wrapper
    const wrapper = container.querySelector('.min-h-screen')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass('bg-background')
  })

  it('has responsive navigation', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    // Navigation should be hidden on mobile
    const knowledgeLink = screen.getByRole('link', { name: 'Knowledge Base' })
    const navContainer = knowledgeLink.parentElement
    expect(navContainer).toHaveClass('hidden', 'md:flex')
  })

  it('renders children in main element', () => {
    const { container } = render(
      <RootLayout>
        <div>Child Content</div>
      </RootLayout>
    )
    
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveTextContent('Child Content')
  })
})