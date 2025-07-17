/**
 * Theme utilities and semantic color mappings
 * Following 60/30/10 design rule:
 * - 60% Neutral (backgrounds, text)
 * - 30% Complementary (cards, borders)
 * - 10% Accent (CTAs, primary actions)
 */

/**
 * Simplified theme colors following design system
 */
export const themeColors = {
  // Neutral colors (60% - used for most UI elements)
  neutral: {
    background: 'bg-background',
    foreground: 'text-foreground',
    muted: 'bg-muted text-muted-foreground',
    card: 'bg-card text-card-foreground',
  },
  
  // Complementary colors (30% - used for structure)
  complementary: {
    border: 'border-border',
    input: 'border-input',
    secondary: 'bg-secondary text-secondary-foreground',
  },
  
  // Accent colors (10% - used sparingly for CTAs)
  accent: {
    primary: 'bg-primary text-primary-foreground',
    primaryHover: 'hover:bg-primary/90',
    primaryFocus: 'focus:ring-primary',
  },
  
  // System colors (used only for critical states)
  system: {
    destructive: 'bg-destructive text-destructive-foreground',
    destructiveHover: 'hover:bg-destructive/90',
  },
} as const

/**
 * Badge variants - simplified to use mostly neutral colors
 */
export const badgeVariants = {
  // Default badge (neutral)
  default: 'bg-secondary text-secondary-foreground',
  
  // System states (only when necessary)
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  
  // All other badges use neutral colors
  secondary: 'bg-muted text-muted-foreground',
  outline: 'border border-border bg-background',
} as const

/**
 * Get theme-aware color class for badges/chips
 * Most badges should be neutral, with accent only for CTAs
 */
export function getBadgeVariant(type?: string): string {
  // Most badges should use the default neutral variant
  if (!type || type === 'default') {
    return badgeVariants.default
  }
  
  // Only use destructive for actual errors/warnings
  if (type === 'destructive' || type === 'error') {
    return badgeVariants.destructive
  }
  
  // Everything else gets secondary (neutral) treatment
  return badgeVariants.secondary
}

/**
 * Status indicators - simplified
 */
export function getStatusIndicator(status: 'active' | 'inactive' | 'error'): string {
  switch (status) {
    case 'active':
      return 'bg-primary' // Only active items get accent color
    case 'error':
      return 'bg-destructive'
    default:
      return 'bg-muted' // Inactive/default states are neutral
  }
}

/**
 * Focus styles - consistent across all interactive elements
 */
export const focusStyles = 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'

/**
 * Hover styles - subtle interactions
 */
export const hoverStyles = {
  card: 'hover:bg-muted/50 transition-colors',
  button: 'hover:bg-primary/90 transition-colors',
  link: 'hover:text-primary transition-colors',
}

/**
 * Get theme color classes for badges and indicators
 */
export function getThemeColor(color: string): string {
  const colors: Record<string, string> = {
    blue: 'bg-primary/10 text-primary ring-primary/20',
    purple: 'bg-primary/10 text-primary ring-primary/20',
    green: 'bg-primary/10 text-primary ring-primary/20',
    pink: 'bg-primary/10 text-primary ring-primary/20',
    orange: 'bg-muted text-muted-foreground ring-border',
    red: 'bg-destructive/10 text-destructive ring-destructive/20',
    gray: 'bg-muted text-muted-foreground ring-border',
    info: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground ring-secondary/20',
    default: 'bg-secondary text-secondary-foreground ring-secondary/20',
  };
  
  return colors[color] || colors.default;
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-primary/10 text-primary ring-primary/20';
    case 'inactive':
      return 'bg-muted text-muted-foreground ring-border';
    case 'draft':
      return 'bg-muted text-muted-foreground ring-border';
    default:
      return 'bg-muted text-muted-foreground ring-border';
  }
}