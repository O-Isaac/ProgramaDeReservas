package io.github.isaac.reservas.services;

import io.github.isaac.reservas.beans.CopiarClase;
import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.repositories.RepositoryAula;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import io.github.isaac.reservas.repositories.RepositoryReserva;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ServiceReserva {
    private final RepositoryReserva repository;
    private final RepositoryAula repositoryAula;
    private final RepositoryHorario repositoryHorario;
    private final CopiarClase copiarClase = new CopiarClase();

    private void validarReserva(Reserva reserva) {
        // Validación 2: No permitir reservas en el pasado
        if (reserva.getFecha().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("No se pueden hacer reservas en el pasado.");
        }

        // Validación 3: Número de asistentes no puede superar la capacidad del aula
        if (reserva.getAsistentes() > reserva.getAula().getCapacidad()) {
            throw new IllegalArgumentException("El número de asistentes supera la capacidad del aula.");
        }

        // Validación 4: Comprobar solapamiento de horarios en el aula para la misma fecha
        List<Reserva> reservasExistentes = repository.findByAulaAndFecha(reserva.getAula(), reserva.getFecha());

        for (Reserva reservaExistente : reservasExistentes) {
            if (reservaExistente.getId() != null && reservaExistente.getId().equals(reserva.getId())) {
                continue; // Saltar la reserva actual en caso de actualización
            }

            if (reservaExistente.getHorario().getInicio().isBefore(reserva.getHorario().getFin()) &&
                reserva.getHorario().getInicio().isBefore(reservaExistente.getHorario().getFin())) {
                throw new IllegalArgumentException("La reserva se solapa con otra reserva existente en el mismo aula y fecha.");
            }
        }
    }

    public List<Reserva> obtenerTodas() {
        return repository.findAll();
    }

    public Reserva guardar(Reserva reserva) {
        // Resolver Aula
        if (reserva.getAula() != null && reserva.getAula().getId() != null) {
            reserva.setAula(repositoryAula.findById(reserva.getAula().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Aula no encontrada")));
        }

        // Resolver Horario existente (si tiene id)
        if (reserva.getHorario() != null && reserva.getHorario().getId() != null) {
            reserva.setHorario(repositoryHorario.findById(reserva.getHorario().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado")));
        }

        validarReserva(reserva);
        return repository.save(reserva);
    }

    @SneakyThrows
    public Reserva actualizar(Reserva reservaModificada, Long id) {
        Reserva reserva = obtenerPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrado: " + id));

        copiarClase.copyProperties(reserva, reservaModificada);

        validarReserva(reserva);
        return repository.save(reserva);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Optional<Reserva> obtenerPorId(Long id) {
        return repository.findById(id);
    }
}