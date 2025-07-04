// Simplified source for static export
export const pageTree = {
  name: 'Docs',
  children: [
    {
      type: 'page',
      name: 'Welcome',
      url: '/docs',
    },
    {
      type: 'separator',
      name: 'Getting Started',
    },
    {
      type: 'page',
      name: 'Introduction',
      url: '/docs/getting-started/introduction',
    },
    {
      type: 'page',
      name: 'Quick Start',
      url: '/docs/getting-started/quickstart',
    },
    {
      type: 'page',
      name: 'Requirements',
      url: '/docs/getting-started/requirements',
    },
    {
      type: 'separator',
      name: 'Features',
    },
    {
      type: 'page',
      name: 'Documents',
      url: '/docs/features/documents',
    },
    {
      type: 'page',
      name: 'Forms',
      url: '/docs/features/forms',
    },
    {
      type: 'page',
      name: 'Providers',
      url: '/docs/features/providers',
    },
    {
      type: 'page',
      name: 'Contacts',
      url: '/docs/features/contacts',
    },
  ],
}

export function getPage(slug: string[]) {
  // Map slugs to content
  const slugPath = slug.join('/')
  const pages = {
    '': { data: { title: 'WCINYP Documentation', description: 'Welcome to the Weill Cornell Imaging at NewYork-Presbyterian documentation', body: () => null } },
    'getting-started/introduction': { data: { title: 'Introduction to WCINYP', description: 'Learn about the WCINYP system', body: () => null } },
    'getting-started/quickstart': { data: { title: 'Quick Start Guide', description: 'Get up and running with WCINYP quickly', body: () => null } },
    'getting-started/requirements': { data: { title: 'System Requirements', description: 'What you need to use WCINYP', body: () => null } },
    'features/documents': { data: { title: 'Document Management', description: 'How to work with documents in WCINYP', body: () => null } },
    'features/forms': { data: { title: 'Form Builder & Management', description: 'Creating and managing dynamic forms', body: () => null } },
    'features/providers': { data: { title: 'Provider Directory', description: 'Finding and managing provider information', body: () => null } },
    'features/contacts': { data: { title: 'Contact Directory', description: 'Comprehensive contact management system', body: () => null } },
  }
  
  return pages[slugPath as keyof typeof pages]
}

export function getPages() {
  return []
}