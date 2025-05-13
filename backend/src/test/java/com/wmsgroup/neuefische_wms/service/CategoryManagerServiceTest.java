package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.converter.CategoryConverter;
import com.wmsgroup.neuefische_wms.converter.CategoryManagerOutputDTOConverter;
import com.wmsgroup.neuefische_wms.dto.CategoryManagerInputDTO;
import com.wmsgroup.neuefische_wms.dto.CategoryManagerOutputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;

@ExtendWith(MockitoExtension.class)
public class CategoryManagerServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private IdService idService;

    @Mock
    private CategoryManagerOutputDTOConverter categoryManagerOutputDTOConverter;

    @Mock
    private CategoryConverter categoryConverter;

    @InjectMocks
    private CategoryManagerService categoryManagerService;

    @Test
    void addCategory_shouldReturnOutputDto_whenInputDtoIsValid() {
        // Given
        String generatedId = "new-id";
        Category testCategory = Category.builder().id(generatedId).name("Test Category").build();
        CategoryManagerInputDTO inputDTO = new CategoryManagerInputDTO("Test Category", null);
        CategoryManagerOutputDTO outputDTO = new CategoryManagerOutputDTO(generatedId, "Test Category");

        Mockito.when(idService.generateId()).thenReturn(generatedId);
        Mockito.when(categoryConverter.convert(eq(inputDTO))).thenReturn(testCategory);
        Mockito.when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        Mockito.when(categoryManagerOutputDTOConverter.convert(any(Category.class))).thenReturn(outputDTO);

        // When
        CategoryManagerOutputDTO result = categoryManagerService.addCategory(inputDTO);

        // Then
        assertEquals(generatedId, result.id());
        assertEquals("Test Category", result.name());

        Mockito.verify(idService).generateId();
        Mockito.verify(categoryConverter).convert(eq(inputDTO));
        Mockito.verify(categoryRepository).save(any());
        Mockito.verify(categoryManagerOutputDTOConverter).convert(argThat((Category input) -> input.equals(testCategory)));
    }

    @Test
    void addCategory_shouldThrowNullPointerException_whenInputDtoIsNull() {
        // Given / When / Then
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> categoryManagerService.addCategory(null));
    }

    @Test
    void getAllCategories_shouldReturnCategoryDtoList_whenCategoriesExist() {
        // Given
        List<Category> categories = List.of(
                Category.builder().id("id1").name("Cat1").build(),
                Category.builder().id("id2").name("Cat2").build()
        );
        List<CategoryManagerOutputDTO> outputDTOs = List.of(
                new CategoryManagerOutputDTO("id1", "Cat1"),
                new CategoryManagerOutputDTO("id2", "Cat2")
        );

        Mockito.when(categoryRepository.findAll()).thenReturn(categories);
        Mockito.when(categoryManagerOutputDTOConverter.convert(categories)).thenReturn(outputDTOs);

        // When
        List<CategoryManagerOutputDTO> result = categoryManagerService.getAllCategories();

        // Then
        assertEquals(outputDTOs, result);
        Mockito.verify(categoryRepository).findAll();
        Mockito.verify(categoryManagerOutputDTOConverter).convert(categories);
    }
}