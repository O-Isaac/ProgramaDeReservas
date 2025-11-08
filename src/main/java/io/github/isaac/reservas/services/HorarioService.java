package io.github.isaac.reservas.services;

import io.github.isaac.reservas.dtos.horario.HorarioPostRequest;
import io.github.isaac.reservas.dtos.horario.HorarioResponse;
import io.github.isaac.reservas.dtos.horario.HorarioUpdateRequest;
import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.mappers.HorarioMapper;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class HorarioService {
    private final RepositoryHorario horarios;
    private final HorarioMapper horarioMapper;

    @Transactional
    public List<HorarioResponse> getHorarios() {
        return horarios.findAll()
                .stream()
                .map(horarioMapper::toDto)
                .toList();
    }

    @Transactional
    public HorarioResponse addHorario(HorarioPostRequest request) {
        Horario horario = horarioMapper.toEntity(request);
        Horario horarioAdded = horarios.save(horario);

        horarioAdded.setReservas(List.of());

        return horarioMapper.toDto(horarioAdded);
    }

    @Transactional
    public HorarioResponse updateHorario(Long id, HorarioUpdateRequest request) {
        Horario horario = horarios.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado"));

        // Se van actualizar datos no nulos del dto
        horarioMapper.updateHorarioProps(request, horario);

        return horarioMapper.toDto(horarios.save(horario));
    }

    @Transactional
    public Optional<HorarioResponse> getHorario(Long id) {
        return horarios.findById(id).map(horarioMapper::toDto);
    }

    public void deleteHorario(Long id) {
        if (!horarios.existsById(id)) {
            throw new EntityNotFoundException("Horario no encontrado");
        }

        horarios.deleteById(id);
    }
}
