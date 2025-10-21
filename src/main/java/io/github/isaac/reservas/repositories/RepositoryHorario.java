package io.github.isaac.reservas.repositories;

import io.github.isaac.reservas.entities.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositoryHorario extends JpaRepository<Horario, Long> {
    List<Horario> findByReservaId(Long reservaId);
    List<Horario> findByReserva_AulaId(Long reservaAulaId);
}