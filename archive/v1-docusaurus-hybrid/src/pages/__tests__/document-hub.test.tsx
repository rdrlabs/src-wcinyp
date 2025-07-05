import { render, screen } from '../../test-utils';
import DocumentHub from '../document-hub';

// Mock the ModernDocumentSelector component
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

// Mock the Layout component
jest.mock('@theme/Layout', () => {
  return function MockLayout({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
    return (
      <div data-testid="layout">
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    );
  };
});

describe('DocumentHub', () => {
  it('renders the Layout with correct title and description', () => {
    render(<DocumentHub />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Document Hub' })).toBeInTheDocument();
    expect(screen.getByText('Modern document management for medical forms')).toBeInTheDocument();
  });

  it('renders the ModernDocumentSelector component', () => {
    render(<DocumentHub />);
    expect(screen.getByTestId('modern-document-selector')).toBeInTheDocument();
    expect(screen.getByText('Modern Document Selector')).toBeInTheDocument();
    expect(screen.getByText('Mocked Document Selector Content')).toBeInTheDocument();
  });
});
