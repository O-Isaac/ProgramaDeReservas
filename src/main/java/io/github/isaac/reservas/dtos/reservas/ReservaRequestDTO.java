package io.github.isaac.reservas.dtos.reservas;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ReservaRequestDTO {
    @JsonFormat(pattern = "dd/MM/yyyy")
    @NotNull(message = "La fecha es obligatorio")
    private LocalDate fecha;

    @NotNull(message = "El id del aula es obligatorio")
    @Positive(message = "El id de aula tiene que ser superior a 0")
    private Long aulaId;

    @NotNull(message = "El id del horario es obligatorio")
    @Positive(message = "El id de horario tiene que ser superior a 0")
    private Long horarioId;

    @NotNull(message = "El id del usuario es obligatorio")
    @Positive(message = "El id de usuario tiene que ser superior a 0")
    private Long usuarioId;

    @NotNull(message = "El motivo es obligatorio")
    @NotBlank(message = "El motivo no puede estar en blanco")
    private String motivo;

    @NotNull(message = "Especificar los asistentes es obligatorio")
    @Positive(message = "No puede haber asistentes menor que 0")
    private Integer asistentes;
}