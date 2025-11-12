package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.reserva.ReservaPostRequest;
import io.github.isaac.reservas.dtos.reserva.ReservaResponse;
import io.github.isaac.reservas.dtos.reserva.ReservaUpdateRequest;
import io.github.isaac.reservas.services.ReservaService;
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
@RequestMapping("/reservas")
@AllArgsConstructor
@Tag(name = "Reservas", description = "Operaciones CRUD para la gestión de reservas")
@SecurityRequirement(name = "bearer-jwt")
public class ControllerReserva {

    private final ReservaService reservaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    @Operation(summary = "Listar reservas", description = "Obtiene todas las reservas")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    public ResponseEntity<List<ReservaResponse>> getReservas() {
        return ResponseEntity.ok(reservaService.getReservas());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    @Operation(summary = "Crear reserva", description = "Crea una nueva reserva validando solapamientos y capacidad")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Creada"),
            @ApiResponse(responseCode = "400", description = "Validación/Regla de negocio fallida"),
            @ApiResponse(responseCode = "404", description = "Alguna entidad referencial no encontrada")
    })
    public ResponseEntity<ReservaResponse> createReserva(@Valid @RequestBody ReservaPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/reservas"))
                .body(reservaService.addReserva(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    @Operation(summary = "Actualizar reserva", description = "Actualiza parcialmente una reserva y vuelve a validar solapamientos y capacidad")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Actualizada"),
            @ApiResponse(responseCode = "400", description = "Regla de negocio fallida"),
            @ApiResponse(responseCode = "404", description = "Reserva o entidad referencial no encontrada")
    })
    public ResponseEntity<ReservaResponse>  updateReserva(
            @Parameter(description = "ID de la reserva", required = true) @PathVariable Long id,
            @RequestBody ReservaUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(reservaService.updateReserva(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    @Operation(summary = "Eliminar reserva", description = "Elimina una reserva por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Eliminada"),
            @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    public ResponseEntity<Void> deleteReserva(
            @Parameter(description = "ID de la reserva", required = true) @PathVariable Long id) {
        reservaService.deleteReserva(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESOR', 'ADMIN')")
    @Operation(summary = "Obtener reserva", description = "Obtiene una reserva por su ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Encontrada"),
            @ApiResponse(responseCode = "404", description = "No encontrada")
    })
    public ResponseEntity<ReservaResponse> getReserva(
            @Parameter(description = "ID de la reserva", required = true) @PathVariable Long id) {
        return reservaService.getReserva(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
