package com.wmsgroup.neuefische_wms.model.order;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("Orders")
public record Order(
        @Id String id,
        List<OrderItem> wares,
        OrderStatus status,
        Instant createdAt,
        Instant updatedAt
) {}