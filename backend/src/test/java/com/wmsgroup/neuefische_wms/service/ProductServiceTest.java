package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.exception.CategoryNotFoundException;
import com.wmsgroup.neuefische_wms.exception.NoValidNumberException;
import com.wmsgroup.neuefische_wms.exception.NotBlankException;
import com.wmsgroup.neuefische_wms.exception.ProductNotFoundException;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.ProductInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

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

        when(idService.generateId()).thenReturn(generatedId);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);
        when(categoryRepository.existsById(any(String.class))).thenReturn(true);

        // When
        ProductOutputDTO result = productService.addProduct(inputDTO);

        // Then
        assertEquals(outputDTO, result);
        assertEquals(generatedId, result.id());
        assertEquals("Test Product", result.name());
        assertEquals("cat-1", result.categoryId());
        assertEquals("10,00", result.price());

        verify(idService).generateId();
        verify(productRepository).save(any());
    }

    @Test
    void addProduct_shouldThrowCategoryNotFoundException_whenCategoryIdDoesNotExist() {
        // Given
        String missingCategoryId = "missing-category-id";
        ProductInputDTO inputDTO = new ProductInputDTO("Child Product", missingCategoryId, "10,00" );

        when(categoryRepository.existsById(missingCategoryId)).thenReturn(false);

        // When / Then
        CategoryNotFoundException ex = assertThrows(
                CategoryNotFoundException.class,
                () -> productService.addProduct(inputDTO)
        );
        assertEquals("Kategorie für die Id missing-category-id existiert nicht.", ex.getMessage());
        assertEquals("product/new/categoryId", ex.getPath());

        verify(categoryRepository).existsById(missingCategoryId);
        verify(productRepository, never()).save(any());
    }

    @Test
    void addProduct_shouldThrowNotBlankException_whenNameIsBlank() {
        // Given
        String categoryId = "category-id";
        ProductInputDTO inputDTO = new ProductInputDTO("   ", categoryId, "10,00" );

        // When / Then
        NotBlankException ex = assertThrows(
                NotBlankException.class,
                () -> productService.addProduct(inputDTO)
        );
        assertEquals("Name darf nicht leer sein!", ex.getMessage());
        assertEquals("product/new/name", ex.getPath());

        verify(productRepository, never()).save(any());
    }

    @Test
    void addProduct_shouldThrowNotBlankException_whenPriceIsBlank() {
        // Given
        String categoryId = "category-id";
        ProductInputDTO inputDTO = new ProductInputDTO("Product", categoryId, "   " );

        // When / Then
        NotBlankException ex = assertThrows(
                NotBlankException.class,
                () -> productService.addProduct(inputDTO)
        );
        assertEquals("Preis darf nicht leer sein!", ex.getMessage());
        assertEquals("product/new/price", ex.getPath());

        verify(productRepository, never()).save(any());
    }

    @Test
    void addProduct_shouldThrowNoValidNumberException_whenPriceIsNotNumeric() {
        // Given
        String categoryId = "category-id";
        ProductInputDTO inputDTO = new ProductInputDTO("Product", categoryId, "xxx" );

        // When / Then
        NoValidNumberException ex = assertThrows(
                NoValidNumberException.class,
                () -> productService.addProduct(inputDTO)
        );
        assertEquals("Preis muss eine gültige Zahl sein!", ex.getMessage());
        assertEquals("product/new/price", ex.getPath());

        verify(productRepository, never()).save(any());
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

        when(productRepository.findAll()).thenReturn(products);

        // When
        List<ProductOutputDTO> result = productService.getAllProducts();

        // Then
        assertEquals(outputDTOs, result);  // Hinweis: Hier wird verglichen, ob die Inhalte gleich sind. Die Konvertierung ist jetzt statisch im Service implementiert.
        verify(productRepository).findAll();
    }

    @Test
    void updateProduct_shouldUpdateAndReturnProductOutputDTO() {
        // Given
        String productId = "1";
        ProductInputDTO inputDTO = new ProductInputDTO("TestProduct", "cat1", "10,00");
        when(productRepository.existsById(productId)).thenReturn(true);
        when(categoryRepository.existsById(anyString())).thenReturn(true);
        when(productRepository.save(any())).thenReturn(mock(Product.class));

        // When
        ProductOutputDTO result = productService.updateProduct(productId, inputDTO);

        // Then
        assertNotNull(result);
        verify(productRepository).existsById(productId);
        verify(categoryRepository).existsById("cat1");
        verify(productRepository).save(any());
    }

    @Test
    void updateProduct_shouldThrowIfProductDoesNotExist() {
        // Given
        String productId = "doesNotExist";
        ProductInputDTO inputDTO = new ProductInputDTO("Test Product", "cat-1", "10,00");
        when(productRepository.existsById(productId)).thenReturn(false);

        // When / Then
        ProductNotFoundException ex = assertThrows(ProductNotFoundException.class, () ->
                productService.updateProduct(productId, inputDTO)
        );

        assertEquals("Produkt mit Id doesNotExist existiert nicht.", ex.getMessage());
        assertEquals("product/doesNotExist/", ex.getPath());

        verify(productRepository).existsById(productId);
        verify(productRepository, never()).save(any());
    }

    @Test
    void updateProduct_shouldThrowIfCategoryDoesNotExist() {
        // Given
        String productId = "1";
        String invalidCatId = "invalidCat";
        ProductInputDTO inputDTO = new ProductInputDTO("Test Product", invalidCatId, "10,00");
        when(productRepository.existsById(productId)).thenReturn(true);
        when(categoryRepository.existsById(invalidCatId)).thenReturn(false);

        // When / Then
        CategoryNotFoundException ex = assertThrows(CategoryNotFoundException.class, () ->
                productService.updateProduct(productId, inputDTO)
        );

        assertEquals("Kategorie für die Id invalidCat existiert nicht.", ex.getMessage());
        assertEquals("product/1/categoryId", ex.getPath());

        verify(categoryRepository).existsById(invalidCatId);
        verify(productRepository, never()).save(any());
    }

    @Test
    void updateProduct_shouldThrowIfNameIsBlank() {
        // Given
        String productId = "1";
        ProductInputDTO inputDTO = new ProductInputDTO("   ", "cat1", "10,00");
        when(productRepository.existsById(productId)).thenReturn(true);

        // When / Then
        NotBlankException ex = assertThrows(NotBlankException.class, () ->
                productService.updateProduct(productId, inputDTO)
        );

        assertEquals("Name darf nicht leer sein!", ex.getMessage());
        assertEquals("product/1/name", ex.getPath());

        verify(productRepository, never()).save(any());
    }

    @Test
    void updateProduct_shouldThrowIfPriceIsBlank() {
        // Given
        String productId = "1";
        ProductInputDTO inputDTO = new ProductInputDTO("Product", "cat1", "   ");
        when(productRepository.existsById(productId)).thenReturn(true);

        // When / Then
        NotBlankException ex = assertThrows(NotBlankException.class, () ->
                productService.updateProduct(productId, inputDTO)
        );

        assertEquals("Preis darf nicht leer sein!", ex.getMessage());
        assertEquals("product/1/price", ex.getPath());

        verify(productRepository, never()).save(any());
    }

    @Test
    void updateProduct_shouldThrowIfPriceIsNonNumeric() {
        // Given
        String productId = "1";
        ProductInputDTO inputDTO = new ProductInputDTO("Product", "cat1", "Acht Dollar");
        when(productRepository.existsById(productId)).thenReturn(true);

        // When / Then
        NoValidNumberException ex = assertThrows(NoValidNumberException.class, () ->
                productService.updateProduct(productId, inputDTO)
        );

        assertEquals("Preis muss eine gültige Zahl sein!", ex.getMessage());
        assertEquals("product/1/price", ex.getPath());

        verify(productRepository, never()).save(any());
    }

    @Test
    void deleteProduct_shouldDeleteIfExists() {
        String productId = "10";
        when(productRepository.existsById(productId)).thenReturn(true);

        productService.deleteProduct(productId);

        verify(productRepository).deleteById(productId);
    }

    @Test
    void deleteProduct_shouldThrowIfNotExist() {
        String productId = "notfound";
        when(productRepository.existsById(productId)).thenReturn(false);

        ProductNotFoundException ex = assertThrows(ProductNotFoundException.class, () ->
                productService.deleteProduct(productId)
        );

        assertEquals("Produkt mit Id notfound existiert nicht.", ex.getMessage());
        assertEquals("product/notfound/", ex.getPath());

        verify(productRepository, never()).delete(any());
    }

    @Test
    void getAllProducts_shouldReturnEmptyList_whenNoProductsExist() {
        // Given
        when(productRepository.findAll()).thenReturn(List.of());

        // When
        List<ProductOutputDTO> result = productService.getAllProducts();

        // Then
        assertEquals(List.of(), result);
        verify(productRepository).findAll();
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

        when(categoryRepository.existsById("cat-1")).thenReturn(true);
        when(productRepository.findAllByCategoryId("cat-1")).thenReturn(products);

        // When
        List<ProductOutputDTO> result = productService.getProductsByCategoryId("cat-1");

        // Then
        assertEquals(outputDTOs, result);  // Hinweis: Hier wird verglichen, ob die Inhalte gleich sind. Die Konvertierung ist jetzt statisch im Service implementiert.
        verify(productRepository).findAllByCategoryId("cat-1");
        verify(categoryRepository).existsById("cat-1");
    }

    @Test
    void getProductsByCategoryId_shouldReturnEmptyList_whenNoProductsExist() {
        // Given
        when(productRepository.findAllByCategoryId("cat-1")).thenReturn(List.of());
        when(categoryRepository.existsById("cat-1")).thenReturn(true);

        // When
        List<ProductOutputDTO> result = productService.getProductsByCategoryId("cat-1");

        // Then
        assertEquals(List.of(), result);
        verify(productRepository).findAllByCategoryId("cat-1");
        verify(categoryRepository).existsById("cat-1");
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
        when(categoryRepository.existsById("cat-1")).thenReturn(false);

        // When / Then
        assertThrows(CategoryNotFoundException.class, () -> productService.getProductsByCategoryId("cat-1"));

        verify(categoryRepository).existsById("cat-1");
    }
}