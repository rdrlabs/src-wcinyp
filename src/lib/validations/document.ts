import { z } from 'zod';

// Document schema
export const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required').max(255),
  size: z.string().regex(/^\d+(\.\d+)?\s*(B|KB|MB|GB)$/i, 'Invalid file size format'),
  path: z.string().min(1, 'File path is required'),
  category: z.string().optional(),
  lastUpdated: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

// Document categories schema
export const documentCategoriesSchema = z.record(z.string(), z.array(documentSchema));

// Create document input schema
export const createDocumentSchema = documentSchema.omit({ size: true, lastUpdated: true });

// Update document input schema
export const updateDocumentSchema = documentSchema.partial();

// Document search/filter schema
export const documentSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.enum(['name', 'size', 'lastUpdated', 'category']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

// Export types
export type Document = z.infer<typeof documentSchema>;
export type DocumentCategories = z.infer<typeof documentCategoriesSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type DocumentSearchParams = z.infer<typeof documentSearchSchema>;