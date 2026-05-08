import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PermissionLevel } from '@/types/auth'

// shadcn/ui className merge helper.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Permission hierarchy used by checkPermission.
const PERMISSION_HIERARCHY: Record<PermissionLevel, number> = {
  [PermissionLevel.PUBLIC]: 0,
  [PermissionLevel.AUTHENTICATED]: 1,
  [PermissionLevel.BASIC]: 2,
  [PermissionLevel.PRO]: 3,
  [PermissionLevel.ENTERPRISE]: 4,
}

// True if userLevel is at least requiredLevel.
export function checkPermission(
  userLevel: PermissionLevel,
  requiredLevel: PermissionLevel
): boolean {
  return PERMISSION_HIERARCHY[userLevel] >= PERMISSION_HIERARCHY[requiredLevel]
}

export function formatDate(
  date: string | Date,
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatPrice(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function generateSecureFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}_${random}.${extension}`
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Initials for avatar fallbacks (up to 2 chars).
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<Args extends unknown[]>(
  func: (...args: Args) => unknown,
  wait: number
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return (...args: Args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
