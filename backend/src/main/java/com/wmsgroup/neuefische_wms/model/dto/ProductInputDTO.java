package com.wmsgroup.neuefische_wms.model.dto;

import lombok.NonNull;

public record ProductInputDTO(
        @NonNull
        String name,
        @NonNull
        String categoryId,
        @NonNull
        String price
) {
}
