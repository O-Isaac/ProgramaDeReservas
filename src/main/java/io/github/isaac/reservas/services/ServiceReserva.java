package io.github.isaac.reservas.services;

import io.github.isaac.reservas.dtos.reservas.ReservaUpdateDTO;
import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.entities.Usuario;
import io.github.isaac.reservas.mappers.MapperReserva;
import io.github.isaac.reservas.repositories.RepositoryAula;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import io.github.isaac.reservas.repositories.RepositoryReserva;
import io.github.isaac.reservas.repositories.RepositoryUsuario;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ServiceReserva {
    private final RepositoryReserva repositoryReserva;
    private final RepositoryUsuario repositoryUsuario;
    private final RepositoryHorario repositoryHorario;
    private final RepositoryAula repositoryAula;
    private final MapperReserva mapper;

    public List<Reserva> findAll() {
        return repositoryReserva.findAll();
    }

    public Optional<Reserva> findById(Long id) {
        return repositoryReserva.findById(id);
    }

    private void validarReserva(Reserva reserva) {
        if (reserva.getFecha().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Fecha invalida");
        }

        // Comprobar capacidad

        if (reserva.getAsistentes() > reserva.getAula().getCapacidad()) {
            throw new IllegalArgumentException("Los asistentenes no debe ser superior a la capacidad del aula");
        }

        // Comprobar solapamiento

        boolean existeSolapamiento = repositoryReserva.existsSolapamiento(
                reserva.getAula().getId(),
                reserva.getFecha(),
                reserva.getHorario().getInicio(),
                reserva.getHorario().getFin()
        );

        if (existeSolapamiento) {
            throw new IllegalArgumentException("Hay solapamiento en los horarios del aula!");
        }
    }

    @Transactional
    public Reserva create(Reserva reserva) {
        // Se pone null para garantizar que se genere la id
        reserva.setId(null);

        // Se comprueba que tenga las relaciones

        if (reserva.getAula().getId() == null) {
            throw new IllegalArgumentException("Debe especificar un aula válida");
        }

        if (reserva.getHorario().getId() == null) {
            throw new IllegalArgumentException("Debe especificar un horario válido");
        }

        if (reserva.getUsuario().getId() == null) {
            throw new IllegalArgumentException("Debe especificar un usuario valido.");
        }

        Aula aula = repositoryAula.findById(reserva.getAula().getId())
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada"));

        Horario horario = repositoryHorario.findById(reserva.getHorario().getId())
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrada"));

        Usuario usuarios = repositoryUsuario.findById(reserva.getUsuario().getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        reserva.setUsuario(usuarios);
        reserva.setAula(aula);
        reserva.setHorario(horario);

        validarReserva(reserva);

        return repositoryReserva.save(reserva);
    }

    @Transactional
    public Reserva update(Long id, ReservaUpdateDTO reservaUpdateDTO) {
        Reserva reserva = repositoryReserva.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrada"));

        // Actualizamos valores no nulos
        mapper.updateEntityFromDto(reservaUpdateDTO, reserva);

        if (reservaUpdateDTO.getAulaId() != null) {
            Aula aula = repositoryAula.findById(reservaUpdateDTO.getAulaId())
                    .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada con id: " + reservaUpdateDTO.getAulaId()));

            reserva.setAula(aula);
        }

        if (reservaUpdateDTO.getHorarioId() != null) {
            Horario horario = repositoryHorario.findById(reservaUpdateDTO.getHorarioId())
                    .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado con id: " + reservaUpdateDTO.getHorarioId()));

            reserva.setHorario(horario);
        }

        // Guardamos en el repositorio
        return repositoryReserva.save(reserva);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!repositoryReserva.existsById(id)) {
            return false;
        }

        repositoryReserva.deleteById(id);

        return true;
    }
}
