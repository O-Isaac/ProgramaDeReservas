package io.github.isaac.reservas.services;

import io.github.isaac.reservas.dtos.reserva.ReservaPostRequest;
import io.github.isaac.reservas.dtos.reserva.ReservaResponse;
import io.github.isaac.reservas.dtos.reserva.ReservaUpdateRequest;
import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.entities.Usuario;
import io.github.isaac.reservas.mappers.ReservaMapper;
import io.github.isaac.reservas.repositories.RepositoryAula;
import io.github.isaac.reservas.repositories.RepositoryHorario;
import io.github.isaac.reservas.repositories.RepositoryReserva;
import io.github.isaac.reservas.repositories.RepositoryUsuario;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ReservaService {
    private final RepositoryUsuario usuarios;
    private final RepositoryReserva reservas;
    private final RepositoryHorario horarios;
    private final RepositoryAula aulas;

    private final ReservaMapper reservaMapper;

    @Transactional
    public List<ReservaResponse> getReservas() {
        return reservas.findAll()
                .stream()
                .map(reservaMapper::toDto)
                .toList();
    }

    @Transactional
    public ReservaResponse addReserva(ReservaPostRequest request) {
        // Se busca las entidades referenciales
        Horario horario = horarios.findById(request.getHorarioId())
                .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado"));

        Aula aula = aulas.findById(request.getAulaId())
                .orElseThrow(() -> new EntityNotFoundException("Aula no encontrado"));

        Usuario usuario = usuarios.findById(request.getUsuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Se mapea la entidad padred
        Reserva reserva = reservaMapper.createReservaEntity(request);

        // Se establece la relacion en la entidad transaccional
        reserva.setHorario(horario);
        reserva.setAula(aula);
        reserva.setUsuario(usuario);

        // Se comprueba solapamiento y validaciones
        boolean haySolapamiento = reservas.existsSolapamiento(
                aula.getId(),
                reserva.getFecha(),
                horario.getInicio(),
                horario.getFin()
        );

        if (haySolapamiento) {
            throw new IllegalArgumentException("Hay solapamiento en el tramo");
        }

        if (reserva.getAsistentes() > reserva.getAula().getCapacidad()) {
            throw new IllegalArgumentException("Los asistentes no puede superar la capacidad del aula");
        }

        // Se guarda
        return reservaMapper.toDto(reservas.save(reserva));
    }

    @Transactional
    public ReservaResponse updateReserva(Long id, ReservaUpdateRequest request) {
        // Se busca entidad para actualizar
        Reserva reserva = reservas.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrado"));

        // Se valida las relaciones y se establecen
        if (request.getUsuarioId() != null) {
            Usuario usuario = usuarios.findById(request.getUsuarioId())
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

            reserva.setUsuario(usuario);
        }

        if (request.getHorarioId() != null) {
            Horario horario = horarios.findById(request.getHorarioId())
                    .orElseThrow(() -> new EntityNotFoundException("Horario no encontrado"));

            reserva.setHorario(horario);
        }

        if (request.getAulaId() != null) {
            Aula aula = aulas.findById(request.getAulaId())
                    .orElseThrow(() -> new EntityNotFoundException("Aula no encontrado"));

            reserva.setAula(aula);
        }

        // Se actualiza los datos
        reservaMapper.updateReserva(request, reserva);

        // Se mira si hay solapamiento
        boolean haySolapamiento = reservas.existsSolapamiento(
                reserva.getAula().getId(),
                reserva.getFecha(),
                reserva.getHorario().getInicio(),
                reserva.getHorario().getFin()
        );

        if (haySolapamiento) {
            throw new IllegalArgumentException("Hay solapamiento en el tramo");
        }

        if (reserva.getAsistentes() > reserva.getAula().getCapacidad()) {
            throw new IllegalArgumentException("Los asistentes no puede superar la capacidad del aula");
        }

        // Se guardar
        return reservaMapper.toDto(reservas.save(reserva));
    }

    @Transactional
    public Optional<ReservaResponse> getReserva(Long id) {
        return reservas.findById(id).map(reservaMapper::toDto);
    }

    public void deleteReserva(Long id) {
        if (!reservas.existsById(id)) {
            throw new EntityNotFoundException("Reserva no encontrado");
        }

        reservas.deleteById(id);
    }


}
