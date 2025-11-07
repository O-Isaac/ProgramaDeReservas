package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.reservas.ReservaRequestDTO;
import io.github.isaac.reservas.dtos.reservas.ReservaResponseDTO;
import io.github.isaac.reservas.dtos.reservas.ReservaUpdateDTO;
import io.github.isaac.reservas.entities.Reserva;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MapperReserva {

    @Mapping(target = "aula.id", source = "aulaId")
    @Mapping(target = "horario.id", source = "horarioId")
    @Mapping(target = "usuario.id", source = "usuarioId")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    Reserva toEntity(ReservaRequestDTO reservaRequestDTO);

    @Mapping(target = "aulaNombre", source = "aula.nombre")
    @Mapping(target = "capacidad", source = "aula.capacidad")
    @Mapping(target = "inicio", source = "horario.inicio")
    @Mapping(target = "fin", source = "horario.fin")
    @Mapping(target = "ordenadores", source = "aula.esOrdenadores")
    ReservaResponseDTO toResponse(Reserva reserva);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ReservaUpdateDTO reservaUpdateDTO,  @MappingTarget Reserva reserva);
}
