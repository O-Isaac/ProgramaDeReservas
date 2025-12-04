"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getToken, removeToken, setToken, getPerfil } from "@/lib/api-client"
import { decodeJWT, extractRoles, getUserIdFromToken, isTokenExpired, type DecodedToken } from "@/lib/auth-utils"

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
  login: (token: string) => Promise<void>
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

  // Función para cargar el perfil del usuario
  const loadUserProfile = async (authToken: string) => {
    try {
      const profile = await getPerfil()
      console.log("Perfil cargado desde backend:", profile)
      
      if (profile) {
        // Extraer roles del perfil (pueden venir como array de strings o array de objetos)
        let roles: string[] = []
        if (Array.isArray(profile.roles)) {
          roles = profile.roles.map((role: any) => {
            if (typeof role === 'string') return role
            if (role.authority) return role.authority
            if (role.nombre) return role.nombre
            return String(role)
          })
        }
        
        console.log("Roles extraídos del perfil:", roles)
        
        const userData: User = {
          id: profile.id || getUserIdFromToken(authToken) || 0,
          nombre: profile.nombre || "",
          email: profile.email || "",
          roles: roles
        }
        setUser(userData)
        setUserEmail(userData.email)
        setUserRoles(roles)
        
        console.log("Estado actualizado - userRoles:", roles)
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error)
      // Si falla cargar el perfil, extraer info del token
      const decoded = decodeJWT(authToken)
      if (decoded) {
        setUserEmail(decoded.sub || null)
        if (decoded.authorities) {
          const roles = extractRoles(decoded.authorities)
          console.log("Roles extraídos del token (fallback):", roles)
          setUserRoles(roles)
        }
      }
    }
  }

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getToken()
      if (savedToken) {
        // Verificar si el token ha expirado
        if (isTokenExpired(savedToken)) {
          console.log("Token expirado, limpiando sesión")
          removeToken()
          setIsLoading(false)
          return
        }

        setTokenState(savedToken)
        const decoded = decodeJWT(savedToken)
        console.log("Token decodificado al cargar:", decoded)
        
        if (decoded?.sub) {
          setUserEmail(decoded.sub)
        }
        
        // Extraer roles del token como fallback inmediato
        if (decoded?.authorities) {
          const roles = extractRoles(decoded.authorities)
          console.log("Roles extraídos del token al cargar:", roles)
          setUserRoles(roles)
        } else if (decoded?.roles) {
          // Por si el token tiene los roles directamente
          const roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles]
          console.log("Roles extraídos directamente del token:", roles)
          setUserRoles(roles)
        }

        // Cargar perfil completo (puede sobrescribir los roles con datos más actualizados)
        await loadUserProfile(savedToken)
      }
      setIsLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (newToken: string) => {
    setToken(newToken)
    setTokenState(newToken)
    const decoded = decodeJWT(newToken)
    console.log("Token decodificado al login:", decoded)

    if (decoded?.sub) {
      setUserEmail(decoded.sub)
    }

    // Extraer roles del token como fallback inmediato
    if (decoded?.authorities) {
      const roles = extractRoles(decoded.authorities)
      console.log("Roles extraídos del token al login:", roles)
      setUserRoles(roles)
    } else if (decoded?.roles) {
      // Por si el token tiene los roles directamente
      const roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles]
      console.log("Roles extraídos directamente del token:", roles)
      setUserRoles(roles)
    }

    // Cargar perfil completo del usuario (puede sobrescribir con datos más actualizados)
    await loadUserProfile(newToken)
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
