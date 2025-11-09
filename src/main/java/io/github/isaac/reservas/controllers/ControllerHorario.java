package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.horario.HorarioPostRequest;
import io.github.isaac.reservas.dtos.horario.HorarioResponse;
import io.github.isaac.reservas.dtos.horario.HorarioUpdateRequest;
import io.github.isaac.reservas.services.HorarioService;
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
@RequestMapping("/horarios")
@AllArgsConstructor
@Tag(name = "Horarios", description = "Operaciones CRUD para la gestión de horarios")
@SecurityRequirement(name = "bearer-jwt")
public class ControllerHorario {
    private final HorarioService horarioService;

    @GetMapping
    @Operation(summary = "Listar horarios", description = "Obtiene el listado completo de horarios")
    @ApiResponses({ @ApiResponse(responseCode = "200", description = "OK") })
    public ResponseEntity<List<HorarioResponse>> findAll() {
        return ResponseEntity.ok(horarioService.getHorarios());
    }

    @PostMapping
    @Operation(summary = "Crear horario", description = "Crea un nuevo horario")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Creado"),
            @ApiResponse(responseCode = "400", description = "Validación fallida")
    })
    public ResponseEntity<HorarioResponse> addHorario(@Valid @RequestBody HorarioPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/horarios"))
                .body(horarioService.addHorario(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar horario", description = "Actualiza parcialmente un horario existente. Los campos nulos se ignoran")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Actualizado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    public ResponseEntity<HorarioResponse> updateHorario(
            @Parameter(description = "ID del horario", required = true) @PathVariable("id") Long id,
            @Valid @RequestBody HorarioUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .location(URI.create("/horarios/" + id))
                .body(horarioService.updateHorario(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar horario", description = "Elimina un horario por su ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    public ResponseEntity<Void> deleteHorario(
            @Parameter(description = "ID del horario", required = true) @PathVariable("id") Long id) {
        horarioService.deleteHorario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener horario", description = "Obtiene un horario por su ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrado"),
            @ApiResponse(responseCode = "404", description = "No encontrado")
    })
    public ResponseEntity<HorarioResponse> getHorario(
            @Parameter(description = "ID del horario", required = true) @PathVariable("id") Long id) {
        return horarioService.getHorario(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
