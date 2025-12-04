"use client"

import type React from "react"
import { register } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DecorativeIcon } from "@/components/decorative-icon"

export default function RegisterPage() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await register(nombre, email, password)
      router.push("/auth/login")
    } catch (err: any) {
      setError("Error en el registro. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" aria-hidden />

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
              Crea tu cuenta
            </div>
            <h1 className="text-4xl font-semibold text-foreground">Reservant</h1>
            <p className="text-sm text-muted-foreground font-light">Organiza reservas con una cuenta segura.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card/70 backdrop-blur rounded-2xl border border-border/70 p-6 shadow-lg">
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="Tu nombre"
                required
              />
            </div>

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
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg text-sm h-auto transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-muted-foreground space-y-3">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px]">
              <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">Sin instalaciones</span>
              <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">Soporte 24/7</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-secondary/50 via-background to-background items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-6 rounded-3xl bg-card/50 border border-border/70 backdrop-blur-sm" />
        <div className="w-full h-full flex items-center justify-center text-foreground/30 relative z-10">
          <DecorativeIcon />
        </div>
      </div>
    </div>
  )
}
