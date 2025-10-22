package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.services.ServiceReserva;
import jakarta.transaction.Transactional;
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
        return serviceReserva.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable Long id) {
        return serviceReserva.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createReserva(@RequestBody Reserva reserva) {
        try {
            var aulaCreado = serviceReserva.guardar(reserva);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("/reservas"))
                    .body(aulaCreado);
        } catch (Exception exception) {
            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Reserva> updateReserva(@RequestBody Reserva reserva, @PathVariable Long id) {
        // Asegurar que el ID de la entidad coincide con el path variable antes de actualizar
        reserva.setId(id);
        return ResponseEntity.ok(serviceReserva.actualizar(reserva, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable Long id) {
        serviceReserva.eliminarReserva(id);
        return ResponseEntity.noContent().build();
    }
}

