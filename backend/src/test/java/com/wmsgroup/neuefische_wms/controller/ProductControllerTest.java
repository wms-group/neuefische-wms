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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
                .andExpect(jsonPath("$.error").value("IllegalArgumentException"));
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
                .hasFieldOrPropertyWithValue("message", "categoryId is marked non-null but is null");
    }

    @Test
    void testGetAllProducts() throws Exception {
        Product product1 = Product.builder().id("1").name("Electronics").categoryId("cat-1").price(BigDecimal.TEN).build();
        Product product2 = Product.builder().id("2").name("Smartphones").categoryId("cat-1").price(BigDecimal.ONE).build();
        productRepository.save(product1);
        productRepository.save(product2);

        string response = mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andReturn().getResponse().getContentAsString();
                
        List<Product> expected = List.of(product1, product2);
        List<Product> actual = objectMapper.readValue(response, new TypeReference<List<Product>>() {});
        assertThat(actual).
             containsExactlyInAnyOrderElementsOf(expected);
    }
}