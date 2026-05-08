'use client'

import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = getSupabaseClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        if (resetError.message.includes('Unable to validate email address')) {
          setError('That email address is invalid')
        } else {
          setError('Could not send reset email. Please try again.')
        }
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
          <div className="text-green-600 text-lg font-medium mb-2">
            Email sent
          </div>
          <p className="text-green-700 text-sm mb-4">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
          </p>
          <p className="text-green-700 text-xs">
            Check your spam folder if you don&apos;t see it.
          </p>
        </div>

        <div className="text-center">
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset your password
        </h2>
        <p className="text-sm text-gray-600">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full saas-button-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </div>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <div className="text-center">
        <Link href="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
