package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.horarios.HorarioDTO;
import io.github.isaac.reservas.entities.Horario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MapperHorario {

    HorarioDTO toDto(Horario horario);
    Horario toEntity(HorarioDTO horarioDTO);

}
