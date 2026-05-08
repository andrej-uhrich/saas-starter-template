import type { ReactNode } from 'react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              SaaS Starter
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in or create an account to continue
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
