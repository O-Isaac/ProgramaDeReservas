"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  getReservas,
  createReserva,
  deleteReserva,
  getUsuarios,
  getAulas,
} from "@/lib/api-client";
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
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formStep, setFormStep] = useState(1); // Step 1: Aula, Step 2: Fecha, Step 3: Horario, Step 4: Submit
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
      const [res, usu, aul] = await Promise.all([
        getReservas(),
        getUsuarios(),
        getAulas(),
      ]);
      setReservas(res);
      setUsuarios(usu);
      setAulas(aul);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiDate = convertToApiDate(formData.fecha);
      await createReserva({
        usuarioId: Number.parseInt(formData.usuarioId),
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
      setFormStep(1);
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error("Error creating reserva:", err);
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

  const canProceedToStep2 = !!formData.usuarioId && !!formData.aulaId;
  const canProceedToStep3 = canProceedToStep2 && !!formData.fecha;
  const canSubmit =
    canProceedToStep3 && !!formData.horarioId && !!formData.motivo;

  const reservasByAula = aulas.reduce((acc, aula) => {
    acc[aula.id] = reservas.filter((r) => r.aula?.id === aula.id);
    return acc;
  }, {} as Record<number, Reserva[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reservas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona todas las reservas de aulas
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? "Cancelar" : "+ Nueva Reserva"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Crear Nueva Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs">
                    1
                  </span>
                  Selecciona Usuario y Aula
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
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
                    <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs">
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
                    <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs">
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
                    <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs">
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
                    setFormStep(1);
                    setFormData({
                      usuarioId: "",
                      aulaId: "",
                      horarioId: "",
                      fecha: "",
                      motivo: "",
                      asistentes: 1,
                    });
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={!canSubmit} className="flex-1">
                  Crear Reserva
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">
            Cargando reservas...
          </p>
        ) : Object.keys(reservasByAula).length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay reservas
          </p>
        ) : (
          aulas.map((aula) => (
            <div key={aula.id}>
              <h3 className="text-lg font-semibold mb-3">{aula.nombre}</h3>
              <div className="grid grid-cols-1 gap-2">
                {reservasByAula[aula.id] &&
                reservasByAula[aula.id].length > 0 ? (
                  reservasByAula[aula.id].map((reserva) => (
                    <Card
                      key={reserva.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">
                                {reserva.motivo}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {reserva.usuario.nombre}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(reserva.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {parseDateToDDMMYYYY(reserva.fecha)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {reserva.horario.inicio} - {reserva.horario.fin}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {reserva.asistentes} pers.
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Sin reservas
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
