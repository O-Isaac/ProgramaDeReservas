package io.github.isaac.reservas.dtos.reserva;

import io.github.isaac.reservas.enums.TipoHorario;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservaResponse {
    private Long id;
    private LocalDate fecha;
    private String motivo;
    private int asistentes;

    private ReservaAula aula;

    @Data
    public static class ReservaAula {
        private Long id;
        private String nombre;
        private Integer capacidad;
        private Boolean ordenadores;
    }

    private ReservaHorario horario;

    @Data
    public static class ReservaHorario {
        private Long id;
        private LocalTime inicio;
        private LocalTime fin;
        private TipoHorario tipo;
    }

    private ReservaUsuario usuario;

    // No se si la logica de negio es necesario exponer informacion privada de los usuarios
    // por eso solo se mostrara la id
    @Data
    public static class ReservaUsuario {
        private Long id;
        private String nombre;
    }
}
