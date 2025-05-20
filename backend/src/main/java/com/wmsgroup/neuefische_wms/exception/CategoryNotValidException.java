package com.wmsgroup.neuefische_wms.exception;

import lombok.Getter;

@Getter
public class CategoryNotValidException extends IllegalArgumentException implements WithPathInterface {
    private final String path;

    public CategoryNotValidException(String message, String path) {
        super(message);
        this.path = path;
    }
}
