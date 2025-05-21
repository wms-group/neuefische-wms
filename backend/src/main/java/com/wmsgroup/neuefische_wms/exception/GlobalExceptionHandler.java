package com.wmsgroup.neuefische_wms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.wmsgroup.neuefische_wms.model.dto.ErrorDTO;

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

    @ExceptionHandler(StockNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleStockNotFound(StockNotFoundException e) {
        return ErrorDTO.fromException(e).withStatus(HttpStatus.NOT_FOUND.name());
    }
      
    @ExceptionHandler(AisleNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorDTO handleRedoException(AisleNotFoundException e) {
        return ErrorDTO.fromException(e).withStatus(HttpStatus.NOT_FOUND.name());
    }

    @ExceptionHandler(HallNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	private ErrorDTO handleHallNotFound(HallNotFoundException e) {
		return ErrorDTO.fromException(e).withStatus(HttpStatus.NOT_FOUND.name());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	private ErrorDTO handleIllegalArgument(IllegalArgumentException e) {
		return ErrorDTO.fromException(e);
	}
}
