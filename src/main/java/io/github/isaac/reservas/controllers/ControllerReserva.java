package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.services.ServiceReserva;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")
@AllArgsConstructor
public class ControllerReserva {

    private final ServiceReserva serviceReserva;

    // GET /reservas
    @GetMapping
    public List<Reserva> getReservas() {
        return serviceReserva.obtenerTodas();
    }

    // GET /reservas/{id}
    @GetMapping("/{id}")
    public Reserva getReservaById(@PathVariable Long id) {
        return serviceReserva.obtenerPorId(id);
    }

    // POST /reservas
    @PostMapping
    public Reserva createReserva(@RequestBody Reserva reserva) {
        return serviceReserva.guardar(reserva);
    }

    // PUT /reservas/{id}
    @PutMapping("/{id}")
    public Reserva updateReserva(@RequestBody Reserva reserva, @PathVariable Long id) {
        // Asegurar que el ID de la entidad coincide con el path variable antes de guardar
        reserva.setId(id);
        return serviceReserva.guardar(reserva);
    }

    // DELETE /reservas/{id}
    @DeleteMapping("/{id}")
    public void deleteReserva(@PathVariable Long id) {
        serviceReserva.eliminar(id);
    }
}

