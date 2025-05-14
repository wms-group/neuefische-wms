package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.converter.CategoryConverter;
import com.wmsgroup.neuefische_wms.converter.CategoryOutputDTOConverter;
import com.wmsgroup.neuefische_wms.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.dto.CategoryOutputDTO;
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
    private final CategoryOutputDTOConverter categoryOutputDTOConverter;
    private final CategoryConverter categoryConverter;

    public List<CategoryOutputDTO> getAllCategories() {
        return CategoryOutputDTOConverter.convert(categoryRepository.findAll());
    }

    public CategoryOutputDTO addCategory(@NonNull CategoryInputDTO categoryManagerInputDTO) {
        if (categoryManagerInputDTO.parentId() != null && !categoryRepository.existsById(categoryManagerInputDTO.parentId())) {
            throw new IllegalArgumentException(String.format("Category for parentId %s does not exist", categoryManagerInputDTO.parentId()));
        }
        return categoryOutputDTOConverter.convert(
                categoryRepository.save(
                        categoryConverter.convert(categoryManagerInputDTO)
                                .withId(idService.generateId())
                )
        );
    }
}
