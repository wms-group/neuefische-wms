package com.wmsgroup.neuefische_wms.model.dto;

import lombok.With;
import org.springframework.http.HttpStatus;

public record ErrorDTO(
        String error,
        String cause,
        String causeMessage,
        String message,
        @With
        String status
) {
    /**
     * Konvertiert eine Exception in ein ErrorDTO-Objekt.
     *
     * @param exception Die Exception, die konvertiert werden soll.
     * @return Ein ErrorDTO-Objekt, das die Informationen der Exception enthält.
     */
    public static ErrorDTO fromException(final Exception exception) {
        Throwable cause = exception.getCause();
        return new ErrorDTO(
                exception.getClass().getSimpleName(),
                cause != null ? cause.getClass().getSimpleName() : null,
                cause != null ? cause.getMessage() : null,
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.name()
        );
    }
}
