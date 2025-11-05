package io.github.isaac.reservas.dtos.reservas;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ReservaResponseDTO {

    private Long id;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate fecha;

    private String motivo;

    private Integer asistentes;

    private String aulaNombre;

    private Integer capacidad;

    private LocalTime inicio;

    private LocalTime fin;

    private boolean ordenadores;

}
