package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.usuario.UsuarioPostRequest;
import io.github.isaac.reservas.dtos.usuario.UsuarioResponse;
import io.github.isaac.reservas.dtos.usuario.UsuarioUpdateRequest;
import io.github.isaac.reservas.entities.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UsuarioMapper {
    UsuarioResponse toDto(Usuario usuario);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "reservas", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    Usuario toEntity(UsuarioPostRequest request);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "reservas", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateUsuarioProps(UsuarioUpdateRequest request, @MappingTarget Usuario usuario);

}
