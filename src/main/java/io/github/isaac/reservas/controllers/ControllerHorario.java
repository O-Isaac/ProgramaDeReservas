package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.services.ServiceHorario;
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
    private final ServiceHorario serviceHorario;

    @GetMapping
    public List<Horario> getHorarios() {
        return serviceHorario.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> getHorarioById(@PathVariable Long id) {
        return serviceHorario.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Horario> createHorario(@RequestBody Horario horario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/horarios"))
                .body(serviceHorario.save(horario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Horario> updateHorario(@PathVariable("id") Long id, @RequestBody Horario horario) {
        return ResponseEntity.ok(serviceHorario.update(id, horario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Horario> deleteHorarioById(@PathVariable("id") Long id) {
        if (serviceHorario.delete(id)) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/horarios"))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
}
