package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.aula.AulaPostRequest;
import io.github.isaac.reservas.dtos.aula.AulaResponse;
import io.github.isaac.reservas.dtos.aula.AulaUpdateRequest;
import io.github.isaac.reservas.services.AulaService;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/aulas")
@AllArgsConstructor
@Tag(name = "Aulas", description = "Operaciones CRUD para la gestión de aulas")
@SecurityRequirement(name = "bearer-jwt")
public class ControllerAula {

    private final AulaService aulaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    @Operation(summary = "Listar aulas", description = "Obtiene el listado completo de aulas incluyendo reservas enlazadas (si las hubiera)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado recuperado correctamente")
    })
    public ResponseEntity<List<AulaResponse>> getAulas() {
        return ResponseEntity.ok(aulaService.getAulas());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear aula", description = "Crea una nueva aula")
    @ApiResponses({
            @ApiResponse(responseCode = "303", description = "Creada y redirigido (SEE_OTHER) a /aulas"),
            @ApiResponse(responseCode = "400", description = "Validación fallida")
    })
    public ResponseEntity<AulaResponse> addAula(@Valid @RequestBody AulaPostRequest request) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/aulas"))
                .body(aulaService.addAula(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar aula", description = "Actualiza parcialmente un aula existente. Los campos nulos se ignoran")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Actualizada correctamente (NO_CONTENT con body mapeado)"),
            @ApiResponse(responseCode = "404", description = "Aula no encontrada")
    })
    public ResponseEntity<AulaResponse> updateAula(
            @Parameter(description = "ID del aula", required = true) @PathVariable Long id,
            @Valid @RequestBody AulaUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .location(URI.create("/aulas/" + id))
                .body(aulaService.updateAula(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar aula", description = "Elimina un aula por su ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminada"),
            @ApiResponse(responseCode = "404", description = "Aula no encontrada")
    })
    public ResponseEntity<Void> deleteAula(
            @Parameter(description = "ID del aula", required = true) @PathVariable Long id) {
        aulaService.deleteAula(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    @Operation(summary = "Obtener aula", description = "Obtiene los datos de un aula por su ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrada"),
            @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    public ResponseEntity<AulaResponse> getAula(
            @Parameter(description = "ID del aula", required = true) @PathVariable Long id) {
        return aulaService.getAula(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
