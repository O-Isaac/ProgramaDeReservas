package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.aulas.AulaDTO;
import io.github.isaac.reservas.dtos.aulas.AulaUpdateDTO;
import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.mappers.MapperAula;
import io.github.isaac.reservas.services.ServiceAula;
import jakarta.validation.Valid;
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
    private final MapperAula mapper;

    @GetMapping
    public List<AulaDTO> getAulas(
            @RequestParam(required = false) Integer capacidad,
            @RequestParam(required = false) Boolean ordenadores
    ) {
        return serviceAula.buscarAulas(capacidad, ordenadores)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AulaDTO> getAula(@PathVariable("id") Long id) {
        return serviceAula.getById(id)
                .map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AulaDTO> createAula(@Valid @RequestBody Aula aula) {
        // Creacion optimista
        Aula aulaCreated = serviceAula.create(aula);
        AulaDTO response = mapper.toDto(aulaCreated);

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/aulas"))
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AulaDTO>  updateAula(@PathVariable("id") Long id, @RequestBody AulaUpdateDTO aula) {
        Aula aulaUpdated = serviceAula.update(id, aula);
        AulaDTO response = mapper.toDto(aulaUpdated);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AulaDTO> deleteAula(@PathVariable("id") Long id) {
        if (serviceAula.delete(id)) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/aulas"))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
}
