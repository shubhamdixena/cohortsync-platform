"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "./supabase"

type UserRole = "MEMBER" | "ADMIN"

interface UserInfo {
  id: string
  name: string
  initials: string
  email: string
  role: UserRole
  avatar?: string | null
  bio?: string | null
  profile?: {
    title?: string
    headline?: string
    bio?: string
    [key: string]: any
  }
}

interface UserContextType {
  currentRole: UserRole
  setCurrentRole: (role: UserRole) => void
  userInfo: UserInfo | null
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("MEMBER")
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Fetch current user from database
  const fetchUser = async () => {
    try {
      console.log('fetchUser: Starting user fetch...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      console.log('fetchUser: Auth check result', { 
        hasUser: !!user, 
        userId: user?.id,
        authError: authError?.message 
      })
      
      if (!user) {
        console.log('fetchUser: No authenticated user')
        // Clear cached user data when logged out
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cohort_user_data')
        }
        setUserInfo(null)
        setIsLoading(false)
        return
      }

      console.log('fetchUser: Authenticated as', user.id, 'fetching from /api/users/me...')
      const response = await fetch('/api/users/me')
      
      console.log('fetchUser: API response status:', response.status)
      
      if (response.ok) {
        const userData = await response.json()
        const name = userData.name || 'User'
        const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        console.log('User data fetched:', { 
          id: userData.id, 
          email: userData.email,
          name: userData.name,
          role: userData.role,
          roleType: typeof userData.role,
          hasProfile: !!userData.profile
        })
        const userObj = {
          id: userData.id,
          name: name,
          initials: initials,
          email: userData.email,
          role: userData.role as UserRole,
          avatar: userData.avatar,
          bio: userData.bio,
          profile: userData.profile || undefined
        }
        setUserInfo(userObj)
        setCurrentRole(userData.role as UserRole)
        console.log('Role set to:', userData.role)
        
        // Cache user data for faster future loads
        if (typeof window !== 'undefined') {
          localStorage.setItem('cohort_user_data', JSON.stringify(userObj))
        }
      } else {
        let errorData;
        try {
          const text = await response.text();
          try {
            errorData = JSON.parse(text);
          } catch {
            errorData = { error: text || response.statusText };
          }
        } catch (e) {
          errorData = { error: 'Failed to read response' };
        }
        console.error('fetchUser: API error', { status: response.status, error: errorData })
        
        // Try to use cached data if API fails
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('cohort_user_data')
          if (cached) {
            try {
              const cachedUser = JSON.parse(cached)
              console.log('Using cached user data:', cachedUser)
              setUserInfo(cachedUser)
              setCurrentRole(cachedUser.role as UserRole)
            } catch (e) {
              console.error('Failed to parse cached user data:', e)
              setUserInfo(null)
            }
          } else {
            setUserInfo(null)
          }
        } else {
          setUserInfo(null)
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      
      // Try to use cached data on error
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cohort_user_data')
        if (cached) {
          try {
            const cachedUser = JSON.parse(cached)
            console.log('Using cached user data on error:', cachedUser)
            setUserInfo(cachedUser)
            setCurrentRole(cachedUser.role as UserRole)
          } catch (e) {
            console.error('Failed to parse cached user data:', e)
            setUserInfo(null)
          }
        } else {
          setUserInfo(null)
        }
      } else {
        setUserInfo(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Try to load cached user data first (instant load)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cohort_user_data')
      if (cached) {
        try {
          const cachedUser = JSON.parse(cached)
          console.log('Loading cached user data on mount:', cachedUser)
          setUserInfo(cachedUser)
          setCurrentRole(cachedUser.role as UserRole)
        } catch (e) {
          console.error('Failed to parse cached user data:', e)
        }
      }
    }
    
    // Then fetch fresh data from server
    fetchUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchUser()
      } else if (event === 'SIGNED_OUT') {
        setUserInfo(null)
        setCurrentRole("MEMBER")
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cohort_user_data')
        }
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Auto-detect role based on current pathname
  useEffect(() => {
    if (pathname && userInfo) {
      if (pathname.startsWith('/admin')) {
        if (userInfo.role === 'ADMIN') {
          setCurrentRole('ADMIN')
        } else {
          // Redirect non-admin users away from admin pages
          router.push('/')
        }
      } else {
        setCurrentRole(userInfo.role)
      }
    }
  }, [pathname, userInfo])

  const refreshUser = async () => {
    await fetchUser()
  }

  return <UserContext.Provider value={{ currentRole, setCurrentRole, userInfo, isLoading, refreshUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin"
    default:
      return "/"
  }
}
