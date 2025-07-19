/**
 * External URLs and API endpoints
 */

import { urlConfig } from '@/config/app.config'

export const EXTERNAL_URLS = {
  // Partner sites
  wcm: urlConfig.wcm,
  nyp: urlConfig.nyp,
  
  // Microsoft services
  teams: urlConfig.microsoft.teams,
  outlook: urlConfig.microsoft.outlook,
  myApps: urlConfig.microsoft.myApps,
  
  // Social media
  facebook: urlConfig.social.facebook,
  twitter: urlConfig.social.twitter,
  linkedin: urlConfig.social.linkedin,
  youtube: urlConfig.social.youtube,
  
  // Patient resources
  patientPortal: urlConfig.patientPortal,
  insuranceInfo: urlConfig.insuranceInfo,
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
} as const