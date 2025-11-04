package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.services.ServiceAula;
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
    public List<Aula> getAulas() {
        return serviceAula.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aula> getAula(@PathVariable("id") Long id) {
        return serviceAula.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Aula> createAula(@RequestBody Aula aula) {
        // Creacion optimista
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/aulas"))
                .body(serviceAula.create(aula));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aula>  updateAula(@PathVariable("id") Long id, @RequestBody Aula aula) {
        return ResponseEntity.ok(serviceAula.update(id, aula));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Aula> deleteAula(@PathVariable("id") Long id) {
        if (serviceAula.delete(id)) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/aulas"))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
}
