"use client"

import { useEffect, useMemo, useState } from "react"
import { getReservas, getAulas, getHorarios, getUsuarios } from "@/lib/api-client"
import { usePermissions } from "@/hooks/use-permissions"
import { Card } from "@/components/ui/card"
import { Calendar, BookOpen, Clock, Users, ArrowRight } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DashboardOverview() {
  const { can } = usePermissions()
  const [data, setData] = useState({
    totalReservas: 0,
    totalAulas: 0,
    totalHorarios: 0,
    totalUsuarios: 0,
    reservasProximas: [] as any[],
    reservasByAula: [] as any[],
    reservasByDay: [] as any[],
  })
  const [isLoading, setIsLoading] = useState(true)

  const sortedReservas = useMemo(() => {
    if (!Array.isArray(data.reservasProximas)) return []
    return [...data.reservasProximas].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
  }, [data.reservasProximas])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos según permisos
        const promises: Promise<any>[] = [
          getReservas(),
          getAulas(),
          getHorarios(),
        ]

        // Solo cargar usuarios si tiene permiso
        if (can.viewUsuarios) {
          promises.push(getUsuarios())
        }

        const results = await Promise.all(promises)
        const [reservas, aulas, horarios, usuarios] = results

        const reservasByAulaData = aulas.map((aula: any) => ({
          name: aula.nombre,
          reservas: (Array.isArray(reservas) ? reservas : []).filter((r: any) => r.aula?.id === aula.id).length,
        }))

        const reservasByDayData = [
          { day: "Lun", count: 0 },
          { day: "Mar", count: 0 },
          { day: "Mié", count: 0 },
          { day: "Jue", count: 0 },
          { day: "Vie", count: 0 },
          { day: "Sáb", count: 0 },
          { day: "Dom", count: 0 },
        ]

        if (Array.isArray(reservas)) {
          reservas.forEach((r: any) => {
            const date = new Date(r.fecha)
            const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
            if (dayIndex >= 0) reservasByDayData[dayIndex].count++
          })
        }

        const reservasProximas = (Array.isArray(reservas) ? reservas : []).slice(0, 5)

        setData({
          totalReservas: Array.isArray(reservas) ? reservas.length : 0,
          totalAulas: Array.isArray(aulas) ? aulas.length : 0,
          totalHorarios: Array.isArray(horarios) ? horarios.length : 0,
          totalUsuarios: can.viewUsuarios && Array.isArray(usuarios) ? usuarios.length : 0,
          reservasProximas,
          reservasByAula: reservasByAulaData,
          reservasByDay: reservasByDayData,
        })
      } catch (err) {
        console.error("Error loading dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [can.viewUsuarios])

  const stats = [
    { label: "Reservas Totales", value: data.totalReservas, icon: Calendar, color: "bg-blue-100 text-blue-600", visible: true },
    { label: "Aulas", value: data.totalAulas, icon: BookOpen, color: "bg-green-100 text-green-600", visible: true },
    { label: "Horarios", value: data.totalHorarios, icon: Clock, color: "bg-orange-100 text-orange-600", visible: true },
    { label: "Usuarios", value: data.totalUsuarios, icon: Users, color: "bg-purple-100 text-purple-600", visible: can.viewUsuarios },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  if (isLoading) {
    return (
      <div className="grid gap-4 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="p-6 bg-muted/40 border-dashed">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-16 bg-muted rounded mt-4" />
            </Card>
          ))}
        </div>
        <Card className="p-6 bg-muted/40 border-dashed h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.filter(stat => stat.visible).map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowRight className="w-3 h-3" /> Actualizado
                  </span>
                </div>
                <div className={`${stat.color} p-3 rounded-lg shadow-inner bg-opacity-40`}> 
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservas por Aula */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Reservas por Aula</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.reservasByAula}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-border)" }}
              />
              <Bar dataKey="reservas" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Reservas por Día */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Reservas por Día</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.reservasByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-border)" }}
              />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Reservas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Últimas Reservas</h3>
        <div className="space-y-3">
          {sortedReservas.length > 0 ? (
            sortedReservas.map((reserva, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{reserva.motivo}</p>
                  <p className="text-sm text-muted-foreground">
                    {reserva.aula?.nombre} • {reserva.horario?.inicio} • {reserva.usuario?.nombre}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {reserva.fecha}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay reservas aún</p>
          )}
        </div>
      </Card>
    </div>
  )
}
