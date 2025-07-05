/**
 * Theme utilities and semantic color mappings
 */


/**
 * Semantic color variants that adapt to theme
 */
export const themeColors = {
  // Status colors
  status: {
    success: 'bg-green-50 text-green-700 ring-green-700/10 dark:bg-green-950/20 dark:text-green-400 dark:ring-green-400/20',
    warning: 'bg-yellow-50 text-yellow-700 ring-yellow-700/10 dark:bg-yellow-950/20 dark:text-yellow-400 dark:ring-yellow-400/20',
    error: 'bg-red-50 text-red-700 ring-red-700/10 dark:bg-red-950/20 dark:text-red-400 dark:ring-red-400/20',
    info: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-950/20 dark:text-blue-400 dark:ring-blue-400/20',
  },
  
  // Category colors (for badges)
  category: {
    primary: 'bg-primary/10 text-primary ring-primary/20',
    secondary: 'bg-secondary text-secondary-foreground ring-secondary/20',
    blue: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-950/20 dark:text-blue-400 dark:ring-blue-400/20',
    purple: 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-950/20 dark:text-purple-400 dark:ring-purple-400/20',
    green: 'bg-green-50 text-green-700 ring-green-700/10 dark:bg-green-950/20 dark:text-green-400 dark:ring-green-400/20',
    orange: 'bg-orange-50 text-orange-700 ring-orange-700/10 dark:bg-orange-950/20 dark:text-orange-400 dark:ring-orange-400/20',
    pink: 'bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-950/20 dark:text-pink-400 dark:ring-pink-400/20',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-950/20 dark:text-indigo-400 dark:ring-indigo-400/20',
    teal: 'bg-teal-50 text-teal-700 ring-teal-700/10 dark:bg-teal-950/20 dark:text-teal-400 dark:ring-teal-400/20',
    red: 'bg-red-50 text-red-700 ring-red-700/10 dark:bg-red-950/20 dark:text-red-400 dark:ring-red-400/20',
    gray: 'bg-gray-50 text-gray-700 ring-gray-700/10 dark:bg-gray-950/20 dark:text-gray-400 dark:ring-gray-400/20',
  },
  
  // Border colors for cards/sections
  border: {
    default: 'border-border',
    primary: 'border-primary/20 hover:border-primary/30 dark:border-primary/30 dark:hover:border-primary/40',
    muted: 'border-muted hover:border-muted-foreground/20',
  },
  
  // Text colors
  text: {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground',
  },
  
  // Background colors
  background: {
    default: 'bg-background',
    card: 'bg-card',
    muted: 'bg-muted',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
  },
} as const

/**
 * Get theme-aware color class for a given variant
 */
export function getThemeColor(
  variant: keyof typeof themeColors.category | 'default' | 'info' | 'success' | 'warning' | 'error'
): string {
  if (variant === 'default') {
    return themeColors.category.secondary
  }
  if (variant === 'info') {
    return themeColors.status.info
  }
  if (variant === 'success') {
    return themeColors.status.success
  }
  if (variant === 'warning') {
    return themeColors.status.warning
  }
  if (variant === 'error') {
    return themeColors.status.error
  }
  return themeColors.category[variant as keyof typeof themeColors.category] || themeColors.category.gray
}

/**
 * Get status color based on status type
 */
export function getStatusColor(status: 'active' | 'draft' | 'archived' | 'success' | 'warning' | 'error'): string {
  const statusMap = {
    active: themeColors.status.success,
    draft: themeColors.status.warning,
    archived: themeColors.status.error,
    success: themeColors.status.success,
    warning: themeColors.status.warning,
    error: themeColors.status.error,
  }
  return statusMap[status] || themeColors.category.gray
}

/**
 * Theme-aware hover effect for navigation
 */
export const navigationHoverEffect = 'hover:text-foreground hover:drop-shadow-[0_0_8px_var(--primary)]'

/**
 * Theme-aware card hover effect
 */
export const cardHoverEffect = 'hover:shadow-lg hover:border-primary/20 transition-all duration-200'