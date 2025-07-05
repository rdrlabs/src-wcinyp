/**
 * Application statistics and metrics
 */

export const APP_STATISTICS = {
  documents: {
    count: 156,
    label: 'documents',
    description: 'Medical forms and documents',
  },
  providers: {
    count: 42,
    label: 'providers',
    description: 'Medical professionals',
  },
  contacts: {
    count: 150,
    label: 'contacts',
    minLabel: '150+',
    description: 'Department contacts',
  },
  articles: {
    count: 15,
    label: 'articles',
    minLabel: '15+',
    description: 'Knowledge base articles',
  },
} as const

export const DEFAULT_USER = {
  cwid: 'AB12345',
  displayName: 'Test User',
  role: 'Staff',
} as const

export const PAGE_METADATA = {
  siteName: 'WCINYP',
  defaultTitle: 'Weill Cornell Imaging at NewYork-Presbyterian',
  titleTemplate: '%s | WCINYP',
  description: 'Internal portal for Weill Cornell Imaging at NewYork-Presbyterian staff',
} as const