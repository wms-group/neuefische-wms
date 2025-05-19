package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private IdService idService;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void addCategory_shouldReturnOutputDto_whenInputDtoIsValid() {
        // Given
        String generatedId = "new-id";
        Category testCategory = Category.builder().id(generatedId).name("Test Category").build();
        CategoryInputDTO inputDTO = new CategoryInputDTO("Test Category", null);
        CategoryOutputDTO outputDTO = new CategoryOutputDTO(generatedId, "Test Category", null);

        when(idService.generateId()).thenReturn(generatedId);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // When
        CategoryOutputDTO result = categoryService.addCategory(inputDTO);

        // Then
        assertEquals(outputDTO, result);
        assertEquals(generatedId, result.id());
        assertEquals("Test Category", result.name());

        verify(idService).generateId();
        verify(categoryRepository).save(any());
    }

    @Test
    void addCategory_shouldThrowIllegalArgumentException_whenParentIdDoesNotExist() {
        // Given
        String missingParentId = "missing-parent-id";
        CategoryInputDTO inputDTO = new CategoryInputDTO("Child Category", missingParentId);

        when(categoryRepository.existsById(missingParentId)).thenReturn(false);

        // When / Then
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> categoryService.addCategory(inputDTO)
        );
        assertEquals("Parent category with id missing-parent-id does not exist", ex.getMessage());

        verify(categoryRepository).existsById(missingParentId);
    }

    @Test
    void addCategory_shouldThrowNullPointerException_whenInputDtoIsNull() {
        // Given / When / Then
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> categoryService.addCategory(null));
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

        when(categoryRepository.findAll()).thenReturn(categories);

        // When
        List<CategoryOutputDTO> result = categoryService.getAllCategories();

        // Then
        assertEquals(outputDTOs, result);  // Hinweis: Hier wird verglichen, ob die Inhalte gleich sind. Die Konvertierung ist jetzt statisch im Service implementiert.
        verify(categoryRepository).findAll();
    }

    @Test
    void updateCategory_shouldReturnOutput_whenValid() {
        // Given
        String categoryId = "cat-1";
        CategoryInputDTO inputDTO = new CategoryInputDTO("Updated", null);
        Category updatedCategory = Category.builder().id(categoryId).name("Updated").build();
        CategoryOutputDTO outputDTO = new CategoryOutputDTO(categoryId, "Updated", null);

        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(categoryRepository.save(any(Category.class))).thenReturn(updatedCategory);

        // When
        CategoryOutputDTO result = categoryService.updateCategory(categoryId, inputDTO);

        // Then
        assertEquals(outputDTO, result);
        verify(categoryRepository).existsById(categoryId);
        verify(categoryRepository).save(any());
    }

    @Test
    void updateCategory_shouldThrowIllegalArgumentException_whenCategoryDoesNotExist() {
        // Given
        String categoryId = "notFound";
        CategoryInputDTO inputDTO = new CategoryInputDTO("newname", null);

        when(categoryRepository.existsById(categoryId)).thenReturn(false);

        // When/Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> categoryService.updateCategory(categoryId, inputDTO)
        );
        assertEquals("Category with id notFound does not exist", ex.getMessage());
        verify(categoryRepository).existsById(categoryId);
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void updateCategory_shouldThrowIllegalArgumentException_whenParentCategoryDoesNotExist() {
        // Given
        String categoryId = "cat-1";
        String parentCategoryId = "not-found";
        CategoryInputDTO inputDTO = new CategoryInputDTO("newname", parentCategoryId);

        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(categoryRepository.existsById(parentCategoryId)).thenReturn(false);

        // When/Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> categoryService.updateCategory(categoryId, inputDTO)
        );
        assertEquals("Parent category with id not-found does not exist", ex.getMessage());
        verify(categoryRepository).existsById(categoryId);
        verify(categoryRepository).existsById(parentCategoryId);
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void updateCategory_shouldThrowIllegalArgumentException_whenNameIsBlank() {
        // Given
        String categoryId = "cat-2";
        CategoryInputDTO inputDTO = new CategoryInputDTO("   ", null);

        when(categoryRepository.existsById(categoryId)).thenReturn(true);

        // When/Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> categoryService.updateCategory(categoryId, inputDTO)
        );
        assertEquals("Name must not be blank", ex.getMessage());
        verify(categoryRepository).existsById(categoryId);
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void deleteCategory_shouldDelete_whenExists() {
        // Given
        String categoryId = "cat-del";
        when(categoryRepository.existsById(categoryId)).thenReturn(true);

        // When
        categoryService.deleteCategory(categoryId);

        // Then
        verify(categoryRepository).existsById(categoryId);
        verify(productRepository).deleteAllByCategoryId(categoryId);
        verify(categoryRepository).deleteAllByParentId(categoryId);
        verify(categoryRepository).deleteById(categoryId);
    }

    @Test
    void deleteCategory_shouldThrow_whenNotExists() {
        // Given
        String categoryId = "notExist";
        when(categoryRepository.existsById(categoryId)).thenReturn(false);

        // When / Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> categoryService.deleteCategory(categoryId)
        );
        assertEquals("Category with id notExist does not exist", ex.getMessage());
        verify(categoryRepository).existsById(categoryId);
        verify(categoryRepository, never()).deleteById(anyString());
    }

    @Test
    void deleteCategoryAndMoveChildren_shouldDelete_whenChildrenExist() {
        // Given
        String categoryId = "cat-del";
        String moveToCategoryId = "cat-move";
        when(categoryRepository.existsById(categoryId)).thenReturn(true);
        when(categoryRepository.existsById(moveToCategoryId)).thenReturn(true);
        when(categoryRepository.findAllByParentId(categoryId))
                .thenReturn(
                        List.of(Category.builder()
                                .id("child-1")
                                .name("child-1")
                                .parentId(categoryId)
                                .build(),
                            Category.builder()
                                .id("child-2")
                                .name("child-2")
                                .parentId(categoryId)
                                .build()
                        ));
        when(productRepository.findAllByCategoryId(categoryId)).thenReturn(List.of(
                Product.builder().id("product-1").name("product-1").price(BigDecimal.ONE).categoryId(categoryId).build(),
                Product.builder().id("product-2").name("product-2").price(BigDecimal.TEN).categoryId("child-1").build(),
                Product.builder().id("product-3").name("product-3").price(BigDecimal.TEN).categoryId("child-1").build()
        ));

        // When
        categoryService.deleteCategoryAndMoveChildren(categoryId, moveToCategoryId);

        // Then
        verify(categoryRepository).existsById(categoryId);
        verify(categoryRepository).findAllByParentId(categoryId);
        verify(categoryRepository, times(2)).save(argThat(category -> category.getParentId() != null && category.getParentId().equals(moveToCategoryId)));
        verify(productRepository, times(3)).save(argThat(product -> product.getCategoryId().equals(moveToCategoryId)));
        verify(categoryRepository).deleteById(categoryId);
    }

    @Test
    void deleteCategoryAndMoveChildren_shouldThrow_whenCategoryNotExists() {
        // Given
        String categoryId = "notExist";
        String moveToCategoryId = "exists";
        when(categoryRepository.existsById(categoryId)).thenReturn(false);
        when(categoryRepository.existsById(moveToCategoryId)).thenReturn(true);

        // When / Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> categoryService.deleteCategoryAndMoveChildren(categoryId, moveToCategoryId)
        );
        assertEquals("Category with id notExist does not exist", ex.getMessage());
        verify(categoryRepository).existsById(categoryId);
        verify(categoryRepository, never()).deleteById(anyString());
    }

    @Test
    void deleteCategoryAndMoveChildren_shouldThrow_whenTargetCategoryNotExists() {
        // Given
        String categoryId = "notExist";
        String moveToCategoryId = "exists";
        when(categoryRepository.existsById(moveToCategoryId)).thenReturn(false);

        // When / Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> categoryService.deleteCategoryAndMoveChildren(categoryId, moveToCategoryId)
        );
        assertEquals("New category with id exists does not exist", ex.getMessage());
        verify(categoryRepository, never()).deleteById(anyString());
    }

    @Test
    void deleteCategoryAndMoveChildren_shouldThrow_whenTargetCategoryIsNullButProductsExist() {
        // Given
        String categoryId = "exists";
        String moveToCategoryId = null;
        when(productRepository.existsByCategoryId(categoryId)).thenReturn(true);

        // When / Then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> categoryService.deleteCategoryAndMoveChildren(categoryId, moveToCategoryId)
        );
        assertEquals("Can't move products to null category, empty category first!", ex.getMessage());
        verify(categoryRepository, never()).deleteById(anyString());
    }

    @Test
    void deleteCategoryAndMoveChildren_shouldDelete_whenTargetCategoryIsNullAndNoProductsExist() {
        // Given
        String categoryId = "exists";
        String moveToCategoryId = null;
        when(productRepository.existsByCategoryId(categoryId)).thenReturn(false);
        when(categoryRepository.existsById(categoryId)).thenReturn(true);

        // When / Then
        categoryService.deleteCategoryAndMoveChildren(categoryId, moveToCategoryId);

        verify(categoryRepository).deleteById(anyString());
    }
}