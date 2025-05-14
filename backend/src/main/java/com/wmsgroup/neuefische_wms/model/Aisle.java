package com.wmsgroup.neuefische_wms.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.With;

@Document("aisles")
@Builder
@With
public record Aisle(
		@Id String id,
		String name,
		List<String> categoryIds,
		List<String> stockId) {

}
