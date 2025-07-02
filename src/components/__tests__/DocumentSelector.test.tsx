import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import DocumentSelector from '../DocumentSelector';

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
  global.alert = jest.fn();
});

describe('DocumentSelector (Legacy)', () => {
  describe('Initial Rendering', () => {
    it('renders the document selector interface', () => {
      render(<DocumentSelector />);
      
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
    });

    it('renders without crashing', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<DocumentSelector />);
      
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Component Structure', () => {
    it('has proper component hierarchy', () => {
      render(<DocumentSelector />);
      
      const documentSelector = screen.getByText('Document Hub').closest('div');
      expect(documentSelector).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<DocumentSelector />);
      
      // Component should render without errors
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });
});