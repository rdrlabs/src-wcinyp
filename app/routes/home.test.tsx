import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import Home from './home'

describe('Home Route', () => {
  it('renders the dashboard title', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    expect(screen.getByText('WCINYP Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Weill Cornell Imaging at NewYork-Presbyterian')).toBeInTheDocument()
  })

  it('displays all feature cards', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Document Hub')).toBeInTheDocument()
    expect(screen.getByText('Provider Directory')).toBeInTheDocument()
    expect(screen.getByText('Form Builder')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
  })

  it('shows correct stats for each feature', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    
    expect(screen.getByText('156 documents')).toBeInTheDocument()
    expect(screen.getByText('42 providers')).toBeInTheDocument()
    expect(screen.getByText('12 templates')).toBeInTheDocument()
    expect(screen.getByText('8 reports')).toBeInTheDocument()
  })
})