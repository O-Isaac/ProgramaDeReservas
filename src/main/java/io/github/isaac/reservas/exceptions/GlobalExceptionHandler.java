package io.github.isaac.reservas.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Manejamos los errores de formato como los enums
    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<?> handleInvalidFormatException(InvalidFormatException ex) {
        Map<String, String> error = new HashMap<>();

        if (ex.getTargetType().isEnum()) {
            error.put("valores", Arrays.toString(ex.getTargetType().getEnumConstants()));
            error.put("error", "Valor inválido para el campo de tipo enum");
            error.put("detalle", "Valor recibido: " + ex.getValue());
        } else {
            error.put("error", "Formato de dato inválido");
            error.put("detalle", ex.getOriginalMessage());
        }

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Manejamos las validaciones de los contraints en la base de datos
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, String> map = new HashMap<>();

        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            map.put(violation.getPropertyPath().toString(), violation.getMessage());
        }

        return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
    }

    // Manejamos todas las exceptiones de logica de negocio
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handlerIllegalArgsException(IllegalArgumentException e) {
        Map<String, String> response = new HashMap<>();

        response.put("message", e.getMessage());
        response.put("status", "400");

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Manejamos validaciones del lado de jakarta
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handlerExceptionNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
