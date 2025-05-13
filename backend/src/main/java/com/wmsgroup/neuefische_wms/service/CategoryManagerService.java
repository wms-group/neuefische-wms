package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.converter.CategoryConverter;
import com.wmsgroup.neuefische_wms.converter.CategoryManagerOutputDTOConverter;
import com.wmsgroup.neuefische_wms.dto.CategoryManagerInputDTO;
import com.wmsgroup.neuefische_wms.dto.CategoryManagerOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryManagerService {
    private final CategoryRepository categoryRepository;
    private final IdService idService;
    private final CategoryManagerOutputDTOConverter categoryManagerOutputDTOConverter;
    private final CategoryConverter categoryConverter;

    public List<CategoryManagerOutputDTO> getAllCategories() {
        return categoryManagerOutputDTOConverter.convert(categoryRepository.findAll());
    }

    public CategoryManagerOutputDTO addCategory(@NonNull CategoryManagerInputDTO categoryManagerInputDTO) {
        return categoryManagerOutputDTOConverter.convert(
                categoryRepository.save(
                        categoryConverter.convert(categoryManagerInputDTO)
                                .withId(idService.generateId())
                )
        );
    }
}
