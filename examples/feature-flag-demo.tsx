/**
 * Example demonstrating how feature flags work in the migration
 * This file shows how components can adapt based on feature flags
 */

import { FEATURE_FLAGS } from '@/lib/feature-flags'
import { migrateTextSize, migrateColor, migrateClassName } from '@/lib/design-system-migration'

// Example 1: Badge component with conditional colors
export function ExampleBadge({ variant = 'default', children }: { variant?: string; children: React.ReactNode }) {
  // Old behavior: colorful badges
  const oldColors = {
    default: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
  }

  // New behavior: neutral badges only
  const newColors = {
    default: 'bg-secondary text-secondary-foreground',
    blue: 'bg-secondary text-secondary-foreground', // All map to neutral
    green: 'bg-secondary text-secondary-foreground',
    red: 'bg-destructive/10 text-destructive', // Only destructive keeps color
  }

  const colors = FEATURE_FLAGS.NEUTRAL_BADGES_ONLY ? newColors : oldColors
  const colorClass = colors[variant as keyof typeof colors] || colors.default

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${FEATURE_FLAGS.ENFORCE_TYPOGRAPHY ? 'text-sm' : 'text-xs'} font-semibold ${colorClass}`}>
      {children}
    </span>
  )
}

// Example 2: Typography with automatic migration
export function ExampleHeading({ size = 'large', children }: { size?: string; children: React.ReactNode }) {
  const sizeMap = {
    small: 'text-sm',     // Standard small size
    medium: 'text-lg',    // Standard medium size
    large: 'text-2xl',    // Standard large size
  }

  const textSize = migrateTextSize(sizeMap[size as keyof typeof sizeMap] || 'text-2xl')
  
  return <h1 className={`${textSize} font-semibold`}>{children}</h1>
}

// Example 3: Full className migration
export function ExampleCard() {
  const oldClassName = 'bg-blue-50 text-xs font-bold p-5 gap-1.5'
  const newClassName = migrateClassName(oldClassName)
  
  // With flags enabled:
  // - bg-blue-50 → bg-primary/10
  // - text-xs → text-sm (text-xs is no longer allowed)
  // - font-bold → font-semibold (standardized weight)
  // - p-5 stays (it's valid)
  // - gap-1.5 stays (but should be manually fixed to gap-2)

  return (
    <div className={newClassName}>
      <p>Feature Flags Status:</p>
      <ul className="mt-2">
        <li>Strict Design System: {FEATURE_FLAGS.STRICT_DESIGN_SYSTEM ? '✅' : '❌'}</li>
        <li>Neutral Badges Only: {FEATURE_FLAGS.NEUTRAL_BADGES_ONLY ? '✅' : '❌'}</li>
        <li>Enforce Typography: {FEATURE_FLAGS.ENFORCE_TYPOGRAPHY ? '✅' : '❌'}</li>
      </ul>
    </div>
  )
}

// Example 4: How to use in tests
export const testExamples = `
import { withFeatureFlags } from '@/test/feature-flag-utils'

// Test with specific flags
it('uses neutral badges when enabled', withFeatureFlags(
  { NEUTRAL_BADGES_ONLY: true },
  () => {
    render(<ExampleBadge variant="blue">Test</ExampleBadge>)
    const badge = screen.getByText('Test')
    expect(badge).toHaveClass('bg-secondary') // Not bg-blue-100
  }
))

// Test migration helpers
it('migrates text sizes correctly', () => {
  // With ENFORCE_TYPOGRAPHY = true
  // Only 4 sizes allowed: text-sm, text-base, text-lg, text-2xl
  expect(migrateTextSize('text-xs')).toBe('text-sm')     // xs → sm
  expect(migrateTextSize('text-4xl')).toBe('text-2xl')   // 4xl → 2xl
  expect(migrateTextSize('text-5xl')).toBe('text-2xl')   // 5xl → 2xl
  expect(migrateTextSize('text-6xl')).toBe('text-2xl')   // 6xl → 2xl
})
`