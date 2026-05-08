'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { PermissionLevel } from '@/types/auth'

// Extended User type with our custom profile data
interface AuthUser extends User {
  subscription_tier?: PermissionLevel
  subscription_status?: string
  name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Check if we're in a build environment
  const isBuildTime = typeof window === 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL

  const supabase = isBuildTime ? null : getSupabaseClient()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  // Only start in loading state if we have a Supabase client to query.
  const [loading, setLoading] = useState(() => supabase !== null)

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
      }
    }, 3000)

    return () => clearTimeout(timeout)
  }, [loading])


  // Fetch user profile data from our profiles table
  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!supabase) return null
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('Profile fetch error:', error)
        return null
      }

      return profile
    } catch (error) {
      console.warn('Profile fetch failed:', error)
      return null
    }
  }, [supabase])

  // Update user with profile data
  const updateUserWithProfile = useCallback(async (authUser: User) => {
    try {
      // Set user immediately to prevent loading hang
      setUser(authUser as AuthUser)
      setLoading(false)
      
      // Try to fetch profile in background, don't block UI
      fetchUserProfile(authUser.id)
        .then(profile => {
          if (profile) {
            const extendedUser: AuthUser = {
              ...authUser,
              subscription_tier: profile.subscription_tier as PermissionLevel,
              subscription_status: profile.subscription_status,
              ...(profile.name != null && { name: profile.name }),
              ...(profile.avatar_url != null && { avatar_url: profile.avatar_url }),
            }
            setUser(extendedUser)
          }
        })
        .catch(() => {
          // Silently fail, user is already set
        })
        
    } catch {
      setUser(authUser as AuthUser)
      setLoading(false)
    }
  }, [fetchUserProfile])

  // Refresh user data
  const refreshUser = async () => {
    if (!supabase) return
    
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (authUser) {
      await updateUserWithProfile(authUser)
    } else {
      setUser(null)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, name?: string) => {
    if (!supabase) return { error: new Error('Supabase not initialized') as any }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        }
      }
    })

    if (!error && data.user) {
      // Profile will be created automatically via database trigger
      await refreshUser()
    }

    return { error }
  }

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not initialized') as any }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error && data.user) {
      try {
        await updateUserWithProfile(data.user)
      } catch (profileError) {
        // If profile update fails, still allow login with basic user data
        console.warn('Profile update failed during login:', profileError)
        setUser(data.user as AuthUser)
        setLoading(false)
      }
    }

    return { error }
  }

  // Sign out function
  const signOut = async () => {
    if (!supabase) return { error: new Error('Supabase not initialized') as any }
    
    const { error } = await supabase.auth.signOut()
    
    if (!error) {
      setUser(null)
      setSession(null)
    }

    return { error }
  }

  // Listen for auth changes
  useEffect(() => {
    if (!supabase) {
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          await updateUserWithProfile(session.user)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [updateUserWithProfile, supabase])

  // Initial session check
  useEffect(() => {
    const getInitialSession = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setLoading(false)
          return
        }
        
        setSession(session)
        
        if (session?.user) {
          await updateUserWithProfile(session.user)
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch {
        setLoading(false)
      }
    }

    getInitialSession()
  }, [updateUserWithProfile, supabase])

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protected components
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-600 mb-8">
              Please log in to access this page.
            </p>
            <a
              href="/login"
              className="saas-button-primary"
            >
              Go to Login
            </a>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}