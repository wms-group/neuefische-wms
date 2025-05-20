package com.wmsgroup.neuefische_wms.exception;

import lombok.Getter;

@Getter
public class CategoryNotFoundException extends IllegalArgumentException implements WithPathInterface {
    private final String path;

    public CategoryNotFoundException(String message, String path) {
        super(message);
        this.path = path;
    }
}
