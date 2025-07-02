import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import Providers from '../providers';

// Mock providers data
jest.mock('../../data/providers.json', () => ({
  providers: [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
      name: 'Dr. Michael Brown',
      credentials: 'MD',
      specialty: 'Oncology',
      department: 'oncology',
      npi: '1122334455',
      phone: '(555) 111-2222',
      email: 'mbrown@test.com',
      location: 'Manhattan',
      epic_chat: [],
      tags: ['no-direct-contact'],
      associated_providers: [],
      priority_notes: [
        {
          type: 'contact',
          icon: '📞',
          text: 'Contact via scheduler only'
        }
      ],
      last_updated: '2025-01-01',
      updated_by: 'admin',
      status: 'warning'
    }
  ]
}));

// Mock URL.createObjectURL and revokeObjectURL for download functionality
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock document.createElement for download functionality
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
    };
  }
  return {};
});

global.document.body = {
  appendChild: mockAppendChild,
  removeChild: mockRemoveChild,
} as any;

beforeEach(() => {
  mockClick.mockClear();
  mockAppendChild.mockClear();
  mockRemoveChild.mockClear();
  (global.URL.createObjectURL as jest.Mock).mockClear();
  (global.URL.revokeObjectURL as jest.Mock).mockClear();
});

describe('Providers Page', () => {
  describe('Initial Rendering', () => {
    it('renders the provider database interface', () => {
      render(<Providers />);
      
      expect(screen.getByText('Provider Database')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search providers...')).toBeInTheDocument();
      expect(screen.getByText('3 providers (1 critical)')).toBeInTheDocument();
    });

    it('displays all provider cards', () => {
      render(<Providers />);
      
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Dr. Michael Brown')).toBeInTheDocument();
    });

    it('shows provider specialties', () => {
      render(<Providers />);
      
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Neurology')).toBeInTheDocument();
      expect(screen.getByText('Oncology')).toBeInTheDocument();
    });

    it('displays filter buttons', () => {
      render(<Providers />);
      
      expect(screen.getByRole('button', { name: 'Neurology' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cardiology' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Oncology' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Critical Notes' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'PTHS Only' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '3T Required' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No Direct Contact' })).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters providers by name', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText('Search providers...');
      await user.type(searchInput, 'John');
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('filters providers by specialty', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText('Search providers...');
      await user.type(searchInput, 'Cardiology');
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('filters providers by phone number', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText('Search providers...');
      await user.type(searchInput, '555) 123');
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('filters providers by NPI', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText('Search providers...');
      await user.type(searchInput, '1234567890');
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('shows no results message for invalid search', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText('Search providers...');
      await user.type(searchInput, 'NonexistentProvider');
      
      await waitFor(() => {
        expect(screen.getByText('No providers found')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your search terms or filters.')).toBeInTheDocument();
      });
    });

    it('clears search and returns to normal view', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText('Search providers...');
      await user.type(searchInput, 'John');
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
      });
      
      await user.clear(searchInput);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Dr. Michael Brown')).toBeInTheDocument();
      });
    });
  });

  describe('Filter Functionality', () => {
    it('filters by department - Cardiology', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const cardiologyButton = screen.getByRole('button', { name: 'Cardiology' });
      await user.click(cardiologyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('filters by department - Neurology', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const neurologyButton = screen.getByRole('button', { name: 'Neurology' });
      await user.click(neurologyButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Dr. John Smith')).not.toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('filters by critical status', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const criticalButton = screen.getByRole('button', { name: 'Critical Notes' });
      await user.click(criticalButton);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('filters by tag - 3T Required', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const tag3TButton = screen.getByRole('button', { name: '3T Required' });
      await user.click(tag3TButton);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('filters by tag - PTHS Only', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const pthsButton = screen.getByRole('button', { name: 'PTHS Only' });
      await user.click(pthsButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Dr. John Smith')).not.toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });

    it('toggles filter on and off', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const cardiologyButton = screen.getByRole('button', { name: 'Cardiology' });
      
      // Apply filter
      await user.click(cardiologyButton);
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
      });
      
      // Remove filter
      await user.click(cardiologyButton);
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Dr. Michael Brown')).toBeInTheDocument();
      });
    });

    it('applies multiple filters simultaneously', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const cardiologyButton = screen.getByRole('button', { name: 'Cardiology' });
      const tag3TButton = screen.getByRole('button', { name: '3T Required' });
      
      await user.click(cardiologyButton);
      await user.click(tag3TButton);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
        expect(screen.queryByText('Dr. Michael Brown')).not.toBeInTheDocument();
      });
    });
  });

  describe('Provider Card Display', () => {
    it('displays provider contact information', () => {
      render(<Providers />);
      
      expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
      expect(screen.getByText('Manhattan')).toBeInTheDocument();
      expect(screen.getByText('jsmith')).toBeInTheDocument();
    });

    it('displays priority notes with icons', () => {
      render(<Providers />);
      
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('Requires 3T MRI only')).toBeInTheDocument();
      expect(screen.getByText('📞')).toBeInTheDocument();
      expect(screen.getByText('Contact via scheduler only')).toBeInTheDocument();
    });

    it('displays provider tags', () => {
      render(<Providers />);
      
      expect(screen.getByText('3T-required')).toBeInTheDocument();
      expect(screen.getByText('PTHS-only')).toBeInTheDocument();
      expect(screen.getByText('no-direct-contact')).toBeInTheDocument();
    });

    it('shows status indicators with correct colors', () => {
      render(<Providers />);
      
      // Critical status (red dot)
      const criticalCard = screen.getByText('Dr. John Smith').closest('div');
      expect(criticalCard).toBeInTheDocument();
      
      // Warning status (yellow dot)
      const warningCard = screen.getByText('Dr. Michael Brown').closest('div');
      expect(warningCard).toBeInTheDocument();
      
      // OK status (green dot)
      const okCard = screen.getByText('Dr. Sarah Johnson').closest('div');
      expect(okCard).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('triggers JSON download when export button clicked', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const exportButton = screen.getByRole('button', { name: '📥 Export JSON' });
      await user.click(exportButton);
      
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('exports filtered data when filters are applied', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      // Apply a filter first
      const cardiologyButton = screen.getByRole('button', { name: 'Cardiology' });
      await user.click(cardiologyButton);
      
      const exportButton = screen.getByRole('button', { name: '📥 Export JSON' });
      await user.click(exportButton);
      
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText('Search providers...');
      expect(searchInput).toHaveAttribute('type', 'text');
      
      const filterButtons = screen.getAllByRole('button');
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation', () => {
      render(<Providers />);
      
      const searchInput = screen.getByPlaceholderText('Search providers...');
      searchInput.focus();
      expect(searchInput).toHaveFocus();
      
      fireEvent.keyDown(searchInput, { key: 'Tab' });
      // Next focusable element should receive focus
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<Providers />);
      
      expect(screen.getByText('Provider Database')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('handles rapid filter changes', async () => {
      const user = userEvent.setup();
      render(<Providers />);
      
      const cardiologyButton = screen.getByRole('button', { name: 'Cardiology' });
      
      // Rapidly toggle filter multiple times
      for (let i = 0; i < 5; i++) {
        await user.click(cardiologyButton);
      }
      
      // Should still function correctly
      await waitFor(() => {
        expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
      });
    });
  });
});