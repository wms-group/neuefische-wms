package com.wmsgroup.neuefische_wms.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.With;

@Document("stock")
@With
public record Stock(@Id String id, String productId, int amount) {
}
