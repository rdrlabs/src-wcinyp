/**
 * Design System Migration Helpers
 * These utilities help migrate from old patterns to new design system compliant ones
 */

import { FEATURE_FLAGS } from './feature-flags'

/**
 * Maps old text sizes to design system compliant sizes
 * Only 4 sizes allowed: text-sm (14px), text-base (16px), text-lg (18px), text-2xl (24px)
 */
export function migrateTextSize(oldSize: string): string {
  // If feature is not enabled, return original size
  if (!FEATURE_FLAGS.ENFORCE_TYPOGRAPHY) {
    return oldSize
  }

  const sizeMap: Record<string, string> = {
    'text-xs': 'text-sm',      // 12px → 14px (smallest allowed)
    'text-sm': 'text-sm',      // 14px → 14px (no change)
    'text-base': 'text-base',  // 16px → 16px (no change)
    'text-lg': 'text-lg',      // 18px → 18px (no change)
    'text-xl': 'text-lg',      // 20px → 18px (merge with lg)
    'text-2xl': 'text-2xl',    // 24px → 24px (no change)
    'text-3xl': 'text-2xl',    // 30px → 24px (largest allowed)
    'text-4xl': 'text-2xl',    // 36px → 24px (largest allowed)
    'text-5xl': 'text-2xl',    // 48px → 24px (largest allowed)
    'text-6xl': 'text-2xl',    // 60px → 24px (largest allowed)
  }

  return sizeMap[oldSize] || oldSize
}

/**
 * Maps direct color classes to semantic design system colors
 * Follows 60/30/10 color distribution rule
 */
export function migrateColor(oldColor: string): string {
  // If strict design system is not enabled, return original color
  if (!FEATURE_FLAGS.STRICT_DESIGN_SYSTEM) {
    return oldColor
  }

  const colorMap: Record<string, string> = {
    // Background colors
    'bg-red-50': 'bg-destructive/10',
    'bg-red-100': 'bg-destructive/20',
    'bg-red-200': 'bg-destructive/30',
    'bg-red-500': 'bg-destructive',
    'bg-red-600': 'bg-destructive',
    'bg-red-700': 'bg-destructive',
    
    'bg-blue-50': 'bg-primary/10',
    'bg-blue-100': 'bg-primary/20',
    'bg-blue-500': 'bg-primary',
    'bg-blue-600': 'bg-primary',
    'bg-blue-700': 'bg-primary',
    
    'bg-green-50': 'bg-muted',
    'bg-green-100': 'bg-muted',
    'bg-green-500': 'bg-primary',
    'bg-green-600': 'bg-primary',
    
    'bg-yellow-50': 'bg-muted',
    'bg-yellow-100': 'bg-muted',
    
    'bg-purple-50': 'bg-muted',
    'bg-purple-100': 'bg-muted',
    'bg-purple-500': 'bg-primary',
    'bg-purple-600': 'bg-primary',
    
    'bg-orange-50': 'bg-muted',
    'bg-orange-100': 'bg-muted',
    
    // Text colors
    'text-red-500': 'text-destructive',
    'text-red-600': 'text-destructive',
    'text-red-700': 'text-destructive',
    
    'text-blue-500': 'text-primary',
    'text-blue-600': 'text-primary',
    'text-blue-700': 'text-primary',
    
    'text-green-500': 'text-primary',
    'text-green-600': 'text-primary',
    
    'text-purple-500': 'text-primary',
    'text-purple-600': 'text-primary',
    
    // Border colors
    'border-red-200': 'border-destructive/20',
    'border-red-300': 'border-destructive/30',
    'border-blue-200': 'border-primary/20',
    'border-blue-300': 'border-primary/30',
  }

  return colorMap[oldColor] || oldColor
}

/**
 * Maps font weights to design system compliant weights
 * Only 2 weights allowed: font-normal (400) and font-semibold (600)
 */
export function migrateFontWeight(oldWeight: string): string {
  if (!FEATURE_FLAGS.ENFORCE_TYPOGRAPHY) {
    return oldWeight
  }

  const weightMap: Record<string, string> = {
    'font-thin': 'font-normal',        // 100 → 400
    'font-extralight': 'font-normal',  // 200 → 400
    'font-light': 'font-normal',       // 300 → 400
    'font-normal': 'font-normal',      // 400 → 400 (no change)
    'font-medium': 'font-semibold',    // 500 → 600
    'font-semibold': 'font-semibold',  // 600 → 600 (no change)
    'font-bold': 'font-semibold',      // 700 → 600
    'font-extrabold': 'font-semibold', // 800 → 600
    'font-black': 'font-semibold',     // 900 → 600
  }

  return weightMap[oldWeight] || oldWeight
}

/**
 * Utility to check if a class name contains forbidden patterns
 */
export function hasDesignViolation(className: string): {
  hasViolation: boolean
  violations: string[]
} {
  const violations: string[] = []

  // Check for forbidden text sizes
  if (FEATURE_FLAGS.ENFORCE_TYPOGRAPHY) {
    const forbiddenSizes = ['text-xs', 'text-xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl']
    forbiddenSizes.forEach(size => {
      if (className.includes(size)) {
        violations.push(`Forbidden text size: ${size}`)
      }
    })

    // Check for forbidden font weights
    const forbiddenWeights = ['font-bold', 'font-medium', 'font-light', 'font-thin', 'font-black']
    forbiddenWeights.forEach(weight => {
      if (className.includes(weight)) {
        violations.push(`Forbidden font weight: ${weight}`)
      }
    })
  }

  // Check for direct color usage
  if (FEATURE_FLAGS.STRICT_DESIGN_SYSTEM) {
    const colorPattern = /(bg|text|border)-(red|blue|green|yellow|purple|orange|pink|indigo)-\d{2,3}/g
    const matches = className.match(colorPattern)
    if (matches) {
      matches.forEach(match => {
        violations.push(`Direct color usage: ${match}`)
      })
    }
  }

  return {
    hasViolation: violations.length > 0,
    violations
  }
}

/**
 * Automatically migrates a className string to be design system compliant
 */
export function migrateClassName(className: string): string {
  let migrated = className

  // Migrate text sizes
  const textSizes = migrated.match(/text-\w+/g) || []
  textSizes.forEach(size => {
    const newSize = migrateTextSize(size)
    if (newSize !== size) {
      migrated = migrated.replace(size, newSize)
    }
  })

  // Migrate colors
  const colors = migrated.match(/(bg|text|border)-\w+-\d{2,3}/g) || []
  colors.forEach(color => {
    const newColor = migrateColor(color)
    if (newColor !== color) {
      migrated = migrated.replace(color, newColor)
    }
  })

  // Migrate font weights
  const weights = migrated.match(/font-\w+/g) || []
  weights.forEach(weight => {
    const newWeight = migrateFontWeight(weight)
    if (newWeight !== weight) {
      migrated = migrated.replace(weight, newWeight)
    }
  })

  return migrated
}