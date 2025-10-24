export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          name: string | null
          email: string | null
          date_of_birth: string | null
          age: number | null
          gender: string | null
          bio: string | null
          occupation: string | null
          location: Json | null
          height: number | null
          ethnicity: string | null
          religion: string | null
          zodiac_sign: string | null
          drinking: string | null
          looking_for: string | null
          relationship_type: string | null
          primary_goal: string | null
          interests: string[] | null
          photos: Json | null
          avatar_url: string | null
          is_premium: boolean | null
          premium_expires_at: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          created_at: string | null
          updated_at: string | null
          last_active_at: string | null
          is_admin: boolean | null
          is_banned: boolean | null
          ban_reason: string | null
          flagged_count: number | null
        }
        Insert: {
          id: string
          phone: string
          name?: string | null
          email?: string | null
          // ... other fields optional
        }
        Update: {
          phone?: string
          name?: string | null
          // ... all fields optional
        }
      }
      // ... other tables
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

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
