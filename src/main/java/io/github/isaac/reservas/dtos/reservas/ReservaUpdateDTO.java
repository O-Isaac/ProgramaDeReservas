package io.github.isaac.reservas.dtos.reservas;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaUpdateDTO {
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate fecha;

    @Positive(message = "El id de aula tiene que ser superior a 0")
    private Long aulaId;

    @Positive(message = "El id de horario tiene que ser superior a 0")
    private Long horarioId;

    private String motivo;

    @Positive(message = "Los asistentes deben ser mayor que 0")
    private Integer asistentes;
}