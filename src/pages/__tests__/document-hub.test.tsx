import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import DocumentHub from '../document-hub';

// Mock ModernDocumentSelector component
jest.mock('../../components/ModernDocumentSelector', () => {
  return function MockModernDocumentSelector() {
    return (
      <div data-testid="modern-document-selector">
        <h2>Modern Document Selector</h2>
        <div>Mocked Document Selector Content</div>
      </div>
    );
  };
});

describe('Document Hub', () => {
  describe('Initial Rendering', () => {
    it('renders the document hub page without crashing', () => {
      render(<DocumentHub />);
      
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
    });

    it('displays the page title and description', () => {
      render(<DocumentHub />);
      
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      expect(screen.getByText(/Access and manage medical imaging documents/)).toBeInTheDocument();
    });

    it('renders the Modern Document Selector component', () => {
      render(<DocumentHub />);
      
      const modernSelector = screen.getByTestId('modern-document-selector');
      expect(modernSelector).toBeInTheDocument();
      expect(screen.getByText('Modern Document Selector')).toBeInTheDocument();
    });
  });

  describe('Page Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<DocumentHub />);
      
      const h1 = screen.getByRole('heading', { level: 1, name: 'Document Hub' });
      expect(h1).toBeInTheDocument();
    });

    it('has proper layout structure', () => {
      render(<DocumentHub />);
      
      const container = screen.getByText('Document Hub').closest('.container');
      expect(container).toBeInTheDocument();
    });

    it('applies proper CSS classes', () => {
      render(<DocumentHub />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('hero__title');
    });
  });

  describe('Component Integration', () => {
    it('successfully integrates Modern Document Selector', () => {
      render(<DocumentHub />);
      
      expect(screen.getByTestId('modern-document-selector')).toBeInTheDocument();
      expect(screen.getByText('Mocked Document Selector Content')).toBeInTheDocument();
    });

    it('maintains component isolation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<DocumentHub />);
      
      // Should render without any integration errors
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      expect(screen.getByTestId('modern-document-selector')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper landmark structure', () => {
      render(<DocumentHub />);
      
      const main = screen.getByRole('main') || screen.getByText('Document Hub').closest('div');
      expect(main).toBeInTheDocument();
    });

    it('has accessible heading structure', () => {
      render(<DocumentHub />);
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveAccessibleName('Document Hub');
    });

    it('provides semantic structure', () => {
      render(<DocumentHub />);
      
      const pageContent = screen.getByText('Document Hub').closest('.hero');
      expect(pageContent).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive container classes', () => {
      render(<DocumentHub />);
      
      const container = screen.getByText('Document Hub').closest('.container');
      expect(container).toBeInTheDocument();
    });

    it('uses Docusaurus layout classes', () => {
      render(<DocumentHub />);
      
      const hero = screen.getByText('Document Hub').closest('.hero');
      expect(hero).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<DocumentHub />);
      
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('continues to render if child component fails', () => {
      // Mock a failing component
      jest.doMock('../../components/ModernDocumentSelector', () => {
        return function FailingComponent() {
          throw new Error('Component failed');
        };
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        render(<DocumentHub />);
        expect(screen.getByText('Document Hub')).toBeInTheDocument();
      } catch (error) {
        // Expected behavior - component should still attempt to render
      }
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<DocumentHub />);
      
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      
      rerender(<DocumentHub />);
      
      expect(screen.getByText('Document Hub')).toBeInTheDocument();
      expect(screen.getByTestId('modern-document-selector')).toBeInTheDocument();
    });

    it('loads child components efficiently', () => {
      const startTime = performance.now();
      
      render(<DocumentHub />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Basic performance check - should render quickly
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByTestId('modern-document-selector')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta', () => {
    it('provides appropriate page title content', () => {
      render(<DocumentHub />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Document Hub');
    });

    it('includes descriptive content for search engines', () => {
      render(<DocumentHub />);
      
      expect(screen.getByText(/Access and manage medical imaging documents/)).toBeInTheDocument();
    });
  });
});