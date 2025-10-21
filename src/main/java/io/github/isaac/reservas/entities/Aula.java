package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "aulas")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = "reservas")
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String nombre;
    private Integer capacidad;
    private Boolean esOrdenadores;

    @OneToMany(mappedBy = "aula", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private List<Reserva> reservas;
}