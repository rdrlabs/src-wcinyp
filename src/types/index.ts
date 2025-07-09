// Document types
export interface Document {
  name: string;
  size: string;
  path: string;
  category?: string;
  lastUpdated?: string;
}

export interface DocumentCategories {
  [category: string]: Document[];
}

// Provider types
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