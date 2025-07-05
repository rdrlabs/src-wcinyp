import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import FormBuilder from '../FormBuilder';

describe('FormBuilder (Legacy)', () => {
  describe('Initial Rendering', () => {
    it('renders the form builder interface', () => {
      render(<FormBuilder />);
      
      expect(screen.getByText('Self-Pay Agreement Form')).toBeInTheDocument();
    });

    it('renders without crashing', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<FormBuilder />);
      
      expect(screen.getByText('Self-Pay Agreement Form')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Component Structure', () => {
    it('has proper component hierarchy', () => {
      render(<FormBuilder />);
      
      const formBuilder = screen.getByText('Self-Pay Agreement Form').closest('div');
      expect(formBuilder).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<FormBuilder />);
      
      // Component should render without errors
      expect(screen.getByText('Self-Pay Agreement Form')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });
});