package io.github.isaac.reservas.repositories;

import io.github.isaac.reservas.entities.Aula;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositoryAula extends JpaRepository<Aula, Long> {

    // Aula con capacidad
    List<Aula> findByCapacidadGreaterThan(Integer capacidadIsGreaterThan);

    // Aulas con capacidad superior y con ordenadores
    List<Aula> findByCapacidadGreaterThanAndEsOrdenadoresTrue(Integer capacidadIsGreaterThan);

    // Si quieres permitir cualquier valor de ordenadores:
    List<Aula> findByCapacidadGreaterThanAndEsOrdenadores(Integer capacidad, Boolean ordenadores);

}
