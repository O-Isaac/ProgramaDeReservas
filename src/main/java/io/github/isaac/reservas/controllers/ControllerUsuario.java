package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.usuario.UsuarioPostRequest;
import io.github.isaac.reservas.dtos.usuario.UsuarioResponse;
import io.github.isaac.reservas.dtos.usuario.UsuarioUpdateRequest;
import io.github.isaac.reservas.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@AllArgsConstructor
@Tag(name = "Usuarios", description = "Operaciones CRUD para la gestión de usuarios")
public class ControllerUsuario {

    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Obtiene todos los usuarios")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    public ResponseEntity<List<UsuarioResponse>> getUsuarios() {
        return ResponseEntity.ok(usuarioService.getUsuarios());
    }

    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario con rol por defecto ROLE_PROFESOR")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Creado"),
            @ApiResponse(responseCode = "400", description = "Validación fallida")
    })
    public ResponseEntity<UsuarioResponse> addUsuario(@Valid @RequestBody UsuarioPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioService.addUsuario(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza parcialmente un usuario. Campos nulos se ignoran")
    @ApiResponses({
            @ApiResponse(responseCode = "303", description = "Actualizado - SEE_OTHER"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    public ResponseEntity<UsuarioResponse> updateUsuario(
            @Parameter(description = "ID del usuario", required = true) @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/usuarios/" + id))
                .body(usuarioService.updateUsuario(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    public ResponseEntity<Void> deleteUsuario(
            @Parameter(description = "ID del usuario", required = true) @PathVariable Long id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario", description = "Obtiene un usuario por su ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    public ResponseEntity<UsuarioResponse> getUsuario(
            @Parameter(description = "ID del usuario", required = true) @PathVariable Long id) {
        return usuarioService.getUsuario(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
