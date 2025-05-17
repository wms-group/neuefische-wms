package com.wmsgroup.neuefische_wms.model.dto;

import lombok.With;

public record ProductOutputDTO(
        @With
        String id,
        String name,
        String categoryId,
        String price
) {
}
