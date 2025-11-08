package io.github.isaac.reservas.dtos.horario;

import io.github.isaac.reservas.enums.DiaSemana;
import io.github.isaac.reservas.enums.TipoHorario;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class HorarioPostRequest {

    @NotNull(message = "Es obligatorio")
    private DiaSemana dia;

    @NotNull(message = "Es obligatorio")
    private TipoHorario tipo;

    @NotNull(message = "Es obligatorio")
    private LocalTime inicio;

    @NotNull(message = "Es obligatorio")
    private LocalTime fin;

    @NotNull(message = "Es obligatorio")
    private Integer session;
}
