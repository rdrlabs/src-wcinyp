import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const container = document.body.appendChild(document.createElement('div'));
  return render(ui, {
    container,
    wrapper: AllTheProviders,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };

// Common test utilities
export const createMockWindow = () => ({
  print: jest.fn(),
  close: jest.fn(),
  location: { href: '' },
});

export const createMockDocument = (name: string, path: string, modality?: string) => ({
  name,
  path,
  category: 'test',
  modality,
  color: '#000000',
});

export const waitForDebounce = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Test data factories
export const testFormData = [
  { 
    label: 'Patient Name', 
    value: 'John Doe', 
    type: 'text' as const,
    required: true 
  },
  { 
    label: 'Date of Birth', 
    value: '1990-01-01', 
    type: 'date' as const,
    required: true 
  },
  { 
    label: 'Service Date', 
    value: '2024-01-01', 
    type: 'date' as const,
    required: true 
  },
  { 
    label: 'Amount Due', 
    value: '100', 
    type: 'number' as const,
    required: true 
  },
];

export const testDocuments = [
  createMockDocument('MRI Questionnaire', '/documents/MRI Questionnaire.pdf', 'MRI'),
  createMockDocument('CT Questionnaire', '/documents/CT Questionnaire.pdf', 'CT'),
  createMockDocument('Test Document with Very Long Name That Should Test UI Layout', '/documents/long-name.pdf'),
];

// Mock implementations
export const mockPrintImplementation = jest.fn().mockImplementation(() => {
  const mockWindow = createMockWindow();
  return mockWindow;
});

export const mockFailingPrintImplementation = jest.fn().mockImplementation(() => {
  throw new Error('Print blocked by popup blocker');
});

// Helper to test accessibility
export const getByRole = (container: HTMLElement, role: string, options?: any) => {
  return container.querySelector(`[role="${role}"]`);
};

// Form validation helpers
export const testValidInput = {
  text: 'Valid Text',
  date: '2024-01-01',
  number: '123',
};

export const testInvalidInput = {
  text: '',
  date: 'invalid-date',
  number: 'not-a-number',
};