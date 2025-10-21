package io.github.isaac.reservas;

import io.github.isaac.reservas.entities.Aula;
import io.github.isaac.reservas.entities.Horario;
import io.github.isaac.reservas.entities.Reserva;
import io.github.isaac.reservas.repositories.RepositoryReserva;
import io.github.isaac.reservas.services.ServiceReserva;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class ServiceReservaTest {
    private RepositoryReserva repository;
    private ServiceReserva service;
    private Aula aula;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(RepositoryReserva.class);
        service = new ServiceReserva(repository);
        aula = Aula.builder().id(1L).capacidad(20).build();
    }

    @Test
    void guardar_reservaValida_ok() {
        Reserva reserva = Reserva.builder()
                .fecha(LocalDate.now().plusDays(1))
                .motivo("Clase de prueba")
                .asistentes(10)
                .aula(aula)
                .horario(List.of(Horario.builder()
                        .dia(LocalDate.now().plusDays(1))
                        .inicio(LocalTime.of(10, 0))
                        .fin(LocalTime.of(12, 0))
                        .build()))
                .build();
        when(repository.getReservaByAula_Id(anyLong())).thenReturn(Collections.emptyList());
        when(repository.save(any(Reserva.class))).thenReturn(reserva);
        Reserva result = service.guardar(reserva);
        assertEquals(reserva, result);
    }

    @Test
    void guardar_reservaEnPasado_lanzaExcepcion() {
        Reserva reserva = Reserva.builder()
                .fecha(LocalDate.now().minusDays(1))
                .motivo("Pasado")
                .asistentes(5)
                .aula(aula)
                .horario(List.of(Horario.builder()
                        .dia(LocalDate.now().minusDays(1))
                        .inicio(LocalTime.of(9, 0))
                        .fin(LocalTime.of(10, 0))
                        .build()))
                .build();
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.guardar(reserva));
        assertTrue(ex.getMessage().contains("pasado"));
    }

    @Test
    void guardar_reservaSuperaCapacidad_lanzaExcepcion() {
        Reserva reserva = Reserva.builder()
                .fecha(LocalDate.now().plusDays(1))
                .motivo("Demasiados asistentes")
                .asistentes(100)
                .aula(aula)
                .horario(List.of(Horario.builder()
                        .dia(LocalDate.now().plusDays(1))
                        .inicio(LocalTime.of(11, 0))
                        .fin(LocalTime.of(13, 0))
                        .build()))
                .build();
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.guardar(reserva));
        assertTrue(ex.getMessage().contains("capacidad"));
    }

    @Test
    void guardar_reservaSolapada_lanzaExcepcion() {
        LocalDate fecha = LocalDate.now().plusDays(1);
        Horario horarioExistente = Horario.builder()
                .dia(fecha)
                .inicio(LocalTime.of(10, 0))
                .fin(LocalTime.of(12, 0))
                .build();
        Reserva reservaExistente = Reserva.builder()
                .fecha(fecha)
                .aula(aula)
                .horario(List.of(horarioExistente))
                .build();
        when(repository.getReservaByAula_Id(aula.getId())).thenReturn(List.of(reservaExistente));

        Reserva reservaNueva = Reserva.builder()
                .fecha(fecha)
                .motivo("Solapada")
                .asistentes(5)
                .aula(aula)
                .horario(List.of(Horario.builder()
                        .dia(fecha)
                        .inicio(LocalTime.of(11, 0))
                        .fin(LocalTime.of(13, 0))
                        .build()))
                .build();
        Exception ex = assertThrows(IllegalArgumentException.class, () -> service.guardar(reservaNueva));
        assertTrue(ex.getMessage().contains("solapa"));
    }
}

