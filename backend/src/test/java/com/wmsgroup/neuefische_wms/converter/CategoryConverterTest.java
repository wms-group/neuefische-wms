package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.dto.CategoryManagerInputDTO;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryConverterTest {
    private CategoryConverter categoryConverter;

    @Mock
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        categoryConverter = new CategoryConverter(categoryRepository);
    }

    @Test
    void testConvertWithoutParentId() {
        // Given
        CategoryManagerInputDTO inputDTO = new CategoryManagerInputDTO("TestCategory", null);

        // When
        Category result = categoryConverter.convert(inputDTO);

        // Then
        assertNotNull(result);
        assertEquals("TestCategory", result.getName());
        assertNull(result.getParentId());
    }

    @Test
    void testConvertWithValidParentId() {
        // Given
        String parentId = "validParentId";
        when(categoryRepository.existsById(parentId)).thenReturn(true);
        CategoryManagerInputDTO inputDTO = new CategoryManagerInputDTO("ChildCategory", parentId);

        // When
        Category result = categoryConverter.convert(inputDTO);

        // Then
        assertNotNull(result);
        assertEquals("ChildCategory", result.getName());
        assertEquals(parentId, result.getParentId());
        verify(categoryRepository).existsById(parentId);
    }

    @Test
    void testConvertWithInvalidParentIdThrowsException() {
        // Given
        String parentId = "invalidParentId";
        when(categoryRepository.existsById(parentId)).thenReturn(false);
        CategoryManagerInputDTO inputDTO = new CategoryManagerInputDTO("ChildCategory", parentId);

        // When / Then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> categoryConverter.convert(inputDTO));
        assertEquals("Category for parentId invalidParentId does not exist", exception.getMessage());
        verify(categoryRepository).existsById(parentId);
    }
    
    @Test
    void testConvertWithNullInputThrowsException() {
        // Wenn / Dann
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> categoryConverter.convert(null));
    }

    @Test
    void testConvertWithNullNameThrowsException() {
        // Given
        // Das Lombok-@NonNull auf dem name-Parameter erzeugt bei Übergabe von null automatisch eine NullPointerException
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> new CategoryManagerInputDTO(null, null));
    }
}