package com.wmsgroup.neuefische_wms.model.dto;

import com.wmsgroup.neuefische_wms.model.order.OrderStatus;

import java.time.Instant;
import java.util.List;

public record OrderDto(
        List<OrderItemDto> wares,
        OrderStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
