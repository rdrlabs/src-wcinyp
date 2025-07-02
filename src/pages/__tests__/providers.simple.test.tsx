import React from 'react';
import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import Providers from '../providers';

// Mock providers data
jest.mock('../../data/providers.json', () => ({
  providers: [
    {
      id: 'test-provider',
      name: 'Dr. Test Provider',
      credentials: 'MD',
      specialty: 'Test Specialty',
      department: 'test',
      npi: '1234567890',
      phone: '(555) 123-4567',
      email: 'test@test.com',
      location: 'Test Location',
      epic_chat: ['test'],
      tags: ['test-tag'],
      associated_providers: [],
      priority_notes: [],
      last_updated: '2025-01-01',
      updated_by: 'test',
      status: 'ok'
    }
  ]
}));

// Mock document methods for export functionality
const mockClick = jest.fn();

global.document.createElement = jest.fn((tagName) => {
  if (tagName === 'a') {
    return {
      href: '',
      download: '',
      click: mockClick,
      style: {},
    } as unknown as HTMLAnchorElement;
  }
  return {} as unknown as HTMLElement;
}) as typeof document.createElement;

global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = jest.fn();

describe('Providers Page - Basic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Providers />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('displays provider information', () => {
    render(<Providers />);
    expect(screen.getByText('Dr. Test Provider')).toBeInTheDocument();
  });
});