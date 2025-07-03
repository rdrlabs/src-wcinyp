import { render, screen } from '../../../test-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';

describe('Card Component', () => {
  describe('Card', () => {
    it('renders card with children', () => {
      render(
        <Card data-testid="card">
          <div>Card content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(
        <Card ref={ref} data-testid="card">
          Content
        </Card>
      );
      
      expect(ref.current).toBeTruthy();
    });
  });

  describe('CardHeader', () => {
    it('renders card header with children', () => {
      render(
        <CardHeader data-testid="card-header">
          <div>Header content</div>
        </CardHeader>
      );
      
      const header = screen.getByTestId('card-header');
      expect(header).toBeInTheDocument();
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <CardHeader className="custom-header" data-testid="card-header">
          Header
        </CardHeader>
      );
      
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('renders card title with children', () => {
      render(
        <CardTitle data-testid="card-title">
          Title Text
        </CardTitle>
      );
      
      const title = screen.getByTestId('card-title');
      expect(title).toBeInTheDocument();
      expect(screen.getByText('Title Text')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <CardTitle className="custom-title" data-testid="card-title">
          Title
        </CardTitle>
      );
      
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('renders card description with children', () => {
      render(
        <CardDescription data-testid="card-description">
          Description text
        </CardDescription>
      );
      
      const description = screen.getByTestId('card-description');
      expect(description).toBeInTheDocument();
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <CardDescription className="custom-description" data-testid="card-description">
          Description
        </CardDescription>
      );
      
      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass('custom-description');
    });
  });

  describe('CardContent', () => {
    it('renders card content with children', () => {
      render(
        <CardContent data-testid="card-content">
          <p>Content text</p>
        </CardContent>
      );
      
      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();
      expect(screen.getByText('Content text')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <CardContent className="custom-content" data-testid="card-content">
          Content
        </CardContent>
      );
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('renders card footer with children', () => {
      render(
        <CardFooter data-testid="card-footer">
          <button>Action</button>
        </CardFooter>
      );
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <CardFooter className="custom-footer" data-testid="card-footer">
          Footer
        </CardFooter>
      );
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Complete Card Example', () => {
    it('renders complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test Content</p>
          </CardContent>
          <CardFooter>
            <button>Test Action</button>
          </CardFooter>
        </Card>
      );
      
      expect(screen.getByTestId('complete-card')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test Action' })).toBeInTheDocument();
    });
  });
});