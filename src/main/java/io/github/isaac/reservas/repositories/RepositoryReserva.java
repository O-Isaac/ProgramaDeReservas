package io.github.isaac.reservas.repositories;

import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.entities.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface RepositoryReserva extends JpaRepository<Reserva, Long> {
    @Query("""
        SELECT COUNT(r) > 0
        FROM Reserva r
        WHERE r.aula.id = :aulaId
          AND r.fecha = :fecha
          AND (
               r.horario.inicio < :horaFin
           AND r.horario.fin > :horaInicio
          )
        """)
    boolean existsSolapamiento(
            @Param("aulaId") Long aulaId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

}
