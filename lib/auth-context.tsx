'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, UserSettings, Analysis } from './types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void
  analyses: Analysis[]
  addAnalysis: (analysis: Analysis) => void
}

const defaultSettings: UserSettings = {
  defaultLocation: '',
  weightUnit: 'g',
  aiSettings: {
    plasticBottleWeight: 15,
    plasticBagWeight: 5,
    plasticCupWeight: 8,
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [analyses, setAnalyses] = useState<Analysis[]>([])

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('ecoscan_user')
    const storedSettings = localStorage.getItem('ecoscan_settings')
    const storedAnalyses = localStorage.getItem('ecoscan_analyses')
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }
    if (storedAnalyses) {
      setAnalyses(JSON.parse(storedAnalyses))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - in production this would hit a real auth endpoint
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email && password.length >= 6) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        organization: 'BLUE NGO',
      }
      setUser(newUser)
      localStorage.setItem('ecoscan_user', JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ecoscan_user')
  }

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem('ecoscan_settings', JSON.stringify(updated))
  }

  const addAnalysis = (analysis: Analysis) => {
    const updated = [analysis, ...analyses]
    setAnalyses(updated)
    localStorage.setItem('ecoscan_analyses', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      settings, 
      updateSettings,
      analyses,
      addAnalysis,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
