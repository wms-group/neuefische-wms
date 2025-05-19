package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import lombok.NonNull;

public class CategoryConverter {
    /**
     * Private constructor to prevent instantiation of this utility class.
     *
     * @throws UnsupportedOperationException always, because this is a utility class.
     */
    private CategoryConverter() {
        // Utility class
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static Category convert(@NonNull CategoryInputDTO categoryInputDTO) {
        return Category.builder()
                .name(categoryInputDTO.name())
                .parentId(categoryInputDTO.parentId())
                .build();
    }
}
