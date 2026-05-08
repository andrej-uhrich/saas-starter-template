import { Header } from '@/components/layout/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <main className="saas-container py-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              SaaS Starter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Next.js 16, React 19, Tailwind, and Supabase auth wired up and
              ready to extend. Replace this landing page with your product.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="saas-button-primary text-lg px-8 py-3">
              Get started
            </a>
            <a
              href="/login"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-3 rounded-md transition-colors"
            >
              Sign in
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="saas-card">
              <h3 className="text-lg font-semibold mb-2">Auth out of the box</h3>
              <p className="text-gray-600 text-sm">
                Email/password sign up, login, password reset, and a Supabase
                session-aware proxy.
              </p>
            </div>

            <div className="saas-card">
              <h3 className="text-lg font-semibold mb-2">Tier-based access</h3>
              <p className="text-gray-600 text-sm">
                A small permissions layer gates features by subscription tier
                so you can lock pro/enterprise features quickly.
              </p>
            </div>

            <div className="saas-card">
              <h3 className="text-lg font-semibold mb-2">Typed data layer</h3>
              <p className="text-gray-600 text-sm">
                Hand-written Database type for the profiles table that you can
                replace with <code>supabase gen types</code> output later.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
