/**
 * Company branding and information constants
 */

export const COMPANY = {
  name: 'WCI@NYP',
  fullName: 'Weill Cornell Imaging at NewYork-Presbyterian',
  shortName: 'WCINYP',
  wcmName: 'Weill Cornell Medicine',
  nypName: 'NewYork-Presbyterian Hospital',
  collaboration: 'WCI@NYP is a collaboration between',
} as const

export const CONTACT_INFO = {
  phone: '(212) 746-6000',
  alternatePhone: '(212) 746-2920',
  email: 'imaging@med.cornell.edu',
  emergencyMessage: 'Emergency? Call 911',
  urgentMessage: 'For urgent imaging needs, contact your care team.',
} as const

export const ADDRESS = {
  street: '520 East 70th Street',
  alternateStreet: '525 East 68th Street',
  city: 'New York, NY 10021',
  alternateCity: 'New York, NY 10065',
  country: 'USA',
} as const

export const BUSINESS_HOURS = {
  weekdays: 'Mon-Fri: 8:00 AM - 5:00 PM',
  saturday: 'Closed',
  sunday: 'Closed',
} as const

export const LEGAL = {
  copyright: `© ${new Date().getFullYear()} Weill Cornell Imaging at NewYork-Presbyterian. All rights reserved.`,
  privacyPolicy: 'Privacy Policy',
  termsOfService: 'Terms of Service',
} as const

export const EMAIL_DOMAINS = {
  wcinyp: '@wcinyp.org',
  nyp: '@nyp.org',
  cornell: '@med.cornell.edu',
} as const