// Document types

/**
 * Represents a document in the system
 * @interface Document
 * 
 * @property {string} name - The document filename or title
 * @property {string} size - File size (e.g., "2.5 MB")
 * @property {string} path - Relative or absolute path to the document
 * @property {string} [category] - Document category for organization
 * @property {string} [lastUpdated] - ISO date string of last modification
 * 
 * @example
 * ```ts
 * const document: Document = {
 *   name: "Patient_Consent_Form.pdf",
 *   size: "1.2 MB",
 *   path: "/documents/forms/consent.pdf",
 *   category: "Forms",
 *   lastUpdated: "2024-01-15T10:30:00Z"
 * };
 * ```
 */
export interface Document {
  name: string;
  size: string;
  path: string;
  category?: string;
  lastUpdated?: string;
}

/**
 * Map of document categories to their documents
 * @interface DocumentCategories
 * 
 * @example
 * ```ts
 * const categories: DocumentCategories = {
 *   "Forms": [consent, hipaa],
 *   "Reports": [annual, quarterly],
 *   "Policies": [privacy, security]
 * };
 * ```
 */
export interface DocumentCategories {
  [category: string]: Document[];
}

// Provider types

/**
 * Healthcare provider information
 * @interface Provider
 * 
 * @property {number} id - Unique provider identifier
 * @property {string} name - Provider's full name
 * @property {string} specialty - Medical specialty (e.g., "Cardiology", "Pediatrics")
 * @property {string} department - Department or division
 * @property {string} phone - Contact phone number
 * @property {string} email - Contact email address
 * @property {string} location - Office location or address
 * @property {string} [npi] - National Provider Identifier (10-digit)
 * @property {'WCM' | 'NYP' | 'NYP-Affiliate' | 'NYP/Columbia' | 'Private' | 'BTC' | 'WCCC'} [affiliation] - Institutional affiliation
 * @property {Array<'vip' | 'urgent' | 'new' | 'teaching' | 'research' | 'multilingual'>} [flags] - Special flags/attributes
 * @property {string[]} [languages] - Languages spoken by provider
 * @property {string} [notes] - Additional notes or comments
 * @property {boolean} [availableToday] - Whether provider has availability today
 * 
 * @example
 * ```ts
 * const provider: Provider = {
 *   id: 12345,
 *   name: "Dr. Jane Smith",
 *   specialty: "Cardiology",
 *   department: "Internal Medicine",
 *   phone: "(212) 555-1234",
 *   email: "jsmith@hospital.org",
 *   location: "Building A, Floor 3",
 *   npi: "1234567890",
 *   affiliation: "WCM",
 *   flags: ["teaching", "multilingual"],
 *   languages: ["English", "Spanish", "Mandarin"],
 *   availableToday: true
 * };
 * ```
 */
export interface Provider {
  id: number;
  name: string;
  specialty: string;
  department: string;
  phone: string;
  email: string;
  location: string;
  npi?: string;
  affiliation?: 'WCM' | 'NYP' | 'NYP-Affiliate' | 'NYP/Columbia' | 'Private' | 'BTC' | 'WCCC';
  flags?: Array<'vip' | 'urgent' | 'new' | 'teaching' | 'research' | 'multilingual'>;
  languages?: string[];
  notes?: string;
  availableToday?: boolean;
}

// Contact types

/**
 * Contact information for various entities in the healthcare system
 * @interface Contact
 * 
 * @property {number} id - Unique contact identifier
 * @property {string} name - Contact name (person or organization)
 * @property {'Provider' | 'Facility' | 'Insurance' | 'Lab' | 'Vendor' | 'Government'} type - Type of contact
 * @property {string} department - Associated department
 * @property {string} phone - Contact phone number
 * @property {string} email - Contact email address
 * @property {string} location - Physical location or address
 * @property {string} lastContact - ISO date string of last contact
 * 
 * @example
 * ```ts
 * const contact: Contact = {
 *   id: 789,
 *   name: "Quest Diagnostics Lab",
 *   type: "Lab",
 *   department: "Laboratory Services",
 *   phone: "(800) 555-LAB1",
 *   email: "results@questlab.com",
 *   location: "123 Lab Street, Suite 100",
 *   lastContact: "2024-01-10T14:00:00Z"
 * };
 * ```
 */
export interface Contact {
  id: number;
  name: string;
  type: 'Provider' | 'Facility' | 'Insurance' | 'Lab' | 'Vendor' | 'Government';
  department: string;
  phone: string;
  email: string;
  location: string;
  lastContact: string;
}

// Form field types

/**
 * Represents a field in a dynamic form
 * @interface FormField
 * 
 * @property {string} id - Unique field identifier
 * @property {string} [name] - Field name attribute (optional for backward compatibility)
 * @property {string} label - Display label for the field
 * @property {string} type - Input type for the field
 * @property {boolean} required - Whether the field is required
 * @property {string} [placeholder] - Placeholder text for input fields
 * @property {string[]} [options] - Options for select/radio fields
 * 
 * @example
 * ```ts
 * const textField: FormField = {
 *   id: "patient_name",
 *   name: "patientName",
 *   label: "Patient Name",
 *   type: "text",
 *   required: true,
 *   placeholder: "Enter patient's full name"
 * };
 * 
 * const selectField: FormField = {
 *   id: "appointment_type",
 *   label: "Appointment Type",
 *   type: "select",
 *   required: true,
 *   options: ["New Patient", "Follow-up", "Consultation"]
 * };
 * ```
 */
export interface FormField {
  id: string;
  name?: string; // Optional for backward compatibility
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'checkbox' | 'textarea' | 'tel' | 'radio' | 'file' | 'signature' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

// Form template types
export interface FormTemplate {
  id: string | number; // Allow both for compatibility
  name: string;
  fields: FormField[] | number; // Allow both: array of fields or field count
  lastUsed: string;
  submissions: number;
  status: 'active' | 'draft';
  category: string;
  description: string;
}

// JSON data types (for compatibility with existing data files)
export interface FormTemplateJSON {
  id: number;
  name: string;
  fields: number;
  lastUsed: string;
  submissions: number;
  status: string;
  category: string;
  description: string;
}

// Form submission types
export interface FormSubmission {
  id: string;
  formTemplateId: string;
  data: Record<string, unknown>;
  submittedAt: string;
}

// API Response types

/**
 * Generic API response wrapper
 * @interface ApiResponse
 * @template T - Type of the response data
 * 
 * @property {boolean} success - Whether the API call was successful
 * @property {T} [data] - Response data (present on success)
 * @property {string} [error] - Error message (present on failure)
 * 
 * @example
 * ```ts
 * // Success response
 * const successResponse: ApiResponse<Provider[]> = {
 *   success: true,
 *   data: [provider1, provider2]
 * };
 * 
 * // Error response
 * const errorResponse: ApiResponse<never> = {
 *   success: false,
 *   error: "Failed to fetch providers: Network error"
 * };
 * ```
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  category?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationParams;
}