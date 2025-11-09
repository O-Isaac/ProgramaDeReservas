"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface DashboardNavProps {
  activeTab: string
  onTabChange: (tab: any) => void
}

export default function DashboardNav({ activeTab, onTabChange }: DashboardNavProps) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex gap-4">
          {["usuarios", "aulas", "horarios", "reservas"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-md capitalize font-medium transition ${
                activeTab === tab ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>
    </nav>
  )
}
