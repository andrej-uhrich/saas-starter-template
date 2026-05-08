'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useRouter } from 'next/navigation'

interface LoginButtonProps {
  email: string
  password: string
}

export function LoginButton({ email, password }: LoginButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: authError } = await signIn(email, password)

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email or password is incorrect')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address')
        } else {
          setError('Sign in failed. Please try again.')
        }
      } else {
        const urlParams = new URLSearchParams(window.location.search)
        const message = urlParams.get('message')

        if (message === 'password-updated') {
          router.push('/dashboard?message=password-reset-success')
        } else {
          router.push('/dashboard')
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        type="button"
        className="w-full saas-button-primary py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Signing in...</span>
          </div>
        ) : (
          'Sign in'
        )}
      </button>
    </div>
  )
}
