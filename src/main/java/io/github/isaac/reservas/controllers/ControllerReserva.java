package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.services.ServiceReserva;
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

    @GetMapping
    public List<Reserva> getReservas() {
        return serviceReserva.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Long id) {
        return serviceReserva.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Reserva> createReserva(@RequestBody Reserva reserva) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/reservas"))
                .body(serviceReserva.create(reserva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reserva> updateReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        return ResponseEntity.ok(serviceReserva.update(id, reserva));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Reserva> deleteReserva(@PathVariable Long id) {
        if (serviceReserva.delete(id)) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/reservas"))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
}

