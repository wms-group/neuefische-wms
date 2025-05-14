package com.wmsgroup.neuefische_wms.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.AisleUpdateDTO;

import lombok.Builder;
import lombok.With;

@Document("aisles")
@Builder
@With
public record Aisle(
		@Id String id,
		String name,
		List<String> categoryIds,
		List<String> stockIds) {

	public static Aisle of(AisleCreationDTO dto) {
		return new Aisle("", dto.name(), dto.categoryIds(), dto.stockIds());
	}

	public static Aisle of(AisleUpdateDTO dto) {
		return new Aisle(dto.id(), dto.name(), dto.categoryIds(), dto.stockIds());
	}
}
