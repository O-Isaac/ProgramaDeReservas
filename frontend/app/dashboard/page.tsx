"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import UsuariosTab from "@/components/dashboard/usuarios-tab"
import AulasTab from "@/components/dashboard/aulas-tab"
import HorariosTab from "@/components/dashboard/horarios-tab"
import ReservasTab from "@/components/dashboard/reservas-tab"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import { CalendarPlus, Sparkles, Users2 } from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"

type Tab = "dashboard" | "usuarios" | "aulas" | "horarios" | "reservas"

export default function DashboardPage() {
  const { token, isLoading, user } = useAuth()
  const { can } = usePermissions()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/auth/login")
    }
  }, [token, isLoading, router])

  const quickActions = useMemo(
    () => [
      { id: "reservas", label: "Nueva reserva", icon: CalendarPlus, visible: can.createReserva },
      { id: "usuarios", label: "Usuarios", icon: Users2, visible: can.viewUsuarios },
      { id: "dashboard", label: "Resumen", icon: Sparkles, visible: true },
    ],
    [can.createReserva, can.viewUsuarios],
  )

  if (isLoading || !token) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 ml-72 overflow-auto">
        <div className="sticky top-0 z-30 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/60 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_45%),radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent)_8%,transparent),transparent_38%)]">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted/70 text-muted-foreground px-3 py-1 text-[11px] font-medium border border-border/60">
                <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
                Panel principal / {activeTab === "dashboard" ? "Resumen" : activeTab}
              </div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                {user?.nombre || "Bienvenido"}
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {activeTab === "dashboard" ? "Resumen" : activeTab}
                </span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Gestiona reservas, aulas y horarios con accesos rápidos y visuales claros.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickActions.filter((qa) => qa.visible).map((qa) => {
                const Icon = qa.icon
                const isActive = activeTab === qa.id
                return (
                  <button
                    key={qa.id}
                    onClick={() => setActiveTab(qa.id as Tab)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow"
                        : "bg-card/80 text-foreground border-border hover:border-primary/60 hover:-translate-y-[1px]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    {qa.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {activeTab === "dashboard" && <DashboardOverview />}
          {activeTab === "usuarios" && <UsuariosTab />}
          {activeTab === "aulas" && <AulasTab />}
          {activeTab === "horarios" && <HorariosTab />}
          {activeTab === "reservas" && <ReservasTab />}
        </div>
      </main>
    </div>
  )
}
