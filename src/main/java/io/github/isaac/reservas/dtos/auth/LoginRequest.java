package io.github.isaac.reservas.dtos.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email
    @NotBlank(message = "Es obligatorio")
    private String email;

    @NotBlank(message = "Es obligatorio")
    private String password;
}
