package com.wmsgroup.neuefische_wms.model.dto;

public record OrderItemDto(
        String productId,
        int amount
) {
}