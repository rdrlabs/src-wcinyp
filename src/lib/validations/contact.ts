import { z } from 'zod';

// Base contact schema
export const contactSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required').max(255),
  type: z.enum([
    'Provider',
    'Facility',
    'Insurance',
    'Lab',
    'Vendor',
    'Government',
    'Location',
    'ReferringProvider'
  ]),
  department: z.string().min(1, 'Department is required').max(255),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s\-\(\)\+\.]+$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  location: z.string().min(1, 'Location is required').max(255),
  lastContact: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

// Provider-specific schema (extends contact)
export const providerSchema = contactSchema.extend({
  type: z.literal('Provider'),
  specialty: z.string().min(1, 'Specialty is required').max(255),
  npi: z.string().regex(/^\d{10}$/, 'NPI must be exactly 10 digits').optional(),
  affiliation: z.enum(['WCM', 'NYP', 'NYP-Affiliate', 'NYP/Columbia', 'Private', 'BTC', 'WCCC']).optional(),
  flags: z.array(z.enum(['vip', 'urgent', 'new', 'teaching', 'research', 'multilingual'])).optional(),
  languages: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  availableToday: z.boolean().optional(),
});

// Create contact input schema (for forms)
export const createContactSchema = contactSchema.omit({ id: true, lastContact: true });

// Update contact input schema (for forms)
export const updateContactSchema = contactSchema.partial().required({ id: true });

// Search/filter schema
export const contactSearchSchema = z.object({
  query: z.string().optional(),
  type: contactSchema.shape.type.optional(),
  department: z.string().optional(),
  sortBy: z.enum(['name', 'type', 'department', 'lastContact']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

// Export types
export type Contact = z.infer<typeof contactSchema>;
export type Provider = z.infer<typeof providerSchema>;
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ContactSearchParams = z.infer<typeof contactSearchSchema>;