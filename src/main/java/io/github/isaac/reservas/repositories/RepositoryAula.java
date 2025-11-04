package io.github.isaac.reservas.repositories;

import io.github.isaac.reservas.entities.Aula;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositoryAula extends JpaRepository<Aula, Long> {
}
