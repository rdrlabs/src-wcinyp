import type { Document, FormTemplate, Provider, Contact } from '@/types'

// Extended Document type for demo
interface DemoDocument extends Document {
  title: string
  type: string
  description: string
  fileUrl: string
  fileSize: string
  version: string
  tags: string[]
  department: string
  downloadCount: number
}

// Demo Documents
export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    name: 'MRI Safety Screening Form',
    title: 'MRI Safety Screening Form',
    path: '/documents/mri-safety-screening.pdf',
    category: 'Clinical Forms',
    type: 'form',
    description: 'Patient screening questionnaire for MRI procedures',
    fileUrl: '#',
    fileSize: '245 KB',
    size: '245 KB',
    version: '2.1',
    lastUpdated: '2024-01-15',
    tags: ['MRI', 'Safety', 'Screening', 'Patient Care'],
    department: 'Radiology',
    downloadCount: 1523
  },
  {
    name: 'CT Contrast Consent Form',
    title: 'CT Contrast Consent Form',
    path: '/documents/ct-contrast-consent.pdf',
    category: 'Consent Forms',
    type: 'pdf',
    description: 'Informed consent for CT procedures with contrast administration',
    fileUrl: '#',
    fileSize: '312 KB',
    size: '312 KB',
    version: '1.5',
    lastUpdated: '2024-01-10',
    tags: ['CT', 'Contrast', 'Consent', 'Patient Care'],
    department: 'Radiology',
    downloadCount: 987
  },
  {
    name: 'Radiation Dose Tracking Log',
    title: 'Radiation Dose Tracking Log',
    path: '/documents/radiation-dose-tracking.xlsx',
    category: 'Administrative',
    type: 'excel',
    description: 'Template for tracking patient radiation exposure across procedures',
    fileUrl: '#',
    fileSize: '156 KB',
    size: '156 KB',
    version: '3.0',
    lastUpdated: '2023-12-20',
    tags: ['Radiation', 'Dose Tracking', 'Compliance'],
    department: 'Quality Assurance',
    downloadCount: 543
  },
  {
    name: 'Ultrasound Examination Protocol',
    title: 'Ultrasound Examination Protocol',
    path: '/documents/ultrasound-protocol.pdf',
    category: 'Protocols',
    type: 'pdf',
    description: 'Standardized protocols for various ultrasound examinations',
    fileUrl: '#',
    fileSize: '2.3 MB',
    size: '2.3 MB',
    version: '4.2',
    lastUpdated: '2023-11-28',
    tags: ['Ultrasound', 'Protocol', 'Guidelines'],
    department: 'Ultrasound',
    downloadCount: 2341
  },
  {
    name: 'Interventional Radiology Checklist',
    title: 'Interventional Radiology Checklist',
    path: '/documents/ir-checklist.pdf',
    category: 'Clinical Forms',
    type: 'form',
    description: 'Pre-procedure checklist for IR procedures',
    fileUrl: '#',
    fileSize: '198 KB',
    size: '198 KB',
    version: '1.8',
    lastUpdated: '2024-01-08',
    tags: ['IR', 'Checklist', 'Safety'],
    department: 'Interventional Radiology',
    downloadCount: 765
  }
]

// Demo Form Templates
export const DEMO_FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'demo-form-001',
    name: 'MRI Safety Screening',
    description: 'Comprehensive patient screening for MRI compatibility',
    category: 'MRI',
    fields: [
      { id: '1', label: 'Patient Name', type: 'text', required: true },
      { id: '2', label: 'Medical Record Number', type: 'text', required: true },
      { id: '3', label: 'Do you have any implants?', type: 'checkbox', required: true },
      { id: '4', label: 'If yes, please describe', type: 'textarea', required: false }
    ],
    lastUsed: '2024-01-15',
    submissions: 245,
    status: 'active'
  },
  {
    id: 'demo-form-002',
    name: 'Contrast Allergy Assessment',
    description: 'Evaluate patient risk for contrast reactions',
    category: 'Contrast',
    fields: [
      { id: '1', label: 'Previous contrast reaction?', type: 'checkbox', required: true },
      { id: '2', label: 'Type of reaction', type: 'select', required: false, options: ['Mild', 'Moderate', 'Severe'] }
    ],
    lastUsed: '2024-01-10',
    submissions: 132,
    status: 'active'
  }
]

