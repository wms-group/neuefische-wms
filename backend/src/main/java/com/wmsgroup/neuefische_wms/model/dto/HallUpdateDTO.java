package com.wmsgroup.neuefische_wms.model.dto;

import java.util.List;

public record HallUpdateDTO(String id, String name, List<String> aisleIds) {

}
