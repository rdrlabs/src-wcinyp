/**
 * Color Distribution Constants - Design System v4
 * 
 * Implements the 60/30/10 color rule:
 * - 60% Neutral (backgrounds, containers)
 * - 30% Complementary (borders, subtle elements)
 * - 10% Accent (CTAs, important indicators)
 */

// Color distribution categories
export const COLOR_DISTRIBUTION = {
  // 60% - Neutral colors
  neutral: {
    background: 'bg-background',
    foreground: 'text-foreground',
    card: 'bg-card',
    cardForeground: 'text-card-foreground',
    // Use these for most UI elements
  },
  
  // 30% - Complementary colors
  complementary: {
    muted: 'bg-muted',
    mutedForeground: 'text-muted-foreground',
    border: 'border-border',
    input: 'border-input',
    secondary: 'bg-secondary',
    secondaryForeground: 'text-secondary-foreground',
    // Use these for structure and subtle emphasis
  },
  
  // 10% - Accent colors
  accent: {
    primary: 'bg-primary',
    primaryForeground: 'text-primary-foreground',
    accent: 'bg-accent',
    accentForeground: 'text-accent-foreground',
    // Use sparingly for CTAs and important elements
  },
  
  // System colors (use only when necessary)
  system: {
    destructive: 'bg-destructive',
    destructiveForeground: 'text-destructive-foreground',
    ring: 'ring-ring',
    // Use only for errors, warnings, focus states
  },
} as const;

// Component-specific color patterns
export const COMPONENT_COLORS = {
  // Page structure (60% neutral)
  page: {
    background: COLOR_DISTRIBUTION.neutral.background,
    text: COLOR_DISTRIBUTION.neutral.foreground,
  },
  
  // Cards and containers (60% neutral)
  card: {
    background: COLOR_DISTRIBUTION.neutral.card,
    text: COLOR_DISTRIBUTION.neutral.cardForeground,
    border: COLOR_DISTRIBUTION.complementary.border,
  },
  
  // Forms and inputs (30% complementary)
  form: {
    label: COLOR_DISTRIBUTION.complementary.mutedForeground,
    input: COLOR_DISTRIBUTION.complementary.input,
    placeholder: COLOR_DISTRIBUTION.complementary.mutedForeground,
    helper: COLOR_DISTRIBUTION.complementary.mutedForeground,
  },
  
  // Buttons (10% accent for primary, 30% for secondary)
  button: {
    primary: {
      background: COLOR_DISTRIBUTION.accent.primary,
      text: COLOR_DISTRIBUTION.accent.primaryForeground,
    },
    secondary: {
      background: COLOR_DISTRIBUTION.complementary.secondary,
      text: COLOR_DISTRIBUTION.complementary.secondaryForeground,
    },
    ghost: {
      hover: COLOR_DISTRIBUTION.complementary.muted,
      text: COLOR_DISTRIBUTION.neutral.foreground,
    },
  },
  
  // Navigation (mostly neutral with accent for active)
  navigation: {
    background: COLOR_DISTRIBUTION.neutral.background,
    text: COLOR_DISTRIBUTION.complementary.mutedForeground,
    active: COLOR_DISTRIBUTION.accent.primary,
    hover: COLOR_DISTRIBUTION.neutral.foreground,
  },
  
  // Badges (neutral by default)
  badge: {
    default: {
      background: COLOR_DISTRIBUTION.complementary.secondary,
      text: COLOR_DISTRIBUTION.complementary.secondaryForeground,
    },
    muted: {
      background: COLOR_DISTRIBUTION.complementary.muted,
      text: COLOR_DISTRIBUTION.complementary.mutedForeground,
    },
  },
} as const;

// Usage guidelines
export const COLOR_GUIDELINES = {
  // When to use neutral (60%)
  neutral: [
    'Page backgrounds',
    'Card backgrounds',
    'Main content areas',
    'Default text color',
    'Most UI containers',
  ],
  
  // When to use complementary (30%)
  complementary: [
    'Borders and dividers',
    'Subtle backgrounds',
    'Secondary buttons',
    'Form labels',
    'Muted text',
    'Hover states for neutral elements',
  ],
  
  // When to use accent (10%)
  accent: [
    'Primary CTAs',
    'Active navigation states',
    'Important indicators',
    'Focus states',
    'Success messages (sparingly)',
  ],
  
  // Avoid these patterns
  avoid: [
    'Multiple accent colors on the same page',
    'Accent colors for decorative purposes',
    'Bright colors for large areas',
    'More than 10% accent color usage',
  ],
} as const;

// Helper to check color distribution compliance
export function isAccentColor(className: string): boolean {
  return className.includes('primary') || className.includes('accent');
}

export function isNeutralColor(className: string): boolean {
  return className.includes('background') || 
         className.includes('foreground') || 
         className.includes('card');
}

export function isComplementaryColor(className: string): boolean {
  return className.includes('muted') || 
         className.includes('secondary') || 
         className.includes('border');
}