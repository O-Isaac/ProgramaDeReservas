package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.reserva.ReservaPostRequest;
import io.github.isaac.reservas.dtos.reserva.ReservaResponse;
import io.github.isaac.reservas.dtos.reserva.ReservaUpdateRequest;
import io.github.isaac.reservas.services.ReservaService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/reservas")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ControllerReserva {

    private final ReservaService reservaService;

    @GetMapping
    public ResponseEntity<List<ReservaResponse>> getReservas() {
        return ResponseEntity.ok(reservaService.getReservas());
    }

    @PostMapping
    public ResponseEntity<ReservaResponse> createReserva(@Valid @RequestBody ReservaPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/reservas"))
                .body(reservaService.addReserva(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponse>  updateReserva(@PathVariable Long id, @RequestBody ReservaUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(reservaService.updateReserva(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable Long id) {
        reservaService.deleteReserva(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponse> getReserva(@PathVariable Long id) {
        return reservaService.getReserva(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

