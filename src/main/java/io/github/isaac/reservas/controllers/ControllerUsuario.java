package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.usuarios.UsuarioDTO;
import io.github.isaac.reservas.entities.Usuario;
import io.github.isaac.reservas.mappers.MapperUsuario;
import io.github.isaac.reservas.services.ServiceUsuario;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class ControllerUsuario {
    private final ServiceUsuario serviceUsuario;
    private final MapperUsuario mapper;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> findAll() {
        List<UsuarioDTO> usuarios = serviceUsuario.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();

        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> findById(@PathVariable("id") Long id) {
        return serviceUsuario.findById(id)
                .map(mapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> save(@RequestBody @Valid Usuario usuario) {
        Usuario usuarioCreated = serviceUsuario.save(usuario);
        UsuarioDTO response = mapper.toDTO(usuarioCreated);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> update(@PathVariable("id") Long id, @RequestBody Usuario usuario) {
        Usuario usuarioUpdated = serviceUsuario.updateById(id, usuario);
        UsuarioDTO response =  mapper.toDTO(usuarioUpdated);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> delete(@PathVariable("id") Long id) {
        if (serviceUsuario.deleteById(id)) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/usuarios"))
                    .build();
        }

        return ResponseEntity.notFound().build();
    }
}
