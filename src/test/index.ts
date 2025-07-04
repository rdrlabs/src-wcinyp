/**
 * Central export for all test utilities
 * 
 * This provides a single import point for all testing utilities,
 * making tests cleaner and more maintainable.
 * 
 * Usage:
 * ```typescript
 * import { 
 *   DocumentsPage, 
 *   createMockDocument, 
 *   createPageTests,
 *   renderWithProviders 
 * } from '@/test'
 * ```
 */

// Re-export test factories
export * from './mocks/factories'

// Re-export test utilities
export * from './utils'

// Re-export test patterns
export * from './patterns'

// Convenience exports for common combinations
export {
  // Common factories
  createMockDocument,
  createMockFormTemplate,
  createMockProvider,
  createMockContact,
  createMockFormSubmission,
  createMockFormField,
  createMockFormWithFields,
  createMockUserData,
  createMockApiResponse,
  createPaginatedData,
  createLoadingState,
  createErrorState,
  createSuccessState,
  createMockFile,
  createRealisticDocumentData,
  createDocumentSet,
  createFormWithValidation,
  createProviderDirectory,
  createErrorScenario
} from './mocks/factories'

export {
  // Test patterns
  createPageTests,
  createLoadingPageTest,
  createErrorPageTest
} from './patterns'

// Type exports for better IDE support
export type {
  Document,
  FormTemplate,
  Provider,
  Contact,
  FormSubmission,
  FormField
} from './mocks/factories'