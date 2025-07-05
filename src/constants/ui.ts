/**
 * UI/UX related constants
 */

export const KEYBOARD_SHORTCUTS = {
  search: '⌘K',
  searchKey: 'k',
} as const

export const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
} as const

export const SPACING = {
  page: {
    vertical: 'py-8',
    horizontal: 'px-4',
  },
  section: {
    top: 'mt-8',
    bottom: 'mb-8',
  },
  component: {
    gap: 'space-x-8',
    stack: 'space-y-4',
  },
} as const

export const GRID_LAYOUTS = {
  footer: {
    base: 'grid-cols-1',
    md: 'md:grid-cols-2',
    lg: 'lg:grid-cols-4',
  },
  cards: {
    base: 'grid-cols-1',
    md: 'md:grid-cols-2',
    lg: 'lg:grid-cols-3',
  },
  documents: {
    base: 'grid-cols-1',
    lg: 'lg:grid-cols-2',
  },
} as const

export const TEXT_SIZES = {
  hero: 'text-5xl md:text-6xl',
  title: 'text-4xl',
  heading: 'text-2xl',
  subheading: 'text-xl',
  body: 'text-base',
  small: 'text-sm',
  xs: 'text-xs',
} as const

export const CONTAINER_STYLES = {
  page: 'min-h-screen bg-background',
  content: 'container mx-auto',
  section: 'rounded-lg border bg-card p-6',
} as const

export const ANIMATION_DURATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const

export const Z_INDEX = {
  dropdown: 10,
  modal: 100,
  popover: 200,
  tooltip: 300,
  navbar: 50,
} as const

export const TOASTER_CONFIG = {
  position: 'top-right' as const,
  duration: 5000,
} as const