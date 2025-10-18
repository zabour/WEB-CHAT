import { createClient } from '@supabase/supabase-js'

// Supabase configuration - now using the actual MGX Supabase instance
const supabaseUrl = 'https://bnzjtsfaqdsrwprtjpnc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuemp0c2ZhcWRzcndwcnRqcG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzg2NzMsImV4cCI6MjA3NDkxNDY3M30.wGEvqyIOXqgM_nPmdZUAKPlG1GwRIOM-RUb2gDSVBNk'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase is now configured
export const isSupabaseConfigured = () => true

export type Database = {
  public: {
    Tables: {
      app_227ebbfd7d_profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          avatar_url: string | null
          status: string
          last_seen: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          status?: string
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          status?: string
          last_seen?: string
          created_at?: string
          updated_at?: string
        }
      }
      app_227ebbfd7d_contacts: {
        Row: {
          id: string
          user_id: string
          contact_user_id: string
          contact_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contact_user_id: string
          contact_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contact_user_id?: string
          contact_name?: string | null
          created_at?: string
        }
      }
      app_227ebbfd7d_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          avatar_url: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          avatar_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          avatar_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      app_227ebbfd7d_group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      app_227ebbfd7d_messages: {
        Row: {
          id: string
          sender_id: string
          chat_id: string
          chat_type: 'contact' | 'group'
          content: string
          message_type: 'text' | 'image' | 'file'
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          chat_id: string
          chat_type: 'contact' | 'group'
          content: string
          message_type?: 'text' | 'image' | 'file'
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          chat_id?: string
          chat_type?: 'contact' | 'group'
          content?: string
          message_type?: 'text' | 'image' | 'file'
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}