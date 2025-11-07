package io.github.isaac.reservas.services;


import io.github.isaac.reservas.entities.Usuario;
import io.github.isaac.reservas.repositories.RepositoryUsuario;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ServiceUsuario {

    private RepositoryUsuario repositoryUsuario;

    public List<Usuario> findAll() {
        return repositoryUsuario.findAll();
    }

    public Optional<Usuario> findById(Long id)  {
        return repositoryUsuario.findById(id);
    }

    public Usuario save(Usuario usuario) {
        return repositoryUsuario.save(usuario);
    }

    public boolean deleteById(Long id) {
        if (!repositoryUsuario.existsById(id)) {
            return false;
        }

        repositoryUsuario.deleteById(id);

        return true;
    }

    public Usuario updateById(Long id, Usuario usuarioMod) {
        Usuario usuario = repositoryUsuario.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrada"));

        usuario.setId(id);

        return repositoryUsuario.save(usuario);
    }
}
