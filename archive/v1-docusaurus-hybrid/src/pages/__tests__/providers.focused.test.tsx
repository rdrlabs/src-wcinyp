import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Providers from '../providers';

// Mock providers data for testing
jest.mock('../../data/providers.json', () => ({
  providers: [
    {
      id: 'dr-smith',
      name: 'Dr. John Smith',
      credentials: 'MD',
      specialty: 'Cardiology',
      department: 'cardiology',
      npi: '1234567890',
      phone: '(555) 123-4567',
      email: 'jsmith@test.com',
      location: 'Manhattan',
      epic_chat: ['jsmith'],
      tags: ['3T-required'],
      associated_providers: [],
      priority_notes: [
        {
          type: 'critical',
          icon: '⚠️',
          text: 'Requires 3T MRI only'
        }
      ],
      last_updated: '2025-01-01',
      updated_by: 'admin',
      status: 'critical'
    },
    {
      id: 'dr-johnson',
      name: 'Dr. Sarah Johnson',
      credentials: 'MD, PhD',
      specialty: 'Neurology',
      department: 'neurology',
      npi: '0987654321',
      phone: '(555) 987-6543',
      email: 'sjohnson@test.com',
      location: 'Queens',
      epic_chat: ['sjohnson'],
      tags: ['PTHS-only'],
      associated_providers: [],
      priority_notes: [],
      last_updated: '2025-01-01',
      updated_by: 'admin',
      status: 'ok'
    },
    {
      id: 'dr-chen',
      name: 'Dr. Michael Chen',
      credentials: 'MD',
      specialty: 'Oncology',
      department: 'oncology',
      npi: '1122334455',
      phone: '(555) 234-5678',
      email: 'mchen@test.com',
      location: 'Manhattan',
      epic_chat: ['mchen'],
      tags: ['no-direct-contact'],
      associated_providers: [],
      priority_notes: [
        {
          type: 'contact',
          icon: '📞',
          text: 'Contact through coordinator'
        }
      ],
      last_updated: '2024-11-20',
      updated_by: 'coordinator',
      status: 'warning'
    }
  ]
}));

// Simplified DOM mocks
const mockClick = jest.fn();
global.URL = {
  createObjectURL: jest.fn(() => 'mock-blob-url'),
  revokeObjectURL: jest.fn(),
} as any;

// Mock document.createElement more carefully
const originalCreateElement = document.createElement;
beforeEach(() => {
  jest.clearAllMocks();
  document.createElement = jest.fn().mockImplementation((tagName: string) => {
    if (tagName === 'a') {
      const element = originalCreateElement.call(document, 'a');
      element.click = mockClick;
      return element;
    }
    return originalCreateElement.call(document, tagName);
  });
});

afterEach(() => {
  document.createElement = originalCreateElement;
});

