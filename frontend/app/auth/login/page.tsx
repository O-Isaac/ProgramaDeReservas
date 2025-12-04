"use client"

import type React from "react"

import { login } from "@/lib/api-client"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DecorativeIcon } from "@/components/decorative-icon"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login: authLogin } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const token = await login(email, password)
      await authLogin(token)
      router.push("/dashboard")
    } catch (err: any) {
      setError("Credenciales inválidas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-4xl font-semibold text-foreground mb-2">Reservant</h1>
            <p className="text-sm text-muted-foreground font-light">Gestión inteligente de reservas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg text-sm h-auto transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Registrarse
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-secondary to-background items-center justify-center p-12">
        <div className="w-full h-full flex items-center justify-center text-foreground/30">
          <DecorativeIcon />
        </div>
      </div>
    </div>
  )
}
