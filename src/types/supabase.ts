// This file will be automatically generated when you run:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
// For now, we'll use a minimal type definition

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          net_id: string
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          net_id: string
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          net_id?: string
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      pending_auth_sessions: {
        Row: {
          id: string
          session_token: string
          email: string
          device_info: string | null
          device_fingerprint: string | null
          is_authenticated: boolean
          authenticated_at: string | null
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          session_token?: string
          email: string
          device_info?: string | null
          device_fingerprint?: string | null
          is_authenticated?: boolean
          authenticated_at?: string | null
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          session_token?: string
          email?: string
          device_info?: string | null
          device_fingerprint?: string | null
          is_authenticated?: boolean
          authenticated_at?: string | null
          created_at?: string
          expires_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}