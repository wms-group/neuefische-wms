package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.ProductInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private IdService idService;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeAll
    static void setUp() {
        Locale.setDefault(Locale.forLanguageTag("de-DE"));
    }

    @Test
    void addProduct_shouldReturnOutputDto_whenInputDtoIsValid() {
        // Given
        String generatedId = "new-id";
        Product testProduct = Product.builder().id(generatedId).name("Test Product").categoryId("cat-1").price(BigDecimal.TEN).build();
        ProductInputDTO inputDTO = new ProductInputDTO("Test Product", "cat-1", "10,00");
        ProductOutputDTO outputDTO = new ProductOutputDTO(generatedId, "Test Product", "cat-1", "10,00");

        Mockito.when(idService.generateId()).thenReturn(generatedId);
        Mockito.when(productRepository.save(ArgumentMatchers.any(Product.class))).thenReturn(testProduct);
        Mockito.when(categoryRepository.existsById(ArgumentMatchers.any(String.class))).thenReturn(true);

        // When
        ProductOutputDTO result = productService.addProduct(inputDTO);

        // Then
        assertEquals(outputDTO, result);
        assertEquals(generatedId, result.id());
        assertEquals("Test Product", result.name());
        assertEquals("cat-1", result.categoryId());
        assertEquals("10,00", result.price());

        Mockito.verify(idService).generateId();
        Mockito.verify(productRepository).save(any());
    }

    @Test
    void addProduct_shouldThrowIllegalArgumentException_whenCategoryIdDoesNotExist() {
        // Given
        String missingCategoryId = "missing-category-id";
        ProductInputDTO inputDTO = new ProductInputDTO("Child Product", missingCategoryId, "10,00" );

        Mockito.when(categoryRepository.existsById(missingCategoryId)).thenReturn(false);

        // When / Then
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> productService.addProduct(inputDTO)
        );
        assertEquals("Category for categoryId missing-category-id does not exist", ex.getMessage());

        Mockito.verify(categoryRepository).existsById(missingCategoryId);
    }

    @Test
    void addProduct_shouldThrowNullPointerException_whenInputDtoIsNull() {
        // Given / When / Then
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> productService.addProduct(null));
    }

    @Test
    void getAllProducts_shouldReturnProductDtoList_whenProductsExist() {
        // Given
        List<Product> products = List.of(
                Product.builder().id("id1").name("Prod1").categoryId("id1").price(BigDecimal.TEN).build(),
                Product.builder().id("id2").name("Prod2").categoryId("id1").price(BigDecimal.ONE).build()
        );
        List<ProductOutputDTO> outputDTOs = List.of(
                new ProductOutputDTO("id1", "Prod1", "id1", "10,00"),
                new ProductOutputDTO("id2", "Prod2", "id1", "1,00")
        );

        Mockito.when(productRepository.findAll()).thenReturn(products);

        // When
        List<ProductOutputDTO> result = productService.getAllProducts();

        // Then
        assertEquals(outputDTOs, result);  // Hinweis: Hier wird verglichen, ob die Inhalte gleich sind. Die Konvertierung ist jetzt statisch im Service implementiert.
        Mockito.verify(productRepository).findAll();
    }

    @Test
    void getAllProducts_shouldReturnEmptyList_whenNoProductsExist() {
        // Given
        Mockito.when(productRepository.findAll()).thenReturn(List.of());

        // When
        List<ProductOutputDTO> result = productService.getAllProducts();

        // Then
        assertEquals(List.of(), result);
        Mockito.verify(productRepository).findAll();
    }
    @Test
    void getProductsByCategoryId_shouldReturnProductDtoList_whenProductsExist() {
        // Given
        List<Product> products = List.of(
                Product.builder().id("id1").name("Prod1").categoryId("cat-1").price(BigDecimal.TEN).build(),
                Product.builder().id("id2").name("Prod2").categoryId("cat-1").price(BigDecimal.ONE).build()
        );
        List<ProductOutputDTO> outputDTOs = List.of(
                new ProductOutputDTO("id1", "Prod1", "cat-1", "10,00"),
                new ProductOutputDTO("id2", "Prod2", "cat-1", "1,00")
        );

        Mockito.when(categoryRepository.existsById("cat-1")).thenReturn(true);
        Mockito.when(productRepository.findAllByCategoryId("cat-1")).thenReturn(products);

        // When
        List<ProductOutputDTO> result = productService.getProductsByCategoryId("cat-1");

        // Then
        assertEquals(outputDTOs, result);  // Hinweis: Hier wird verglichen, ob die Inhalte gleich sind. Die Konvertierung ist jetzt statisch im Service implementiert.
        Mockito.verify(productRepository).findAllByCategoryId("cat-1");
        Mockito.verify(categoryRepository).existsById("cat-1");
    }

    @Test
    void getProductsByCategoryId_shouldReturnEmptyList_whenNoProductsExist() {
        // Given
        Mockito.when(productRepository.findAllByCategoryId("cat-1")).thenReturn(List.of());
        Mockito.when(categoryRepository.existsById("cat-1")).thenReturn(true);

        // When
        List<ProductOutputDTO> result = productService.getProductsByCategoryId("cat-1");

        // Then
        assertEquals(List.of(), result);
        Mockito.verify(productRepository).findAllByCategoryId("cat-1");
        Mockito.verify(categoryRepository).existsById("cat-1");
    }

    @Test
    void getProductsByCategoryId_shouldThrowNullPointerException_whenCategoryIdIsNull() {
        // When / Then
        //noinspection DataFlowIssue
        assertThrows(NullPointerException.class, () -> productService.getProductsByCategoryId(null));
    }

    @Test
    void getProductsByCategoryId_shouldThrowIllegalArgumentsException_whenCategoryIdDoesNotExist() {
        // When
        Mockito.when(categoryRepository.existsById("cat-1")).thenReturn(false);

        // When / Then
        assertThrows(IllegalArgumentException.class, () -> productService.getProductsByCategoryId("cat-1"));
        Mockito.verify(categoryRepository).existsById("cat-1");
    }
}