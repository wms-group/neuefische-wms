package com.wmsgroup.neuefische_wms.model.dto;

import com.mongodb.lang.Nullable;
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
