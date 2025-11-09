"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getHorarios, createHorario, deleteHorario, getReservas } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar } from "lucide-react"

interface Horario {
  id: number
  dia: string
  tipo: string
  inicio: string
  fin: string
  session: number
}

export default function HorariosTab() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [reservas, setReservas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    dia: "LUNES",
    tipo: "LECTIVA",
    inicio: "",
    fin: "",
    session: 1,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [horariosData, reservasData] = await Promise.all([getHorarios(), getReservas()])
      setHorarios(horariosData)
      setReservas(reservasData)
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createHorario(formData)
      setFormData({
        dia: "LUNES",
        tipo: "LECTIVA",
        inicio: "",
        fin: "",
        session: 1,
      })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error("Error creating horario:", err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este horario?")) {
      try {
        await deleteHorario(id)
        fetchData()
      } catch (err) {
        console.error("Error deleting horario:", err)
      }
    }
  }

  const getReservasCount = (horarioId: number) => {
    return reservas.filter((r) => r.horario?.id === horarioId).length
  }

  const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"]
  const tipos = ["LECTIVA", "RECREO", "MEDIODIA"]

  const horariosPorDia = dias.reduce(
    (acc, dia) => {
      acc[dia] = horarios.filter((h) => h.dia === dia)
      return acc
    },
    {} as Record<string, Horario[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Horarios</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestiona los horarios disponibles</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? "Cancelar" : "+ Nuevo Horario"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Crear Nuevo Horario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.dia}
                  onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  {dias.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  {tipos.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="time"
                  value={formData.inicio}
                  onChange={(e) => setFormData({ ...formData, inicio: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
                <input
                  type="time"
                  value={formData.fin}
                  onChange={(e) => setFormData({ ...formData, fin: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
                <input
                  type="number"
                  placeholder="Session"
                  min="1"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Crear Horario
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Cargando horarios...</p>
      ) : (
        <div className="space-y-6">
          {dias.map((dia) => (
            <div key={dia}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {dia}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {horariosPorDia[dia] && horariosPorDia[dia].length > 0 ? (
                  horariosPorDia[dia].map((horario) => (
                    <Card key={horario.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold">
                                {horario.inicio} - {horario.fin}
                              </span>
                            </div>
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                              {horario.tipo}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-muted/50 rounded text-center">
                              <p className="font-semibold">{horario.session}</p>
                              <p className="text-xs text-muted-foreground">Session</p>
                            </div>
                            <div className="p-2 bg-muted/50 rounded text-center">
                              <p className="font-semibold">{getReservasCount(horario.id)}</p>
                              <p className="text-xs text-muted-foreground">Reservas</p>
                            </div>
                          </div>

                          <Button variant="destructive" onClick={() => handleDelete(horario.id)} className="w-full">
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-4">Sin horarios</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
