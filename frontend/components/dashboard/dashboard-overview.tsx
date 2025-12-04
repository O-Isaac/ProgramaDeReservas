"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getReservas, getAulas, getHorarios, getUsuarios } from "@/lib/api-client"
import { usePermissions } from "@/hooks/use-permissions"
import { Card } from "@/components/ui/card"
import { Calendar, BookOpen, Clock, Users, ArrowRight } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DashboardOverview() {
  const { can } = usePermissions()
  const reservasQuery = useQuery({ queryKey: ["reservas"], queryFn: getReservas })
  const aulasQuery = useQuery({ queryKey: ["aulas"], queryFn: getAulas })
  const horariosQuery = useQuery({ queryKey: ["horarios"], queryFn: getHorarios })
  const usuariosQuery = useQuery({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
    enabled: can.viewUsuarios,
  })

  const isLoading = reservasQuery.isPending || aulasQuery.isPending || horariosQuery.isPending || usuariosQuery.isPending

  const data = useMemo(() => {
    const reservas = Array.isArray(reservasQuery.data) ? reservasQuery.data : []
    const aulas = Array.isArray(aulasQuery.data) ? aulasQuery.data : []
    const horarios = Array.isArray(horariosQuery.data) ? horariosQuery.data : []
    const usuarios = can.viewUsuarios && Array.isArray(usuariosQuery.data) ? usuariosQuery.data : []

    const reservasByAulaData = aulas.map((aula: any) => ({
      name: aula.nombre,
      reservas: reservas.filter((r: any) => r.aula?.id === aula.id).length,
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

    reservas.forEach((r: any) => {
      const date = new Date(r.fecha)
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
      if (dayIndex >= 0) reservasByDayData[dayIndex].count++
    })

    const reservasProximas = reservas.slice(0, 5)

    return {
      totalReservas: reservas.length,
      totalAulas: aulas.length,
      totalHorarios: horarios.length,
      totalUsuarios: usuarios.length,
      reservasProximas,
      reservasByAula: reservasByAulaData,
      reservasByDay: reservasByDayData,
    }
  }, [reservasQuery.data, aulasQuery.data, horariosQuery.data, usuariosQuery.data, can.viewUsuarios])

  const sortedReservas = useMemo(() => {
    if (!Array.isArray(data.reservasProximas)) return []
    return [...data.reservasProximas].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
  }, [data.reservasProximas])

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

      {/* Resumen por Aula */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Resumen por aula</h3>
            <p className="text-sm text-muted-foreground">Capta rápido qué aulas tienen más movimiento.</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{data.reservasByAula.length} aulas</span>
        </div>
        {data.reservasByAula.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {data.reservasByAula.map((item, idx) => (
              <div key={idx} className="border border-border/70 rounded-xl p-4 bg-card/60 hover:border-primary/30 transition shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{item.reservas} reservas</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(item.reservas * 12, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border/70 rounded-lg p-6 text-center text-muted-foreground">Sin datos de aulas</div>
        )}
      </Card>

      {/* Upcoming Reservations */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Próximas reservas</h3>
            <p className="text-sm text-muted-foreground">Lo siguiente en agenda (ordenado por fecha).</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {sortedReservas.length} en cola
          </span>
        </div>
        {sortedReservas.length > 0 ? (
          <div className="divide-y divide-border/70">
            {sortedReservas.slice(0, 6).map((reserva, idx) => (
              <div key={idx} className="py-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {reserva.aula?.nombre?.[0] || "A"}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground leading-tight">{reserva.motivo}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-foreground text-[11px] font-medium">
                      {reserva.aula?.nombre || "Aula"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      {reserva.horario?.inicio || ""}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{reserva.usuario?.nombre || reserva.usuario?.email || "Usuario"}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" aria-hidden />
                    <span>{reserva.fecha}</span>
                    {reserva.asistentes ? (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" aria-hidden />
                        <span>{reserva.asistentes} asistentes</span>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border/70 rounded-lg p-8 text-center text-muted-foreground">
            No hay reservas programadas.
          </div>
        )}
      </Card>
    </div>
  )
}
