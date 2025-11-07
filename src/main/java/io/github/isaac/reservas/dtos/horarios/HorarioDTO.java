package io.github.isaac.reservas.dtos.horarios;

import io.github.isaac.reservas.enums.DiaSemana;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class HorarioDTO {

    private Long id;
    private DiaSemana dia;
    private LocalTime inicio;
    private LocalTime fin;

}
