import '@testing-library/jest-dom';

// JSDOM doesn't implement PointerEvent so we need to polyfill it
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    constructor(type: string, params: MouseEventInit) {
      super(type, params);
    }
  }
  global.PointerEvent = PointerEvent as any;
}

// Mock pointer capture methods that JSDOM doesn't support
if (typeof Element.prototype.hasPointerCapture !== 'function') {
  Element.prototype.hasPointerCapture = jest.fn(() => false);
}
if (typeof Element.prototype.setPointerCapture !== 'function') {
  Element.prototype.setPointerCapture = jest.fn();
}
if (typeof Element.prototype.releasePointerCapture !== 'function') {
  Element.prototype.releasePointerCapture = jest.fn();
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.print
Object.defineProperty(window, 'print', {
  value: jest.fn(),
  writable: true,
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(() => ({
    print: jest.fn(),
    close: jest.fn(),
  })),
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollIntoView method that JSDOM doesn't support
if (typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = jest.fn();
}
