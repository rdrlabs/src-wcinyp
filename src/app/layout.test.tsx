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

vi.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>
}))

vi.mock('fumadocs-ui/provider', () => ({
  RootProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="root-provider">{children}</div>
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
    expect(screen.getByRole('link', { name: 'WCINYP' })).toHaveAttribute('href', '/')
    
    // Check navigation links
    expect(screen.getByRole('link', { name: 'Knowledge Base' })).toHaveAttribute('href', '/knowledge')
    expect(screen.getByRole('link', { name: 'Directory' })).toHaveAttribute('href', '/directory')
    expect(screen.getByRole('link', { name: 'Providers' })).toHaveAttribute('href', '/providers')
    expect(screen.getByRole('link', { name: 'Documents' })).toHaveAttribute('href', '/documents')
  })

  it('includes theme toggle', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('wraps content with providers', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('providers')).toBeInTheDocument()
    expect(screen.getByTestId('root-provider')).toBeInTheDocument()
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
    const navContainer = screen.getByRole('link', { name: 'Knowledge Base' }).parentElement
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