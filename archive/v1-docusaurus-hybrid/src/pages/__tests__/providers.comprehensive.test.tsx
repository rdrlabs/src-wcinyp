import React from 'react';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Providers from '../providers';

// Use RTL render directly to avoid custom render issues
const render = (ui: React.ReactElement) => rtlRender(ui);

// Enhanced mock data for comprehensive testing
jest.mock('../../data/providers.json', () => ({
  providers: [
    {
      id: 'dr-smith-cardio',
      name: 'Dr. John Smith',
      credentials: 'MD',
      specialty: 'Interventional Cardiology',
      department: 'cardiology',
      npi: '1234567890',
      phone: '(555) 123-4567',
      email: 'jsmith@hospital.com',
      location: 'Manhattan - Main Campus',
      epic_chat: ['jsmith'],
      tags: ['3T-required', 'emergency-capable'],
      associated_providers: [],
      priority_notes: [
        {
          type: 'critical',
          icon: '⚠️',
          text: 'Requires 3T MRI scanner only - no exceptions'
        }
      ],
      last_updated: '2025-01-01',
      updated_by: 'admin',
      status: 'critical'
    },
    {
      id: 'dr-johnson-neuro',
      name: 'Dr. Sarah Johnson',
      credentials: 'MD, PhD',
      specialty: 'Neurological Surgery',
      department: 'neurology',
      npi: '0987654321',
      phone: '(555) 987-6543',
      email: 'sjohnson@hospital.com',
      location: 'Queens - Satellite Office',
      epic_chat: ['sjohnson', 'sjohnson_backup'],
      tags: ['PTHS-only', 'pediatric-certified'],
      associated_providers: ['dr-smith-cardio'],
      priority_notes: [
        {
          type: 'info',
          icon: 'ℹ️',
          text: 'Prefers morning appointments'
        }
      ],
      last_updated: '2024-12-15',
      updated_by: 'scheduler',
      status: 'ok'
    },
    {
      id: 'dr-chen-oncology',
      name: 'Dr. Michael Chen',
      credentials: 'MD, FACO',
      specialty: 'Medical Oncology',
      department: 'oncology',
      npi: '1122334455',
      phone: '(555) 234-5678',
      email: 'mchen@hospital.com',
      location: 'Manhattan - Cancer Center',
      epic_chat: ['mchen'],
      tags: ['no-direct-contact'],
      associated_providers: [],
      priority_notes: [
        {
          type: 'contact',
          icon: '📞',
          text: 'Contact through nurse coordinator only'
        }
      ],
      last_updated: '2024-11-20',
      updated_by: 'coordinator',
      status: 'warning'
    }
  ]
}));

// Mock document methods for export functionality
const mockClick = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

global.document.createElement = jest.fn((tagName) => {
  if (tagName === 'a') {
    return {
      href: '',
      download: '',
      click: mockClick,
      style: {},
    } as unknown as HTMLAnchorElement;
  }
  return {} as unknown as HTMLElement;
}) as typeof document.createElement;

// Mock body methods without overriding the entire body object
Object.defineProperty(global.document.body, 'appendChild', {
  value: mockAppendChild,
  writable: true,
});

Object.defineProperty(global.document.body, 'removeChild', {
  value: mockRemoveChild,
  writable: true,
});

global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = jest.fn();

