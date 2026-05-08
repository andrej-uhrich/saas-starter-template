'use client'

import { useAuth } from '@/lib/auth/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome{user?.name ? `, ${user.name}` : ''}. Replace this page with your
          app&apos;s real dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="saas-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Next steps</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Run the SQL in <code>supabase-schema.sql</code></li>
            <li>Add your Supabase URL/key to <code>.env.local</code></li>
            <li>Replace this page with real content</li>
          </ul>
        </div>

        <div className="saas-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Auth wired up</h3>
          <p className="text-sm text-gray-600">
            Sign in / sign up / forgot &amp; reset password are all functional once
            Supabase is configured.
          </p>
        </div>

        <div className="saas-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Permissions</h3>
          <p className="text-sm text-gray-600">
            See <code>src/lib/auth/permissions.ts</code> for tier-gated feature
            access and per-tier resource limits.
          </p>
        </div>
      </div>
    </div>
  )
}
