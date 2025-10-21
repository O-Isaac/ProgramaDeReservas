package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.services.ServiceAula;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/aulas")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ControllerAula {
    private final ServiceAula serviceAula;

    @GetMapping
    public List<Aula> getAulas(
            @RequestParam(required = false) Integer capacidad,
            @RequestParam(required = false) Boolean esOrdenadores
    ) {

        // /aulas?capacidad=30
        if (capacidad != null) {
            return serviceAula.obtenerPorCapacidad(capacidad);
        }

        // /aulas?esOrdenadores=true
        if (esOrdenadores != null) {
            return serviceAula.obtenerAulasOrdenadores(esOrdenadores);
        }

        // /aulas
        return serviceAula.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aula> getAulaById(@PathVariable Long id) {
        return serviceAula.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAula(@PathVariable Long id) {
        serviceAula.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Aula> updateAula(@RequestBody Aula aula, @PathVariable Long id) {
        return ResponseEntity.ok(serviceAula.actualizar(aula, id));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createAula(@RequestBody Aula aula) {
        try {
            var aulaCreado = serviceAula.guardar(aula);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("/aulas"))
                    .body(aulaCreado);
        } catch (Exception exception) {
            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    @GetMapping("/{id}/reservas")
    public List<Reserva> getReservasPorId(@PathVariable Long id) {
        return serviceAula.obtenerReservasAula(id);
    }
}
