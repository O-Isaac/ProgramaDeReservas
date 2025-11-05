package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.aulas.AulaDTO;
import io.github.isaac.reservas.entities.Aula;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = {MapperReserva.class})
public interface MapperAula {

    @Mapping(target = "reservas.aula", ignore = true)
    AulaDTO toDto(Aula aula);

}
