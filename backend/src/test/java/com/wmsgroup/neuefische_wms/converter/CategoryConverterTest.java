package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CategoryConverterTest {

    @Test
    void testConvertWithoutParentId() {
        // Given
        CategoryInputDTO inputDTO = new CategoryInputDTO("TestCategory", null);

        // When
        Category result = CategoryConverter.convert(inputDTO);

        // Then
        assertNotNull(result);
        assertEquals("TestCategory", result.getName());
        assertNull(result.getParentId());
    }

    @Test
    void testConvertWithParentId() {
        // Given
        String parentId = "validParentId";
        CategoryInputDTO inputDTO = new CategoryInputDTO("ChildCategory", parentId);

        // When
        Category result = CategoryConverter.convert(inputDTO);

        // Then
        assertNotNull(result);
        assertEquals("ChildCategory", result.getName());
        assertEquals(parentId, result.getParentId());
    }

    @Test
    void testConvertWithNullInputThrowsException() {
        // Wenn / Dann
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> CategoryConverter.convert(null));
    }

    @Test
    void testConvertWithNullNameThrowsException() {
        // Given
        // Das Lombok-@NonNull auf dem name-Parameter erzeugt bei Übergabe von null automatisch eine NullPointerException
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> new CategoryInputDTO(null, null));
    }
}