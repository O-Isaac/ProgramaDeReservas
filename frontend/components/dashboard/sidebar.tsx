"use client"

import { useAuth } from "@/context/auth-context"
import { usePermissions } from "@/hooks/use-permissions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Users, BookOpen, Clock, Calendar, BarChart3, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { getReservas, getAulas, getHorarios } from "@/lib/api-client"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { logout, userEmail, userRoles } = useAuth()
  const { can } = usePermissions()
  const router = useRouter()
  const [stats, setStats] = useState({ reservas: 0, aulas: 0, horarios: 0 })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const promises: Promise<any>[] = [getReservas(), getAulas(), getHorarios()]

        const [reservas, aulas, horarios] = await Promise.all(promises)
        setStats({
          reservas: Array.isArray(reservas) ? reservas.length : 0,
          aulas: Array.isArray(aulas) ? aulas.length : 0,
          horarios: Array.isArray(horarios) ? horarios.length : 0,
        })
      } catch (err) {
        console.log("[v0] Error loading stats")
      }
    }
    loadStats()
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const tabs = [
    { id: "dashboard", label: "Panel", icon: BarChart3, visible: true },
    { id: "usuarios", label: "Usuarios", icon: Users, visible: can.viewUsuarios },
    { id: "aulas", label: "Aulas", icon: BookOpen, visible: can.viewAulas },
    { id: "horarios", label: "Horarios", icon: Clock, visible: can.viewHorarios },
    { id: "reservas", label: "Reservas", icon: Calendar, visible: can.viewReservas },
  ]

  const formatRoleName = (role: string): string => {
    if (!role || typeof role !== 'string') return 'Desconocido'
    // Eliminar el prefijo ROLE_ si existe y formatear
    const cleanRole = role.replace(/^ROLE_/, "")
    // Capitalizar primera letra y convertir guiones bajos en espacios
    return cleanRole
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const getRoleBadgeColor = (role: string): string => {
    if (!role || typeof role !== 'string') return "bg-gray-100 text-gray-700 border-gray-200"
    const cleanRole = role.toUpperCase().replace(/^ROLE_/, "")
    if (cleanRole === "ADMIN") return "bg-red-100 text-red-700 border-red-200"
    if (cleanRole === "PROFESOR") return "bg-blue-100 text-blue-700 border-blue-200"
    return "bg-gray-100 text-gray-700 border-gray-200"
  }

  const primaryRole = userRoles && userRoles.length > 0 ? userRoles[0] : null

  return (
    <aside className="w-72 h-screen flex flex-col fixed left-0 top-0 border-r border-border/60 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent_38%),radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent)_6%,transparent),transparent_42%),var(--color-card)] backdrop-blur-lg shadow-lg shadow-primary/5">
      {/* Logo Section */}
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Reservant</h1>
            <p className="text-xs text-muted-foreground">Gestión de Reservas</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-4 border-b border-border/60 space-y-3 bg-gradient-to-b from-card/80 to-transparent">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resumen</p>
        <div className="grid grid-cols-3 gap-2">
          {[{ label: "Reservas", value: stats.reservas }, { label: "Aulas", value: stats.aulas }, { label: "Horarios", value: stats.horarios }].map((item) => (
            <div key={item.label} className="rounded-xl p-3 text-center border border-border/60 bg-card/70 shadow-sm">
              <p className="text-lg font-bold text-foreground leading-none">{item.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {tabs.filter((tab) => tab.visible).map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 border border-transparent ${
                isActive
                  ? "bg-primary/15 text-foreground border-primary/40 shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-border"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* User Section & Logout */}
        <div className="p-4 border-t border-border/60 space-y-3 bg-card/85 backdrop-blur">
          <div className="px-4 py-3 bg-muted/30 rounded-xl space-y-2 border border-border/50">
            <div className="flex items-center gap-2 text-sm text-foreground truncate">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium truncate">{userEmail || "Sin correo"}</span>
            </div>

            {primaryRole && (
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border ${getRoleBadgeColor(primaryRole)} bg-primary/10 text-primary`}
              >
                {formatRoleName(primaryRole)}
              </span>
            )}
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent hover:bg-muted"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
    </aside>
  )
}
