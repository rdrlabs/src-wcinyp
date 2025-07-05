/**
 * Medical and healthcare related constants
 */

export const MEDICAL_SPECIALTIES = {
  radiology: 'Radiology',
  diagnosticRadiology: 'Diagnostic Radiology',
  interventionalRadiology: 'Interventional Radiology',
  neuroradiology: 'Neuroradiology',
  pediatricRadiology: 'Pediatric Radiology',
  musculoskeletalRadiology: 'Musculoskeletal Radiology',
  cardiothoracicRadiology: 'Cardiothoracic Radiology',
  abdominalRadiology: 'Abdominal Radiology',
  breastImaging: 'Breast Imaging',
  nuclearMedicine: 'Nuclear Medicine',
  cardiology: 'Cardiology',
  neurology: 'Neurology',
  orthopedics: 'Orthopedics',
  pediatrics: 'Pediatrics',
  emergency: 'Emergency Medicine',
  internalMedicine: 'Internal Medicine',
} as const

export const PROVIDER_FLAGS = {
  vip: {
    value: 'vip',
    label: 'VIP Provider',
    color: 'text-yellow-500',
  },
  urgent: {
    value: 'urgent',
    label: 'Urgent Availability',
    color: 'text-red-500',
  },
  new: {
    value: 'new',
    label: 'New Provider',
    color: 'text-green-500',
  },
  teaching: {
    value: 'teaching',
    label: 'Teaching Faculty',
    color: 'text-purple-500',
  },
  research: {
    value: 'research',
    label: 'Research Faculty',
    color: 'text-blue-500',
  },
  multilingual: {
    value: 'multilingual',
    label: 'Multilingual',
    color: 'text-indigo-500',
  },
} as const

export const DOCUMENT_CATEGORIES = {
  abnForms: 'ABN Forms',
  calciumScoreABN: 'Calcium Score ABN',
  patientQuestionnaires: 'Patient Questionnaires',
  administrativeForms: 'Administrative Forms',
  faxTransmittalForms: 'Fax Transmittal Forms',
  invoiceForms: 'Invoice Forms',
  financialForms: 'Financial Forms',
  registrationForms: 'Registration Forms',
  medicalForms: 'Medical Forms',
} as const

export const IMAGING_MODALITIES = {
  ct: 'CT',
  mri: 'MRI',
  xray: 'X-Ray',
  ultrasound: 'Ultrasound',
  mammography: 'Mammography',
  petct: 'PET/CT',
  fluoroscopy: 'Fluoroscopy',
  dexa: 'DEXA',
  nuclear: 'Nuclear Medicine',
  interventional: 'Interventional',
} as const

export const APPOINTMENT_TYPES = {
  routine: 'Routine',
  urgent: 'Urgent',
  followUp: 'Follow-up',
  screening: 'Screening',
  diagnostic: 'Diagnostic',
  consultation: 'Consultation',
  procedure: 'Procedure',
} as const

export const LANGUAGES = [
  'English',
  'Spanish',
  'Mandarin',
  'Cantonese',
  'Russian',
  'French',
  'Korean',
  'Arabic',
  'Hindi',
  'Bengali',
  'Portuguese',
  'Japanese',
  'Other',
] as const