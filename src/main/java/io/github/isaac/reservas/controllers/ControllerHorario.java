package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.horario.HorarioPostRequest;
import io.github.isaac.reservas.dtos.horario.HorarioResponse;
import io.github.isaac.reservas.dtos.horario.HorarioUpdateRequest;
import io.github.isaac.reservas.services.HorarioService;
import jakarta.validation.Valid;
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
    private final HorarioService horarioService;

    @GetMapping
    public ResponseEntity<List<HorarioResponse>> findAll() {
        return ResponseEntity.ok(horarioService.getHorarios());
    }

    @PostMapping
    public ResponseEntity<HorarioResponse> addHorario(@Valid @RequestBody HorarioPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/horarios"))
                .body(horarioService.addHorario(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioResponse> updateHorario(@PathVariable("id") Long id, @Valid @RequestBody HorarioUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .location(URI.create("/horarios/" + id))
                .body(horarioService.updateHorario(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorario(@PathVariable("id") Long id) {
        horarioService.deleteHorario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioResponse> getHorario(@PathVariable("id") Long id) {
        return horarioService.getHorario(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
