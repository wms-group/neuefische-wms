package com.wmsgroup.neuefische_wms.exception;

public class ProductNotFoundException extends IllegalArgumentException implements WithPathInterface {
    private final String path;

    public ProductNotFoundException(String message, String path) {
        super(message);
        this.path = path;
    }

    @Override
    public String getPath() {
        return path;
    }
}