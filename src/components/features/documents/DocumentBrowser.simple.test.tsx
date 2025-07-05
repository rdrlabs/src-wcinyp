import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DocumentBrowser } from './DocumentBrowser'

describe('DocumentBrowser Simple Test', () => {
  it('should render without crashing', () => {
    const { container } = render(<DocumentBrowser />)
    expect(container).toBeInTheDocument()
  })
})