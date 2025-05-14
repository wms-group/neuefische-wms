package com.wmsgroup.neuefische_wms.model.dto;

import lombok.With;

public record CategoryOutputDTO(
        @With
        String id,
        String name,
        String parentId
) {
}
