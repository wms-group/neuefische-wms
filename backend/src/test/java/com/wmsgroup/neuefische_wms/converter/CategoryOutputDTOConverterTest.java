package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CategoryOutputDTOConverterTest {
    @Test
    void convert_shouldConvertCategoryToCategoryManagerOutputDTO() {
        // Arrange
        Category category = Category.builder()
                .id("123")
                .name("Electronics")
                .build();

        // Act
        CategoryOutputDTO result = CategoryOutputDTOConverter.convert(category);

        // Assert
        assertNotNull(result);
        assertEquals("123", result.id());
        assertEquals("Electronics", result.name());
    }

    @Test
    void convert_shouldHandleEmptyList() {
        // Arrange
        List<Category> categories = List.of();

        // Act
        List<CategoryOutputDTO> result = CategoryOutputDTOConverter.convert(categories);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    @Test
    void convert_shouldConvertCategoryListToCategoryManagerOutputDTOList() {
        // Arrange
        Category category1 = Category.builder()
                .id("123")
                .name("Electronics")
                .build();

        Category category2 = Category.builder()
                .id("456")
                .name("Books")
                .build();

        List<Category> categories = List.of(category1, category2);

        // Act
        List<CategoryOutputDTO> result = CategoryOutputDTOConverter.convert(categories);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("123", result.get(0).id());
        assertEquals("Electronics", result.get(0).name());
        assertEquals("456", result.get(1).id());
        assertEquals("Books", result.get(1).name());
    }

    @Test
    void convert_shouldThrowNullPointerException_whenCalledWithNullCategory() {
        assertThrows(NullPointerException.class, () -> {
            //noinspection DataFlowIssue
            CategoryOutputDTOConverter.convert((Category) null); });
    }

    @Test
    void convert_shouldThrowNullPointerException_whenCalledWithNullCategoryList() {
        assertThrows(NullPointerException.class, () -> {
            //noinspection DataFlowIssue
            CategoryOutputDTOConverter.convert((List<Category>) null); });
    }

}