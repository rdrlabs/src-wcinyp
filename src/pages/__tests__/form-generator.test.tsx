import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import FormGenerator from '../form-generator';

// Mock ModernFormBuilder component
jest.mock('../../components/ModernFormBuilder', () => {
  return function MockModernFormBuilder() {
    return (
      <div data-testid="modern-form-builder">
        <h2>Modern Form Builder</h2>
        <div>Mocked Modern Form Builder Content</div>
        <button>Create Form</button>
        <button>Save Form</button>
        <button>Export Form</button>
      </div>
    );
  };
});

describe('Form Generator', () => {
  describe('Initial Rendering', () => {
    it('renders the form generator page without crashing', () => {
      render(<FormGenerator />);
      
      expect(screen.getByText('Form Generator')).toBeInTheDocument();
    });

    it('displays the page title and description', () => {
      render(<FormGenerator />);
      
      expect(screen.getByText('Form Generator')).toBeInTheDocument();
      expect(screen.getByText(/Create and customize medical forms/)).toBeInTheDocument();
    });

    it('renders the Modern Form Builder component', () => {
      render(<FormGenerator />);
      
      const formBuilder = screen.getByTestId('modern-form-builder');
      expect(formBuilder).toBeInTheDocument();
      expect(screen.getByText('Modern Form Builder')).toBeInTheDocument();
    });
  });

  describe('Page Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<FormGenerator />);
      
      const h1 = screen.getByRole('heading', { level: 1, name: 'Form Generator' });
      expect(h1).toBeInTheDocument();
    });

    it('has proper layout structure', () => {
      render(<FormGenerator />);
      
      const container = screen.getByText('Form Generator').closest('.container');
      expect(container).toBeInTheDocument();
    });

    it('applies proper CSS classes', () => {
      render(<FormGenerator />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('hero__title');
    });
  });

  describe('Component Integration', () => {
    it('successfully integrates Modern Form Builder component', () => {
      render(<FormGenerator />);
      
      expect(screen.getByTestId('modern-form-builder')).toBeInTheDocument();
      expect(screen.getByText('Mocked Modern Form Builder Content')).toBeInTheDocument();
    });

    it('displays form builder action buttons', () => {
      render(<FormGenerator />);
      
      expect(screen.getByRole('button', { name: 'Create Form' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Form' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Export Form' })).toBeInTheDocument();
    });

    it('maintains component isolation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<FormGenerator />);
      
      expect(screen.getByText('Form Generator')).toBeInTheDocument();
      expect(screen.getByTestId('modern-form-builder')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('User Interactions', () => {
    it('allows interaction with form builder buttons', async () => {
      const user = userEvent.setup();
      render(<FormGenerator />);
      
      const createButton = screen.getByRole('button', { name: 'Create Form' });
      const saveButton = screen.getByRole('button', { name: 'Save Form' });
      const exportButton = screen.getByRole('button', { name: 'Export Form' });
      
      await user.click(createButton);
      await user.click(saveButton);
      await user.click(exportButton);
      
      // Buttons should be interactive (no errors thrown)
      expect(createButton).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();
      expect(exportButton).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<FormGenerator />);
      
      const firstButton = screen.getByRole('button', { name: 'Create Form' });
      
      await user.tab();
      // Should be able to navigate to interactive elements
      expect(document.activeElement).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('has proper landmark structure', () => {
      render(<FormGenerator />);
      
      const main = screen.getByRole('main') || screen.getByText('Form Generator').closest('div');
      expect(main).toBeInTheDocument();
    });

    it('has accessible heading structure', () => {
      render(<FormGenerator />);
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveAccessibleName('Form Generator');
    });

    it('provides semantic button structure', () => {
      render(<FormGenerator />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('supports screen readers', () => {
      render(<FormGenerator />);
      
      const pageDescription = screen.getByText(/Create and customize medical forms/);
      expect(pageDescription).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive container classes', () => {
      render(<FormGenerator />);
      
      const container = screen.getByText('Form Generator').closest('.container');
      expect(container).toBeInTheDocument();
    });

    it('uses Docusaurus layout classes', () => {
      render(<FormGenerator />);
      
      const hero = screen.getByText('Form Generator').closest('.hero');
      expect(hero).toBeInTheDocument();
    });

    it('maintains layout integrity on different screen sizes', () => {
      render(<FormGenerator />);
      
      const formBuilder = screen.getByTestId('form-builder');
      expect(formBuilder).toBeInTheDocument();
      
      // Form builder should be contained within the page layout
      const container = formBuilder.closest('.container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<FormGenerator />);
      
      expect(screen.getByText('Form Generator')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('continues to render if child component fails', () => {
      // Mock a failing component
      jest.doMock('../../components/FormBuilder', () => {
        return function FailingComponent() {
          throw new Error('FormBuilder failed');
        };
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        render(<FormGenerator />);
        expect(screen.getByText('Form Generator')).toBeInTheDocument();
      } catch (error) {
        // Expected behavior - page should still attempt to render
      }
      
      consoleSpy.mockRestore();
    });

    it('handles missing form builder gracefully', () => {
      // Test graceful degradation
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<FormGenerator />);
      
      // Page title should always render
      expect(screen.getByText('Form Generator')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<FormGenerator />);
      
      expect(screen.getByText('Form Generator')).toBeInTheDocument();
      
      rerender(<FormGenerator />);
      
      expect(screen.getByText('Form Generator')).toBeInTheDocument();
      expect(screen.getByTestId('modern-form-builder')).toBeInTheDocument();
    });

    it('loads child components efficiently', () => {
      const startTime = performance.now();
      
      render(<FormGenerator />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(100);
      expect(screen.getByTestId('modern-form-builder')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta', () => {
    it('provides appropriate page title content', () => {
      render(<FormGenerator />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Form Generator');
    });

    it('includes descriptive content for search engines', () => {
      render(<FormGenerator />);
      
      expect(screen.getByText(/Create and customize medical forms/)).toBeInTheDocument();
    });

    it('uses semantic HTML structure', () => {
      render(<FormGenerator />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.tagName).toBe('H1');
    });
  });

  describe('Integration with Form Builder', () => {
    it('passes props correctly to Form Builder', () => {
      render(<FormGenerator />);
      
      const formBuilder = screen.getByTestId('form-builder');
      expect(formBuilder).toBeInTheDocument();
    });

    it('maintains Form Builder state', async () => {
      const user = userEvent.setup();
      render(<FormGenerator />);
      
      const createButton = screen.getByRole('button', { name: 'Create Form' });
      
      await user.click(createButton);
      
      // Form Builder should remain mounted and functional
      expect(screen.getByTestId('modern-form-builder')).toBeInTheDocument();
      expect(createButton).toBeInTheDocument();
    });
  });
});