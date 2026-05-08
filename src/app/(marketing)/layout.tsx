import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'

export default function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Header />
      {children}

      <footer className="bg-gray-900 text-white">
        <div className="saas-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SaaS Starter</h3>
              <p className="text-gray-400 text-sm">
                Replace this footer with your product copy.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/login" className="hover:text-white">Sign in</a></li>
                <li><a href="/register" className="hover:text-white">Get started</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
