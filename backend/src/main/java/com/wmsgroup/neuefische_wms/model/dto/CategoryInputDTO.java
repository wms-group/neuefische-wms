package com.wmsgroup.neuefische_wms.model.dto;

import com.mongodb.lang.Nullable;
import lombok.NonNull;

public record CategoryInputDTO(
        @NonNull
        String name,
        @Nullable
        String parentId
) {
}
