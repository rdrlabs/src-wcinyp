// Export all validation schemas and types from a single entry point

// Auth validations
export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  userProfileSchema,
  sessionSchema,
  accessRequestSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
  type UserProfile,
  type Session,
  type AccessRequest,
} from './auth';

// Contact validations
export {
  contactSchema,
  providerSchema,
  createContactSchema,
  updateContactSchema,
  contactSearchSchema,
  type Contact,
  type Provider,
  type CreateContactInput,
  type UpdateContactInput,
  type ContactSearchParams,
} from './contact';

// Document validations
export {
  documentSchema,
  documentCategoriesSchema,
  createDocumentSchema,
  updateDocumentSchema,
  documentSearchSchema,
  type Document,
  type DocumentCategories,
  type CreateDocumentInput,
  type UpdateDocumentInput,
  type DocumentSearchParams,
} from './document';

// Form validations
export {
  formFieldSchema,
  formTemplateSchema,
  formSubmissionSchema,
  createFormTemplateSchema,
  updateFormTemplateSchema,
  formFieldValidationSchema,
  type FormFieldType,
  type FormField,
  type FormTemplate,
  type FormSubmission,
  type CreateFormTemplateInput,
  type UpdateFormTemplateInput,
} from './form';