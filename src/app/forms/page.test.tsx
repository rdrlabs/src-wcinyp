import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import FormsRedirectPage from './page'

// Mock Next.js router
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

describe('Forms Redirect Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays redirect message', () => {
    render(<FormsRedirectPage />)
    
    expect(screen.getByText('Redirecting to Documents & Forms...')).toBeInTheDocument()
  })

  it('calls router.replace with /documents on mount', () => {
    render(<FormsRedirectPage />)
    
    expect(mockReplace).toHaveBeenCalledWith('/documents')
    expect(mockReplace).toHaveBeenCalledTimes(1)
  })
})