// Demo Providers
export const DEMO_PROVIDERS: Provider[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Neuroradiology',
    department: 'Radiology',
    npi: '1234567890',
    email: 'sjohnson@demo.med.cornell.edu',
    phone: '(212) 555-0101',
    location: 'Main Building, 5th Floor',
    affiliation: 'WCM',
    flags: ['vip', 'teaching'],
    languages: ['English', 'Spanish'],
    notes: 'Specializes in advanced neuroimaging techniques. Available for complex case consultations.',
    availableToday: true
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Interventional Radiology',
    department: 'Interventional Radiology',
    npi: '0987654321',
    email: 'mchen@demo.med.cornell.edu',
    phone: '(212) 555-0102',
    location: 'Main Building, 3rd Floor',
    affiliation: 'NYP',
    flags: ['urgent', 'research'],
    languages: ['English', 'Mandarin'],
    availableToday: true
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatric Ultrasound',
    department: 'Ultrasound',
    npi: '5678901234',
    email: 'erodriguez@demo.med.cornell.edu',
    phone: '(212) 555-0103',
    location: 'Children\'s Wing, 2nd Floor',
    affiliation: 'WCM',
    flags: ['teaching', 'multilingual'],
    languages: ['English', 'Spanish', 'Portuguese'],
    notes: 'Leading expert in pediatric ultrasound. Conducts weekly teaching sessions.',
    availableToday: true
  },
  {
    id: 4,
    name: 'Dr. James Thompson',
    specialty: 'Nuclear Medicine',
    department: 'Nuclear Medicine',
    npi: '3456789012',
    email: 'jthompson@demo.med.cornell.edu',
    phone: '(212) 555-0104',
    location: 'Nuclear Medicine Suite, B1',
    affiliation: 'NYP',
    notes: 'Currently on sabbatical. Dr. Williams covering.',
    availableToday: false
  }
]

// Demo Contacts
export const DEMO_CONTACTS: Contact[] = [
  {
    id: 1001,
    name: 'Radiology Main Desk',
    type: 'Facility',
    email: 'radiology@demo.med.cornell.edu',
    phone: '(212) 555-1000',
    department: 'Radiology',
    location: 'Main Building, 2nd Floor',
    lastContact: '2024-01-15'
  },
  {
    id: 1002,
    name: 'IT Support - Imaging',
    type: 'Vendor',
    email: 'imaging-it@demo.med.cornell.edu',
    phone: '(212) 555-4357',
    department: 'Information Technology',
    location: 'Remote Support',
    lastContact: '2024-01-14'
  },
  {
    id: 1003,
    name: 'Scheduling Coordinator',
    type: 'Facility',
    email: 'scheduling@demo.med.cornell.edu',
    phone: '(212) 555-7777',
    department: 'Patient Services',
    location: 'Main Building, 1st Floor',
    lastContact: '2024-01-13'
  },
  {
    id: 1004,
    name: 'Radiation Safety Officer',
    type: 'Government',
    email: 'rso@demo.med.cornell.edu',
    phone: '(212) 555-7234',
    department: 'Safety & Compliance',
    location: 'Administrative Building, Room 301',
    lastContact: '2024-01-10'
  }
]

// Demo statistics for dashboard
export const DEMO_STATS = {
  totalDocuments: 127,
  totalProviders: 48,
  activeProviders: 44,
  totalContacts: 89,
  recentActivity: [
    { id: '1', action: 'Document uploaded', details: 'New MRI protocol added', timestamp: '2 hours ago' },
    { id: '2', action: 'Provider updated', details: 'Dr. Chen profile modified', timestamp: '5 hours ago' },
    { id: '3', action: 'Form submitted', details: 'Safety screening completed', timestamp: '1 day ago' }
  ]
}

// Helper function to simulate data loading delay
export function simulateLoading<T>(data: T, delay: number = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}