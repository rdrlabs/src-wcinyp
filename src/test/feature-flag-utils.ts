import { vi } from 'vitest'

/**
 * Test utilities for managing feature flags during tests
 */

/**
 * Enables specific feature flags for a test
 * @param flags - Object with feature flag names and their values
 */
export function setFeatureFlags(flags: Record<string, boolean>) {
  Object.entries(flags).forEach(([key, value]) => {
    process.env[key] = value.toString()
  })
}

/**
 * Resets all feature flags to their default (disabled) state
 */
export function resetFeatureFlags() {
  process.env.NEXT_PUBLIC_STRICT_DESIGN_SYSTEM = 'false'
  process.env.NEXT_PUBLIC_NEUTRAL_BADGES = 'false'
  process.env.NEXT_PUBLIC_ENFORCE_TYPOGRAPHY = 'false'
}

/**
 * Creates a test wrapper that enables feature flags for the duration of the test
 * @param flags - Feature flags to enable
 * @param testFn - Test function to run
 */
export function withFeatureFlags(
  flags: {
    STRICT_DESIGN_SYSTEM?: boolean
    NEUTRAL_BADGES?: boolean
    ENFORCE_TYPOGRAPHY?: boolean
  },
  testFn: () => void | Promise<void>
) {
  return async () => {
    // Save current state
    const originalFlags = {
      NEXT_PUBLIC_STRICT_DESIGN_SYSTEM: process.env.NEXT_PUBLIC_STRICT_DESIGN_SYSTEM,
      NEXT_PUBLIC_NEUTRAL_BADGES: process.env.NEXT_PUBLIC_NEUTRAL_BADGES,
      NEXT_PUBLIC_ENFORCE_TYPOGRAPHY: process.env.NEXT_PUBLIC_ENFORCE_TYPOGRAPHY,
    }

    try {
      // Set new flags
      if (flags.STRICT_DESIGN_SYSTEM !== undefined) {
        process.env.NEXT_PUBLIC_STRICT_DESIGN_SYSTEM = flags.STRICT_DESIGN_SYSTEM.toString()
      }
      if (flags.NEUTRAL_BADGES !== undefined) {
        process.env.NEXT_PUBLIC_NEUTRAL_BADGES = flags.NEUTRAL_BADGES.toString()
      }
      if (flags.ENFORCE_TYPOGRAPHY !== undefined) {
        process.env.NEXT_PUBLIC_ENFORCE_TYPOGRAPHY = flags.ENFORCE_TYPOGRAPHY.toString()
      }

      // Clear module cache to ensure feature flags are re-evaluated
      vi.resetModules()

      // Run test
      await testFn()
    } finally {
      // Restore original flags
      Object.entries(originalFlags).forEach(([key, value]) => {
        if (value !== undefined) {
          process.env[key] = value
        }
      })
      
      // Clear module cache again
      vi.resetModules()
    }
  }
}

/**
 * Helper to test components with different feature flag combinations
 */
export function testWithFeatureFlagCombinations(
  name: string,
  testFn: (flags: { STRICT_DESIGN_SYSTEM: boolean; NEUTRAL_BADGES: boolean; ENFORCE_TYPOGRAPHY: boolean }) => void | Promise<void>
) {
  const combinations = [
    { STRICT_DESIGN_SYSTEM: false, NEUTRAL_BADGES: false, ENFORCE_TYPOGRAPHY: false },
    { STRICT_DESIGN_SYSTEM: true, NEUTRAL_BADGES: false, ENFORCE_TYPOGRAPHY: false },
    { STRICT_DESIGN_SYSTEM: true, NEUTRAL_BADGES: true, ENFORCE_TYPOGRAPHY: false },
    { STRICT_DESIGN_SYSTEM: true, NEUTRAL_BADGES: true, ENFORCE_TYPOGRAPHY: true },
  ]

  combinations.forEach((flags) => {
    const flagString = Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([flag]) => flag)
      .join(', ') || 'No flags'
    
    it(`${name} (${flagString})`, withFeatureFlags(flags, () => testFn(flags)))
  })
}