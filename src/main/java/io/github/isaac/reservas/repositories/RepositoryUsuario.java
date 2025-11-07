package io.github.isaac.reservas.repositories;

import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepositoryUsuario extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}
