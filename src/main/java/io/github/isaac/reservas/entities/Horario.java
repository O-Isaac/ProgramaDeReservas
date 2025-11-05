package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.*;
import io.github.isaac.reservas.enums.DiaSemana;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "El dia de la semana es obligatorio")
    @Enumerated(EnumType.STRING)
    private DiaSemana diaSemana;

    @NotNull(message = "Horario de inicio es obligatorio")
    private LocalTime inicio;

    @NotNull(message = "Horario de final es obligatorio")
    private LocalTime fin;

    @OneToMany(mappedBy = "horario", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reserva> reservas;

}
