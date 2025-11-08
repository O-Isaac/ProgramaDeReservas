package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.aula.AulaPostRequest;
import io.github.isaac.reservas.dtos.aula.AulaResponse;
import io.github.isaac.reservas.dtos.aula.AulaUpdateRequest;
import io.github.isaac.reservas.services.AulaService;
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

    private final AulaService aulaService;

    @GetMapping
    public ResponseEntity<List<AulaResponse>> getAulas() {
        return ResponseEntity.ok(aulaService.getAulas());
    }

    @PostMapping
    public ResponseEntity<AulaResponse> addAula(@Valid @RequestBody AulaPostRequest request) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/aulas"))
                .body(aulaService.addAula(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AulaResponse> updateAula(@PathVariable Long id, @Valid @RequestBody AulaUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .location(URI.create("/aulas/" + id))
                .body(aulaService.updateAula(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAula(@PathVariable Long id) {
        aulaService.deleteAula(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AulaResponse> getAula(@PathVariable Long id) {
        return aulaService.getAula(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
