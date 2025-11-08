package io.github.isaac.reservas.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String roles;

    private String email;

    private String password;

    private boolean enabled = true;

    @OneToMany(mappedBy = "usuario",  fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private List<Reserva> reservas = new ArrayList<>();
}
