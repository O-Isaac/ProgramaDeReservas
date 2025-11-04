package io.github.isaac.reservas.services;

import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.repositories.RepositoryAula;
import io.github.isaac.reservas.repositories.RepositoryReserva;
import io.github.isaac.reservas.utils.ClassUtil;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ServiceAula {
    private final RepositoryAula repository;
    private final RepositoryReserva repositoryReserva;

    public List<Aula> buscarAulas(Integer capacidad, Boolean ordenadores) {
        if (capacidad == null && ordenadores == null) {
            return repository.findAll();
        } else if (capacidad != null && ordenadores == null) {
            return repository.findByCapacidadGreaterThan(capacidad);
        } else if (capacidad != null && ordenadores != null) {
            return repository.findByCapacidadGreaterThanAndEsOrdenadores(capacidad, ordenadores);
        } else {
            // Solo filtra por ordenadores si no hay capacidad
            return repository.findAll().stream()
                    .filter(a -> a.getEsOrdenadores().equals(ordenadores))
                    .toList();
        }
    }

    public Optional<Aula> getById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);

        return true;
    }

    @Transactional
    public Aula update(Long id, Aula aulaMod) {
        Aula aula = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada"));

        ClassUtil.copyNonNullProperties(aula, aulaMod);

        aula.setId(id);

        return repository.save(aula);
    }

    @Transactional
    public Aula create(Aula aula) {
        aula.setId(null);
        return repository.save(aula);
    }
}
