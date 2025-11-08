package io.github.isaac.reservas.dtos.aula;

import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class AulaResponse {
    private Long id;
    private String nombre;
    private boolean ordenadores;
    private int capacidad;
    private List<AulaReserva> reservas = new ArrayList<>();

    @Data
    public static class AulaReserva {
        private LocalDate fecha;
        private String motivo;
        private int asistentes;
    }
}
