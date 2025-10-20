package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.services.ServiceReserva;
import io.github.isaac.reservas.services.ServiceAula;
import io.github.isaac.reservas.services.ServiceReserva;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import io.github.isaac.reservas.services.ServiceReserva;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import io.github.isaac.reservas.services.ServiceReserva;
import io.github.isaac.reservas.repositories.RepositoryHorario;

import io.github.isaac.reservas.repositories.RepositoryHorario;
import io.github.isaac.reservas.services.ServiceReserva;

import io.github.isaac.reservas.services.ServiceReserva;
import io.github.isaac.reservas.repositories.RepositoryHorario;

import io.github.isaac.reservas.services.ServiceReserva;

import io.github.isaac.reservas.services.ServiceReserva;

import io.github.isaac.reservas.services.ServiceReserva;
import io.github.isaac.reservas.services.ServiceReserva;

import io.github.isaac.reservas.repositories.RepositoryHorario;

import io.github.isaac.reservas.services.ServiceReserva;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class ControllerHorario {

    private final RepositoryHorario repositoryHorario;

    @GetMapping
    public List<Horario> getHorarios(@RequestParam(required = false) Long reservaId) {
        if (reservaId != null) {
            return repositoryHorario.findByReservaId(reservaId);
        }
        return repositoryHorario.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> getHorarioById(@PathVariable Long id) {
        return repositoryHorario.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Horario> createHorario(@RequestBody Horario horario) {
        Horario saved = repositoryHorario.save(horario);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Horario> updateHorario(@RequestBody Horario horario, @PathVariable Long id) {
        horario.setId(id);
        Horario updated = repositoryHorario.save(horario);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorario(@PathVariable Long id) {
        repositoryHorario.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

