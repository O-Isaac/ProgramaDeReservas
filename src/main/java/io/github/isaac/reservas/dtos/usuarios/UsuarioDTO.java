package io.github.isaac.reservas.dtos.usuarios;

import io.github.isaac.reservas.dtos.reservas.ReservaResponseDTO;
import lombok.Data;

import java.util.List;

@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
    private List<ReservaResponseDTO> reservas;
}
