package io.github.isaac.reservas.services;

import io.github.isaac.reservas.dtos.auth.ChangePasswordRequest;
import io.github.isaac.reservas.dtos.auth.LoginRequest;
import io.github.isaac.reservas.dtos.auth.RegisterRequest;
import io.github.isaac.reservas.entities.Usuario;
import io.github.isaac.reservas.repositories.RepositoryUsuario;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RepositoryUsuario repositoryUsuario;
    private final PasswordEncoder passwordEncoder;

    public String login(LoginRequest request) throws BadCredentialsException , Exception {
        var authToken = new UsernamePasswordAuthenticationToken(request.email(), request.password());
        var authentication = authenticationManager.authenticate(authToken);

        return jwtService.generateToken(authentication);
    }

    public Usuario registerUser(RegisterRequest request) throws EntityExistsException {
        Optional<Usuario> usuario = repositoryUsuario.findByEmail(request.email());

        if (usuario.isPresent()) {
            throw new EntityExistsException("Un usuario con ese correo electronico ya existe");
        }

        Usuario usuarioEntity = new Usuario();

        usuarioEntity.setEmail(request.email());
        usuarioEntity.setPassword(passwordEncoder.encode(request.password()));
        usuarioEntity.setNombre(request.nombre());
        usuarioEntity.setRoles("ROLE_PROFESOR");
        usuarioEntity.setEnabled(true);

        return repositoryUsuario.save(usuarioEntity);
    }

    public boolean cambiarPassword(Authentication authentication, ChangePasswordRequest request) {
        var email = authentication.getName();
        var password = request.password();

        Usuario usuario = repositoryUsuario.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        usuario.setPassword(passwordEncoder.encode(password));

        repositoryUsuario.save(usuario);

        return true;
    }
}
