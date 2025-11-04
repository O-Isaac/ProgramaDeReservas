package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.util.List;

@Entity
@Table(name = "aulas")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String nombre;
    private Integer capacidad;
    private Boolean esOrdenadores;

    @OneToMany(mappedBy = "aula", cascade = CascadeType.REMOVE)
    @JsonIgnore
    @ToString.Exclude
    List<Reserva> reservas;
}