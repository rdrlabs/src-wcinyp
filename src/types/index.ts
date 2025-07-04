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

// Form template types
export interface FormTemplate {
  id: number;
  name: string;
  fields: number;
  lastUsed: string;
  submissions: number;
  status: 'active' | 'draft';
  category: string;
  description: string;
}

// Form submission types
export interface FormSubmission {
  formId: number;
  formName: string;
  data: Record<string, any>;
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