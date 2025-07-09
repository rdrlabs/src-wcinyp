/**
 * Feature flags for gradual design system migration
 * These flags allow us to incrementally roll out design system changes
 * without breaking existing functionality.
 */

export const FEATURE_FLAGS = {
  /**
   * Master switch for strict design system enforcement
   * When enabled, all design system rules are enforced
   */
  STRICT_DESIGN_SYSTEM: true,

  /**
   * Controls badge color enforcement
   * When enabled, only neutral badges are allowed (no colorful variants)
   */
  NEUTRAL_BADGES_ONLY: true,

  /**
   * Controls typography size enforcement
   * When enabled, only 4 text sizes are allowed (text-sm, text-base, text-lg, text-2xl)
   */
  ENFORCE_TYPOGRAPHY: true,
} as const

/**
 * Helper to check if a feature is enabled
 */
export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag] || false
}

/**
 * Helper to get all enabled features (for debugging)
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([flag]) => flag)
}