package io.github.isaac.reservas.dtos.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @NotBlank(message = "La contraseña antigua no puede estar vacia")
    private String oldPassword;

    @NotBlank(message = "La contraseña nueva no puede estar vacia")
    @Size(min = 6, max = 16, message = "La contraseña tiene que ser entre 6 y 16 caracteres")
    private String newPassword;

}
