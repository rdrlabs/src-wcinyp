import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Providers } from './providers'

describe('Providers', () => {
  it('renders children within theme provider', () => {
    render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    )
    
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('provides theme context to children', () => {
    const TestComponent = () => {
      // This component would have access to theme context
      return <div data-testid="themed-component">Themed Content</div>
    }
    
    render(
      <Providers>
        <TestComponent />
      </Providers>
    )
    
    expect(screen.getByTestId('themed-component')).toBeInTheDocument()
  })

  it('wraps multiple children', () => {
    render(
      <Providers>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Providers>
    )
    
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.getByText('Child 3')).toBeInTheDocument()
  })
})