/**
 * Form-related constants
 */

export const FIELD_TYPES = {
  text: {
    value: 'text',
    label: 'Text',
    icon: '📝',
  },
  email: {
    value: 'email',
    label: 'Email',
    icon: '✉️',
  },
  phone: {
    value: 'phone',
    label: 'Phone',
    icon: '📱',
  },
  date: {
    value: 'date',
    label: 'Date',
    icon: '📅',
  },
  select: {
    value: 'select',
    label: 'Select',
    icon: '🔽',
  },
  checkbox: {
    value: 'checkbox',
    label: 'Checkbox',
    icon: '☑️',
  },
  textarea: {
    value: 'textarea',
    label: 'Text Area',
    icon: '📄',
  },
  signature: {
    value: 'signature',
    label: 'Signature',
    icon: '✍️',
  },
} as const

export const FORM_CATEGORIES = {
  financial: 'Financial',
  registration: 'Registration',
  medical: 'Medical',
  administrative: 'Administrative',
  abnForms: 'ABN Forms',
  patientQuestionnaires: 'Patient Questionnaires',
} as const

export const FORM_STATUS = {
  active: 'active',
  draft: 'draft',
  archived: 'archived',
} as const

export const INSURANCE_PROVIDERS = [
  'Aetna',
  'Blue Cross Blue Shield',
  'Cigna',
  'Empire BlueCross',
  'Humana',
  'Medicare',
  'Medicaid',
  'Oxford',
  'United Healthcare',
  'Other',
] as const

export const DEFAULT_FORM_VALUES = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
} as const