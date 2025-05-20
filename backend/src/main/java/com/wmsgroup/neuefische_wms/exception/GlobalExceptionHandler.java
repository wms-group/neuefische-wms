package com.wmsgroup.neuefische_wms.exception;

import com.wmsgroup.neuefische_wms.model.dto.ErrorDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorDTO> handleUserNotFound(UserNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorDTO.fromException(ex).withStatus(HttpStatus.NOT_FOUND.name()));
  }

  @ExceptionHandler(UserAlreadyExistException.class)
  public ResponseEntity<ErrorDTO> handleUserAlreadyExists(UserAlreadyExistException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(ErrorDTO.fromException(ex).withStatus(HttpStatus.CONFLICT.name()));
  }
}
