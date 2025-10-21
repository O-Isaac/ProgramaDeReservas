package io.github.isaac.reservas.entities;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Table(name = "reservas")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = { "aula", "horario" })
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate fecha;
    private String motivo;
    private Integer asistentes;

    @CreationTimestamp
    private LocalDate createAt;

    @ManyToOne(cascade = { CascadeType.PERSIST })
    @JsonIgnoreProperties("reservas")
    private Aula aula;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "horario_id", nullable = false)
    private Horario horario;

}