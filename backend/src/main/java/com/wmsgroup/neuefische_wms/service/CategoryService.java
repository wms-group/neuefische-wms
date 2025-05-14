package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.converter.CategoryConverter;
import com.wmsgroup.neuefische_wms.converter.CategoryOutputDTOConverter;
import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final IdService idService;

    public List<CategoryOutputDTO> getAllCategories() {
        return CategoryOutputDTOConverter.convert(categoryRepository.findAll());
    }

    public CategoryOutputDTO addCategory(@NonNull CategoryInputDTO categoryInputDTO) {
        if (categoryInputDTO.parentId() != null && !categoryRepository.existsById(categoryInputDTO.parentId())) {
            throw new IllegalArgumentException(String.format("Category for parentId %s does not exist", categoryInputDTO.parentId()));
        }
        if (categoryInputDTO.name().isBlank()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
        return CategoryOutputDTOConverter.convert(
                categoryRepository.save(
                        CategoryConverter.convert(categoryInputDTO)
                                .withId(idService.generateId())
                )
        );
    }
}
