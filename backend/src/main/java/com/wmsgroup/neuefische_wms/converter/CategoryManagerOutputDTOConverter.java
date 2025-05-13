package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.dto.CategoryManagerOutputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryManagerOutputDTOConverter {
    public CategoryManagerOutputDTO convert(@NonNull Category category) {
        return new CategoryManagerOutputDTO(
                category.getId(),
                category.getName()
        );
    }

    public List<CategoryManagerOutputDTO> convert(@NonNull List<Category> categories) {
        return categories.stream().map(this::convert).toList();
    }
}
