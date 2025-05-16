package com.wmsgroup.neuefische_wms.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.wmsgroup.neuefische_wms.model.dto.HallCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.HallUpdateDTO;

import lombok.With;

@Document("halls")
@With
public record Hall(@Id String id, String name, List<String> aisleIds) {
	public static Hall of(HallCreationDTO dto) {
		return new Hall("", dto.name(), dto.aisleIds());
	}

	public static Hall of(HallUpdateDTO dto) {
		return new Hall(dto.id(), dto.name(), dto.aisleIds());
	}

    public Hall withId(String id) {
        return new Hall(id, name, aisleIds);
    }

    public Hall withName(String name) {
        return new Hall(id, name, aisleIds);
    }

    public Hall withAisleIds(List<String> aisleIds) {
        return new Hall(id, name, aisleIds);
    }
}
