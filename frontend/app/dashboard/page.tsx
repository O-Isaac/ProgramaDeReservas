"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import UsuariosTab from "@/components/dashboard/usuarios-tab"
import AulasTab from "@/components/dashboard/aulas-tab"
import HorariosTab from "@/components/dashboard/horarios-tab"
import ReservasTab from "@/components/dashboard/reservas-tab"
import DashboardOverview from "@/components/dashboard/dashboard-overview"

type Tab = "dashboard" | "usuarios" | "aulas" | "horarios" | "reservas"

export default function DashboardPage() {
  const { token, isLoading } = useAuth()
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

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 ml-72 overflow-auto">
        <div className="p-8">
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
