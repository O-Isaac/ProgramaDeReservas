"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  getReservas,
  createReserva,
  deleteReserva,
  getUsuarios,
  getAulas,
  getToken,
} from "@/lib/api-client";
import { getUserIdFromToken } from "@/lib/auth-utils";
import { useAuth } from "@/context/auth-context";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HorarioSelector from "./horario-selector";
import { Calendar, Clock, Users, Trash2 } from "lucide-react";
import { convertToApiDate, parseDateToDDMMYYYY } from "@/lib/date-utils";

interface Reserva {
  id: number;
  fecha: string;
  motivo: string;
  asistentes: number;
  usuario: { id: number; nombre: string };
  aula: { id: number; nombre: string };
  horario: { id: number; inicio: string; fin: string };
}

interface Usuario {
  id: number;
  nombre: string;
}

interface Aula {
  id: number;
  nombre: string;
}

export default function ReservasTab() {
  const { user, token } = useAuth();
  const { can, isAdmin } = usePermissions();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    usuarioId: "",
    aulaId: "",
    horarioId: "",
    fecha: "",
    motivo: "",
    asistentes: 1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const promises = [getReservas(), getAulas()];
      // Solo cargar usuarios si es admin (para poder ver todas las reservas)
      if (isAdmin) {
        promises.push(getUsuarios());
      }
      const results = await Promise.all(promises);
      setReservas(results[0]);
      setAulas(results[1]);
      if (isAdmin && results[2]) {
        setUsuarios(results[2]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const apiDate = convertToApiDate(formData.fecha);
      const fallbackToken = token || getToken();
      const resolvedUserId = isAdmin && formData.usuarioId
        ? Number.parseInt(formData.usuarioId)
        : user?.id ?? (fallbackToken ? getUserIdFromToken(fallbackToken) : null);

      if (!resolvedUserId) {
        console.error("No se pudo obtener el ID del usuario autenticado");
        return;
      }

      await createReserva({
        usuarioId: resolvedUserId,
        aulaId: Number.parseInt(formData.aulaId),
        horarioId: Number.parseInt(formData.horarioId),
        fecha: apiDate,
        motivo: formData.motivo,
        asistentes: formData.asistentes,
      });
      setFormData({
        usuarioId: "",
        aulaId: "",
        horarioId: "",
        fecha: "",
        motivo: "",
        asistentes: 1,
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error("Error creating reserva:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar esta reserva?")) {
      try {
        await deleteReserva(id);
        fetchData();
      } catch (err) {
        console.error("Error deleting reserva:", err);
      }
    }
  };

  const canProceedToStep2 = (isAdmin ? !!formData.usuarioId : true) && !!formData.aulaId;
  const canProceedToStep3 = canProceedToStep2 && !!formData.fecha;
  const canSubmit =
    canProceedToStep3 && !!formData.horarioId && !!formData.motivo;

  const reservasByAula = aulas.reduce((acc, aula) => {
    acc[aula.id] = reservas.filter((r) => r.aula?.id === aula.id);
    return acc;
  }, {} as Record<number, Reserva[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground border border-border/70">Panel · Reservas</div>
          <h2 className="text-2xl font-bold tracking-tight">Reservas</h2>
          <p className="text-sm text-muted-foreground">Gestiona todas las reservas de aulas</p>
        </div>
        {can.createReserva && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 rounded-full">
            {showForm ? "Cancelar" : "+ Nueva Reserva"}
          </Button>
        )}
      </div>

      {showForm && can.createReserva && (
        <Card className="border border-border/70 shadow-sm bg-card/75 backdrop-blur">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Crear Nueva Reserva</CardTitle>
                <p className="text-sm text-muted-foreground">Completa los pasos para asegurar el aula y horario.</p>
              </div>
              <span className="text-xs rounded-full px-2.5 py-1 bg-primary/10 text-primary font-medium">Pasos guiados</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 bg-primary text-white rounded-full text-xs shadow-sm">
                    1
                  </span>
                  {isAdmin ? "Selecciona Usuario y Aula" : "Selecciona Aula"}
                </h3>
                <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-2' : ''} gap-4 pl-8`}>
                  {isAdmin && (
                    <div>
                      <label className="text-xs font-medium block mb-2">
                        Usuario *
                      </label>
                      <select
                        value={formData.usuarioId}
                        onChange={(e) =>
                          setFormData({ ...formData, usuarioId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                      >
                        <option value="">Selecciona Usuario</option>
                        {usuarios.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {!isAdmin && (
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-muted-foreground">
                        Reservando como: <span className="font-semibold text-foreground">{user?.nombre || user?.email}</span>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium block mb-2">
                      Aula *
                    </label>
                    <select
                      value={formData.aulaId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aulaId: e.target.value,
                          fecha: "",
                          horarioId: "",
                        })
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      required
                    >
                      <option value="">Selecciona Aula</option>
                      {aulas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {canProceedToStep2 && (
                <div className="space-y-3 border-t pt-6">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 bg-primary text-white rounded-full text-xs shadow-sm">
                      2
                    </span>
                    Selecciona Fecha
                  </h3>
                  <div className="pl-8">
                    <label className="text-xs font-medium block mb-2">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      onChange={(e) => {
                        const apiDate = e.target.value;
                        const displayDate = apiDate
                          ? parseDateToDDMMYYYY(apiDate)
                          : "";
                        setFormData({
                          ...formData,
                          fecha: displayDate,
                          horarioId: "",
                        });
                      }}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      required
                    />
                  </div>
                </div>
              )}

              {canProceedToStep3 && (
                <div className="space-y-3 border-t pt-6">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 bg-primary text-white rounded-full text-xs shadow-sm">
                      3
                    </span>
                    Selecciona Horario
                  </h3>
                  <div className="pl-8">
                    <HorarioSelector
                      fecha={formData.fecha}
                      onSelect={(horarioId) => {
                        setFormData({
                          ...formData,
                          horarioId: String(horarioId),
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {canProceedToStep3 && (
                <div className="space-y-3 border-t pt-6">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-7 h-7 bg-primary text-white rounded-full text-xs shadow-sm">
                      4
                    </span>
                    Detalles de la Reserva
                  </h3>
                  <div className="pl-8 space-y-3">
                    <div>
                      <label className="text-xs font-medium block mb-2">
                        Motivo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Clase de matemáticas"
                        value={formData.motivo}
                        onChange={(e) =>
                          setFormData({ ...formData, motivo: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-2">
                        Asistentes *
                      </label>
                      <input
                        type="number"
                        placeholder="Número de asistentes"
                        min="1"
                        value={formData.asistentes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            asistentes: Number.parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      usuarioId: "",
                      aulaId: "",
                      horarioId: "",
                      fecha: "",
                      motivo: "",
                      asistentes: 1,
                    });
                  }}
                  className="flex-1 rounded-full"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={!canSubmit || isSaving} className="flex-1 rounded-full">
                  {isSaving ? "Creando..." : "Crear Reserva"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <Card className="p-6 text-center text-muted-foreground bg-muted/40 border-dashed">Cargando reservas...</Card>
        ) : Object.keys(reservasByAula).length === 0 ? (
          <Card className="border border-dashed border-border/70 rounded-lg p-8 text-center text-muted-foreground">
            No hay reservas registradas todavía.
          </Card>
        ) : (
          aulas.map((aula) => (
            <Card key={aula.id} className="border border-border/70 shadow-sm bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg leading-tight">{aula.nombre}</CardTitle>
                  <p className="text-sm text-muted-foreground">Reservas recientes para este espacio</p>
                </div>
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                  {reservasByAula[aula.id]?.length || 0} reserva(s)
                </span>
              </CardHeader>
              <CardContent className="space-y-2">
                {reservasByAula[aula.id] && reservasByAula[aula.id].length > 0 ? (
                  reservasByAula[aula.id].map((reserva) => (
                    <div
                      key={reserva.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 bg-card/60 hover:border-primary/40 transition"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold text-foreground leading-tight">{reserva.motivo}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{reserva.usuario.nombre}</span>
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{parseDateToDDMMYYYY(reserva.fecha)}</span>
                          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{reserva.horario.inicio} - {reserva.horario.fin}</span>
                          <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{reserva.asistentes} pers.</span>
                        </div>
                      </div>
                      {can.deleteReserva && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(reserva.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <Card className="p-4 text-center text-muted-foreground bg-muted/30 border-dashed">Sin reservas</Card>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
