import { PermissionLevel, type FeaturePermissions } from '@/types/auth'
import { checkPermission } from '@/lib/utils'

// Minimum tier required to access each gated feature.
// Adjust as you build out the app.
export const FEATURE_PERMISSIONS: FeaturePermissions = {
  analytics_view: PermissionLevel.PRO,
  team_collaboration: PermissionLevel.PRO,
  export_data: PermissionLevel.PRO,
  custom_branding: PermissionLevel.ENTERPRISE,
  api_access: PermissionLevel.ENTERPRISE,
}

export function hasFeatureAccess(
  userLevel: PermissionLevel,
  feature: keyof FeaturePermissions
): boolean {
  return checkPermission(userLevel, FEATURE_PERMISSIONS[feature])
}

// Per-tier resource limits. Use -1 to mean "unlimited".
// Add or rename keys to match the resources your app tracks.
export const SUBSCRIPTION_LIMITS = {
  [PermissionLevel.PUBLIC]: {
    maxItems: 0,
    maxProjects: 0,
    maxTeamMembers: 0,
    storageGB: 0,
  },
  [PermissionLevel.AUTHENTICATED]: {
    maxItems: 3,
    maxProjects: 1,
    maxTeamMembers: 0,
    storageGB: 0.1,
  },
  [PermissionLevel.BASIC]: {
    maxItems: 25,
    maxProjects: 3,
    maxTeamMembers: 0,
    storageGB: 1,
  },
  [PermissionLevel.PRO]: {
    maxItems: -1,
    maxProjects: -1,
    maxTeamMembers: 10,
    storageGB: 10,
  },
  [PermissionLevel.ENTERPRISE]: {
    maxItems: -1,
    maxProjects: -1,
    maxTeamMembers: -1,
    storageGB: 100,
  },
} as const

type LimitKey = keyof typeof SUBSCRIPTION_LIMITS[PermissionLevel.BASIC]

export function isWithinLimit(
  userLevel: PermissionLevel,
  resource: LimitKey,
  currentCount: number
): boolean {
  const limit = SUBSCRIPTION_LIMITS[userLevel][resource]
  if (limit === -1) return true
  return currentCount < limit
}

export function getRemainingCount(
  userLevel: PermissionLevel,
  resource: LimitKey,
  currentCount: number
): number | null {
  const limit = SUBSCRIPTION_LIMITS[userLevel][resource]
  if (limit === -1) return null
  return Math.max(0, limit - currentCount)
}
