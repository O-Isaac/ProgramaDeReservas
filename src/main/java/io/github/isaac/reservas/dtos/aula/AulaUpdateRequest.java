package io.github.isaac.reservas.dtos.aula;

import lombok.Data;

// No se aplica validaciones ya que se hace una actualizacion partial del objecto
// No usar primitivo por que remplaza parametros originales ya que el mapper ignora
// datos null, con eso podemos realizar actualizaciones parciales del pojo
@Data
public class AulaUpdateRequest {
    private String nombre;
    private Boolean ordenadores;
    private Integer capacidad;
}
