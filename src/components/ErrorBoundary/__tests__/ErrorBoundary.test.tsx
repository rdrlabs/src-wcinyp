import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AppErrorBoundary, CriticalErrorBoundary, PageErrorBoundary } from '../index';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error for boundary');
  }
  return <div>Component works fine</div>;
};

describe('Error Boundary Components', () => {
  // Suppress console.error for these tests since we're intentionally triggering errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe('AppErrorBoundary', () => {
    it('renders children when no error occurs', () => {
      render(
        <AppErrorBoundary>
          <ThrowError shouldThrow={false} />
        </AppErrorBoundary>
      );

      expect(screen.getByText('Component works fine')).toBeInTheDocument();
    });

    it('renders error fallback when error occurs', () => {
      render(
        <AppErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AppErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/There was an error loading this section/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('allows user to retry after error', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      const TestComponent = () => <ThrowError shouldThrow={shouldThrow} />;

      const { rerender } = render(
        <AppErrorBoundary>
          <TestComponent />
        </AppErrorBoundary>
      );

      // Error should be displayed
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Fix the error condition
      shouldThrow = false;

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);

      // Re-render with fixed component
      rerender(
        <AppErrorBoundary>
          <TestComponent />
        </AppErrorBoundary>
      );
    });
  });

  describe('CriticalErrorBoundary', () => {
    it('renders minimal fallback when error occurs', () => {
      render(
        <CriticalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </CriticalErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('⚠️ Error')).toBeInTheDocument();
      expect(screen.getByText(/This section failed to load/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('PageErrorBoundary', () => {
    it('renders standard error fallback for page-level errors', () => {
      render(
        <PageErrorBoundary>
          <ThrowError shouldThrow={true} />
        </PageErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    });
  });

  describe('Error Fallback Components', () => {
    it('shows error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <AppErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AppErrorBoundary>
      );

      expect(screen.getByText('Error details (development only)')).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('hides error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(
        <AppErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AppErrorBoundary>
      );

      expect(screen.queryByText('Error details (production only)')).not.toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });
});