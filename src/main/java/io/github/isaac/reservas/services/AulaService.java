package io.github.isaac.reservas.services;

import io.github.isaac.reservas.dtos.aula.AulaPostRequest;
import io.github.isaac.reservas.dtos.aula.AulaResponse;
import io.github.isaac.reservas.dtos.aula.AulaUpdateRequest;
import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.mappers.AulaMapper;
import io.github.isaac.reservas.repositories.RepositoryAula;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AulaService {
    private final AulaMapper mapper;
    private final RepositoryAula aulas;

    // Se debe usar transactional por que cuando voy acceder la referencia reserva
    // es posible que hibernate no carge ese dato o no le de tiempo, para evitar eso hacer
    // transactional cuando se intente acceder a una referencia de la entidad ademas se debe
    // comprobar que la carga de la entidad referente sea lazy, si es eager no hace falta
    @Transactional
    public List<AulaResponse> getAulas() {
        return aulas.findAll()
                .stream()
                // Tener en cuenta que en el dto se accede a la referencia de la entidad reservas
                .map(mapper::toDto)
                .toList();
    }

    @Transactional
    public AulaResponse addAula(AulaPostRequest request) {
        Aula aula = mapper.toEntity(request);
        Aula aulaSaved = aulas.save(aula);

        aulaSaved.setReservas(List.of());

        return mapper.toDto(aulaSaved);
    }


    @Transactional
    public AulaResponse updateAula(Long id, AulaUpdateRequest request) {
        Aula aula = aulas.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrada"));

        // Se van actualizar datos no nulos del dto
        mapper.updateAula(request, aula);

        return mapper.toDto(aulas.save(aula));
    }

    @Transactional
    public Optional<AulaResponse> getAula(Long id) {
        return aulas.findById(id).map(mapper::toDto);
    }

    public void deleteAula(Long id) {
        if (!aulas.existsById(id)) {
            throw new EntityNotFoundException("Aula no encontrada");
        }

        aulas.deleteById(id);
    }
}
