/**
 * Spacing Constants - Design System
 * 
 * Based on 8pt grid system:
 * - All values divisible by 8 (preferred) or 4
 * - Consistent spacing throughout the app
 * - Maps to Tailwind spacing values
 */

// Base unit (in pixels)
export const GRID_UNIT = 8;

// Spacing scale based on 8pt grid
export const SPACING = {
  // Core spacing values (multiples of 8)
  0: 'p-0 m-0 gap-0',           // 0px
  1: 'p-2 m-2 gap-2',           // 8px
  2: 'p-4 m-4 gap-4',           // 16px
  3: 'p-6 m-6 gap-6',           // 24px
  4: 'p-8 m-8 gap-8',           // 32px
  5: 'p-10 m-10 gap-10',        // 40px
  6: 'p-12 m-12 gap-12',        // 48px
  8: 'p-16 m-16 gap-16',        // 64px
  10: 'p-20 m-20 gap-20',       // 80px
  12: 'p-24 m-24 gap-24',       // 96px
  16: 'p-32 m-32 gap-32',       // 128px
} as const;

// Tailwind class mappings for different properties
export const PADDING = {
  0: 'p-0',     // 0px
  1: 'p-2',     // 8px
  2: 'p-4',     // 16px
  3: 'p-6',     // 24px
  4: 'p-8',     // 32px
  5: 'p-10',    // 40px
  6: 'p-12',    // 48px
  8: 'p-16',    // 64px
} as const;

export const MARGIN = {
  0: 'm-0',     // 0px
  1: 'm-2',     // 8px
  2: 'm-4',     // 16px
  3: 'm-6',     // 24px
  4: 'm-8',     // 32px
  5: 'm-10',    // 40px
  6: 'm-12',    // 48px
  8: 'm-16',    // 64px
} as const;

export const GAP = {
  0: 'gap-0',   // 0px
  1: 'gap-2',   // 8px
  2: 'gap-4',   // 16px
  3: 'gap-6',   // 24px
  4: 'gap-8',   // 32px
  5: 'gap-10',  // 40px
  6: 'gap-12',  // 48px
  8: 'gap-16',  // 64px
} as const;

// Semantic spacing patterns
export const LAYOUT_SPACING = {
  // Page-level spacing
  pageContainer: 'container mx-auto px-4 py-8',  // 16px horizontal, 32px vertical
  sectionGap: 'space-y-12',                      // 48px between sections
  
  // Component spacing
  cardPadding: 'p-6',                            // 24px all sides
  cardGap: 'gap-6',                              // 24px between cards
  
  // Form spacing
  formFieldGap: 'space-y-4',                     // 16px between form fields
  labelGap: 'mb-2',                              // 8px below labels
  
  // Button spacing
  buttonPadding: 'px-4 py-2',                    // 16px horizontal, 8px vertical
  buttonGroup: 'gap-2',                          // 8px between buttons
  
  // Table spacing
  tableCellPadding: 'px-4 py-2',                 // 16px horizontal, 8px vertical
  
  // Navigation spacing
  navItemGap: 'gap-6',                           // 24px between nav items
  navPadding: 'px-4 py-4',                       // 16px horizontal, 16px vertical
} as const;

// Responsive spacing utilities
export const RESPONSIVE_SPACING = {
  // Container widths
  containerPadding: 'px-4 md:px-8',              // 16px mobile, 32px desktop
  
  // Section spacing
  sectionPadding: 'py-8 md:py-12',              // 32px mobile, 48px desktop
  
  // Grid gaps
  gridGap: 'gap-4 md:gap-6',                     // 16px mobile, 24px desktop
} as const;

// Validation helpers
export function isGridAligned(pixels: number): boolean {
  return pixels % GRID_UNIT === 0;
}

export function isHalfGridAligned(pixels: number): boolean {
  return pixels % (GRID_UNIT / 2) === 0;
}

// Convert pixels to nearest grid value
export function toNearestGrid(pixels: number): number {
  return Math.round(pixels / GRID_UNIT) * GRID_UNIT;
}

// Get Tailwind spacing class from pixel value
export function getSpacingClass(pixels: number, property: 'p' | 'm' | 'gap' = 'p'): string {
  const gridValue = pixels / 4; // Tailwind uses 4px as base
  return `${property}-${gridValue}`;
}