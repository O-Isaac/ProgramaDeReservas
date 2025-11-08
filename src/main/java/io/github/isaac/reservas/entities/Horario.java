package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.*;
import io.github.isaac.reservas.enums.DiaSemana;
import io.github.isaac.reservas.enums.TipoHorario;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DiaSemana diaSemana;

    @Enumerated(EnumType.STRING)
    private TipoHorario tipo;

    private LocalTime inicio;

    private LocalTime fin;

    private int sessionDia;

    @OneToMany(mappedBy = "horario", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reserva> reservas;

}
