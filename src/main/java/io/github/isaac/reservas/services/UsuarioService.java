package io.github.isaac.reservas.services;

import io.github.isaac.reservas.dtos.usuario.UsuarioPostRequest;
import io.github.isaac.reservas.dtos.usuario.UsuarioResponse;
import io.github.isaac.reservas.dtos.usuario.UsuarioUpdateRequest;
import io.github.isaac.reservas.entities.Usuario;
import io.github.isaac.reservas.mappers.UsuarioMapper;
import io.github.isaac.reservas.repositories.RepositoryUsuario;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UsuarioService {
    private final RepositoryUsuario usuarios;
    private final UsuarioMapper usuarioMapper;

    @Transactional
    public List<UsuarioResponse> getUsuarios() {
        return usuarios.findAll()
                .stream()
                .map(usuarioMapper::toDto)
                .toList();
    }

    @Transactional
    public UsuarioResponse addUsuario(UsuarioPostRequest request) {
        Usuario usuario = usuarioMapper.toEntity(request);

        usuario.setRoles("ROLE_PROFESOR");
        usuario.setEnabled(true);

        Usuario usuarioAdded = usuarios.save(usuario);

        usuarioAdded.setReservas(List.of());

        return usuarioMapper.toDto(usuarioAdded);
    }

    @Transactional
    public UsuarioResponse updateUsuario(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = usuarios.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        usuarioMapper.updateUsuarioProps(request, usuario);

        return usuarioMapper.toDto(usuarios.save(usuario));
    }

    public Optional<UsuarioResponse> getUsuario(Long id) {
        return usuarios.findById(id).map(usuarioMapper::toDto);
    }

    public void deleteUsuario(Long id) {
        if (!usuarios.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado");
        }

        usuarios.deleteById(id);
    }
}
