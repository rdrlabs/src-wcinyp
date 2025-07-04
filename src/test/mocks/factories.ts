import { faker } from '@faker-js/faker'
import { vi } from 'vitest'

// Types for better type safety
export interface Document {
  name: string
  size: string
  path: string
}

export interface FormTemplate {
  id: number
  name: string
  fields: number
  lastUsed: string
  submissions: number
  status: 'active' | 'draft' | 'archived'
  category: string
  description: string
}

export interface Provider {
  id: number
  name: string
  specialty: string
  department: string
  location: string
  phone: string
  email: string
}

export interface Contact {
  id: number
  name: string
  department: string
  role: string
  location: string
  phone: string
  email: string
}

export interface FormSubmission {
  id: string
  formId: number
  submittedAt: string
  status: 'pending' | 'completed' | 'rejected'
  data: Record<string, unknown>
}

export interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'checkbox' | 'textarea' | 'signature'
  required: boolean
  placeholder?: string
  options?: string[]
  validation?: Record<string, string | number | boolean | RegExp>
}

// Document factory
export const createMockDocument = (overrides: Partial<Document> = {}): Document => ({
  name: faker.system.fileName({ extensionCount: 0 }) + '.pdf',
  size: faker.helpers.arrayElement(['83 KB', '128 KB', '245 KB', '157 KB']),
  path: faker.system.filePath(),
  ...overrides,
})

// Form template factory
export const createMockFormTemplate = (overrides: Partial<FormTemplate> = {}): FormTemplate => ({
  id: faker.number.int({ min: 1, max: 100 }),
  name: faker.helpers.arrayElement([
    'Patient Intake Form',
    'Self Pay Waiver Form',
    'Insurance Verification Form',
    'Medical History Form',
  ]),
  fields: faker.number.int({ min: 5, max: 20 }),
  lastUsed: faker.date.recent().toISOString().split('T')[0],
  submissions: faker.number.int({ min: 0, max: 1000 }),
  status: faker.helpers.arrayElement(['active', 'draft', 'archived']) as 'active' | 'draft' | 'archived',
  category: faker.helpers.arrayElement(['Financial', 'Registration', 'Medical', 'Administrative']),
  description: faker.lorem.sentence(),
  ...overrides,
})

// Provider factory
export const createMockProvider = (overrides: Partial<Provider> = {}): Provider => ({
  id: faker.number.int({ min: 1, max: 100 }),
  name: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
  specialty: faker.helpers.arrayElement(['Radiology', 'Cardiology', 'Neurology', 'Orthopedics']),
  department: faker.helpers.arrayElement(['Imaging', 'Emergency', 'Surgery', 'Outpatient']),
  location: faker.helpers.arrayElement(['61st Street', 'Broadway', 'Beekman', 'LIC']),
  phone: faker.phone.number({ style: 'human' }),
  email: faker.internet.email({ provider: 'wcinyp.org' }),
  ...overrides,
})

// Contact factory
export const createMockContact = (overrides: Partial<Contact> = {}): Contact => ({
  id: faker.number.int({ min: 1, max: 100 }),
  name: faker.person.fullName(),
  department: faker.helpers.arrayElement(['Administration', 'IT', 'HR', 'Clinical', 'Finance']),
  role: faker.person.jobTitle(),
  location: faker.helpers.arrayElement(['Main Campus', 'East Wing', 'West Wing', 'Annex']),
  phone: faker.phone.number({ style: 'human' }),
  email: faker.internet.email(),
  ...overrides,
})

// Form submission factory
export const createMockFormSubmission = (overrides: Partial<FormSubmission> = {}): FormSubmission => ({
  id: faker.string.uuid(),
  formId: faker.number.int({ min: 1, max: 10 }),
  submittedAt: faker.date.recent().toISOString(),
  status: faker.helpers.arrayElement(['pending', 'completed', 'rejected']) as 'pending' | 'completed' | 'rejected',
  data: {
    patientName: faker.person.fullName(),
    dateOfBirth: faker.date.birthdate().toISOString().split('T')[0],
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'human' }),
  },
  ...overrides,
})

// Scenario builders for complex test data
export const createDocumentSet = (options: { count?: number; categories?: string[] } = {}) => {
  const { count = 10, categories = ['ABN Forms', 'Patient Questionnaires', 'Administrative Forms'] } = options
  
  const documents: Record<string, Document[]> = {}
  
  categories.forEach(category => {
    documents[category] = Array.from({ length: Math.floor(count / categories.length) }, () =>
      createMockDocument()
    )
  })
  
  return { categories: documents }
}

