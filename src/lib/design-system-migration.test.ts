import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  migrateTextSize, 
  migrateColor, 
  migrateFontWeight, 
  hasDesignViolation,
  migrateClassName 
} from './design-system-migration'

// Mock feature flags
vi.mock('./feature-flags', () => ({
  FEATURE_FLAGS: {
    STRICT_DESIGN_SYSTEM: true,
    NEUTRAL_BADGES_ONLY: true,
    ENFORCE_TYPOGRAPHY: true,
  }
}))

describe('Design System Migration Helpers', () => {
  describe('migrateTextSize', () => {
    it('should map forbidden text sizes to allowed ones', () => {
      expect(migrateTextSize('text-xs')).toBe('text-sm')
      expect(migrateTextSize('text-xl')).toBe('text-lg')
      expect(migrateTextSize('text-3xl')).toBe('text-2xl')
      expect(migrateTextSize('text-4xl')).toBe('text-2xl')
      expect(migrateTextSize('text-5xl')).toBe('text-2xl')
      expect(migrateTextSize('text-6xl')).toBe('text-2xl')
    })

    it('should keep allowed text sizes unchanged', () => {
      expect(migrateTextSize('text-sm')).toBe('text-sm')
      expect(migrateTextSize('text-base')).toBe('text-base')
      expect(migrateTextSize('text-lg')).toBe('text-lg')
      expect(migrateTextSize('text-2xl')).toBe('text-2xl')
    })

    it('should return unknown sizes unchanged', () => {
      expect(migrateTextSize('text-custom')).toBe('text-custom')
      expect(migrateTextSize('not-a-text-size')).toBe('not-a-text-size')
    })
  })

  describe('migrateColor', () => {
    it('should map red colors to destructive', () => {
      expect(migrateColor('bg-red-50')).toBe('bg-destructive/10')
      expect(migrateColor('bg-red-100')).toBe('bg-destructive/20')
      expect(migrateColor('bg-red-600')).toBe('bg-destructive')
      expect(migrateColor('text-red-600')).toBe('text-destructive')
    })

    it('should map blue colors to primary', () => {
      expect(migrateColor('bg-blue-600')).toBe('bg-primary')
      expect(migrateColor('text-blue-600')).toBe('text-primary')
    })

    it('should map other colors to muted', () => {
      expect(migrateColor('bg-green-50')).toBe('bg-muted')
      expect(migrateColor('bg-yellow-50')).toBe('bg-muted')
      expect(migrateColor('bg-purple-50')).toBe('bg-muted')
    })

    it('should return unmapped colors unchanged', () => {
      expect(migrateColor('bg-gray-100')).toBe('bg-gray-100')
      expect(migrateColor('text-custom')).toBe('text-custom')
    })
  })

  describe('migrateFontWeight', () => {
    it('should map font weights to allowed ones', () => {
      expect(migrateFontWeight('font-thin')).toBe('font-normal')
      expect(migrateFontWeight('font-light')).toBe('font-normal')
      expect(migrateFontWeight('font-medium')).toBe('font-semibold')
      expect(migrateFontWeight('font-bold')).toBe('font-semibold')
      expect(migrateFontWeight('font-black')).toBe('font-semibold')
    })

    it('should keep allowed weights unchanged', () => {
      expect(migrateFontWeight('font-normal')).toBe('font-normal')
      expect(migrateFontWeight('font-semibold')).toBe('font-semibold')
    })
  })

  describe('hasDesignViolation', () => {
    it('should detect forbidden text sizes', () => {
      const result = hasDesignViolation('text-xs font-bold')
      expect(result.hasViolation).toBe(true)
      expect(result.violations).toContain('Forbidden text size: text-xs')
    })

    it('should detect forbidden font weights', () => {
      const result = hasDesignViolation('text-base font-bold')
      expect(result.hasViolation).toBe(true)
      expect(result.violations).toContain('Forbidden font weight: font-bold')
    })

    it('should detect direct color usage', () => {
      const result = hasDesignViolation('bg-red-600 text-blue-500')
      expect(result.hasViolation).toBe(true)
      expect(result.violations).toContain('Direct color usage: bg-red-600')
      expect(result.violations).toContain('Direct color usage: text-blue-500')
    })

    it('should not flag compliant classes', () => {
      const result = hasDesignViolation('text-base font-semibold bg-primary')
      expect(result.hasViolation).toBe(false)
      expect(result.violations).toHaveLength(0)
    })
  })

  describe('migrateClassName', () => {
    it('should migrate multiple violations in one className', () => {
      const input = 'text-xs font-bold bg-red-600 hover:bg-red-700'
      const output = migrateClassName(input)
      expect(output).toBe('text-sm font-semibold bg-destructive hover:bg-destructive')
    })

    it('should handle complex className strings', () => {
      const input = 'flex items-center text-3xl font-medium bg-blue-600 px-4 py-2'
      const output = migrateClassName(input)
      expect(output).toBe('flex items-center text-2xl font-semibold bg-primary px-4 py-2')
    })

    it('should preserve non-violating classes', () => {
      const input = 'flex items-center text-base font-normal bg-background'
      const output = migrateClassName(input)
      expect(output).toBe(input)
    })
  })
})

describe('Design System Migration with Feature Flags Disabled', () => {
  beforeEach(() => {
    // Mock feature flags as disabled
    vi.resetModules()
    vi.doMock('./feature-flags', () => ({
      FEATURE_FLAGS: {
        STRICT_DESIGN_SYSTEM: false,
        NEUTRAL_BADGES_ONLY: false,
        ENFORCE_TYPOGRAPHY: false,
      }
    }))
  })

  it('should not migrate when feature flags are disabled', async () => {
    const { migrateTextSize, migrateColor, migrateFontWeight } = await import('./design-system-migration')
    
    expect(migrateTextSize('text-xs')).toBe('text-xs')
    expect(migrateColor('bg-red-600')).toBe('bg-red-600')
    expect(migrateFontWeight('font-bold')).toBe('font-bold')
  })
})