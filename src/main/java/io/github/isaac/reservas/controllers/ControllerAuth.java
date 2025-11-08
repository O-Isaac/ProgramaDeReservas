package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.auth.ChangePasswordRequest;
import io.github.isaac.reservas.dtos.auth.LoginRequest;
import io.github.isaac.reservas.dtos.auth.RegisterRequest;
import io.github.isaac.reservas.services.auth.AuthService;
import jakarta.persistence.EntityExistsException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class ControllerAuth {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = authService.verify(request);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales no validas"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error interno del servidor"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok(Map.of("message", "Registrado exitosamente"));
        } catch (EntityExistsException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "El usuario ya existe"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error interno del servidor"));
        }
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> getPerfil(Authentication authentication) {
        return ResponseEntity.ok(authService.perfil(authentication));
    }

    @PatchMapping("/cambiar-pass")
    public ResponseEntity<Void> cambiarPass(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication, request);
        return ResponseEntity.ok().build();
    }
}
