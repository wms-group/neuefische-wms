package com.wmsgroup.neuefische_wms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmsgroup.neuefische_wms.converter.ProductOutputDTOConverter;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.ErrorDTO;
import com.wmsgroup.neuefische_wms.model.dto.ProductInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        categoryRepository.save(
                Category.builder()
                        .id("cat-1")
                        .name("Electronics")
                        .build()
        );
    }

    @Test
    void testAddProductWithValidInput() throws Exception {
        ProductInputDTO inputDTO = new ProductInputDTO("Electronics", "cat-1", "10,00");
        ProductOutputDTO expectedResult = new ProductOutputDTO("2", "Electronics", "cat-1", "10,00");

        String jsonString = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Electronics"))
                .andReturn().getResponse().getContentAsString();

        ProductOutputDTO result = objectMapper.readValue(jsonString, ProductOutputDTO.class);
        Product product = productRepository.findById(result.id()).orElse(null);

        assertThat(product)
                .isNotNull();
        assertThat(ProductOutputDTOConverter.convert(product))
                .isEqualTo(result)
                .isEqualTo(expectedResult.withId(result.id()));
    }

    @Test
    void testAddProductWithInvalidName() throws Exception {
        ProductInputDTO inputDTO = new ProductInputDTO("", "cat-1", "10,00");

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAddProductWithCategoryId_shouldReturnBadRequest_whenCalledWithNonExistentId() throws Exception {
        ProductInputDTO inputDTO = new ProductInputDTO("Smartphones", "cat-2", "10,00");

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("CategoryNotFoundException"));
    }

    @Test
    void testAddProductWithOutCategoryId() throws Exception {
        Map<String, String> inputDTO = Map.of(
                "name", "Smartphones with Android",
                "price", "10,00");

        String jsonString = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        ErrorDTO result = objectMapper.readValue(jsonString, ErrorDTO.class);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("error", "NullPointerException")
                .hasFieldOrPropertyWithValue("message", "CategoryId is marked non-null but is null");
    }

    @Test
    void testGetAllProducts() throws Exception {
        productRepository.save(Product.builder().id("1").name("Electronics").categoryId("cat-1").price(BigDecimal.TEN).build());
        productRepository.save(Product.builder().id("2").name("Smartphones").categoryId("cat-1").price(BigDecimal.ONE).build());

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$.[?(@.name == 'Electronics')].id").value("1"))
                .andExpect(jsonPath("$.[?(@.name == 'Electronics')].categoryId").value("cat-1"))
                .andExpect(jsonPath("$.[?(@.name == 'Electronics')].price").value("10,00"))
                .andExpect(jsonPath("$.[?(@.name == 'Smartphones')].id").value("2"))
                .andExpect(jsonPath("$.[?(@.name == 'Smartphones')].categoryId").value("cat-1"))
                .andExpect(jsonPath("$.[?(@.name == 'Smartphones')].price").value("1,00"))
                ;
    }

    @Test
    void testGetProductsByCategoryId() throws Exception {
        productRepository.save(Product.builder().id("1").name("Electronics").categoryId("cat-1").price(BigDecimal.TEN).build());
        productRepository.save(Product.builder().id("2").name("Smartphones").categoryId("cat-1").price(BigDecimal.ONE).build());
        productRepository.save(Product.builder().id("3").name("iPhone 13").categoryId("cat-2").price(BigDecimal.ONE).build());

        mockMvc.perform(get("/api/products/category/cat-1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$.[?(@.name == 'Electronics')].id").value("1"))
                .andExpect(jsonPath("$.[?(@.name == 'Electronics')].categoryId").value("cat-1"))
                .andExpect(jsonPath("$.[?(@.name == 'Electronics')].price").value("10,00"))
                .andExpect(jsonPath("$.[?(@.name == 'Smartphones')].id").value("2"))
                .andExpect(jsonPath("$.[?(@.name == 'Smartphones')].categoryId").value("cat-1"))
                .andExpect(jsonPath("$.[?(@.name == 'Smartphones')].price").value("1,00"))
                ;
    }

    @Test
    void testGetProductsByCategoryIdReturnsEmptyListWhenNoProductsExistInCategory() throws Exception {
        productRepository.save(Product.builder().id("3").name("iPhone 13").categoryId("cat-2").price(BigDecimal.ONE).build());

        mockMvc.perform(get("/api/products/category/cat-1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(0))
                ;
    }

    @Test
    void testGetProductsByCategoryIdReturnsBadRequestWhenCategoryDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/products/category/cat-2"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("CategoryNotFoundException"));
    }

    @Test
    void testUpdateProductWithValidInput() throws Exception {
        // Arrange: Produkt und Kategorie anlegen
        Product product = productRepository.save(
                Product.builder()
                        .id("p-1")
                        .name("Altname")
                        .categoryId("cat-1")
                        .price(BigDecimal.valueOf(5))
                        .build()
        );
        ProductInputDTO inputDTO = new ProductInputDTO("Neuer Name", "cat-1", "9,99");

        // Act & Assert
        mockMvc.perform(put("/api/products/" + product.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("p-1"))
                .andExpect(jsonPath("$.name").value("Neuer Name"))
                .andExpect(jsonPath("$.categoryId").value("cat-1"))
                .andExpect(jsonPath("$.price").value("9,99"));

        // Überprüfe, dass das Produkt in der DB angepasst wurde
        Product updated = productRepository.findById("p-1").orElseThrow();
        assertThat(updated.getName()).isEqualTo("Neuer Name");
        assertThat(updated.getPrice()).isEqualTo(new BigDecimal("9.99"));
    }

    @Test
    void testUpdateProductWithNonExistingProductId() throws Exception {
        ProductInputDTO inputDTO = new ProductInputDTO("Name", "cat-1", "5,99");
        mockMvc.perform(put("/api/products/invalid-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("ProductNotFoundException"));
    }

    @Test
    void testUpdateProductWithInvalidCategory() throws Exception {
        // Produkt mit gültiger Kategorie anlegen
        Product product = productRepository.save(
                Product.builder()
                        .id("p-2")
                        .name("Test")
                        .categoryId("cat-1")
                        .price(BigDecimal.valueOf(8))
                        .build()
        );
        ProductInputDTO inputDTO = new ProductInputDTO("Neuer Name", "non-existing-cat", "4,99");

        mockMvc.perform(put("/api/products/" + product.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("CategoryNotFoundException"));
    }

    @Test
    void testUpdateProductWithBlankName() throws Exception {
        Product product = productRepository.save(
                Product.builder()
                        .id("p-3")
                        .name("Test")
                        .categoryId("cat-1")
                        .price(BigDecimal.valueOf(8))
                        .build()
        );
        ProductInputDTO inputDTO = new ProductInputDTO("  ", "cat-1", "10,00");
        mockMvc.perform(put("/api/products/" + product.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void testDeleteProductWithExistingId() throws Exception {
        Product product = productRepository.save(
                Product.builder()
                        .id("p-4")
                        .name("Test")
                        .categoryId("cat-1")
                        .price(BigDecimal.valueOf(8))
                        .build()
        );
        mockMvc.perform(delete("/api/products/" + product.getId()))
                .andExpect(status().isNoContent());

        // Das Produkt soll gelöscht sein
        assertThat(productRepository.findById(product.getId())).isEmpty();
    }

    @Test
    void testDeleteProductWithNonExistingId() throws Exception {
        mockMvc.perform(delete("/api/products/non-existent-id"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("ProductNotFoundException"));
    }
}