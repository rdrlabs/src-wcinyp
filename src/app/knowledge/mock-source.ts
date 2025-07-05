// Mock source for client-side rendering with static export
export const pageTree = {
  name: 'Knowledge Base',
  children: [
  {
    type: 'page' as const,
    name: 'Introduction',
    url: '/knowledge',
  },
  {
    type: 'folder' as const,
    name: 'Getting Started',
    index: {
      type: 'page' as const,
      name: 'Overview',
      url: '/knowledge/getting-started',
    },
    children: [
      {
        type: 'page' as const,
        name: 'Introduction',
        url: '/knowledge/intro',
      },
      {
        type: 'page' as const,
        name: 'Quick Start',
        url: '/knowledge/quickstart',
      },
      {
        type: 'page' as const,
        name: 'Requirements',
        url: '/knowledge/requirements',
      },
    ],
  },
  {
    type: 'folder' as const,
    name: 'Features',
    index: {
      type: 'page' as const,
      name: 'Overview',
      url: '/knowledge/features',
    },
    children: [
      {
        type: 'page' as const,
        name: 'Documents',
        url: '/knowledge/features/documents',
      },
      {
        type: 'page' as const,
        name: 'Providers',
        url: '/knowledge/features/providers',
      },
      {
        type: 'page' as const,
        name: 'Forms',
        url: '/knowledge/features/forms',
      },
      {
        type: 'page' as const,
        name: 'Directory',
        url: '/knowledge/features/directory',
      },
    ],
  },
  {
    type: 'folder' as const,
    name: 'Guides',
    index: {
      type: 'page' as const,
      name: 'Overview',
      url: '/knowledge/guides',
    },
    children: [
      {
        type: 'page' as const,
        name: 'Form Builder',
        url: '/knowledge/guides/form-builder',
      },
      {
        type: 'page' as const,
        name: 'Self-Pay Workflow',
        url: '/knowledge/guides/self-pay-workflow',
      },
      {
        type: 'page' as const,
        name: 'API Integration',
        url: '/knowledge/guides/api-integration',
      },
    ],
  },
  ],
};