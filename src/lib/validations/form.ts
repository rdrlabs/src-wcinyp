import { z } from 'zod';

// Form field types enum
const formFieldTypes = z.enum([
  'text',
  'email',
  'phone',
  'date',
  'select',
  'checkbox',
  'textarea',
  'tel',
  'radio',
  'file',
  'signature',
  'number'
]);

// Form field schema
export const formFieldSchema = z.object({
  id: z.string().min(1, 'Field ID is required'),
  name: z.string().optional(), // Optional for backward compatibility
  label: z.string().min(1, 'Field label is required'),
  type: formFieldTypes,
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

// Form template schema
export const formTemplateSchema = z.object({
  id: z.union([z.string(), z.number()]), // Allow both for compatibility
  name: z.string().min(1, 'Form name is required').max(255),
  fields: z.union([
    z.array(formFieldSchema),
    z.number().int().positive() // For field count
  ]),
  lastUsed: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  submissions: z.number().int().min(0),
  status: z.enum(['active', 'draft']),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(500),
});

// Form submission schema
export const formSubmissionSchema = z.object({
  id: z.string().uuid(),
  formTemplateId: z.string(),
  data: z.record(z.unknown()),
  submittedAt: z.string().datetime(),
});

// Create form template input schema
export const createFormTemplateSchema = formTemplateSchema.omit({ 
  id: true, 
  lastUsed: true, 
  submissions: true 
}).extend({
  fields: z.array(formFieldSchema) // Only accept array for creation
});

// Update form template input schema
export const updateFormTemplateSchema = formTemplateSchema.partial().required({ id: true });

// Form field validation for runtime validation
export const formFieldValidationSchema = z.object({
  text: z.string().max(500),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\d\s\-\(\)\+\.]+$/, 'Invalid phone number'),
  tel: z.string().regex(/^[\d\s\-\(\)\+\.]+$/, 'Invalid phone number'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  number: z.number().or(z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number')),
  checkbox: z.boolean(),
  radio: z.string(),
  select: z.string(),
  textarea: z.string().max(2000),
  file: z.any(), // File validation would be handled separately
  signature: z.string().min(1, 'Signature is required'),
});

// Export types
export type FormFieldType = z.infer<typeof formFieldTypes>;
export type FormField = z.infer<typeof formFieldSchema>;
export type FormTemplate = z.infer<typeof formTemplateSchema>;
export type FormSubmission = z.infer<typeof formSubmissionSchema>;
export type CreateFormTemplateInput = z.infer<typeof createFormTemplateSchema>;
export type UpdateFormTemplateInput = z.infer<typeof updateFormTemplateSchema>;