package com.wmsgroup.neuefische_wms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                    "error", "Not Found",
                    "message", ex.getMessage()
            ));
  }

  @ExceptionHandler(UserAlreadyExistException.class)
  public ResponseEntity<Map<String, String>> handleUserAlreadyExists(UserAlreadyExistException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of(
                    "error", "Conflict",
                    "message", ex.getMessage()
            ));
  }
}
