package io.github.isaac.reservas.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "aulas")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Getter
@Setter
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private int capacidad;

    private boolean esOrdenadores;

    @OneToMany(mappedBy = "aula", cascade = CascadeType.REMOVE)
    @ToString.Exclude
    private List<Reserva> reservas = new ArrayList<>();

}