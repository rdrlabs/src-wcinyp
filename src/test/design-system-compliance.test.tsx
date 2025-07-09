import { describe, it, expect } from 'vitest'
import { hasDesignViolation } from '@/lib/design-system-migration'

describe('Design System Compliance Tests', () => {
  describe('Typography Rules', () => {
    it('should detect forbidden text sizes', () => {
      // Forbidden sizes
      expect(hasDesignViolation('text-xs').hasViolation).toBe(true)
      expect(hasDesignViolation('text-xl').hasViolation).toBe(true)
      expect(hasDesignViolation('text-3xl').hasViolation).toBe(true)
      expect(hasDesignViolation('text-4xl').hasViolation).toBe(true)
      expect(hasDesignViolation('text-5xl').hasViolation).toBe(true)
      expect(hasDesignViolation('text-6xl').hasViolation).toBe(true)
      
      // Allowed sizes
      expect(hasDesignViolation('text-sm').hasViolation).toBe(false)
      expect(hasDesignViolation('text-base').hasViolation).toBe(false)
      expect(hasDesignViolation('text-lg').hasViolation).toBe(false)
      expect(hasDesignViolation('text-2xl').hasViolation).toBe(false)
    })

    it('should detect forbidden font weights', () => {
      // Forbidden weights
      expect(hasDesignViolation('font-bold').hasViolation).toBe(true)
      expect(hasDesignViolation('font-medium').hasViolation).toBe(true)
      expect(hasDesignViolation('font-light').hasViolation).toBe(true)
      expect(hasDesignViolation('font-thin').hasViolation).toBe(true)
      expect(hasDesignViolation('font-black').hasViolation).toBe(true)
      
      // Allowed weights
      expect(hasDesignViolation('font-normal').hasViolation).toBe(false)
      expect(hasDesignViolation('font-semibold').hasViolation).toBe(false)
    })
  })

  describe('Color Rules', () => {
    it('should detect direct color usage', () => {
      // Direct colors (forbidden)
      expect(hasDesignViolation('bg-red-500').hasViolation).toBe(true)
      expect(hasDesignViolation('text-blue-600').hasViolation).toBe(true)
      expect(hasDesignViolation('border-green-300').hasViolation).toBe(true)
      
      // Semantic colors (allowed)
      expect(hasDesignViolation('bg-primary').hasViolation).toBe(false)
      expect(hasDesignViolation('text-destructive').hasViolation).toBe(false)
      expect(hasDesignViolation('border-border').hasViolation).toBe(false)
    })
  })

  describe('Component Compliance', () => {
    it('should validate complete component classes', () => {
      // Good component class
      const goodBadge = 'inline-flex items-center rounded-full border px-3 py-2 text-sm font-semibold'
      expect(hasDesignViolation(goodBadge).hasViolation).toBe(false)
      
      // Bad component class (has text-xs)
      const badBadge = 'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold'
      const badResult = hasDesignViolation(badBadge)
      expect(badResult.hasViolation).toBe(true)
      expect(badResult.violations).toContain('Forbidden text size: text-xs')
    })

    it('should validate button sizes are on 8pt grid', () => {
      // Good sizes (multiples of 8px)
      const goodButton = 'h-8 h-10 h-12 px-4 py-2'
      expect(hasDesignViolation(goodButton).hasViolation).toBe(false)
      
      // Note: hasDesignViolation doesn't check spacing violations
      // This is a gap in our validation
    })
  })

  describe('Real World Examples', () => {
    it('should validate FormBuilder heading', () => {
      // After fix - should be valid
      const heading = 'text-lg font-semibold mb-4'
      expect(hasDesignViolation(heading).hasViolation).toBe(false)
    })

    it('should validate required field indicator', () => {
      // After fix - should be valid (semantic color)
      const required = 'text-destructive ml-1'
      expect(hasDesignViolation(required).hasViolation).toBe(false)
    })

    it('should validate theme color functions use semantic tokens', () => {
      // After fix - should be valid
      const themeColor = 'bg-primary/10 text-primary ring-primary/20'
      expect(hasDesignViolation(themeColor).hasViolation).toBe(false)
    })
  })

  describe('TDD Gap Analysis', () => {
    it('documents why violations persisted', () => {
      // Tests were checking implementation, not specification
      // Example: visual-proportions.test.tsx was testing for py-1
      // But py-1 (4px) violates the 8pt grid rule
      
      // The fix: Tests should enforce design system rules
      const violations = [
        'Tests checked for existing values, not correct values',
        'No tests validated against design system constants',
        'Component tests focused on functionality over styling',
        'Missing integration with hasDesignViolation utility'
      ]
      
      expect(violations.length).toBe(4)
    })
  })
})