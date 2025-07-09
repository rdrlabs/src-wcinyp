/**
 * Typography Constants - Flexible Design System
 * 
 * Based on shadcn/ui + Tailwind v4 standards:
 * - Standard Tailwind text sizes (text-xs through text-5xl)
 * - Standard font weights (normal, medium, semibold, bold)
 * - Semantic patterns for consistency
 */

import { TEXT_SIZES } from './ui';

export const FONT_WEIGHTS = {
  normal: 'font-normal',      // 400 - Body text
  medium: 'font-medium',      // 500 - Subtle emphasis
  semibold: 'font-semibold',  // 600 - Headers, buttons
  bold: 'font-bold',          // 700 - Strong emphasis
} as const;

// Type-safe helpers
export type FontWeight = keyof typeof FONT_WEIGHTS;

// Semantic typography mappings using actual Tailwind classes
export const TYPOGRAPHY = {
  // Page-level typography
  pageTitle: `${TEXT_SIZES.heading} ${FONT_WEIGHTS.semibold}`,
  pageDescription: `${TEXT_SIZES.body} ${FONT_WEIGHTS.normal} text-muted-foreground`,
  
  // Section-level typography
  sectionTitle: `${TEXT_SIZES.subheading} ${FONT_WEIGHTS.semibold}`,
  sectionDescription: `${TEXT_SIZES.body} ${FONT_WEIGHTS.normal} text-muted-foreground`,
  
  // Component-level typography
  cardTitle: `${TEXT_SIZES.subheading} ${FONT_WEIGHTS.semibold}`,
  cardDescription: `${TEXT_SIZES.small} ${FONT_WEIGHTS.normal} text-muted-foreground`,
  
  // UI elements
  buttonText: `${TEXT_SIZES.small} ${FONT_WEIGHTS.semibold}`,
  labelText: `${TEXT_SIZES.small} ${FONT_WEIGHTS.normal}`,
  badgeText: `${TEXT_SIZES.small} ${FONT_WEIGHTS.normal}`,
  
  // Table typography
  tableHeader: `${TEXT_SIZES.small} ${FONT_WEIGHTS.semibold}`,
  tableCell: `${TEXT_SIZES.small} ${FONT_WEIGHTS.normal}`,
  
  // Navigation
  navLink: `${TEXT_SIZES.small} ${FONT_WEIGHTS.normal}`,
  navLinkActive: `${TEXT_SIZES.small} ${FONT_WEIGHTS.semibold}`,
  
  // Body text
  body: `${TEXT_SIZES.body} ${FONT_WEIGHTS.normal}`,
  bodyLarge: `${TEXT_SIZES.subheading} ${FONT_WEIGHTS.normal}`,
  bodySmall: `${TEXT_SIZES.small} ${FONT_WEIGHTS.normal}`,
} as const;

// Validation helpers
export function isValidFontSize(className: string): boolean {
  const fontSizeValues = Object.values(TEXT_SIZES) as string[];
  return fontSizeValues.includes(className);
}

export function isValidFontWeight(className: string): boolean {
  const fontWeightValues = Object.values(FONT_WEIGHTS) as string[];
  return fontWeightValues.includes(className);
}