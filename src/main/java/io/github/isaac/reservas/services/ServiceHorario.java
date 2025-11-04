package io.github.isaac.reservas.services;

import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import io.github.isaac.reservas.repositories.RepositoryReserva;
import io.github.isaac.reservas.utils.ClassUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ServiceHorario {
    private final RepositoryHorario repository;
    private final RepositoryReserva repositoryReserva;

    public List<Horario> findAll() {
        return repository.findAll();
    }

    public Optional<Horario> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Horario save(Horario horario) {
        horario.setId(null);
        return repository.save(horario);
    }

    @Transactional
    public Horario update(Long id, Horario horarioMod) {
        Horario horario = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado"));

        ClassUtil.copyNonNullProperties(horario, horarioMod);

        horario.setId(id);

        return repository.save(horario);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }

        // Eliminar el horario
        repository.deleteById(id);

        return true;
    }


}
