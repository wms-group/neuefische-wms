package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;

class ProductOutputDTOConverterTest {

    @BeforeAll
    static void setUp() {
        Locale.setDefault(Locale.forLanguageTag("de-DE"));
    }

    @Test
    void convert_shouldConvertProductToProductOutputDTO() {
        // Arrange
        Product product = Product.builder()
                .id("123")
                .name("Electronics")
                .categoryId("1")
                .price(BigDecimal.TEN)
                .build();

        // Act
        ProductOutputDTO result = ProductOutputDTOConverter.convert(product);

        // Assert
        assertNotNull(result);
        assertEquals("123", result.id());
        assertEquals("Electronics", result.name());
        assertEquals("1", result.categoryId());
        assertEquals("10,00", result.price());
    }

    @Test
    void convert_shouldHandleEmptyList() {
        // Arrange
        List<Product> products = List.of();

        // Act
        List<ProductOutputDTO> result = ProductOutputDTOConverter.convert(products);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    @Test
    void convert_shouldConvertProductListToProductOutputDTOList() {
        // Arrange
        Product product1 = Product.builder()
                .id("123")
                .name("Electronics")
                .categoryId("1")
                .price(BigDecimal.TEN)
                .build();

        Product product2 = Product.builder()
                .id("456")
                .name("Books")
                .categoryId("2")
                .price(BigDecimal.ONE)
                .build();

        List<Product> products = List.of(product1, product2);

        // Act
        List<ProductOutputDTO> result = ProductOutputDTOConverter.convert(products);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("123", result.getFirst().id());
        assertEquals("Electronics", result.getFirst().name());
        assertEquals("1", result.get(0).categoryId());
        assertEquals("10,00", result.get(0).price());
        assertEquals("456", result.get(1).id());
        assertEquals("Books", result.get(1).name());
        assertEquals("2", result.get(1).categoryId());
        assertEquals("1,00", result.get(1).price());
    }

    @Test
    void convert_shouldThrowNullPointerException_whenCalledWithNullProduct() {
        assertThrows(NullPointerException.class, () -> {
            //noinspection DataFlowIssue
            ProductOutputDTOConverter.convert((Product) null); });
    }

    @Test
    void convert_shouldThrowNullPointerException_whenCalledWithNullProductList() {
        assertThrows(NullPointerException.class, () -> {
            //noinspection DataFlowIssue
            ProductOutputDTOConverter.convert((List<Product>) null); });
    }

    @Test
    void testInstantiationFails() {
        InvocationTargetException exception = assertThrows(
                InvocationTargetException.class,
                () -> {
                    // via Reflection Instanziierung erzwingen, da Konstruktor privat ist
                    var constructor = ProductOutputDTOConverter.class.getDeclaredConstructor();
                    constructor.setAccessible(true);
                    constructor.newInstance();
                }
        );
        assertInstanceOf(UnsupportedOperationException.class, exception.getCause());
    }
}