/**
 * Page Object Models for Test Abstraction
 * 
 * These page objects provide a stable interface for tests,
 * allowing UI changes without breaking tests.
 * 
 * Usage:
 * ```typescript
 * import { DocumentsPage } from '@/test/page-objects'
 * 
 * const documentsPage = new DocumentsPage()
 * await documentsPage.searchDocuments('ABN')
 * documentsPage.expectDocumentCount(5)
 * ```
 */

export { DocumentsPage } from './DocumentsPage'
export { FormBuilderPage } from './FormBuilderPage'
export { ProvidersPage } from './ProvidersPage'
export { FormsListPage } from './FormsListPage'

// Re-export types if needed
export type { DocumentsPage as DocumentsPageType } from './DocumentsPage'
export type { FormBuilderPage as FormBuilderPageType } from './FormBuilderPage'
export type { ProvidersPage as ProvidersPageType } from './ProvidersPage'
export type { FormsListPage as FormsListPageType } from './FormsListPage'