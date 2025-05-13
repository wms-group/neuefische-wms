package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.dto.CategoryManagerInputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryConverter {
    private final CategoryRepository categoryRepository;

    public Category convert(@NonNull CategoryManagerInputDTO categoryManagerInputDTO) {
        if (categoryManagerInputDTO.parentId() != null
                && !categoryRepository.existsById(categoryManagerInputDTO.parentId())
        ) {
            throw new IllegalArgumentException(String.format("Category for parentId %s does not exist", categoryManagerInputDTO.parentId()));
        }
        return Category.builder()
                .name(categoryManagerInputDTO.name())
                .parentId(categoryManagerInputDTO.parentId())
                .build();
    }
}