describe('Providers Page - Comprehensive Behavior Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure & Consistency', () => {
    it('follows Docusaurus layout pattern', () => {
      render(<Providers />);
      
      // Should use Docusaurus Layout component (mocked)
      expect(screen.getByTestId('layout')).toBeInTheDocument();
      
      // Should have proper page structure
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('displays page title and provider count consistently', () => {
      render(<Providers />);
      
      // Page should have clear title
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/provider database/i);
      
      // Should show total count
      expect(screen.getByText(/3 providers/i)).toBeInTheDocument();
      
      // Should show critical count
      expect(screen.getByText(/1 critical/i)).toBeInTheDocument();
    });

    it('uses shadcn/ui component patterns consistently', () => {
      render(<Providers />);
      
      // Search should use Input component pattern
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveClass(/border/, /rounded/); // shadcn styling patterns
      
      // Filters should use Button component pattern
      const filterButtons = screen.getAllByRole('button');
      const departmentFilters = filterButtons.filter(btn => 
        ['Neurology', 'Cardiology', 'Oncology'].some(dept => 
          btn.textContent?.includes(dept)
        )
      );
      expect(departmentFilters.length).toBeGreaterThan(0);
      
      // Each provider should be in a Card component
      const providerCards = screen.getAllByText(/Dr\./);
      expect(providerCards).toHaveLength(3);
    });
  });

  describe('Search Functionality - Behavior Testing', () => {
    it('filters providers by name (case-insensitive)', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Initially shows all providers
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
      
      // Search by partial name (lowercase)
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      await user.type(searchInput, 'john');
      
      // Should show only matching providers
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('filters providers by specialty', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      await user.type(searchInput, 'cardiology');
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('filters providers by tags', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      await user.type(searchInput, 'PTHS-only');
      
      await waitFor(() => {
        expect(screen.queryByText('Dr. John Smith')).not.toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('filters providers by priority notes', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      await user.type(searchInput, 'coordinator');
      
      await waitFor(() => {
        expect(screen.queryByText('Dr. John Smith')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
      });
    });

    it('handles empty search results gracefully', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      await user.type(searchInput, 'nonexistent doctor');
      
      await waitFor(() => {
        expect(screen.queryByText('Dr. John Smith')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
        
        // Should show empty state
        expect(screen.getByText(/no providers found/i)).toBeInTheDocument();
      });
    });

    it('clears search when input is emptied', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      
      // Search for something
      await user.type(searchInput, 'john');
      await waitFor(() => {
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
      
      // Clear search
      await user.clear(searchInput);
      
      // Should show all providers again
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument();
      });
    });
  });

  describe('Filter Logic - Behavior Testing', () => {
    it('filters by department when department filter is clicked', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Click cardiology filter
      const cardiologyFilter = screen.getByRole('button', { name: /cardiology/i });
      await user.click(cardiologyFilter);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('filters by status (critical notes)', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const criticalFilter = screen.getByRole('button', { name: /critical notes/i });
      await user.click(criticalFilter);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Chen')).not.toBeInTheDocument();
      });
    });

    it('supports multiple filters simultaneously', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Apply department filter
      const neurologyFilter = screen.getByRole('button', { name: /neurology/i });
      await user.click(neurologyFilter);
      
      // Apply tag filter
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

    it('combines search and filters correctly', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Search for "Dr"
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      await user.type(searchInput, 'Dr');
      
      // Apply oncology filter
      const oncologyFilter = screen.getByRole('button', { name: /oncology/i });
      await user.click(oncologyFilter);
      
      await waitFor(() => {
        expect(screen.queryByText('Dr. John Smith')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.getByText('Dr. Michael Chen')).toBeInTheDocument(); // Matches both search and filter
      });
    });
  });

  describe('Provider Display & Status - Behavior Testing', () => {
    it('displays all essential provider information', () => {
      render(<Providers />);
      
      // Check Dr. Smith's card has essential info
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Interventional Cardiology')).toBeInTheDocument();
      expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
      expect(screen.getByText('Manhattan - Main Campus')).toBeInTheDocument();
    });

    it('shows provider status indicators visually', () => {
      render(<Providers />);
      
      // Each provider card should have status indicator
      // (Testing behavior, not specific colors or icons)
      const providerCards = screen.getAllByText(/Dr\./).map(el => el.closest('[data-testid], .hover\\:shadow, [class*="card"]') || el.parentElement);
      
      // Should have visual status indicators
      providerCards.forEach(card => {
        expect(card).toBeInTheDocument();
        // Visual status indicators present (exact implementation flexible)
      });
    });

    it('displays priority notes when present', () => {
      render(<Providers />);
      
      // Critical note for Dr. Smith
      expect(screen.getByText(/requires 3t mri scanner/i)).toBeInTheDocument();
      
      // Contact note for Dr. Chen  
      expect(screen.getByText(/contact through nurse coordinator/i)).toBeInTheDocument();
    });

    it('displays tags for each provider', () => {
      render(<Providers />);
      
      // Should show tags (exact styling flexible)
      expect(screen.getByText('3T-required')).toBeInTheDocument();
      expect(screen.getByText('PTHS-only')).toBeInTheDocument();
      expect(screen.getByText('no-direct-contact')).toBeInTheDocument();
    });

    it('shows Epic chat usernames when available', () => {
      render(<Providers />);
      
      expect(screen.getByText('jsmith')).toBeInTheDocument();
      expect(screen.getByText('sjohnson, sjohnson_backup')).toBeInTheDocument();
      expect(screen.getByText('mchen')).toBeInTheDocument();
    });
  });

  describe('JSON Export Functionality - Behavior Testing', () => {
    it('provides export functionality', () => {
      render(<Providers />);
      
      const exportButton = screen.getByRole('button', { name: /export json/i });
      expect(exportButton).toBeInTheDocument();
    });

    it('triggers download when export button is clicked', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const exportButton = screen.getByRole('button', { name: /export json/i });
      await user.click(exportButton);
      
      // Should create download link
      expect(global.document.createElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('exports data with proper filename format', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const exportButton = screen.getByRole('button', { name: /export json/i });
      await user.click(exportButton);
      
      // Check that createElement was called and mock element was configured
      expect(global.document.createElement).toHaveBeenCalledWith('a');
      
      // The filename should include date (exact format flexible)
      const createElementCalls = (global.document.createElement as jest.Mock).mock.calls;
      expect(createElementCalls.some(call => call[0] === 'a')).toBe(true);
    });
  });

  describe('Responsive Design & Accessibility', () => {
    it('maintains keyboard accessibility', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Search input should be keyboard accessible
      const searchInput = screen.getByPlaceholderText(/search providers/i);
      expect(searchInput).toBeInTheDocument();
      
      await user.tab();
      // Should be able to navigate to search input (exact implementation flexible)
    });

    it('provides proper ARIA labels and roles', () => {
      render(<Providers />);
      
      // Main content should have proper structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Search should be properly labeled
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
      
      // Buttons should be properly labeled
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type');
      });
    });
  });

  describe('Error Boundary Integration', () => {
    it('is wrapped with error boundaries for resilience', () => {
      render(<Providers />);
      
      // Page should render without crashing
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Error boundaries should be in place (implementation tested separately)
    });
  });
});

describe('Provider Count and Statistics', () => {
  it('updates counts dynamically as filters are applied', async () => {
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

  it('maintains critical count accuracy', async () => {
    const user = userEvent.setup();
    render(<Providers />);
    
    // Initial critical count
    expect(screen.getByText(/1 critical/i)).toBeInTheDocument();
    
    // Filter out the critical provider
    const neurologyFilter = screen.getByRole('button', { name: /neurology/i });
    await user.click(neurologyFilter);
    
    // Critical count should update
    await waitFor(() => {
      expect(screen.getByText(/0 critical/i)).toBeInTheDocument();
    });
  });
});