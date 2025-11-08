package io.github.isaac.reservas.controllers;

import io.github.isaac.reservas.dtos.usuario.UsuarioPostRequest;
import io.github.isaac.reservas.dtos.usuario.UsuarioResponse;
import io.github.isaac.reservas.dtos.usuario.UsuarioUpdateRequest;
import io.github.isaac.reservas.services.UsuarioService;
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

    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> getUsuarios() {
        return ResponseEntity.ok(usuarioService.getUsuarios());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> addUsuario(@Valid @RequestBody UsuarioPostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioService.addUsuario(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> updateUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioUpdateRequest request) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/usuarios/" + id))
                .body(usuarioService.updateUsuario(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> getUsuario(@PathVariable Long id) {
        return usuarioService.getUsuario(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
