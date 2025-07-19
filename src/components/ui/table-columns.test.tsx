import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Column } from '@tanstack/react-table'
import {
  SortableHeader,
  ActionsColumn,
  StatusBadge,
  ContactInfo,
  DateDisplay,
  FileInfo,
  type ActionItem,
} from './table-columns'
import { renderWithTheme } from '@/test/theme-test-utils'

// Mock logger to prevent console output in tests
vi.mock('@/lib/logger-v2', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }
}))

// Mock column for SortableHeader tests
const createMockColumn = (sorted: false | 'asc' | 'desc' = false): Column<any, any> => ({
  getIsSorted: vi.fn(() => sorted),
  toggleSorting: vi.fn(),
} as any)

describe('SortableHeader', () => {
  it('renders with title and no sort indicator when not sorted', () => {
    const column = createMockColumn()
    render(<SortableHeader column={column} title="Test Column" />)
    
    expect(screen.getByText('Test Column')).toBeInTheDocument()
    // Should show the bi-directional arrow when not sorted
    const arrow = screen.getByRole('button').querySelector('.text-muted-foreground')
    expect(arrow).toBeInTheDocument()
  })

  it('shows up arrow when sorted ascending', () => {
    const column = createMockColumn('asc')
    render(<SortableHeader column={column} title="Name" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Name')
    // Look for ArrowUp icon
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('shows down arrow when sorted descending', () => {
    const column = createMockColumn('desc')
    render(<SortableHeader column={column} title="Date" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Date')
    // Look for ArrowDown icon
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('toggles sorting when clicked', async () => {
    const column = createMockColumn('asc')
    const user = userEvent.setup()
    
    render(<SortableHeader column={column} title="Price" />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(column.toggleSorting).toHaveBeenCalledWith(true)
  })

  it('applies custom className', () => {
    const column = createMockColumn()
    render(<SortableHeader column={column} title="Custom" className="text-red-500" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-red-500')
  })
})

describe('ActionsColumn', () => {
  const mockActions: ActionItem<{ id: number; name: string }>[] = [
    {
      label: 'Edit',
      onClick: vi.fn(),
      icon: <span>EditIcon</span>,
    },
    {
      label: 'Delete',
      onClick: vi.fn(),
      icon: <span>DeleteIcon</span>,
      destructive: true,
    },
  ]

  const mockRow = { id: 1, name: 'Test Item' }

  beforeEach(() => {
    mockActions.forEach(action => {
      vi.mocked(action.onClick).mockClear()
    })
  })

  it('renders dropdown menu with all actions', async () => {
    const user = userEvent.setup()
    render(<ActionsColumn actions={mockActions} row={mockRow} />)
    
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    
    expect(screen.getByText('Actions')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onClick handler when action is clicked', async () => {
    const user = userEvent.setup()
    render(<ActionsColumn actions={mockActions} row={mockRow} />)
    
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    
    const editButton = screen.getByText('Edit')
    await user.click(editButton)
    
    expect(mockActions[0].onClick).toHaveBeenCalledWith(mockRow)
  })

  it('applies destructive styling to destructive actions', async () => {
    const user = userEvent.setup()
    render(<ActionsColumn actions={mockActions} row={mockRow} />)
    
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    
    const deleteButton = screen.getByText('Delete')
    // Check closest element with role menuitem
    const menuItem = deleteButton.closest('[role="menuitem"]')
    expect(menuItem).toHaveClass('text-destructive')
  })

  it('disables actions based on disable function', async () => {
    const user = userEvent.setup()
    const actionsWithDisabled = [
      ...mockActions,
      {
        label: 'Archive',
        onClick: vi.fn(),
        disabled: (row: any) => row.id === 1,
      },
    ]
    
    render(<ActionsColumn actions={actionsWithDisabled} row={mockRow} />)
    
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    
    const archiveButton = screen.getByText('Archive')
    const menuItem = archiveButton.closest('[role="menuitem"]')
    expect(menuItem).toHaveAttribute('data-disabled')
  })

  it('hides actions based on hidden function', async () => {
    const user = userEvent.setup()
    const actionsWithHidden = [
      ...mockActions,
      {
        label: 'Secret',
        onClick: vi.fn(),
        hidden: (row: any) => row.name !== 'Admin',
      },
    ]
    
    render(<ActionsColumn actions={actionsWithHidden} row={mockRow} />)
    
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    
    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })

  it('returns null when all actions are hidden', () => {
    const hiddenActions = mockActions.map(action => ({
      ...action,
      hidden: true,
    }))
    
    const { container } = render(<ActionsColumn actions={hiddenActions} row={mockRow} />)
    expect(container.firstChild).toBeNull()
  })

  it('stops event propagation on trigger click', async () => {
    const user = userEvent.setup()
    const handleRowClick = vi.fn()
    
    render(
      <div onClick={handleRowClick}>
        <ActionsColumn actions={mockActions} row={mockRow} />
      </div>
    )
    
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    
    expect(handleRowClick).not.toHaveBeenCalled()
  })
})

describe('StatusBadge', () => {
  it('renders with default variant', () => {
    const { container } = render(<StatusBadge status="Pending" />)
    
    const badge = screen.getByText('Pending')
    expect(badge).toBeInTheDocument()
    
    // StatusBadge renders a Badge with custom classes
    // Since Badge component uses its own variants, we check if the component renders correctly
    const badgeContainer = container.querySelector('div')
    expect(badgeContainer).toBeDefined()
    // The Badge component will have the combined classes
    expect(badgeContainer?.className).toMatch(/bg-muted|text-muted-foreground/)
  })

  it('renders with success variant and icon', () => {
    const { container } = render(<StatusBadge status="Active" variant="success" />)
    
    const badge = screen.getByText('Active')
    expect(badge).toBeInTheDocument()
    
    // Check that it contains the expected classes for success variant
    const badgeContainer = container.querySelector('div')
    expect(badgeContainer?.className).toMatch(/bg-green-100|text-green/)
    
    // Should have CheckCircle icon
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('auto-detects icon based on status text', () => {
    render(<StatusBadge status="Processing" />)
    
    const badge = screen.getByText('Processing')
    // Should have spinning RefreshCw icon
    const icon = badge.parentElement?.querySelector('.animate-spin')
    expect(icon).toBeInTheDocument()
  })

  it('uses custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>
    render(<StatusBadge status="Special" icon={customIcon} />)
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies different sizes', () => {
    const { container, rerender } = render(<StatusBadge status="Test" size="sm" />)
    let badgeContainer = container.querySelector('div')
    expect(badgeContainer?.className).toContain('text-xs')
    
    rerender(<StatusBadge status="Test" size="lg" />)
    badgeContainer = container.querySelector('div')
    expect(badgeContainer?.className).toContain('text-base')
  })

  it('applies custom className', () => {
    const { container } = render(<StatusBadge status="Custom" className="ml-4" />)
    
    const badgeContainer = container.querySelector('div')
    expect(badgeContainer?.className).toContain('ml-4')
  })
})

describe('ContactInfo', () => {
  it('renders email and phone', () => {
    render(
      <ContactInfo 
        email="test@example.com" 
        phone="555-1234" 
        name="John Doe"
      />
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('555-1234')).toBeInTheDocument()
  })

  it('renders in compact mode with icons', () => {
    render(
      <ContactInfo 
        email="test@example.com" 
        phone="555-1234" 
        compact
      />
    )
    
    // Should show icons in compact mode
    const container = screen.getByText('test@example.com').parentElement
    expect(container?.querySelector('svg')).toBeInTheDocument()
  })

  it('shows copy buttons when enabled', async () => {
    const user = userEvent.setup()
    
    // Mock clipboard API
    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true
    })
    
    render(
      <ContactInfo 
        email="test@example.com" 
        phone="555-1234" 
        showCopyButton
      />
    )
    
    // Copy buttons have icon but no accessible name, find by icon
    const copyIcons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg.lucide-copy')
    )
    expect(copyIcons).toHaveLength(2)
    
    // Click email copy button
    await user.click(copyIcons[0])
    expect(mockWriteText).toHaveBeenCalledWith('test@example.com')
  })

  it('handles missing contact info gracefully', () => {
    const { container } = render(<ContactInfo />)
    expect(container.firstChild?.textContent).toBe('—')
  })

  it('renders only provided fields', () => {
    render(<ContactInfo email="only@email.com" />)
    
    expect(screen.getByText('only@email.com')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /call/i })).not.toBeInTheDocument()
  })
})

describe('DateDisplay', () => {
  const testDate = '2025-07-06T10:30:00Z'
  
  beforeEach(() => {
    // Mock current date for consistent relative time tests
    vi.setSystemTime(new Date('2025-07-07T10:30:00Z'))
  })

  it('renders formatted date with default format', () => {
    render(<DateDisplay date={testDate} />)
    
    expect(screen.getByText('Jul 6, 2025')).toBeInTheDocument()
  })

  it('renders with custom format', () => {
    render(<DateDisplay date={testDate} format="yyyy-MM-dd" />)
    
    expect(screen.getByText('2025-07-06')).toBeInTheDocument()
  })

  it('renders relative time when enabled', () => {
    render(<DateDisplay date={testDate} relative />)
    
    expect(screen.getByText('1 day ago')).toBeInTheDocument()
  })

  it('includes time when showTime is true', () => {
    render(<DateDisplay date={testDate} showTime />)
    
    // Should include time in the format
    const dateElement = screen.getByText(/Jul 6, 2025/i)
    expect(dateElement.textContent).toMatch(/\d{1,2}:\d{2}/)
  })

  it('handles null/undefined dates', () => {
    const { rerender } = render(<DateDisplay date={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
    
    rerender(<DateDisplay date={undefined} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('handles invalid date strings', () => {
    render(<DateDisplay date="invalid-date" />)
    expect(screen.getByText('Invalid date')).toBeInTheDocument()
  })

  it('shows tooltip with full date when relative', async () => {
    const user = userEvent.setup()
    render(<DateDisplay date={testDate} relative />)
    
    const dateElement = screen.getByText('1 day ago')
    await user.hover(dateElement)
    
    // Tooltip should show the full date
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Jul 6, 2025')
    })
  })
})

describe('FileInfo', () => {
  it('renders filename with auto-detected icon', () => {
    const { container } = render(<FileInfo filename="document.pdf" />)
    
    expect(screen.getByText('document.pdf')).toBeInTheDocument()
    // Should have file icon (svg element)
    const svgIcon = container.querySelector('svg')
    expect(svgIcon).toBeInTheDocument()
  })

  it('renders file size in human-readable format', () => {
    render(<FileInfo filename="image.jpg" size={1048576} />)
    
    expect(screen.getByText('1 MB')).toBeInTheDocument()
  })

  it('truncates long filenames with tooltip', async () => {
    const user = userEvent.setup()
    const longFilename = 'very-long-filename-that-should-be-truncated-with-ellipsis.txt'
    
    render(<FileInfo filename={longFilename} truncate />)
    
    // FileInfo will show truncated version "very-long-filename-that-sho..."
    const truncatedText = screen.getByText(/very-long-filename-that-sho/)
    expect(truncatedText).toBeInTheDocument()
    expect(truncatedText).toHaveClass('truncate')
    
    // Hover to show tooltip
    await user.hover(truncatedText)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent(longFilename)
    })
  })

  it('shows download button when handler provided', async () => {
    const user = userEvent.setup()
    const handleDownload = vi.fn()
    
    render(<FileInfo filename="report.xlsx" onDownload={handleDownload} />)
    
    const downloadButton = screen.getByRole('button', { name: /download/i })
    await user.click(downloadButton)
    
    expect(handleDownload).toHaveBeenCalled()
  })

  it('shows preview button when handler provided', async () => {
    const user = userEvent.setup()
    const handlePreview = vi.fn()
    
    render(<FileInfo filename="image.png" onPreview={handlePreview} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    await user.click(previewButton)
    
    expect(handlePreview).toHaveBeenCalled()
  })

  it('detects file type from extension', () => {
    const { rerender, container } = render(<FileInfo filename="spreadsheet.xlsx" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    
    rerender(<FileInfo filename="archive.zip" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    
    rerender(<FileInfo filename="video.mp4" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('uses provided type over auto-detection', () => {
    const { container } = render(<FileInfo filename="file.txt" type="image" />)
    
    // Should use image icon even though extension is .txt
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('handles files without extension', () => {
    const { container } = render(<FileInfo filename="README" />)
    
    expect(screen.getByText('README')).toBeInTheDocument()
    // Should show generic file icon (svg element)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})

describe('Edge Cases and Error Handling', () => {
  it('ActionsColumn handles empty actions array', () => {
    const { container } = render(<ActionsColumn actions={[]} row={{}} />)
    expect(container.firstChild).toBeNull()
  })

  it('ContactInfo handles clipboard API errors', async () => {
    const user = userEvent.setup()
    const mockError = new Error('Clipboard access denied')
    
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockRejectedValue(mockError),
      },
      writable: true,
      configurable: true
    })
    
    const { logger } = await import('@/lib/logger-v2')
    
    render(<ContactInfo email="test@test.com" showCopyButton />)
    
    // Find copy button by icon
    const copyButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg.lucide-copy')
    )
    expect(copyButton).toBeDefined()
    await user.click(copyButton!)
    
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith('Failed to copy to clipboard', { error: mockError })
    })
  })

  it('FileInfo handles very small file sizes', () => {
    render(<FileInfo filename="tiny.txt" size={100} />)
    expect(screen.getByText('100 Bytes')).toBeInTheDocument()
  })

  it('FileInfo handles very large file sizes', () => {
    render(<FileInfo filename="huge.iso" size={5368709120} />)
    expect(screen.getByText('5 GB')).toBeInTheDocument()
  })

  it('DateDisplay handles Date objects', () => {
    const dateObj = new Date('2025-07-06T10:30:00Z')
    render(<DateDisplay date={dateObj} />)
    
    expect(screen.getByText('Jul 6, 2025')).toBeInTheDocument()
  })
})

describe('Theme Tests', () => {
  describe('SortableHeader', () => {
    it('renders correctly in light mode', () => {
      const column = createMockColumn('asc')
      const { container } = renderWithTheme(
        <SortableHeader column={column} title="Name" />,
        { theme: 'light' }
      )
      
      const button = screen.getByRole('button')
      expect(button.className).toContain('hover:text-foreground')
      
      // Check icon doesn't have hard-coded colors
      const icon = button.querySelector('svg')
      expect(icon).toBeInTheDocument()
      const iconParent = icon?.parentElement
      expect(iconParent?.className).not.toMatch(/text-(gray|slate)-\d+/)
    })

    it('renders correctly in dark mode', () => {
      const column = createMockColumn('desc')
      const { container } = renderWithTheme(
        <SortableHeader column={column} title="Date" />,
        { theme: 'dark' }
      )
      
      const button = screen.getByRole('button')
      expect(button.className).toContain('hover:text-foreground')
      
      // Neutral state should use semantic muted color
      const neutralColumn = createMockColumn()
      renderWithTheme(
        <SortableHeader column={neutralColumn} title="Status" />,
        { theme: 'dark' }
      )
      
      const neutralIcon = container.querySelector('.text-muted-foreground')
      expect(neutralIcon).toBeInTheDocument()
    })
  })

  describe('StatusBadge', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <div className="space-y-2">
          <StatusBadge status="Active" variant="success" />
          <StatusBadge status="Pending" variant="warning" />
          <StatusBadge status="Failed" variant="error" />
          <StatusBadge status="Inactive" variant="default" />
        </div>,
        { theme: 'light' }
      )
      
      // Check semantic color usage for different variants
      const badges = container.querySelectorAll('[class*="bg-"]')
      badges.forEach(badge => {
        const className = badge.className
        // Should use semantic colors like bg-green-100, bg-yellow-100, etc.
        expect(className).toMatch(/bg-(green|yellow|red|muted)/)
      })
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <div className="space-y-2">
          <StatusBadge status="Active" variant="success" />
          <StatusBadge status="Pending" variant="warning" />
          <StatusBadge status="Failed" variant="error" />
          <StatusBadge status="Inactive" variant="default" />
        </div>,
        { theme: 'dark' }
      )
      
      // Semantic colors should adapt in dark mode
      const badges = container.querySelectorAll('[class*="bg-"]')
      badges.forEach(badge => {
        const className = badge.className
        expect(className).toMatch(/bg-(green|yellow|red|muted)/)
      })
    })
  })

  describe('ActionsColumn', () => {
    it('renders correctly in light mode', async () => {
      const user = userEvent.setup()
      const mockActions: ActionItem<any>[] = [
        { label: 'Edit', onClick: vi.fn() },
        { label: 'Delete', onClick: vi.fn(), destructive: true },
      ]
      
      renderWithTheme(
        <ActionsColumn actions={mockActions} row={{}} />,
        { theme: 'light' }
      )
      
      const trigger = screen.getByRole('button', { name: 'Open menu' })
      expect(trigger.className).toContain('hover:bg-accent')
      expect(trigger.className).toContain('hover:text-accent-foreground')
      
      await user.click(trigger)
      
      // Check dropdown uses semantic colors
      const dropdown = screen.getByText('Actions').parentElement
      expect(dropdown?.className).toContain('bg-popover')
      expect(dropdown?.className).toContain('text-popover-foreground')
      
      // Destructive item should use semantic destructive color
      const deleteItem = screen.getByText('Delete').closest('[role="menuitem"]')
      expect(deleteItem?.className).toContain('text-destructive')
    })

    it('renders correctly in dark mode', async () => {
      const user = userEvent.setup()
      const mockActions: ActionItem<any>[] = [
        { label: 'Edit', onClick: vi.fn() },
        { label: 'Delete', onClick: vi.fn(), destructive: true },
      ]
      
      renderWithTheme(
        <ActionsColumn actions={mockActions} row={{}} />,
        { theme: 'dark' }
      )
      
      const trigger = screen.getByRole('button', { name: 'Open menu' })
      await user.click(trigger)
      
      // Menu items should use semantic hover colors
      const menuItems = screen.getAllByRole('menuitem')
      menuItems.forEach(item => {
        expect(item.className).toContain('hover:bg-accent')
        expect(item.className).toContain('hover:text-accent-foreground')
      })
    })
  })

  describe('ContactInfo', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(
        <ContactInfo 
          name="John Doe"
          email="john@example.com" 
          phone="555-1234"
          showCopyButton
        />,
        { theme: 'light' }
      )
      
      // Name should use default text color
      const name = screen.getByText('John Doe')
      expect(name.className).toContain('font-medium')
      
      // Contact details should use muted foreground
      const email = screen.getByText('john@example.com')
      expect(email.className).toContain('text-muted-foreground')
      
      // Copy buttons should use semantic colors
      const copyButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('svg.lucide-copy')
      )
      copyButtons.forEach(btn => {
        expect(btn.className).toContain('hover:bg-accent')
      })
    })

    it('renders correctly in dark mode', () => {
      renderWithTheme(
        <ContactInfo 
          email="test@example.com" 
          phone="555-1234"
          compact
        />,
        { theme: 'dark' }
      )
      
      // Icons and text should use semantic colors
      const container = screen.getByText('test@example.com').parentElement
      const icons = container?.querySelectorAll('svg')
      icons?.forEach(icon => {
        expect(icon.className).toContain('text-muted-foreground')
      })
    })
  })

  describe('DateDisplay', () => {
    it('renders correctly in light mode', () => {
      renderWithTheme(
        <div className="space-y-2">
          <DateDisplay date="2025-07-06T10:30:00Z" />
          <DateDisplay date="2025-07-06T10:30:00Z" relative />
        </div>,
        { theme: 'light' }
      )
      
      // Regular date should use default text color
      const regularDate = screen.getByText('Jul 6, 2025')
      expect(regularDate.tagName).toBe('TIME')
      
      // Relative date should use muted foreground
      const relativeDate = screen.getByText(/ago/)
      expect(relativeDate.className).toContain('text-muted-foreground')
    })

    it('renders correctly in dark mode', () => {
      vi.setSystemTime(new Date('2025-07-07T10:30:00Z'))
      
      renderWithTheme(
        <DateDisplay date="2025-07-06T10:30:00Z" relative />,
        { theme: 'dark' }
      )
      
      const relativeDate = screen.getByText('1 day ago')
      expect(relativeDate.className).toContain('text-muted-foreground')
    })
  })

  describe('FileInfo', () => {
    it('renders correctly in light mode', () => {
      const { container } = renderWithTheme(
        <FileInfo 
          filename="document.pdf" 
          size={1048576}
          onDownload={() => {}}
          onPreview={() => {}}
        />,
        { theme: 'light' }
      )
      
      // File icon should use muted foreground
      const icon = container.querySelector('svg')
      expect(icon?.className).toContain('text-muted-foreground')
      
      // Size text should use muted foreground
      const sizeText = screen.getByText('1 MB')
      expect(sizeText.className).toContain('text-muted-foreground')
      
      // Action buttons should use semantic colors
      const buttons = screen.getAllByRole('button')
      buttons.forEach(btn => {
        expect(btn.className).toContain('hover:bg-accent')
      })
    })

    it('renders correctly in dark mode', () => {
      const { container } = renderWithTheme(
        <FileInfo 
          filename="very-long-filename-that-should-be-truncated.txt" 
          truncate
          size={2048}
        />,
        { theme: 'dark' }
      )
      
      // All elements should maintain semantic colors
      const icon = container.querySelector('svg')
      expect(icon?.className).toContain('text-muted-foreground')
      
      const sizeText = screen.getByText('2 KB')
      expect(sizeText.className).toContain('text-muted-foreground')
    })
  })

  it('ensures no hard-coded colors', () => {
    const { container } = renderWithTheme(
      <div className="space-y-4">
        <SortableHeader column={createMockColumn()} title="Column" />
        <StatusBadge status="Custom" />
        <ContactInfo email="test@test.com" phone="123" />
        <DateDisplay date={new Date()} />
        <FileInfo filename="test.txt" size={100} />
      </div>,
      { theme: 'dark' }
    )
    
    // Check all elements for hard-coded colors
    const allElements = container.querySelectorAll('*')
    allElements.forEach(element => {
      const classList = element.className
      if (typeof classList === 'string' && !element.tagName.toLowerCase().includes('svg')) {
        // Should not contain hard-coded color values (except for status badges which use semantic colors)
        if (!classList.includes('StatusBadge')) {
          expect(classList).not.toMatch(/text-(gray|slate|zinc|neutral|stone)-\d{3}/)
          expect(classList).not.toMatch(/bg-(gray|slate|zinc|neutral|stone)-\d{3}/)
        }
      }
    })
  })
})