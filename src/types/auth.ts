import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Parameters passed to authentication callback functions
 * @interface AuthCallbackParams
 * 
 * @property {SupabaseClient} supabase - Initialized Supabase client instance
 * 
 * @example
 * ```ts
 * async function handleAuthCallback({ supabase }: AuthCallbackParams) {
 *   const { data: { session } } = await supabase.auth.getSession();
 *   return session;
 * }
 * ```
 */
export interface AuthCallbackParams {
  supabase: SupabaseClient
}

/**
 * Generic data structure for exports
 * @interface ExportData
 * 
 * @example
 * ```ts
 * const exportData: ExportData = {
 *   timestamp: new Date().toISOString(),
 *   format: "csv",
 *   records: [...],
 *   metadata: { version: "1.0" }
 * };
 * ```
 */
export interface ExportData {
  [key: string]: unknown
}

/**
 * Parsed user agent information for session tracking
 * @interface UserAgentInfo
 * 
 * @property {string} [device_type] - Type of device (e.g., "mobile", "desktop", "tablet")
 * @property {string} [device_name] - Specific device name (e.g., "iPhone 14", "Samsung Galaxy")
 * @property {string} [browser] - Full browser string with version
 * @property {string} [browser_name] - Browser name only (e.g., "Chrome", "Safari")
 * @property {string} [os_name] - Operating system name (e.g., "Windows 10", "macOS")
 * 
 * @example
 * ```ts
 * const userAgent: UserAgentInfo = {
 *   device_type: "mobile",
 *   device_name: "iPhone 14 Pro",
 *   browser: "Safari 16.3",
 *   browser_name: "Safari",
 *   os_name: "iOS 16.3"
 * };
 * ```
 */
export interface UserAgentInfo {
  device_type?: string
  device_name?: string
  browser?: string
  browser_name?: string
  os_name?: string
}

/**
 * Structured validation error information
 * @interface ValidationError
 * 
 * @property {string} message - Human-readable error message
 * @property {string} [code] - Machine-readable error code (e.g., "INVALID_EMAIL", "PASSWORD_TOO_SHORT")
 * @property {Record<string, unknown>} [details] - Additional error context or field-specific errors
 * 
 * @example
 * ```ts
 * const validationError: ValidationError = {
 *   message: "Form validation failed",
 *   code: "VALIDATION_ERROR",
 *   details: {
 *     email: "Invalid email format",
 *     password: "Password must be at least 8 characters"
 *   }
 * };
 * ```
 */
export interface ValidationError {
  message: string
  code?: string
  details?: Record<string, unknown>
}