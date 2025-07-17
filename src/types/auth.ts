import type { SupabaseClient } from '@supabase/supabase-js'

export interface AuthCallbackParams {
  supabase: SupabaseClient
}

export interface ExportData {
  [key: string]: unknown
}

export interface UserAgentInfo {
  device_type?: string
  device_name?: string
  browser?: string
  browser_name?: string
  os_name?: string
}

export interface ValidationError {
  message: string
  code?: string
  details?: Record<string, unknown>
}