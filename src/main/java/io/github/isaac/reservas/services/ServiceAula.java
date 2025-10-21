package io.github.isaac.reservas.services;

import io.github.isaac.reservas.beans.CopiarClase;
import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.repositories.RepositoryAula;
import io.github.isaac.reservas.repositories.RepositoryReserva;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ServiceAula {
    private final CopiarClase copiarClase = new CopiarClase();
    private final RepositoryAula repository;
    private final RepositoryReserva repositoryReserva;

    public List<Aula> obtenerTodas() {
        return repository.findAll();
    }

    public Aula guardar(Aula aula) {
        return repository.save(aula);
    }

    @SneakyThrows
    public Aula actualizar(Aula aulaModificada, Long id) {
        Optional<Aula> aulaOptional = obtenerPorId(id);

        if (aulaOptional.isPresent()) {
            Aula aulaExistente = aulaOptional.get();

            // Copiar propiedades que no son null (usa tu bean personalizado)
            copiarClase.copyProperties(aulaExistente, aulaModificada);

            return repository.save(aulaExistente);
        }

        throw new IllegalArgumentException("Aula no encontrada");
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    public Optional<Aula> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public List<Aula> obtenerPorCapacidad(Integer capacidad) {
        return repository.findByCapacidadGreaterThanEqual(capacidad);
    }

    public List<Aula> obtenerAulasOrdenadores(boolean esOrdenadores) {
        return repository.findByEsOrdenadores(esOrdenadores);
    }

    public List<Reserva> obtenerReservasAula(Long id) {
        return repositoryReserva.getReservaByAula_Id(id);
    }
}