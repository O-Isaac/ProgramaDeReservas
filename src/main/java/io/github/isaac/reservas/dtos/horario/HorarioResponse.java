package io.github.isaac.reservas.dtos.horario;

import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.enums.DiaSemana;
import io.github.isaac.reservas.enums.TipoHorario;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class HorarioResponse {
    private Long id;
    private DiaSemana dia;
    private TipoHorario tipo;
    private LocalTime inicio;
    private LocalTime fin;
    private Integer session;
    private List<HorarioReserva> reservas;

    // TODO: Hacer que esta clase sea generica al metodo cuando se accede
    // Se repite en aula, horario, reserva
    @Data
    public static class HorarioReserva {
        private LocalDate fecha;
        private String motivo;
        private int asistentes;
    }
}
