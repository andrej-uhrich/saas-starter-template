// Permission tiers for role-based access control.
export enum PermissionLevel {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

// Application-level user representation. Mirrors the `profiles` table.
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  subscription_tier: PermissionLevel
  subscription_status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: User | null
  access_token?: string
  refresh_token?: string
  expires_at?: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  priority_support: boolean
  team_collaboration: boolean
}

// Map each gated feature to the minimum tier required to access it.
// Adjust the keys as you add features to the app.
export interface FeaturePermissions {
  analytics_view: PermissionLevel
  team_collaboration: PermissionLevel
  export_data: PermissionLevel
  custom_branding: PermissionLevel
  api_access: PermissionLevel
}
