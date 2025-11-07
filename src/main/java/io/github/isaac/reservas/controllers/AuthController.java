package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.auth.ChangePasswordRequest;
import io.github.isaac.reservas.dtos.auth.LoginRequest;
import io.github.isaac.reservas.dtos.auth.RegisterRequest;
import io.github.isaac.reservas.entities.Usuario;
import io.github.isaac.reservas.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            var token = authService.login(loginRequest);

            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales no validos"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("error", "Error interno del servidor"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        Usuario usuario = authService.registerUser(registerRequest);

        if (usuario != null) {
            return ResponseEntity.ok(Map.of("message", "Usuario registrado correctamente"));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Error al registrar usuario"));
    }


    @GetMapping("/perfil")
    public ResponseEntity<?> verPerfil(Authentication authentication) {
        // authentication ya viene inyectado por Spring Security
        var email = authentication.getName();
        var roles = authentication.getAuthorities();

        return ResponseEntity.ok(Map.of("email", email, "roles", roles));
    }

    @PatchMapping("/cambiar-pass")
    public ResponseEntity<?> cambiarPass(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        if (authService.cambiarPassword(authentication, request)) {
            return ResponseEntity.ok(Map.of("message", "Contraseña cambiada con exito!"));
        }

        return ResponseEntity.badRequest().body(Map.of("message", "Error al cambiar la contraseña"));
    }
}
