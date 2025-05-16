package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.ProductInputDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductConverterTest {

    @Test
    void testConvert_shouldThrowNullPointerException_whenCategoryIdIsNull() {
        // Then
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> new ProductInputDTO("TestProduct", null, "10.00"));
    }

    @Test
    void testConvertWithCategoryId() {
        // Given
        String categoryId = "validCategoryId";
        ProductInputDTO inputDTO = new ProductInputDTO("ChildProduct", categoryId, "10.00");

        // When
        Product result = ProductConverter.convert(inputDTO);

        // Then
        assertNotNull(result);
        assertEquals("ChildProduct", result.getName());
        assertEquals(categoryId, result.getCategoryId());
    }

    @Test
    void testConvertWithNullInputThrowsException() {
        // Wenn / Dann
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> ProductConverter.convert(null));
    }

    @Test
    void testConvertWithNullNameThrowsException() {
        // Given
        // Das Lombok-@NonNull auf dem name-Parameter erzeugt bei Übergabe von null automatisch eine NullPointerException
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> new ProductInputDTO(null, null, "10.00"));
    }
}