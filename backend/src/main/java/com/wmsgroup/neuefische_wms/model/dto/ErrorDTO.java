package com.wmsgroup.neuefische_wms.model.dto;

import com.wmsgroup.neuefische_wms.exception.WithPathInterface;
import lombok.With;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;

import java.time.Instant;

public record ErrorDTO(
        String error,
        String cause,
        String causeMessage,
        String message,
        String timestamp,
        @With
        String status,
        @With
        String path // An optional path to connect this Error-Message to a form field
) {
    /**
     * Konvertiert eine Exception in ein ErrorDTO-Objekt.
     *
     * @param exception Die Exception, die konvertiert werden soll.
     * @return Ein ErrorDTO-Objekt, das die Informationen der Exception enthält.
     */
    public static ErrorDTO fromException(final Exception exception) {
        Throwable cause = exception.getCause();
        String path = null;
        if (exception instanceof WithPathInterface) {
            path = exception.getPath();
        }
        return new ErrorDTO(
                exception.getClass().getSimpleName(),
                cause != null ? cause.getClass().getSimpleName() : null,
                cause != null ? cause.getMessage() : null,
                StringUtils.capitalize(exception.getMessage()),
                Instant.now().toString(),
                HttpStatus.BAD_REQUEST.name(),
                path
        );
    }
}
