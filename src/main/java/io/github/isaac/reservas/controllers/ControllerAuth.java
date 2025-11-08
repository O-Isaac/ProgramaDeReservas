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
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Autenticación y gestión de credenciales")
public class ControllerAuth {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Autentica un usuario y devuelve un token JWT", security = {})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Autenticado", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "401", description = "Credenciales no válidas")
    })
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
    @Operation(summary = "Registro", description = "Registra un nuevo usuario", security = {})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Registrado"),
            @ApiResponse(responseCode = "400", description = "Usuario ya existe")
    })
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
    @Operation(summary = "Perfil", description = "Devuelve datos del usuario autenticado")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "OK") })
    public ResponseEntity<?> getPerfil(Authentication authentication) {
        return ResponseEntity.ok(authService.perfil(authentication));
    }

    @PatchMapping("/cambiar-pass")
    @Operation(summary = "Cambiar contraseña", description = "Actualiza la contraseña del usuario autenticado")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Actualizada"),
            @ApiResponse(responseCode = "400", description = "Validación fallida"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public ResponseEntity<Void> cambiarPass(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication, request);
        return ResponseEntity.ok().build();
    }
}
