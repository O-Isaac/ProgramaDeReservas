package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

    @NotBlank(message = "El nombre del aula es obligatorio")
    @NotNull(message = "El nombre del aula no puede estar vacio")
    private String nombre;

    @Positive(message = "La capacidad debe ser mayor que cero")
    @NotNull(message = "El aula debe tener un capacidad")
    private int capacidad;

    @NotNull(message = "El esOrdenadores es obligatorio")
    private boolean esOrdenadores;

    @OneToMany(mappedBy = "aula", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties("aula")
    List<Reserva> reservas;

}