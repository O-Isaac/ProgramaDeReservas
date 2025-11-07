package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.aulas.AulaDTO;
import io.github.isaac.reservas.dtos.aulas.AulaUpdateDTO;
import io.github.isaac.reservas.entities.Aula;
import org.mapstruct.*;


@Mapper(componentModel = "spring", uses = {MapperReserva.class})
public interface MapperAula {

    AulaDTO toDto(Aula aula);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "reservas",  ignore = true)
    void updateEntityFromDto(AulaUpdateDTO aulaUpdateDTO,  @MappingTarget Aula aula);

}
