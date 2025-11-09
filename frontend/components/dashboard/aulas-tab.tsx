"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getAulas, createAula, deleteAula, getReservas } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Laptop, Calendar } from "lucide-react"

interface Aula {
  id: number
  nombre: string
  capacidad: number
  ordenadores: boolean
}

export default function AulasTab() {
  const [aulas, setAulas] = useState<Aula[]>([])
  const [reservas, setReservas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    capacidad: 0,
    ordenadores: false,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [aulasData, reservasData] = await Promise.all([getAulas(), getReservas()])
      setAulas(aulasData)
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
      await createAula(formData.nombre, formData.capacidad, formData.ordenadores)
      setFormData({ nombre: "", capacidad: 0, ordenadores: false })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error("Error creating aula:", err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta aula?")) {
      try {
        await deleteAula(id)
        fetchData()
      } catch (err) {
        console.error("Error deleting aula:", err)
      }
    }
  }

  const getReservasCount = (aulaId: number) => {
    return reservas.filter((r) => r.aula?.id === aulaId).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Aulas</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestiona las aulas disponibles</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? "Cancelar" : "+ Nueva Aula"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Crear Nueva Aula</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del aula"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
              <input
                type="number"
                placeholder="Capacidad"
                min="1"
                value={formData.capacidad}
                onChange={(e) => setFormData({ ...formData, capacidad: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ordenadores}
                  onChange={(e) => setFormData({ ...formData, ordenadores: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Tiene Ordenadores</span>
              </label>
              <Button type="submit" className="w-full">
                Crear Aula
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Cargando aulas...</p>
        ) : aulas.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay aulas</p>
        ) : (
          aulas.map((aula) => (
            <Card key={aula.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{aula.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="flex justify-center mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-sm font-semibold">{aula.capacidad}</p>
                      <p className="text-xs text-muted-foreground">Capacidad</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="flex justify-center mb-1">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm font-semibold">{getReservasCount(aula.id)}</p>
                      <p className="text-xs text-muted-foreground">Reservas</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="flex justify-center mb-1">
                        <Laptop className={`w-4 h-4 ${aula.ordenadores ? "text-orange-600" : "text-gray-400"}`} />
                      </div>
                      <p className="text-sm font-semibold">{aula.ordenadores ? "Sí" : "No"}</p>
                      <p className="text-xs text-muted-foreground">Ord.</p>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={() => handleDelete(aula.id)} className="w-full">
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
