"use client"

import { useAuth } from "@/context/auth-context"
import { usePermissions } from "@/hooks/use-permissions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Users, BookOpen, Clock, Calendar, BarChart3 } from "lucide-react"
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

  console.log("Sidebar - userRoles:", userRoles)
  console.log("Sidebar - userEmail:", userEmail)
  console.log("Sidebar - permisos:", can)

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

  return (
    <aside className="w-72 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Reservant</h1>
            <p className="text-xs text-muted-foreground">Gestión de Reservas</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-4 border-b border-border space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resumen</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{stats.reservas}</p>
            <p className="text-xs text-muted-foreground mt-1">Reservas</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{stats.aulas}</p>
            <p className="text-xs text-muted-foreground mt-1">Aulas</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">{stats.horarios}</p>
            <p className="text-xs text-muted-foreground mt-1">Horarios</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.filter((tab) => tab.visible).map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-border space-y-4">
        <div className="px-4 py-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Usuario</p>
          <p className="text-sm font-medium text-foreground truncate mt-2">{userEmail || "Usuario"}</p>

          {userRoles && userRoles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {userRoles.map((role) => (
                <span
                  key={role}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                    role,
                  )}`}
                >
                  {formatRoleName(role)}
                </span>
              ))}
            </div>
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
