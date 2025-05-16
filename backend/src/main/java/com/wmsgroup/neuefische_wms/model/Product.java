package com.wmsgroup.neuefische_wms.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document
@Builder
@With
@Getter
@EqualsAndHashCode
public class Product {
    @Id
    private final String id;
    @NonNull
    private final String name;
    @NonNull
    private final String categoryId;
    @NonNull
    private final BigDecimal price;
}
