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

  if (isLoading || !token) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  const quickActions = useMemo(
    () => [
      { id: "reservas", label: "Nueva reserva", icon: CalendarPlus, visible: can.createReserva },
      { id: "usuarios", label: "Usuarios", icon: Users2, visible: can.viewUsuarios },
      { id: "dashboard", label: "Resumen", icon: Sparkles, visible: true },
    ],
    [can.createReserva, can.viewUsuarios],
  )

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 ml-72 overflow-auto">
        <div className="sticky top-0 z-30 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 border-b border-border/80">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Panel principal</p>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                {user?.nombre || "Bienvenido"}
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {activeTab === "dashboard" ? "Resumen" : activeTab}
                </span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl">
                Gestiona reservas, aulas y horarios con atajos rápidos y métricas a la vista.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickActions.filter((qa) => qa.visible).map((qa) => {
                const Icon = qa.icon
                return (
                  <button
                    key={qa.id}
                    onClick={() => setActiveTab(qa.id as Tab)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition shadow-sm hover:-translate-y-[1px] hover:shadow-md ${
                      activeTab === qa.id ? "bg-primary text-primary-foreground border-primary" : "bg-card/70 hover:bg-card"
                    }`}
                    aria-current={activeTab === qa.id ? "page" : undefined}
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
