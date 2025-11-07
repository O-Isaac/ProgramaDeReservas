package io.github.isaac.reservas.services;

import io.jsonwebtoken.Jwts;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private final SecretKey secretKey;

    public JwtService() {
        // Genera automáticamente una clave secreta segura de 256 bits
        this.secretKey = Jwts.SIG.HS256.key().build();
    }

    // Genera un token JWT para un usuario autenticado
    public String generateToken(Authentication authentication) {
        // Extraer los roles del usuario y convertirlos a String
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        // Construir el token JWT
        return Jwts.builder()
                .subject(authentication.getName())  // Email del usuario
                .issuer("reservas-api")       // Quién emite el token
                .issuedAt(new Date())               // Cuándo se creó
                .expiration(new Date(
                        System.currentTimeMillis() + 86400000  // Expira en 24h
                ))
                .claim("roles", roles)              // Roles del usuario
                .signWith(secretKey)                // Firmar con clave secreta
                .compact();                         // Generar String del token
    }

    public SecretKey getSecretKey() {
        return secretKey;
    }
}