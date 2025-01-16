import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  _id: string          // MongoDB ID
  firstName: string
  lastName: string
  username: string
  email: string
  profilePic: string
  verified: boolean    // Use this for email verification status
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 