'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { getInitials } from '@/lib/utils'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const { user, signOut, loading, refreshUser } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [nameError, setNameError] = useState('')

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
    } catch {
      // Silently handle logout errors
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleNameEdit = () => {
    setNewName(user?.name || '')
    setNameError('')
    setIsEditingName(true)
  }

  const handleNameCancel = () => {
    setNewName(user?.name || '')
    setNameError('')
    setIsEditingName(false)
  }

  const handleNameSave = async () => {
    if (!newName.trim()) {
      setNameError('Name cannot be empty')
      return
    }

    if (!user?.id) {
      setNameError('Not signed in')
      return
    }

    setIsUpdatingName(true)
    setNameError('')

    try {
      const supabase = getSupabaseClient()

      // Try to update the existing profile row.
      const { error: profileError, data: profileData } = await supabase
        .from('profiles')
        .update({
          name: newName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()

      // If no row was updated, the profile doesn't exist yet; insert it.
      if (!profileError && (!profileData || profileData.length === 0)) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            name: newName.trim(),
          })
          .select()

        if (insertError) {
          setNameError(`Could not create profile: ${insertError.message}`)
          return
        }
      } else if (profileError) {
        setNameError(`Database error: ${profileError.message}`)
        return
      }

      // Mirror the name into auth user metadata.
      await supabase.auth.updateUser({
        data: { name: newName.trim() },
      })

      await refreshUser()
      setIsEditingName(false)
    } catch {
      setNameError('Could not update your name')
    } finally {
      setIsUpdatingName(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in all fields')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    setIsUpdatingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')

    try {
      const supabase = getSupabaseClient()

      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      })

      if (updateError) {
        if (updateError.message.includes('Password should be at least 6 characters')) {
          setPasswordError('New password must be at least 6 characters')
        } else {
          setPasswordError('Could not change password. Please try again.')
        }
        return
      }

      setPasswordSuccess('Password updated successfully')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setIsChangingPassword(false)
    } catch {
      setPasswordError('Could not change password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Not signed in
        </h1>
        <p className="text-gray-600 mb-8">
          Please sign in to view your profile.
        </p>
        <a href="/login" className="saas-button-primary">
          Go to sign in
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Info */}
        <div className="px-6 py-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {user.name ? getInitials(user.name) : user.email ? getInitials(user.email) : 'U'}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  {isEditingName ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Full name"
                      />
                      {nameError && (
                        <p className="text-red-600 text-sm">{nameError}</p>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={handleNameSave}
                          disabled={isUpdatingName}
                          className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-md disabled:opacity-50"
                        >
                          {isUpdatingName ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleNameCancel}
                          disabled={isUpdatingName}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-gray-900">
                        {user.name || 'Not set'}
                      </span>
                      <button
                        onClick={handleNameEdit}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.email}
                  </div>
                </div>

                {/* Subscription Tier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                      {user.subscription_tier || 'free'}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      user.subscription_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : user.subscription_status === 'canceled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.subscription_status || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="px-6 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Change password</h3>
              <p className="text-sm text-gray-600">Update your password to stay secure</p>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="saas-button-primary"
              >
                Change password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-600 text-sm">{passwordSuccess}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="saas-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPassword ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Update password'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    setPasswordError('')
                    setPasswordSuccess('')
                  }}
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Account created on {new Date(user.created_at).toLocaleDateString()}
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium px-4 py-2 rounded-md transition-colors"
            >
              {isLoggingOut ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  <span>Signing out...</span>
                </div>
              ) : (
                'Sign out'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
