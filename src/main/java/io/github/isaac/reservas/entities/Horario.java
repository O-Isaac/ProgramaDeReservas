package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.*;
import io.github.isaac.reservas.enums.DiaSemana;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalTime;
import java.util.List;

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

    @OneToMany(mappedBy = "horario", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Reserva> reservas;

}
