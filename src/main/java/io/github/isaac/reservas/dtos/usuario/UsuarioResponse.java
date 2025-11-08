package io.github.isaac.reservas.dtos.usuario;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String email;
    private Boolean enabled;
    private String roles;
    private List<UsuarioReserva> reservas;

    // TODO: Hacer que esta clase sea generica al metodo cuando se accede
    // Se repite en aula, horario, reserva
    @Data
    public static class UsuarioReserva {
        private LocalDate fecha;
        private String motivo;
        private int asistentes;
    }
}
