import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r min-h-screen p-6">
          <nav className="space-y-2">
            <a href="/dashboard" className="block px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
              Dashboard
            </a>
            <a href="/profile" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              Profile
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
