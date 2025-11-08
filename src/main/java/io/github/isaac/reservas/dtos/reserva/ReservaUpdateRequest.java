package io.github.isaac.reservas.dtos.reserva;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservaUpdateRequest {
    // Campos ignorados
    private Long usuarioId;
    private Long horarioId;
    private Long AulaId;

    // Campos importantes
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate fecha;
    private String motivo;
    private int asistentes;
}
