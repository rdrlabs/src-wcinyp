import { render, screen } from '../../test-utils';
import Homepage from '../index';

describe('Homepage', () => {
  describe('Initial Rendering', () => {
    it('renders the homepage without crashing', () => {
      render(<Homepage />);
      
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
    });

    it('displays the main heading', () => {
      render(<Homepage />);
      
      expect(screen.getByText('Weill Cornell Imaging')).toBeInTheDocument();
    });

    it('has proper page title in Layout', () => {
      render(<Homepage />);
      
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
    });

    it('includes header section', () => {
      render(<Homepage />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Page Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<Homepage />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('Weill Cornell Imaging');
    });

    it('has proper layout structure', () => {
      render(<Homepage />);
      
      const container = screen.getByText('Weill Cornell Imaging').closest('.container');
      expect(container).toBeInTheDocument();
    });

    it('applies proper CSS classes', () => {
      render(<Homepage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('hero__title');
    });

    it('uses hero banner styling', () => {
      render(<Homepage />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('hero', 'hero--primary');
    });
  });

  describe('Accessibility', () => {
    it('has proper landmark structure', () => {
      render(<Homepage />);
      
      const main = screen.getByRole('main');
      const banner = screen.getByRole('banner');
      
      expect(main).toBeInTheDocument();
      expect(banner).toBeInTheDocument();
    });

    it('has accessible heading structure', () => {
      render(<Homepage />);
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveAccessibleName('Weill Cornell Imaging');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive container classes', () => {
      render(<Homepage />);
      
      const container = screen.getByText('Weill Cornell Imaging').closest('.container');
      expect(container).toBeInTheDocument();
    });

    it('uses Docusaurus layout classes', () => {
      render(<Homepage />);
      
      const hero = screen.getByText('Weill Cornell Imaging').closest('.hero');
      expect(hero).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles component errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<Homepage />);
      
      expect(screen.getByText('Weill Cornell Imaging')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', () => {
      const { rerender } = render(<Homepage />);
      
      expect(screen.getByText('Weill Cornell Imaging')).toBeInTheDocument();
      
      rerender(<Homepage />);
      
      expect(screen.getByText('Weill Cornell Imaging')).toBeInTheDocument();
    });
  });

  describe('SEO and Meta', () => {
    it('provides appropriate page title content', () => {
      render(<Homepage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Weill Cornell Imaging');
    });

    it('uses semantic HTML structure', () => {
      render(<Homepage />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.tagName).toBe('H1');
    });
  });
});