export const createFormWithValidation = () => {
  return {
    id: 1,
    name: 'Patient Registration Form',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        validation: { minLength: 2, maxLength: 100 },
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      },
      {
        id: 'dob',
        type: 'date',
        label: 'Date of Birth',
        required: true,
        validation: { max: new Date().toISOString().split('T')[0] },
      },
    ],
  }
}

export const createProviderDirectory = (count: number = 8) => {
  return Array.from({ length: count }, () => createMockProvider())
}

export const createErrorScenario = (type: 'network' | 'validation' | 'server' = 'network') => {
  const errors = {
    network: new Error('Network request failed'),
    validation: new Error('Validation failed: Invalid input'),
    server: new Error('Internal server error'),
  }
  
  return {
    error: errors[type],
    retry: vi.fn(),
  }
}

// Helper to create consistent test data matching the actual app data
export const createRealisticDocumentData = () => ({
  categories: {
    'ABN Forms': [
      { name: 'ABN - 55th Street.pdf', size: '83 KB', path: 'ABN/ABN - 55th Street.pdf' },
      { name: 'ABN - 61st Street.pdf', size: '83 KB', path: 'ABN/ABN - 61st Street.pdf' },
    ],
    'Patient Questionnaires': [
      { name: 'Biopsy Questionnaire.pdf', size: '175 KB', path: 'Biopsy Questionnaire.pdf' },
      { name: 'CT Questionnaire.pdf', size: '93 KB', path: 'CT Questionnaire.pdf' },
    ],
  },
})

// Additional factory functions for comprehensive testing

// Create a form field with all properties
export const createMockFormField = (overrides: Partial<FormField> = {}): FormField => ({
  id: `field_${faker.number.int({ min: 1, max: 100 })}`,
  name: faker.helpers.arrayElement(['Patient Name', 'Date of Birth', 'Insurance ID', 'Phone Number']),
  type: faker.helpers.arrayElement(['text', 'email', 'phone', 'date', 'select', 'checkbox', 'textarea', 'signature']) as FormField['type'],
  required: faker.datatype.boolean(),
  placeholder: faker.lorem.sentence(),
  options: overrides.type === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
  ...overrides,
})

// Create a complete form with fields
export const createMockFormWithFields = (fieldCount: number = 5) => {
  const template = createMockFormTemplate({ fields: fieldCount })
  const fields = Array.from({ length: fieldCount }, (_, i) => 
    createMockFormField({ 
      id: `field_${i + 1}`,
      name: `Field ${i + 1}`,
      required: i === 0 // First field always required
    })
  )
  
  return {
    ...template,
    formFields: fields
  }
}

// Create test user data
export const createMockUserData = () => ({
  patientName: faker.person.fullName(),
  dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0],
  email: faker.internet.email(),
  phone: faker.phone.number({ style: 'human' }),
  insuranceProvider: faker.helpers.arrayElement(['Aetna', 'Blue Cross', 'Cigna', 'United Health']),
  insuranceId: faker.string.alphanumeric(10).toUpperCase(),
  preferredLocation: faker.helpers.arrayElement(['61st Street', 'Broadway', 'Beekman', 'LIC']),
})

// Create mock API responses
export const createMockApiResponse = <T>(data: T, options: { success?: boolean; delay?: number } = {}) => {
  const { success = true, delay = 0 } = options
  
  return {
    promise: new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve(data)
        } else {
          reject(new Error('API request failed'))
        }
      }, delay)
    }),
    mockImplementation: vi.fn().mockResolvedValue(data),
  }
}

// Create paginated data
export const createPaginatedData = <T>(
  itemFactory: () => T,
  options: { page?: number; pageSize?: number; total?: number } = {}
) => {
  const { page = 1, pageSize = 10, total = 50 } = options
  const items = Array.from({ length: pageSize }, itemFactory)
  
  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page < Math.ceil(total / pageSize),
      hasPrev: page > 1,
    },
  }
}

// Create test scenarios for different states
export const createLoadingState = () => ({
  isLoading: true,
  error: null,
  data: null,
})

export const createErrorState = (message: string = 'Something went wrong') => ({
  isLoading: false,
  error: new Error(message),
  data: null,
})

export const createSuccessState = <T>(data: T) => ({
  isLoading: false,
  error: null,
  data,
})

// Mock file for upload testing
export const createMockFile = (options: { name?: string; size?: number; type?: string } = {}) => {
  const { 
    name = faker.system.fileName(), 
    size = faker.number.int({ min: 1000, max: 5000000 }), 
    type = 'application/pdf' 
  } = options
  
  const file = new File(['mock content'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  
  return file
}