package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.horarios.HorarioDTO;
import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.mappers.MapperHorario;
import io.github.isaac.reservas.services.ServiceHorario;
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
    private final ServiceHorario serviceHorario;
    private final MapperHorario mapper;

    @GetMapping
    public List<HorarioDTO> getHorarios() {
        return serviceHorario.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioDTO> getHorarioById(@PathVariable Long id) {
        return serviceHorario.findById(id)
                .map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HorarioDTO> createHorario(@Valid @RequestBody Horario horario) {
        Horario horarioCreated = serviceHorario.save(horario);
        HorarioDTO response = mapper.toDto(horarioCreated);

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/horarios"))
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioDTO> updateHorario(@PathVariable("id") Long id, @RequestBody HorarioDTO horario) {
        Horario horarioUpdated = serviceHorario.update(id, horario);
        HorarioDTO response = mapper.toDto(horarioUpdated);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HorarioDTO> deleteHorarioById(@PathVariable("id") Long id) {
        if (serviceHorario.delete(id)) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/horarios"))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
}
