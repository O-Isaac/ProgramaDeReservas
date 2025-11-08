package io.github.isaac.reservas.dtos.aula;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AulaPostRequest {
    @NotBlank(message = "Es obligatorio")
    private String nombre;

    @Positive(message = "No puede ser negativa")
    private int capacidad;

    @NotNull(message = "Es obligatorio")
    private Boolean ordenadores;
}
