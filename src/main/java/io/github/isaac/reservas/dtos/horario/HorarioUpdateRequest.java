package io.github.isaac.reservas.dtos.horario;

import io.github.isaac.reservas.enums.DiaSemana;
import io.github.isaac.reservas.enums.TipoHorario;
import lombok.Data;

import java.time.LocalTime;

// No hace falta validaciones ya que mapstruct se encargara de gestionar
// los valores no nulos para realizar una update parcial del pojo
@Data
public class HorarioUpdateRequest {
    private DiaSemana dia;
    private TipoHorario tipo;
    private LocalTime inicio;
    private LocalTime fin;
    private Integer session;
}
