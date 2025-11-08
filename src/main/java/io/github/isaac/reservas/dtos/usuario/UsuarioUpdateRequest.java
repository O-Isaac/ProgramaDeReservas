package io.github.isaac.reservas.dtos.usuario;

import lombok.Data;

@Data
public class UsuarioUpdateRequest {
    private String nombre;
    private String email;
    private String password;
    private Boolean enabled;
}
