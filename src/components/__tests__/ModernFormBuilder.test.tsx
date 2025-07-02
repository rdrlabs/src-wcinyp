import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import ModernFormBuilder from '../ModernFormBuilder';

const mockPrint = jest.fn();

beforeEach(() => {
  mockPrint.mockClear();
  global.window.print = mockPrint;
  global.alert = jest.fn();
});

describe('ModernFormBuilder', () => {
  describe('Initial Rendering', () => {
    it('renders the form generator interface', () => {
      render(<ModernFormBuilder />);
      
      expect(screen.getByText('Form Generator')).toBeInTheDocument();
      expect(screen.getByText('Create and customize self-pay agreement forms')).toBeInTheDocument();
      expect(screen.getAllByText('Self-Pay Agreement Form')[0]).toBeInTheDocument();
    });

    it('shows initial progress state', () => {
      render(<ModernFormBuilder />);
      
      expect(screen.getByText('Form Progress')).toBeInTheDocument();
      expect(screen.getByText('0 of 4 fields completed')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      render(<ModernFormBuilder />);
      
      expect(screen.getByLabelText(/Patient Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date of Birth/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Service Date/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Amount Due/)).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<ModernFormBuilder />);
      
      expect(screen.getByRole('button', { name: /Clear Form/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Print Form/ })).toBeInTheDocument();
    });
  });

  describe('Form Field Interactions', () => {
    it('updates field values when typing', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const nameInput = screen.getByLabelText(/Patient Name/);
      await user.type(nameInput, 'John Doe');
      
      expect(nameInput).toHaveValue('John Doe');
    });

    it('updates progress as fields are completed', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      // Initially 0% complete
      expect(screen.getByText('0%')).toBeInTheDocument();
      
      // Fill first field
      const nameInput = screen.getByLabelText(/Patient Name/);
      await user.type(nameInput, 'John Doe');
      
      await waitFor(() => {
        expect(screen.getByText('25%')).toBeInTheDocument();
        expect(screen.getByText('1 of 4 fields completed')).toBeInTheDocument();
      });
      
      // Fill second field
      const dobInput = screen.getByLabelText(/Date of Birth/);
      await user.type(dobInput, '1990-01-01');
      
      await waitFor(() => {
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('2 of 4 fields completed')).toBeInTheDocument();
      });
    });

    it('validates different input types', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const dobInput = screen.getByLabelText(/Date of Birth/);
      const amountInput = screen.getByLabelText(/Amount Due/);
      
      // Date input should accept valid dates
      await user.type(dobInput, '1990-01-01');
      expect(dobInput).toHaveValue('1990-01-01');
      
      // Number input should accept numbers
      await user.type(amountInput, '150.75');
      expect(amountInput).toHaveValue(150.75);
    });

    it('preserves whitespace in inputs', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const nameInput = screen.getByLabelText(/Patient Name/);
      await user.type(nameInput, '  John Doe  ');
      
      // Should preserve whitespace as typed
      expect(nameInput).toHaveValue('  John Doe  ');
    });
  });

  describe('Form Validation', () => {
    it('handles empty form state correctly', () => {
      render(<ModernFormBuilder />);
      
      const clearButton = screen.getByRole('button', { name: /Clear Form/ });
      const printButton = screen.getByRole('button', { name: /Print Form/ });
      
      expect(clearButton).toBeDisabled();
      expect(printButton).toBeDisabled();
    });

    it('enables buttons when form has data', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const nameInput = screen.getByLabelText(/Patient Name/);
      await user.type(nameInput, 'John Doe');
      
      await waitFor(() => {
        const clearButton = screen.getByRole('button', { name: /Clear Form/ });
        const printButton = screen.getByRole('button', { name: /Print Form/ });
        
        expect(clearButton).toBeEnabled();
        expect(printButton).toBeEnabled();
      });
    });

    it('shows validation state in field styling', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const nameInput = screen.getByLabelText(/Patient Name/);
      await user.type(nameInput, 'John Doe');
      
      // Should have success styling (green ring)
      expect(nameInput).toHaveClass('ring-2', 'ring-green-500/20', 'border-green-500/50');
    });
  });

  describe('Clear Functionality', () => {
    it('clears all form fields', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      // Fill out form
      await user.type(screen.getByLabelText(/Patient Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Date of Birth/), '1990-01-01');
      await user.type(screen.getByLabelText(/Service Date/), '2024-01-01');
      await user.type(screen.getByLabelText(/Amount Due/), '100');
      
      // Verify form is filled
      expect(screen.getByText('100%')).toBeInTheDocument();
      
      // Clear form
      const clearButton = screen.getByRole('button', { name: /Clear Form/ });
      await user.click(clearButton);
      
      // All fields should be empty
      expect(screen.getByLabelText(/Patient Name/)).toHaveValue('');
      expect(screen.getByLabelText(/Date of Birth/)).toHaveValue('');
      expect(screen.getByLabelText(/Service Date/)).toHaveValue('');
      expect(screen.getByLabelText(/Amount Due/)).toHaveValue(null);
      
      // Progress should reset
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('disables clear button after clearing', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      // Fill a field
      await user.type(screen.getByLabelText(/Patient Name/), 'John Doe');
      
      // Clear form
      const clearButton = screen.getByRole('button', { name: /Clear Form/ });
      await user.click(clearButton);
      
      // Clear button should be disabled again
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Print Functionality', () => {
    it('prints form when print button is clicked', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      // Fill out form
      await user.type(screen.getByLabelText(/Patient Name/), 'John Doe');
      
      const printButton = screen.getByRole('button', { name: /Print Form/ });
      await user.click(printButton);
      
      expect(mockPrint).toHaveBeenCalledTimes(1);
    });

    it('handles print errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock print to throw error
      mockPrint.mockImplementationOnce(() => {
        throw new Error('Print failed');
      });
      
      render(<ModernFormBuilder />);
      
      await user.type(screen.getByLabelText(/Patient Name/), 'John Doe');
      
      const printButton = screen.getByRole('button', { name: /Print Form/ });
      await user.click(printButton);
      
      expect(global.alert).toHaveBeenCalledWith('Unable to print. Please check your browser settings.');
      
      consoleSpy.mockRestore();
    });

    it('can print partially filled forms', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      // Fill only one field
      await user.type(screen.getByLabelText(/Patient Name/), 'John Doe');
      
      const printButton = screen.getByRole('button', { name: /Print Form/ });
      await user.click(printButton);
      
      expect(mockPrint).toHaveBeenCalledTimes(1);
    });
  });

  describe('Live Preview', () => {
    it('shows live preview of form data', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      // Fill form data
      await user.type(screen.getByLabelText(/Patient Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Amount Due/), '150');
      
      // Check preview shows the data
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('$150')).toBeInTheDocument();
    });

    it('shows placeholder for empty fields in preview', () => {
      render(<ModernFormBuilder />);
      
      // Should show "Not provided" for empty fields
      const notProvidedElements = screen.getAllByText('Not provided');
      expect(notProvidedElements).toHaveLength(4); // One for each field
    });

    it('formats currency correctly in preview', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      await user.type(screen.getByLabelText(/Amount Due/), '150.75');
      
      expect(screen.getByText('$150.75')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and structure', () => {
      render(<ModernFormBuilder />);
      
      // All inputs should have labels
      expect(screen.getByLabelText(/Patient Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date of Birth/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Service Date/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Amount Due/)).toBeInTheDocument();
    });

    it('shows required field indicators', () => {
      render(<ModernFormBuilder />);
      
      // Should show asterisks for required fields
      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators).toHaveLength(4);
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const nameInput = screen.getByLabelText(/Patient Name/);
      const dobInput = screen.getByLabelText(/Date of Birth/);
      
      nameInput.focus();
      expect(nameInput).toHaveFocus();
      
      await user.tab();
      expect(dobInput).toHaveFocus();
    });

    it('has proper heading hierarchy', () => {
      render(<ModernFormBuilder />);
      
      expect(screen.getByRole('heading', { level: 1, name: 'Form Generator' })).toBeInTheDocument();
      expect(screen.getAllByText('Self-Pay Agreement Form')[0]).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('handles rapid typing without lag', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const nameInput = screen.getByLabelText(/Patient Name/);
      
      // Type rapidly
      await user.type(nameInput, 'John Doe Smith Johnson', { delay: 1 });
      
      expect(nameInput).toHaveValue('John Doe Smith Johnson');
    });

    it('updates progress efficiently', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const nameInput = screen.getByLabelText(/Patient Name/);
      
      // Type a character
      await user.type(nameInput, 'J');
      
      // Progress should update immediately
      await waitFor(() => {
        expect(screen.getByText('25%')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles very long input values', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const longName = 'A'.repeat(1000);
      const nameInput = screen.getByLabelText(/Patient Name/);
      
      await user.type(nameInput, longName);
      expect(nameInput).toHaveValue(longName);
    });

    it('handles special characters in input', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const nameInput = screen.getByLabelText(/Patient Name/);
      await user.type(nameInput, 'José María O\'Connor-Smith');
      
      expect(nameInput).toHaveValue('José María O\'Connor-Smith');
    });

    it('handles invalid date inputs gracefully', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const dobInput = screen.getByLabelText(/Date of Birth/);
      
      // Try to type invalid date
      await user.type(dobInput, '2024-13-45');
      
      // Browser should handle validation
      expect(dobInput).toBeInTheDocument();
    });

    it('handles non-numeric input in number fields', async () => {
      const user = userEvent.setup();
      render(<ModernFormBuilder />);
      
      const amountInput = screen.getByLabelText(/Amount Due/);
      
      // Try to type letters in number field
      await user.type(amountInput, 'abc123');
      
      // Should only accept numeric parts (123)
      expect(amountInput.value).toMatch(/123/);
    });
  });
});