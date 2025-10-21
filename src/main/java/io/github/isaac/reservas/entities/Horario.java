package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.*;
import io.github.isaac.reservas.enums.DiaSemana;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "horarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private DiaSemana diaSemana;

    private LocalTime inicio;

    private LocalTime fin;

    @OneToOne(mappedBy = "horario", cascade = { CascadeType.PERSIST, CascadeType.REMOVE })
    @JsonIgnore
    private Reserva reserva;
}
