package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.services.ServiceHorario;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/horarios")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ControllerHorario {

    private ServiceHorario serviceHorario;

    @GetMapping
    public ResponseEntity<List<Horario>> findAll() {
        return ResponseEntity.ok(serviceHorario.obtenerHorarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> findById(@PathVariable Long id) {
        return serviceHorario.obtenerHorario(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> save(@RequestBody Horario horario) {
        try {
            var horarioCreado = serviceHorario.crearHorario(horario);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("/horarios"))
                    .body(horarioCreado);
        } catch (Exception exception) {
            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Horario> update(@PathVariable Long id, @RequestBody Horario horario) {
        return ResponseEntity.ok(serviceHorario.actualizarHorario(horario, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceHorario.eliminarHorario(id);
        return ResponseEntity.noContent().build();
    }

}
