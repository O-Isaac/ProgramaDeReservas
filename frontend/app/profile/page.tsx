"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { changePassword } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Shield, User as UserIcon, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const { user, userEmail, userRoles } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initials = useMemo(() => {
    const source = user?.nombre || userEmail || "?"
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase())
      .join("") || "?"
  }, [user?.nombre, userEmail])

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError("Completa todos los campos")
      return
    }

    if (newPassword !== confirmPassword) {
      setFormError("Las contraseñas nuevas no coinciden")
      return
    }

    if (newPassword.length < 8) {
      setFormError("La nueva contraseña debe tener al menos 8 caracteres")
      return
    }

    try {
      setIsSubmitting(true)
      await changePassword(currentPassword, newPassword)
      toast.success("Contraseña actualizada correctamente")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setFormError("No se pudo actualizar la contraseña")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_45%)]" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 py-12 space-y-10">
        <header className="flex flex-col gap-3">
          <Button variant="ghost" className="w-fit px-0 text-muted-foreground" asChild>
            <Link href="/dashboard" className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]">
              <ArrowLeft className="h-3 w-3" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold text-foreground">Centro de perfil</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Ajusta tus datos personales y mantén protegidas tus credenciales desde esta vista enfocada en seguridad.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border border-border/70 bg-card/80 p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary text-2xl font-semibold flex items-center justify-center">
                  {initials}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usuario activo</p>
                  <p className="text-2xl font-semibold text-foreground leading-tight">{user?.nombre || "Sin nombre"}</p>
                  <span className="text-sm text-muted-foreground">{user?.email || userEmail || "Sin email"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(userRoles && userRoles.length > 0 ? userRoles : ["Sin rol"]).map((role, idx) => (
                  <Badge key={`${role}-${idx}`} className="rounded-full px-3 py-1 text-[11px] uppercase tracking-widest">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-4 text-sm sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">ID interno</p>
                <p className="text-lg font-medium text-foreground">{user?.id ?? "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Accesos</p>
                <p className="text-lg font-medium text-foreground">{userRoles?.length ?? 0} roles</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Correo</p>
                <p className="text-lg font-medium text-foreground break-all">{userEmail || "Sin correo"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Última sincronización</p>
                <p className="text-lg font-medium text-foreground">Al iniciar sesión</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Si notas información desactualizada, cierra sesión y vuelve a iniciar sesión para refrescar los datos vinculados a tu token.
            </p>
          </Card>

          <Card className="rounded-3xl border border-border/70 bg-card/80 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary/40 text-secondary-foreground flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Seguridad rápida</p>
                <p className="text-sm text-muted-foreground">Actualiza tu contraseña con un flujo guiado y seguro.</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handlePasswordChange}>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Contraseña actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                  placeholder="••••••••"
                />
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Guardar contraseña"}
                </Button>
                <Button type="button" variant="outline" className="w-full" disabled={isSubmitting} asChild>
                  <Link href="/dashboard">Ir al panel</Link>
                </Button>
              </div>
            </form>
          </Card>
        </section>

        <Card className="rounded-3xl border border-border/70 bg-card/70 p-6 text-sm text-muted-foreground">
          <div className="flex gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <UserIcon className="h-4 w-4" />
            Consejos rápidos
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-foreground/80">
            <li>Activa verificación en dos pasos cuando esté disponible.</li>
            <li>Evita reutilizar la misma contraseña que usas en otras plataformas.</li>
            <li>Comparte tu acceso únicamente con personal autorizado.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
