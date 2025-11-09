"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getToken, removeToken, setToken } from "@/lib/api-client"
import { decodeJWT, extractRoles } from "@/lib/auth-utils"

interface User {
  id: number
  nombre: string
  email: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  userEmail: string | null
  userRoles: string[]
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedToken = getToken()
    if (savedToken) {
      setTokenState(savedToken)
      const decoded = decodeJWT(savedToken)
      if (decoded?.sub) {
        setUserEmail(decoded.sub)
      }
      if (decoded?.authorities) {
        const roles = extractRoles(decoded.authorities)
        setUserRoles(roles)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string) => {
    setToken(newToken)
    setTokenState(newToken)
    const decoded = decodeJWT(newToken)
    if (decoded?.sub) {
      setUserEmail(decoded.sub)
    }
    if (decoded?.authorities) {
      const roles = extractRoles(decoded.authorities)
      setUserRoles(roles)
    }
  }

  const logout = () => {
    removeToken()
    setTokenState(null)
    setUser(null)
    setUserEmail(null)
    setUserRoles([])
  }

  return (
    <AuthContext.Provider value={{ user, token, userEmail, userRoles, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
