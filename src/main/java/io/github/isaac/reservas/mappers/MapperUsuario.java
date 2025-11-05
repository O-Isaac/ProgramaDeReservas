package io.github.isaac.reservas.mappers;

import io.github.isaac.reservas.dtos.usuarios.UsuarioDTO;
import io.github.isaac.reservas.entities.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {MapperReserva.class})
public interface MapperUsuario {
    UsuarioDTO toDTO(Usuario usuario);
}
