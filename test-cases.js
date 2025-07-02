/**
 * Comprehensive Test Cases for ModernDocumentSelector and ModernFormBuilder
 * These tests demonstrate edge cases and potential bugs found during analysis
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import ModernDocumentSelector from '../src/components/ModernDocumentSelector';
import ModernFormBuilder from '../src/components/ModernFormBuilder';

// Mock implementations for testing
const mockWindow = {
  print: jest.fn(),
  close: jest.fn(),
  focus: jest.fn()
};

describe('ModernDocumentSelector Edge Cases', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Mock window.open
    global.open = jest.fn().mockReturnValue(mockWindow);
  });

  describe('1. Empty Search Results Edge Case', () => {
    test('should display "No documents found" message when search returns empty results', async () => {
      render(<ModernDocumentSelector />);
      
      const searchInput = screen.getByPlaceholderText('Search documents...');
      await userEvent.type(searchInput, 'nonexistent document xyz123');
      
      // Should show empty state message
      expect(screen.getByText(/no documents found/i)).toBeInTheDocument();
      
      // Should provide option to clear search
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });

    test('should handle special characters in search without breaking', async () => {
      render(<ModernDocumentSelector />);
      
      const searchInput = screen.getByPlaceholderText('Search documents...');
      const specialChars = '!@#$%^&*()[]{}|;:,.<>?`~';
      
      // Should not throw errors with special characters
      await expect(async () => {
        await userEvent.type(searchInput, specialChars);
      }).not.toThrow();
      
      // Search should still function
      expect(searchInput.value).toBe(specialChars);
    });
  });

  describe('2. Very Long Document Names Edge Case', () => {
    test('should handle extremely long document names gracefully', () => {
      const longName = 'A'.repeat(500); // 500 character name
      
      // Mock a document with very long name
      const mockLongDocument = {
        name: longName,
        path: '/documents/long-name.pdf',
        category: 'test',
        modality: 'Test'
      };
      
      // Component should render without crashing
      expect(() => {
        render(<ModernDocumentSelector />);
      }).not.toThrow();
      
      // Long names should be properly truncated in UI
      // (This would require modifying the component to handle truncation)
    });

    test('should handle document names with unicode characters', () => {
      const unicodeName = '测试文档 📄 émoji & ñoñó';
      
      render(<ModernDocumentSelector />);
      const searchInput = screen.getByPlaceholderText('Search documents...');
      
      expect(async () => {
        await userEvent.type(searchInput, unicodeName);
      }).not.toThrow();
    });
  });

  describe('3. Print Function Error Scenarios', () => {
    test('should handle popup blocker gracefully', async () => {
      // Mock window.open to return null (popup blocked)
      global.open = jest.fn().mockReturnValue(null);
      
      render(<ModernDocumentSelector />);
      
      // Select a document
      const firstCheckbox = screen.getAllByRole('checkbox')[1]; // Skip bulk mode checkbox
      await userEvent.click(firstCheckbox);
      
      // Try to print
      const printButton = screen.getByRole('button', { name: /print/i });
      await userEvent.click(printButton);
      
      // Should show popup blocker error message
      expect(screen.getByText(/popup blocker/i)).toBeInTheDocument();
    });

    test('should handle print window close failure', async () => {
      // Mock window with close method that throws
      const faultyWindow = {
        ...mockWindow,
        close: jest.fn().mockImplementation(() => {
          throw new Error('Cannot close window');
        })
      };
      global.open = jest.fn().mockReturnValue(faultyWindow);
      
      render(<ModernDocumentSelector />);
      
      // Select and print document
      const firstCheckbox = screen.getAllByRole('checkbox')[1];
      await userEvent.click(firstCheckbox);
      
      const printButton = screen.getByRole('button', { name: /print/i });
      await userEvent.click(printButton);
      
      // Should handle window close failure gracefully
      // (Error should be logged but not crash the app)
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to close print window')
      );
    });

    test('should cleanup windows when component unmounts during printing', () => {
      const { unmount } = render(<ModernDocumentSelector />);
      
      // Start a print operation
      // ... select documents and initiate print
      
      // Unmount component while printing
      unmount();
      
      // Should attempt to close any open windows
      expect(mockWindow.close).toHaveBeenCalled();
    });
  });

  describe('4. State Consistency Edge Cases', () => {
    test('should maintain state consistency with rapid document toggling', async () => {
      render(<ModernDocumentSelector />);
      
      const firstCheckbox = screen.getAllByRole('checkbox')[1];
      
      // Rapidly toggle document selection
      for (let i = 0; i < 10; i++) {
        await userEvent.click(firstCheckbox);
      }
      
      // Final state should be consistent
      const printQueue = screen.getByText(/print queue/i).closest('[data-testid="print-queue"]');
      const itemCount = screen.getByText(/\d+ items/);
      
      // Should show 0 items (even number of clicks = deselected)
      expect(itemCount).toHaveTextContent('0 items');
    });

    test('should handle bulk mode toggle with existing individual quantities', async () => {
      render(<ModernDocumentSelector />);
      
      // Select documents with individual quantities
      const checkboxes = screen.getAllByRole('checkbox').slice(1, 4); // Skip bulk mode checkbox
      for (const checkbox of checkboxes) {
        await userEvent.click(checkbox);
      }
      
      // Set individual quantities
      const quantityInputs = screen.getAllByDisplayValue('1');
      await userEvent.clear(quantityInputs[0]);
      await userEvent.type(quantityInputs[0], '5');
      
      // Toggle bulk mode
      const bulkModeCheckbox = screen.getByRole('checkbox', { name: /bulk mode/i });
      await userEvent.click(bulkModeCheckbox);
      
      // Total copies should be calculated correctly
      const totalCopies = screen.getByText(/total copies:/i);
      expect(totalCopies).toHaveTextContent('Total copies: 3'); // 3 docs × 1 bulk copy each
    });
  });

  describe('5. Memory Leak Edge Cases', () => {
    test('should cleanup event listeners on unmount', () => {
      const { unmount } = render(<ModernDocumentSelector />);
      
      // Mock addEventListener to track listeners
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      unmount();
      
      // Should remove any event listeners that were added
      // (This test would need the component to actually add/remove listeners)
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    test('should cleanup timeouts when component unmounts', async () => {
      jest.useFakeTimers();
      
      const { unmount } = render(<ModernDocumentSelector />);
      
      // Select document and start print (which uses setTimeout)
      const firstCheckbox = screen.getAllByRole('checkbox')[1];
      await userEvent.click(firstCheckbox);
      
      const printButton = screen.getByRole('button', { name: /print/i });
      await userEvent.click(printButton);
      
      // Unmount before timeout completes
      unmount();
      
      // Fast-forward time
      jest.runAllTimers();
      
      // Should not execute timeout callbacks after unmount
      // (This would require the component to track and clear timeouts)
      
      jest.useRealTimers();
    });
  });

  describe('6. Accessibility Edge Cases', () => {
    test('should announce selection changes to screen readers', async () => {
      render(<ModernDocumentSelector />);
      
      const firstCheckbox = screen.getAllByRole('checkbox')[1];
      
      // Should have proper aria-label
      expect(firstCheckbox).toHaveAttribute('aria-label', expect.stringContaining('Select'));
      
      await userEvent.click(firstCheckbox);
      
      // Should update aria-label after selection
      expect(firstCheckbox).toHaveAttribute('aria-label', expect.stringContaining('Deselect'));
    });

    test('should support keyboard navigation', async () => {
      render(<ModernDocumentSelector />);
      
      // Should be able to navigate using Tab
      const firstCard = screen.getAllByRole('button')[0];
      firstCard.focus();
      
      // Enter or Space should toggle selection
      fireEvent.keyDown(firstCard, { key: 'Enter' });
      
      // Should toggle the document selection
      const checkbox = firstCard.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeChecked();
    });
  });
});

describe('ModernFormBuilder Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.print = jest.fn();
  });

  describe('1. Invalid Form Data Inputs', () => {
    test('should reject invalid email formats', async () => {
      render(<ModernFormBuilder />);
      
      // Add email field to test data (would need to modify component)
      const emailInput = screen.getByLabelText(/email/i);
      
      const invalidEmails = [
        'invalid-email',
        '@invalid.com',
        'test@',
        'test..test@example.com'
      ];
      
      for (const email of invalidEmails) {
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, email);
        
        // Should show validation error
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      }
    });

    test('should handle non-numeric input in number fields', async () => {
      render(<ModernFormBuilder />);
      
      const amountInput = screen.getByLabelText(/amount due/i);
      
      const invalidNumbers = ['abc', '12.34.56', '1e10', '$$100'];
      
      for (const invalid of invalidNumbers) {
        await userEvent.clear(amountInput);
        await userEvent.type(amountInput, invalid);
        
        // Should either prevent input or show validation error
        // Current implementation doesn't validate, so this test would fail
      }
    });

    test('should validate date formats properly', async () => {
      render(<ModernFormBuilder />);
      
      const dateInput = screen.getByLabelText(/date of birth/i);
      
      const invalidDates = [
        '2023-13-45', // Invalid month
        '99/99/99',   // Invalid format
        'invalid',    // Non-date string
        '2023-02-30'  // Invalid day for February
      ];
      
      for (const date of invalidDates) {
        await userEvent.clear(dateInput);
        await userEvent.type(dateInput, date);
        
        // Should show validation error
        // Current implementation doesn't validate dates
      }
    });

    test('should enforce required field validation', async () => {
      render(<ModernFormBuilder />);
      
      // Try to print with empty required fields
      const printButton = screen.getByRole('button', { name: /print form/i });
      
      // Should be disabled when form is empty
      expect(printButton).toBeDisabled();
      
      // Fill some but not all required fields
      const patientNameInput = screen.getByLabelText(/patient name/i);
      await userEvent.type(patientNameInput, 'John Doe');
      
      // Should still be disabled if other required fields are empty
      // Current implementation only checks if form is completely empty
    });
  });

  describe('2. Print Function Edge Cases', () => {
    test('should handle print cancellation gracefully', async () => {
      // Mock window.print to simulate user cancellation
      global.print = jest.fn().mockImplementation(() => {
        throw new Error('Print cancelled by user');
      });
      
      render(<ModernFormBuilder />);
      
      // Fill form
      const patientNameInput = screen.getByLabelText(/patient name/i);
      await userEvent.type(patientNameInput, 'John Doe');
      
      const printButton = screen.getByRole('button', { name: /print form/i });
      await userEvent.click(printButton);
      
      // Should handle cancellation gracefully
      expect(screen.getByText(/print cancelled/i)).toBeInTheDocument();
    });

    test('should validate form completeness before printing', async () => {
      render(<ModernFormBuilder />);
      
      // Fill only some fields
      const patientNameInput = screen.getByLabelText(/patient name/i);
      await userEvent.type(patientNameInput, 'John Doe');
      
      const printButton = screen.getByRole('button', { name: /print form/i });
      await userEvent.click(printButton);
      
      // Should show validation errors for missing required fields
      expect(screen.getByText(/please complete all required fields/i)).toBeInTheDocument();
    });

    test('should handle browser print restrictions', async () => {
      // Mock print to fail due to browser restrictions
      global.print = jest.fn().mockImplementation(() => {
        throw new Error('Print not allowed in this context');
      });
      
      render(<ModernFormBuilder />);
      
      // Fill form completely
      const inputs = screen.getAllByRole('textbox');
      for (let i = 0; i < inputs.length; i++) {
        await userEvent.type(inputs[i], `Test Value ${i}`);
      }
      
      const printButton = screen.getByRole('button', { name: /print form/i });
      await userEvent.click(printButton);
      
      // Should show helpful error message
      expect(screen.getByText(/unable to print/i)).toBeInTheDocument();
    });
  });

  describe('3. Performance Edge Cases', () => {
    test('should handle rapid input changes efficiently', async () => {
      render(<ModernFormBuilder />);
      
      const patientNameInput = screen.getByLabelText(/patient name/i);
      
      // Simulate rapid typing
      const rapidText = 'This is a very long patient name that someone might type quickly';
      
      const startTime = performance.now();
      await userEvent.type(patientNameInput, rapidText);
      const endTime = performance.now();
      
      // Should complete within reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
      
      // Form should remain responsive
      expect(patientNameInput.value).toBe(rapidText.trim());
    });

    test('should handle large amounts of form data', async () => {
      // Create a form with many fields (would need to modify component)
      const largeFormData = Array.from({ length: 100 }, (_, i) => ({
        label: `Field ${i}`,
        value: '',
        type: 'text',
        required: false
      }));
      
      // Component should render without significant performance impact
      const startTime = performance.now();
      render(<ModernFormBuilder />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500); // Should render in less than 500ms
    });
  });

  describe('4. Component Unmounting Edge Cases', () => {
    test('should cleanup async operations on unmount', async () => {
      const { unmount } = render(<ModernFormBuilder />);
      
      // Start an async operation (like auto-save)
      const patientNameInput = screen.getByLabelText(/patient name/i);
      await userEvent.type(patientNameInput, 'John');
      
      // Unmount component immediately
      unmount();
      
      // Should not cause memory leaks or errors
      // (This would require the component to have async operations to cancel)
    });

    test('should preserve form data in sessionStorage before unmount', () => {
      const { unmount } = render(<ModernFormBuilder />);
      
      // Should save form state to sessionStorage
      // (This would require implementing persistence)
      
      unmount();
      
      // Data should be available for recovery
      const savedData = sessionStorage.getItem('formBuilderData');
      expect(savedData).toBeTruthy();
    });
  });

  describe('5. Data Integrity Edge Cases', () => {
    test('should handle form data corruption gracefully', () => {
      // Simulate corrupted localStorage data
      localStorage.setItem('formBuilderData', 'corrupted json{');
      
      // Component should render with default data instead of crashing
      expect(() => {
        render(<ModernFormBuilder />);
      }).not.toThrow();
      
      // Should show default form fields
      expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
    });

    test('should validate data types on input', async () => {
      render(<ModernFormBuilder />);
      
      const amountInput = screen.getByLabelText(/amount due/i);
      
      // Try to input negative amount
      await userEvent.type(amountInput, '-100');
      
      // Should either prevent negative input or show validation error
      // Current implementation allows any input
    });
  });
});

describe('Cross-Component Integration Edge Cases', () => {
  test('should handle navigation between components without data loss', () => {
    // Test navigation from DocumentSelector to FormBuilder
    // Should preserve any relevant state
  });

  test('should handle concurrent usage of both components', () => {
    // If both components are used simultaneously, they should not interfere
    render(
      <div>
        <ModernDocumentSelector />
        <ModernFormBuilder />
      </div>
    );
    
    // Both should function independently
    expect(screen.getByText(/document hub/i)).toBeInTheDocument();
    expect(screen.getByText(/form generator/i)).toBeInTheDocument();
  });
});

// Helper functions for testing
const createMockPrintError = (message) => {
  return new Error(message);
};

const simulateSlowNetwork = () => {
  // Mock slow network conditions for testing
  return new Promise(resolve => setTimeout(resolve, 5000));
};

const createLargeDataSet = (size) => {
  return Array.from({ length: size }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: `Value ${i}`
  }));
};

/**
 * Additional test utilities that would be needed:
 * 
 * 1. Mock implementations for window.print, window.open
 * 2. Custom render function with providers
 * 3. Helper functions for form validation
 * 4. Performance measurement utilities
 * 5. Accessibility testing helpers
 */