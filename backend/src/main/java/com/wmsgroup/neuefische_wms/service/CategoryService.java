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
        if (categoryInputDTO.name().isBlank()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
        if (categoryInputDTO.parentId() != null && !categoryRepository.existsById(categoryInputDTO.parentId())) {
            throw new IllegalArgumentException(String.format("Parent category with id %s does not exist", categoryInputDTO.parentId()));
        }
        return CategoryOutputDTOConverter.convert(
                categoryRepository.save(
                        CategoryConverter.convert(categoryInputDTO)
                                .withId(idService.generateId())
                )
        );
    }

    public CategoryOutputDTO updateCategory(@NonNull String id, @NonNull CategoryInputDTO categoryInputDTO) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException(String.format("Category with id %s does not exist", id));
        }
        if (categoryInputDTO.name().isBlank()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
        return CategoryOutputDTOConverter.convert(
                categoryRepository.save(
                        CategoryConverter.convert(categoryInputDTO)
                                .withId(id)
                )
        );
    }

    public void deleteCategory(@NonNull String id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException(String.format("Category with id %s does not exist", id));
        }
        categoryRepository.deleteById(id);
    }
}