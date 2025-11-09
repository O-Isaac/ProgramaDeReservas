package io.github.isaac.reservas.services.auth;

import io.github.isaac.reservas.dtos.auth.ChangePasswordRequest;
import io.github.isaac.reservas.dtos.auth.LoginRequest;
import io.github.isaac.reservas.dtos.auth.RegisterRequest;
import io.github.isaac.reservas.dtos.usuario.UsuarioResponse;
import io.github.isaac.reservas.entities.Usuario;
import io.github.isaac.reservas.mappers.UsuarioMapper;
import io.github.isaac.reservas.repositories.RepositoryUsuario;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;

@Service
@AllArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final RepositoryUsuario usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private final UsuarioMapper usuarioMapper;

    public String verify(LoginRequest request) throws BadCredentialsException, Exception {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        return jwtService.generateToken(authentication);
    }

    public void register(RegisterRequest request) throws EntityExistsException {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EntityExistsException("Un usuario con ese correo ya existe!");
        }

        Usuario usuario = new Usuario();

        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setNombre(request.getNombre());
        usuario.setRoles("ROLE_PROFESOR");
        usuario.setEnabled(true);

        usuarioRepository.save(usuario);
    }

    public Map<String, Object> perfil(Authentication authentication) {
        String email = authentication.getName();
        Collection<? extends GrantedAuthority> roles = authentication.getAuthorities();

        return Map.of(
            "email", email,
            "roles", roles
        );
    }

    // Tenemos que hecharle vistazo al autentication manager
    public void changePassword(Authentication authentication, ChangePasswordRequest request)
            throws EntityNotFoundException, BadCredentialsException {

        // Se busca usuario
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));


        // Se valida que la contraseña antigua sea igual que la que tiene ahora
        if (!passwordEncoder.matches(request.getOldPassword(), usuario.getPassword())) {
            throw new BadCredentialsException("Las contraseña antigua no coincide con su cuenta");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));

        usuarioRepository.save(usuario);

    }
}
