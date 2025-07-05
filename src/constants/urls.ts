/**
 * External URLs and API endpoints
 */

export const EXTERNAL_URLS = {
  // Partner sites
  wcm: 'https://weillcornell.org',
  nyp: 'https://nyp.org',
  
  // Microsoft services
  teams: 'https://teams.microsoft.com',
  outlook: 'https://outlook.office.com',
  myApps: 'https://myapps.microsoft.com',
  
  // Social media
  facebook: 'https://facebook.com/weillcornell',
  twitter: 'https://twitter.com/WeillCornell',
  linkedin: 'https://linkedin.com/school/weill-cornell-medicine',
  youtube: 'https://youtube.com/weillcornellmedicine',
  
  // Patient resources
  patientPortal: 'https://myquest.org',
  insuranceInfo: 'https://www.weillcornell.org/patients',
  privacyPolicy: '/privacy',
  hipaaNotice: '/hipaa',
  help: '/help',
} as const

export const API_ENDPOINTS = {
  // Netlify functions
  submitForm: '/.netlify/functions/submit-form',
  getDocuments: '/.netlify/functions/get-documents',
  
  // API routes (future)
  providers: '/api/providers',
  documents: '/api/documents',
  forms: '/api/forms',
  directory: '/api/directory',
} as const

export const INTERNAL_ROUTES = {
  home: '/',
  knowledge: '/knowledge',
  directory: '/directory',
  documents: '/documents',
  providers: '/providers',
  forms: '/forms', // Redirects to /documents
  wiki: '/wiki',
} as const