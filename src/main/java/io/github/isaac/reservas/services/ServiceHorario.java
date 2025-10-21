package io.github.isaac.reservas.services;

import io.github.isaac.reservas.beans.CopiarClase;
import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.beans.Transient;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ServiceHorario {
    private final RepositoryHorario repositoryHorario;
    private final CopiarClase copiarClase = new CopiarClase();

    public Horario crearHorario(Horario horario) {
        return repositoryHorario.save(horario);
    }

    public List<Horario> obtenerHorarios() {
        return repositoryHorario.findAll();
    }

    public Optional<Horario> obtenerHorario(Long id) {
        return repositoryHorario.findById(id);
    }

    @SneakyThrows
    public Horario actualizarHorario(Horario horarioModify, Long id) {
        Horario horario = obtenerHorario(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario no encontrado: " + id));

        copiarClase.copyProperties(horario, horarioModify);

        return repositoryHorario.save(horario);
    }

    public void eliminarHorario(Long id) {
        repositoryHorario.deleteById(id);
    }
}
