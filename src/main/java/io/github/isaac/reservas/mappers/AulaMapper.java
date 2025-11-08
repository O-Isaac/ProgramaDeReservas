package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.aula.AulaPostRequest;
import io.github.isaac.reservas.dtos.aula.AulaResponse;
import io.github.isaac.reservas.dtos.aula.AulaUpdateRequest;
import io.github.isaac.reservas.entities.Aula;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AulaMapper {
    @Mapping(target = "ordenadores", source = "esOrdenadores")
    AulaResponse toDto(Aula aula);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reservas", ignore = true)
    @Mapping(target = "esOrdenadores", source = "ordenadores")
    Aula toEntity(AulaPostRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reservas", ignore = true)
    @Mapping(target = "esOrdenadores", source = "ordenadores")
    void updateAula(AulaUpdateRequest request, @MappingTarget Aula aula);
}
