package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import lombok.NonNull;

import java.util.List;

public class CategoryOutputDTOConverter {
    /**
     * Private constructor to prevent instantiation of this utility class.
     *
     * @throws UnsupportedOperationException always, because this is a utility class.
     */
    private CategoryOutputDTOConverter() {
        // Utility class
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static CategoryOutputDTO convert(@NonNull Category category) {
        return new CategoryOutputDTO(
                category.getId(),
                category.getName(),
                category.getParentId(),
                0,
                0
        );
    }

    public static List<CategoryOutputDTO> convert(@NonNull List<Category> categories) {
        return categories.stream().map(CategoryOutputDTOConverter::convert).toList();
    }
}
