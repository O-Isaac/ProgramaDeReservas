package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.horario.HorarioPostRequest;
import io.github.isaac.reservas.dtos.horario.HorarioResponse;
import io.github.isaac.reservas.dtos.horario.HorarioUpdateRequest;
import io.github.isaac.reservas.entities.Horario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface HorarioMapper {
    @Mapping(target = "dia", source = "diaSemana")
    @Mapping(target = "session", source = "sessionDia")
    HorarioResponse toDto(Horario horario);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reservas", ignore = true)
    @Mapping(target = "diaSemana", source = "dia")
    @Mapping(target = "sessionDia", source = "session")
    Horario toEntity(HorarioPostRequest request);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reservas", ignore = true)
    @Mapping(target = "diaSemana", source = "dia")
    @Mapping(target = "sessionDia", source = "session")
    void updateHorarioProps(HorarioUpdateRequest request, @MappingTarget Horario horario);
}
