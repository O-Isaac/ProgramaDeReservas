package io.github.isaac.reservas.services;

import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.repositories.RepositoryAula;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import io.github.isaac.reservas.repositories.RepositoryReserva;
import io.github.isaac.reservas.utils.ClassUtil;
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
    private final RepositoryHorario repositoryHorario;
    private final RepositoryAula repositoryAula;

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

        if  (existeSolapamiento) {
            throw new IllegalArgumentException("Hay solapamiento en los horarios del aula!");
        }
    }

    @Transactional
    public Reserva create(Reserva reserva) {
        // Se pone null para garantizar que se genere la id

        reserva.setId(null);

        // Se comprueba que tenga las relaciones

        if (reserva.getAula() == null || reserva.getAula().getId() == null) {
            throw new IllegalArgumentException("Debe especificar un aula válida");
        }

        if (reserva.getHorario() == null || reserva.getHorario().getId() == null) {
            throw new IllegalArgumentException("Debe especificar un horario válido");
        }

        Aula aula = repositoryAula.findById(reserva.getAula().getId())
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada"));

        Horario horario = repositoryHorario.findById(reserva.getHorario().getId())
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrada"));


        reserva.setAula(aula);
        reserva.setHorario(horario);

        validarReserva(reserva);

        return repositoryReserva.save(reserva);
    }

    @Transactional
    public Reserva update(Long id, Reserva reservaMod) {
       Reserva reserva = repositoryReserva.findById(id)
               .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrada"));

       ClassUtil.copyNonNullProperties(reserva, reservaMod);

       validarReserva(reserva);

       reserva.setId(id);

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
