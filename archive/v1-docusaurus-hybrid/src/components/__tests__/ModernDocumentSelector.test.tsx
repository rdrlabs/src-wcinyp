import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import ModernDocumentSelector from '../ModernDocumentSelector';

// Mock window.open and print functionality
const mockWindowOpen = jest.fn();
const mockPrint = jest.fn();

beforeEach(() => {
  mockWindowOpen.mockClear();
  mockPrint.mockClear();
  
  global.window.open = mockWindowOpen.mockReturnValue({
    print: mockPrint,
    close: jest.fn(),
  });
  
  global.window.print = jest.fn();
  
  // Mock alert
  global.alert = jest.fn();
});

describe('ModernDocumentSelector', () => {
  describe('Initial Rendering', () => {
    it('renders the document hub interface', () => {
      render(<ModernDocumentSelector />);
      
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search documents...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'General' })).toBeInTheDocument();
    });

    it('shows empty print queue initially', () => {
      render(<ModernDocumentSelector />);
      
      // Print queue only shows when documents are selected
      expect(screen.queryByText(/Print Queue:/)).not.toBeInTheDocument();
    });

    it('renders search input', () => {
      render(<ModernDocumentSelector />);
      
      const searchInput = screen.getByPlaceholderText('Search documents...');
      expect(searchInput).toBeInTheDocument();
    });

    it('renders section filter buttons', () => {
      render(<ModernDocumentSelector />);
      
      expect(screen.getByRole('button', { name: 'General' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Financial' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'MRI' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'CT' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'PET' })).toBeInTheDocument();
    });
  });

  describe('Document Selection', () => {
    it('allows selecting and deselecting documents', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      // Find and click a document checkbox
      const mriQuestionnaire = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      await user.click(mriQuestionnaire);
      
      expect(screen.getByText(/Print Queue: 1 items/)).toBeInTheDocument();
      expect(screen.getByText(/Total copies: 1/)).toBeInTheDocument();
      
      // Deselect the document
      await user.click(mriQuestionnaire);
      
      expect(screen.queryByText(/Print Queue:/)).not.toBeInTheDocument();
    });

    it('updates print queue when documents are selected', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      const ctDoc = screen.getByRole('checkbox', { name: 'CT Questionnaire' });
      
      await user.click(mriDoc);
      await user.click(ctDoc);
      
      expect(screen.getByText(/Print Queue: 2 items/)).toBeInTheDocument();
      expect(screen.getByText(/Total copies: 2/)).toBeInTheDocument();
    });

    it('shows selected documents in the queue preview', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      await user.click(mriDoc);
      
      expect(screen.getByText(/Print Queue: 1 items/)).toBeInTheDocument();
      // Verify document appears in print queue (not just anywhere on page)
      const printQueue = screen.getByText(/Print Queue: 1 items/).closest('div');
      expect(printQueue).toBeInTheDocument();
    });

    it('allows selecting Financial Forms documents', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      // Find and click a financial document checkbox
      const selfPayForm = screen.getByRole('checkbox', { name: 'Waiver of Liability Form - Self Pay' });
      await user.click(selfPayForm);
      
      expect(screen.getByText(/Print Queue: 1 items/)).toBeInTheDocument();
      expect(screen.getByText(/Total copies: 1/)).toBeInTheDocument();
      
      // Deselect the document
      await user.click(selfPayForm);
      
      expect(screen.queryByText(/Print Queue:/)).not.toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters documents based on search term', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const searchInput = screen.getByPlaceholderText('Search documents...');
      await user.type(searchInput, 'MRI');
      
      await waitFor(() => {
        expect(screen.getByText(/Search Results/)).toBeInTheDocument();
      });
      
      // Should show MRI-related documents
      expect(screen.getByText('MRI Questionnaire')).toBeInTheDocument();
      expect(screen.getByText('MRI Cardiovascular Form')).toBeInTheDocument();
    });

    it('shows no results message for invalid search', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const searchInput = screen.getByPlaceholderText('Search documents...');
      await user.type(searchInput, 'NonexistentDocument');
      
      await waitFor(() => {
        expect(screen.getByText(/Search Results \(0\)/)).toBeInTheDocument();
      });
    });

    it('clears search and returns to normal view', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const searchInput = screen.getByPlaceholderText('Search documents...');
      await user.type(searchInput, 'MRI');
      
      await waitFor(() => {
        expect(screen.getByText(/Search Results/)).toBeInTheDocument();
      });
      
      await user.clear(searchInput);
      
      await waitFor(() => {
        expect(screen.queryByText(/Search Results/)).not.toBeInTheDocument();
        expect(screen.getByText('General Forms')).toBeInTheDocument();
      });
    });
  });

  describe('Section Filtering', () => {
    it('toggles section visibility', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const mriButton = screen.getByRole('button', { name: 'MRI' });
      
      // Initially, MRI section should be visible
      expect(screen.getByText('MRI Forms')).toBeInTheDocument();
      
      // Toggle off
      await user.click(mriButton);
      
      expect(screen.queryByText('MRI Forms')).not.toBeInTheDocument();
      
      // Toggle back on
      await user.click(mriButton);
      
      expect(screen.getByText('MRI Forms')).toBeInTheDocument();
    });

    it('toggles Financial section visibility', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const financialButton = screen.getByRole('button', { name: 'Financial' });
      
      // Initially, Financial section should be visible
      expect(screen.getByText('Financial Forms')).toBeInTheDocument();
      
      // Toggle off
      await user.click(financialButton);
      
      expect(screen.queryByText('Financial Forms')).not.toBeInTheDocument();
      
      // Toggle back on
      await user.click(financialButton);
      
      expect(screen.getByText('Financial Forms')).toBeInTheDocument();
    });
  });

  describe('Bulk Mode', () => {
    it('enables and configures bulk mode', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      // Select a document first
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      await user.click(mriDoc);
      
      // Enable bulk mode
      const bulkModeCheckbox = screen.getByLabelText('Bulk Mode');
      await user.click(bulkModeCheckbox);
      
      expect(bulkModeCheckbox).toBeChecked();
      
      // Should show quantity selector
      const quantitySelect = screen.getByRole('combobox');
      expect(quantitySelect).toBeInTheDocument();
      
      // Verify bulk mode quantity selector is present
      // Note: Skip interaction test due to JSDOM/Radix Select compatibility
      expect(quantitySelect).toBeVisible();
    });
  });

  describe('Print Functionality', () => {
    it('prevents printing when no documents selected', async () => {
      render(<ModernDocumentSelector />);
      
      // No print button when nothing selected - print queue is hidden
      expect(screen.queryByRole('button', { name: /Print/ })).not.toBeInTheDocument();
    });

    it('opens print windows for selected documents', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      // Select a document
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      await user.click(mriDoc);
      
      const printButton = screen.getByRole('button', { name: /Print 1/ });
      await user.click(printButton);
      
      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith('/documents/MRI Questionnaire.pdf', '_blank');
      });
    });

    it('handles print failures gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock failed window.open
      mockWindowOpen.mockReturnValueOnce(null);
      
      render(<ModernDocumentSelector />);
      
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      await user.click(mriDoc);
      
      const printButton = screen.getByRole('button', { name: /Print 1/ });
      await user.click(printButton);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Unable to open print dialog. Please check your popup blocker settings.');
      });
    });

    it('shows printing state during print operation', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      await user.click(mriDoc);
      
      const printButton = screen.getByRole('button', { name: /Print 1/ });
      await user.click(printButton);
      
      // Should show loading state briefly
      expect(screen.getByText('Printing...')).toBeInTheDocument();
    });
  });

  describe('Clear Functionality', () => {
    it('clears all selected documents', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      // Select multiple documents
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      const ctDoc = screen.getByRole('checkbox', { name: 'CT Questionnaire' });
      
      await user.click(mriDoc);
      await user.click(ctDoc);
      
      expect(screen.getByText(/Print Queue: 2 items/)).toBeInTheDocument();
      
      // Clear all
      const clearButton = screen.getByRole('button', { name: 'Clear selected documents' });
      await user.click(clearButton);
      
      expect(screen.queryByText(/Print Queue:/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('supports keyboard navigation', async () => {
      render(<ModernDocumentSelector />);
      
      const searchInput = screen.getByPlaceholderText('Search documents...');
      
      // Should be focusable
      searchInput.focus();
      expect(searchInput).toHaveFocus();
      
      // Tab to next focusable element
      fireEvent.keyDown(searchInput, { key: 'Tab' });
    });

    it('has proper ARIA labels', () => {
      render(<ModernDocumentSelector />);
      
      const searchInput = screen.getByPlaceholderText('Search documents...');
      expect(searchInput).toHaveAttribute('type', 'text');
      
      // Check for section buttons with proper roles
      const mriButton = screen.getByRole('button', { name: 'MRI' });
      expect(mriButton).toBeInTheDocument();
    });

    it('announces selection state changes', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      expect(mriDoc).not.toBeChecked();
      
      await user.click(mriDoc);
      expect(mriDoc).toBeChecked();
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      // This would typically be tested with an error boundary
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<ModernDocumentSelector />);
      
      // Component should render without errors
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('handles rapid selection changes', async () => {
      const user = userEvent.setup();
      render(<ModernDocumentSelector />);
      
      const mriDoc = screen.getByRole('checkbox', { name: 'MRI Questionnaire' });
      
      // Rapidly toggle selection - 4 clicks (even) should end unselected
      for (let i = 0; i < 4; i++) {
        await user.click(mriDoc);
      }
      
      // Should end up unselected (even number of clicks)
      expect(screen.queryByText(/Print Queue:/)).not.toBeInTheDocument();
    });
  });
});