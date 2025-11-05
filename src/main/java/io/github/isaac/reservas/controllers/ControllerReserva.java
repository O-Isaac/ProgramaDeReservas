package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.reservas.ReservaRequestDTO;
import io.github.isaac.reservas.dtos.reservas.ReservaResponseDTO;
import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.mappers.MapperReserva;
import io.github.isaac.reservas.services.ServiceReserva;
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
    private final ServiceReserva serviceReserva;
    private final MapperReserva mappper;

    @GetMapping
    public List<ReservaResponseDTO> getReservas() {
        return serviceReserva.findAll()
                .stream()
                .map(mappper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> getReservaById(@PathVariable Long id) {
        return serviceReserva.findById(id)
                .map(mappper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> createReserva(@RequestBody @Valid ReservaRequestDTO reservaRequestDTO) {
        Reserva reserva = mappper.toEntity(reservaRequestDTO);
        Reserva reservaCreada = serviceReserva.create(reserva);
        ReservaResponseDTO response = mappper.toResponse(reservaCreada);

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/reservas"))
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> updateReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        Reserva reservaCreada = serviceReserva.update(id, reserva);
        ReservaResponseDTO response = mappper.toResponse(reservaCreada);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> deleteReserva(@PathVariable Long id) {
        if (serviceReserva.delete(id)) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/reservas"))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
}

