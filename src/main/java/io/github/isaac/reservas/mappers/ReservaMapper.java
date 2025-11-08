package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.reserva.ReservaPostRequest;
import io.github.isaac.reservas.dtos.reserva.ReservaResponse;
import io.github.isaac.reservas.dtos.reserva.ReservaUpdateRequest;
import io.github.isaac.reservas.entities.Reserva;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ReservaMapper {
    @Mapping(source = "aula.esOrdenadores", target = "aula.ordenadores")
    ReservaResponse toDto(Reserva reserva);

    @Mapping(target = "createAt", ignore = true)    // Este se autogenera en la base de datos
    @Mapping(target = "usuario", ignore = true)     // Se establece la relacción en el servicio
    @Mapping(target = "horario", ignore = true)     // Se establece la relacción en el servicio
    @Mapping(target = "aula", ignore = true)        // Se establece la relacción en el servicio
    @Mapping(target = "id", ignore = true)          // Se genera en la base de datos
    Reserva createReservaEntity(ReservaPostRequest request);

    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "horario", ignore = true)
    @Mapping(target = "aula", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateReserva(ReservaUpdateRequest request, @MappingTarget Reserva reserva);
}
