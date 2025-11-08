package io.github.isaac.reservas.dtos.reserva;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservaPostRequest {
    // Estos campos se van a ignorar para
    // Establecer la relacion bidireccional en el servicio
    @NotNull(message = "Es obligatorio")
    @Min(value = 1, message = "ID debe ser mayor que cero")
    private Long usuarioId;

    @NotNull(message = "Es obligatorio")
    @Min(value = 1, message = "ID debe ser mayor que cero")
    private Long horarioId;

    @NotNull(message = "Es obligatorio")
    @Min(value = 1, message = "ID debe ser mayor que cero")
    private Long aulaId;

    // Estos campos sera lo importantes para crear la reserva
    @NotNull(message = "La fecha es obligatoria")
    @FutureOrPresent(message = "La fecha debe ser hoy o una fecha futura")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate fecha;

    @NotBlank(message = "El motivo es obligatorio")
    @Size(max = 255, message = "El motivo no puede tener más de 255 caracteres")
    private String motivo;

    @Min(value = 1, message = "Debe haber al menos un asistente")
    private int asistentes;
}