describe('Providers Page - Core Functionality (TDD)', () => {
  
  describe('1. Basic Rendering & Structure', () => {
    it('renders the page title correctly', () => {
      render(<Providers />);
      
      // Test behavior: Should show "Provider Database" heading
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/provider database/i);
    });

    it('displays provider count in header', () => {
      render(<Providers />);
      
      // Test behavior: Should show total count and critical count
      expect(screen.getByText(/3 providers/i)).toBeInTheDocument();
      expect(screen.getByText(/1 critical/i)).toBeInTheDocument();
    });

    it('shows all providers initially', () => {
      render(<Providers />);
      
      // Test behavior: All providers should be visible by default
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
    });
  });

  describe('2. Search Functionality (TDD)', () => {
    it('filters providers by name (case-insensitive)', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Find search input (flexible selector)
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
      
      // Test behavior: Search should filter by name
      await user.type(searchInput, 'john');
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument(); // Contains "john"
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('filters providers by specialty', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'cardiology');
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('shows empty state when no results found', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'nonexistent');
      
      await waitFor(() => {
        expect(screen.getByText(/no providers found/i)).toBeInTheDocument();
        expect(screen.queryByText('Dr. John Smith')).not.toBeInTheDocument();
      });
    });

    it('clears search results when input is cleared', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByRole('textbox');
      
      // Search for something
      await user.type(searchInput, 'john');
      await waitFor(() => {
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
      
      // Clear search
      await user.clear(searchInput);
      
      // All providers should be visible again
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
      });
    });
  });

  describe('3. Filter Logic (TDD)', () => {
    it('filters by department when filter button clicked', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Test behavior: Department filters should work
      const cardiologyFilter = screen.getByRole('button', { name: /cardiology/i });
      await user.click(cardiologyFilter);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('can apply multiple filters simultaneously', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Apply neurology filter
      const neurologyFilter = screen.getByRole('button', { name: /neurology/i });
      await user.click(neurologyFilter);
      
      // Apply PTHS filter
      const pthsFilter = screen.getByRole('button', { name: /pths only/i });
      await user.click(pthsFilter);
      
      await waitFor(() => {
        expect(screen.queryByText('Dr. John Smith')).not.toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument(); // Matches both
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('can toggle filters on and off', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const cardiologyFilter = screen.getByRole('button', { name: /cardiology/i });
      
      // Apply filter
      await user.click(cardiologyFilter);
      await waitFor(() => {
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
      });
      
      // Remove filter  
      await user.click(cardiologyFilter);
      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      });
    });

    it('updates provider count when filters are applied', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Initial count
      expect(screen.getByText(/3 providers/i)).toBeInTheDocument();
      
      // Apply filter
      const cardiologyFilter = screen.getByRole('button', { name: /cardiology/i });
      await user.click(cardiologyFilter);
      
      // Count should update
      await waitFor(() => {
        expect(screen.getByText(/1 provider/i)).toBeInTheDocument();
      });
    });
  });

  describe('4. Provider Information Display (TDD)', () => {
    it('displays essential provider information', () => {
      render(<Providers />);
      
      // Test behavior: All essential info should be visible
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      // Test that specialty info is present (may appear in multiple places)
      expect(screen.getAllByText('Cardiology').length).toBeGreaterThan(0);
      expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
      // Test that location info is present (may appear in multiple places)
      expect(screen.getAllByText(/Manhattan/).length).toBeGreaterThan(0);
    });

    it('shows priority notes when present', () => {
      render(<Providers />);
      
      // Test behavior: Priority notes should be displayed
      expect(screen.getByText(/requires 3t mri only/i)).toBeInTheDocument();
      expect(screen.getByText(/contact through coordinator/i)).toBeInTheDocument();
    });

    it('displays provider tags', () => {
      render(<Providers />);
      
      // Test behavior: Tags should be visible
      expect(screen.getByText('3T-required')).toBeInTheDocument();
      expect(screen.getByText('PTHS-only')).toBeInTheDocument();
      expect(screen.getByText('no-direct-contact')).toBeInTheDocument();
    });

    it('shows Epic chat information', () => {
      render(<Providers />);
      
      // Test behavior: Epic chat names should be displayed
      // Epic chat names are shown as "Epic: [names]" in the contact cell
      expect(screen.getByText(/Epic: bapatoff/)).toBeInTheDocument();
      expect(screen.getByText(/Epic: hfine/)).toBeInTheDocument();
      expect(screen.getByText(/Epic: rmagge/)).toBeInTheDocument();
    });
  });

  describe('5. JSON Export Functionality (TDD)', () => {
    it('provides export button', () => {
      render(<Providers />);
      
      // Test behavior: Export functionality should be available
      const exportButton = screen.getByRole('button', { name: /export json/i });
      expect(exportButton).toBeInTheDocument();
    });

    it('triggers download when export clicked', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const exportButton = screen.getByRole('button', { name: /export json/i });
      await user.click(exportButton);
      
      // Test behavior: Should trigger download process
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('6. UI Consistency & Design (TDD)', () => {
    it('uses consistent button styling patterns', () => {
      render(<Providers />);
      
      // Test behavior: Buttons should follow shadcn patterns
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // At least some buttons should have shadcn-style classes
      const hasStyledButtons = buttons.some(btn => 
        btn.className.includes('inline-flex') || 
        btn.className.includes('items-center')
      );
      expect(hasStyledButtons).toBe(true);
    });

    it('maintains responsive grid layout', () => {
      render(<Providers />);
      
      // Test behavior: Providers are displayed in a table layout
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Provider rows should be in the table
      const providerRows = screen.getAllByRole('row');
      // At least header row + some provider rows
      expect(providerRows.length).toBeGreaterThan(1);
    });

    it('provides proper search input styling', () => {
      render(<Providers />);
      
      // Test behavior: Search input should follow design system
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveClass(/border/, /rounded/); // Common shadcn patterns
    });
  });
});

describe('Providers Integration with Error Boundaries', () => {
  it('renders within error boundary without crashing', () => {
    render(<Providers />);
    
    // Test behavior: Should render successfully with error boundaries
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});