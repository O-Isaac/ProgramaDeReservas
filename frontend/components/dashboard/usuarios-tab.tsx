"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getUsuarios, createUsuario, deleteUsuario, getReservas } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Calendar, CheckCircle } from "lucide-react"

interface Usuario {
  id: number
  nombre: string
  email: string
  enabled: boolean
}

export default function UsuariosTab() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [reservas, setReservas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [usuariosData, reservasData] = await Promise.all([getUsuarios(), getReservas()])
      setUsuarios(usuariosData)
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
      await createUsuario(formData.nombre, formData.email, formData.password)
      setFormData({ nombre: "", email: "", password: "" })
      setShowForm(false)
      fetchData()
    } catch (err) {
      console.error("Error creating usuario:", err)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await deleteUsuario(id)
        fetchData()
      } catch (err) {
        console.error("Error deleting usuario:", err)
      }
    }
  }

  const getReservasCount = (usuarioId: number) => {
    return reservas.filter((r) => r.usuario?.id === usuarioId).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Usuarios</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? "Cancelar" : "+ Nuevo Usuario"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Crear Nuevo Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              />
              <Button type="submit" className="w-full">
                Crear Usuario
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay usuarios</p>
        ) : (
          usuarios.map((usuario) => (
            <Card key={usuario.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{usuario.nombre}</CardTitle>
                  {usuario.enabled && <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {usuario.email}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-semibold">{getReservasCount(usuario.id)}</p>
                      <p className="text-xs text-muted-foreground">Reservas</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm font-semibold">{usuario.enabled ? "Activo" : "Inactivo"}</p>
                      <p className="text-xs text-muted-foreground">Estado</p>
                    </div>
                  </div>

                  <Button variant="destructive" onClick={() => handleDelete(usuario.id)} className="w-full">
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
