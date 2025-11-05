package io.github.isaac.reservas.dtos.aulas;

import io.github.isaac.reservas.dtos.reservas.ReservaResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AulaDTO {
    private Long id;
    private String nombre;
    private boolean esOrdenadores;
    private List<ReservaResponseDTO> reservas;
}
