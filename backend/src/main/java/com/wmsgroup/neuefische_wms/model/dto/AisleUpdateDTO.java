package com.wmsgroup.neuefische_wms.model.dto;

import java.util.List;

public record AisleUpdateDTO(String id, String name, List<String> categoryIds, List<String> stockIds) {

}
