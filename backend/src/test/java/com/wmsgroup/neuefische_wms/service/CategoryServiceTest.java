package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
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
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private IdService idService;

    @InjectMocks
    private CategoryService categoryManagerService;

    @Test
    void addCategory_shouldReturnOutputDto_whenInputDtoIsValid() {
        // Given
        String generatedId = "new-id";
        Category testCategory = Category.builder().id(generatedId).name("Test Category").build();
        CategoryInputDTO inputDTO = new CategoryInputDTO("Test Category", null);
        CategoryOutputDTO outputDTO = new CategoryOutputDTO(generatedId, "Test Category", null);

        Mockito.when(idService.generateId()).thenReturn(generatedId);
        Mockito.when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // When
        CategoryOutputDTO result = categoryManagerService.addCategory(inputDTO);

        // Then
        assertEquals(outputDTO, result);
        assertEquals(generatedId, result.id());
        assertEquals("Test Category", result.name());

        Mockito.verify(idService).generateId();
        Mockito.verify(categoryRepository).save(any());
    }

    @Test
    void addCategory_shouldThrowIllegalArgumentException_whenParentIdDoesNotExist() {
        // Given
        String missingParentId = "missing-parent-id";
        CategoryInputDTO inputDTO = new CategoryInputDTO("Child Category", missingParentId);

        Mockito.when(categoryRepository.existsById(missingParentId)).thenReturn(false);

        // When / Then
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> categoryManagerService.addCategory(inputDTO)
        );
        assertEquals("Category for parentId missing-parent-id does not exist", ex.getMessage());

        Mockito.verify(categoryRepository).existsById(missingParentId);
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
                Category.builder().id("id2").name("Cat2").parentId("id1").build()
        );
        List<CategoryOutputDTO> outputDTOs = List.of(
                new CategoryOutputDTO("id1", "Cat1", null),
                new CategoryOutputDTO("id2", "Cat2", "id1")
        );

        Mockito.when(categoryRepository.findAll()).thenReturn(categories);

        // When
        List<CategoryOutputDTO> result = categoryManagerService.getAllCategories();

        // Then
        assertEquals(outputDTOs, result);  // Hinweis: Hier wird verglichen, ob die Inhalte gleich sind. Die Konvertierung ist jetzt statisch im Service implementiert.
        Mockito.verify(categoryRepository).findAll();
    }
}