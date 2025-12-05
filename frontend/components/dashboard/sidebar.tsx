"use client"

import { useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { usePermissions } from "@/hooks/use-permissions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Users, BookOpen, Clock, Calendar, BarChart3, UserRound } from "lucide-react"
import { getReservas, getAulas, getHorarios } from "@/lib/api-client"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen?: boolean
}

export default function Sidebar({ activeTab, onTabChange, isOpen = true }: SidebarProps) {
  const { logout, userEmail, userRoles, user } = useAuth()
  const { can } = usePermissions()
  const router = useRouter()
  const reservasQuery = useQuery({ queryKey: ["reservas"], queryFn: getReservas })
  const aulasQuery = useQuery({ queryKey: ["aulas"], queryFn: getAulas })
  const horariosQuery = useQuery({ queryKey: ["horarios"], queryFn: getHorarios })

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const handleGoToProfile = () => {
    router.push("/profile")
  }

  const tabs = [
    { id: "dashboard", label: "Panel", icon: BarChart3, visible: true },
    { id: "usuarios", label: "Usuarios", icon: Users, visible: can.viewUsuarios },
    { id: "aulas", label: "Aulas", icon: BookOpen, visible: can.viewAulas },
    { id: "horarios", label: "Horarios", icon: Clock, visible: can.viewHorarios },
    { id: "reservas", label: "Reservas", icon: Calendar, visible: can.viewReservas },
  ]

  const formatRoleName = (role: string): string => {
    if (!role || typeof role !== "string") return "Desconocido"
    const cleanRole = role.replace(/^ROLE_/, "")
    return cleanRole
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const primaryRole = userRoles && userRoles.length > 0 ? userRoles[0] : null

  const getRoleBadgeColor = (role: string): string => {
    if (!role || typeof role !== "string") return "bg-muted text-muted-foreground border-border/60"
    const cleanRole = role.toUpperCase().replace(/^ROLE_/, "")
    if (cleanRole === "ADMIN") return "bg-red-100 text-red-700 border-red-200"
    if (cleanRole === "PROFESOR") return "bg-blue-100 text-blue-700 border-blue-200"
    if (cleanRole === "GESTOR") return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-muted text-muted-foreground border-border/60"
  }

  const initials = useMemo(() => {
    const source = user?.nombre || userEmail || "?"
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment[0]?.toUpperCase())
      .join("") || "?"
  }, [user?.nombre, userEmail])

  const stats = {
    reservas: Array.isArray(reservasQuery.data) ? reservasQuery.data.length : 0,
    aulas: Array.isArray(aulasQuery.data) ? aulasQuery.data.length : 0,
    horarios: Array.isArray(horariosQuery.data) ? horariosQuery.data.length : 0,
  }

  const quickStats = [
    { label: "Reservas", value: stats.reservas },
    { label: "Aulas", value: stats.aulas },
    { label: "Horarios", value: stats.horarios },
  ]

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-border/40 bg-card/90 ring-1 ring-white/10 backdrop-blur-lg transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      aria-hidden={!isOpen}
    >
      <div className="flex h-full flex-col">
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-card">
                <Calendar className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.5em] text-muted-foreground">Reservant</p>
                <h1 className="text-xl font-semibold text-foreground">Panel</h1>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Gestión diaria de aulas y reservas.</p>
          </div>
          <div className="space-y-2">
            {quickStats.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 bg-card/80">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-lg font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {tabs.filter((tab) => tab.visible).map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition",
                  isActive ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-background" : "text-muted-foreground")} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="px-5 py-6 space-y-5 border-t border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-foreground">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.nombre || userEmail || "Sin nombre"}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail || "Sin correo"}</p>
            </div>
          </div>
          {primaryRole && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.25em]",
                getRoleBadgeColor(primaryRole)
              )}
            >
              {formatRoleName(primaryRole)}
            </span>
          )}
          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="w-full justify-center gap-2" onClick={handleGoToProfile}>
              <UserRound className="h-4 w-4" />
              Abrir perfil
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-center gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
