"use client";

import { useState, useEffect } from "react";
import { getHorarios, getReservas } from "@/lib/api-client";
import { getDayOfWeek } from "@/lib/date-utils";
import { Clock } from "lucide-react";

interface HorarioSelectorProps {
  fecha: string; // in dd/MM/yyyy format
  onSelect: (horarioId: number, horarioDetails: any) => void;
}

export default function HorarioSelector({
  fecha,
  onSelect,
}: HorarioSelectorProps) {
  const [horarios, setHorarios] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const diaDeSemana = getDayOfWeek(fecha);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [h, r] = await Promise.all([getHorarios(), getReservas()]);
        const filtered = h.filter(
          (horario: any) =>
            horario.dia?.toLowerCase() === diaDeSemana.toLowerCase()
        );
        setHorarios(filtered);
        setReservas(r);
        setSelectedHorario(null);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fecha, diaDeSemana]);

  const isHorarioReserved = (horarioId: number): boolean => {
    return reservas.some(
      (r: any) => r.horario?.id === horarioId && r.fecha === fecha
    );
  };

  const handleSelect = (horarioId: number, horarioDetails: any) => {
    setSelectedHorario(horarioId);
    onSelect(horarioId, horarioDetails);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Cargando horarios...
      </div>
    );
  }

  if (horarios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay horarios disponibles para este día
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium mb-3">
        Horarios disponibles para{" "}
        {diaDeSemana.slice(0, 1).toUpperCase() +
          diaDeSemana.slice(1).toLowerCase()}
        :
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {horarios.map((h) => {
          const isReserved = isHorarioReserved(h.id);
          const isSelected = selectedHorario === h.id;

          return (
            <button
              key={h.id}
              onClick={() => handleSelect(h.id, h)}
              disabled={isReserved}
              className={`p-3 rounded-lg border-2 transition-all ${
                isReserved
                  ? "border-border bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                  : isSelected
                  ? "border-primary bg-primary/10 border-2"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {h.inicio.substring(0, 5)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground block mt-1">
                {h.fin.substring(0, 5)}
              </span>
              {isReserved && (
                <span className="text-xs font-semibold text-red-500 block mt-2">
                  Reservado
                </span>
              )}
              {isSelected && (
                <span className="text-xs font-semibold text-primary block mt-2">
                  ✓ Seleccionado
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
