package io.github.isaac.reservas.repositories;

import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.entities.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RepositoryReserva extends JpaRepository<Reserva, Long> {
    List<Reserva> getReservaByAula_Id(Long aulaId);
    List<Reserva> findByAulaAndFecha(Aula aula, LocalDate fecha);
}
