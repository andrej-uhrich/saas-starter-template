// Re-export Database types for convenient imports.
import type { Database } from '@/types/database'
export type { Database } from '@/types/database'

// Type helpers for Supabase queries.
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Convenience aliases for the profiles table.
export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

// Generic query response shapes.
export type QueryResponse<T> = {
  data: T | null
  error: Error | null
}

export type QueryArrayResponse<T> = {
  data: T[] | null
  error: Error | null
}
