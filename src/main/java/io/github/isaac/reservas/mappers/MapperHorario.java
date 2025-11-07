package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.horarios.HorarioDTO;
import io.github.isaac.reservas.entities.Horario;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MapperHorario {

    @Mapping(target = "dia", source = "diaSemana")
    HorarioDTO toDto(Horario horario);

    @Mapping(source = "dia", target = "diaSemana")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(HorarioDTO horarioDTO, @MappingTarget Horario horario);

}
