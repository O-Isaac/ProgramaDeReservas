package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "EL nombre del usuario es obligatorio")
    @NotBlank(message = "El nombre del usuario no puede estar en blanco")
    private String nombre;

    @Pattern(regexp = "^(ROLE_ADMIN|ROLE_PROFESOR)$", message = "Rol no valido.")
    @NotBlank(message = "El rol del usuario es obligatorio")
    private String role;

    @Email(message = "No es un correo electronico valido.")
    @NotNull(message = "El correo es obligatorio")
    private String email;

    @NotBlank(message = "La contraseña no puede estar en blanco")
    @NotNull(message = "La contraseña es obligatorio")
    private String password;

    @OneToMany(mappedBy = "usuario",  fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private List<Reserva> reservas = new ArrayList<>();

}
