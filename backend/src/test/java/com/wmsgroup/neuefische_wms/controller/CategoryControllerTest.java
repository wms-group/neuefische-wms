package com.wmsgroup.neuefische_wms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmsgroup.neuefische_wms.converter.CategoryOutputDTOConverter;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ErrorDTO;
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
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;


    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();
    }

    @Test
    void testAddCategoryWithValidInput() throws Exception {
        CategoryInputDTO inputDTO = new CategoryInputDTO("Electronics", null);
        CategoryOutputDTO expectedResult = new CategoryOutputDTO("2", "Electronics", null, 0, 0);

        String jsonString = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Electronics"))
                .andReturn().getResponse().getContentAsString();

        CategoryOutputDTO result = objectMapper.readValue(jsonString, CategoryOutputDTO.class);
        Category category = categoryRepository.findById(result.id()).orElse(null);

        assertThat(category)
                .isNotNull();
        assertThat(CategoryOutputDTOConverter.convert(category))
                .isEqualTo(result)
                .isEqualTo(expectedResult.withId(result.id()));
    }

    @Test
    void testAddCategoryWithInvalidName() throws Exception {
        CategoryInputDTO inputDTO = new CategoryInputDTO("", null);

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAddCategoryWithNoName() throws Exception {
        Map<String, String> inputDTO = Map.of(
                "parentId", "2"
        );

        String jsonString = mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();
        ErrorDTO result = objectMapper.readValue(jsonString, ErrorDTO.class);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("error", "NullPointerException")
                .hasFieldOrPropertyWithValue("message", "Name is marked non-null but is null");
    }

    @Test
    void testAddCategoryWithParentId_shouldReturnBadRequest_whenCalledWithNonExistentId() throws Exception {
        CategoryInputDTO inputDTO = new CategoryInputDTO("Smartphones", "2");

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("CategoryNotFoundException"));
    }

    @Test
    void testAddCategoryWithParentId() throws Exception {
        categoryRepository.save(Category.builder().id("2").name("Smartphones").build());

        CategoryInputDTO inputDTO = new CategoryInputDTO("Smartphones with Android", "2");
        CategoryOutputDTO expectedResult = new CategoryOutputDTO("2", "Smartphones with Android", "2", 0, 0);

        String jsonString = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        CategoryOutputDTO result = objectMapper.readValue(jsonString, CategoryOutputDTO.class);
        Category category = categoryRepository.findById(result.id()).orElse(null);

        assertThat(category)
                .isNotNull();
        assertThat(CategoryOutputDTOConverter.convert(category))
                .isEqualTo(result)
                .isEqualTo(expectedResult.withId(result.id()));
    }

    @Test
    void testGetAllCategories() throws Exception {
        categoryRepository.save(Category.builder().id("1").name("Electronics").build());
        categoryRepository.save(Category.builder().id("2").name("Smartphones").parentId("1").build());

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$.[?(@.name == 'Electronics')].id").value("1"))
                .andExpect(jsonPath("$.[?(@.name == 'Smartphones')].id").value("2"))
                .andExpect(jsonPath("$.[?(@.name == 'Smartphones')].parentId").value("1"))
                ;
    }

    @Test
    void testUpdateCategoryWithValidInput() throws Exception {
        categoryRepository.save(Category.builder().id("9").name("Laptops").build());

        CategoryInputDTO updateDTO = new CategoryInputDTO("Notebooks", null);

        String jsonString = mockMvc.perform(put("/api/categories/9")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value("9"))
                .andExpect(jsonPath("$.name").value("Notebooks"))
                .andReturn().getResponse().getContentAsString();

        CategoryOutputDTO result = objectMapper.readValue(jsonString, CategoryOutputDTO.class);
        Category category = categoryRepository.findById(result.id()).orElse(null);

        assertThat(category)
                .isNotNull()
                .matches(c -> c.getName().equals("Notebooks"));
    }

    @Test
    void testUpdateCategoryWithNonExistingId_shouldReturnBadRequest() throws Exception {
        CategoryInputDTO updateDTO = new CategoryInputDTO("NonExistent", null);

        String jsonString = mockMvc.perform(put("/api/categories/777")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        ErrorDTO result = objectMapper.readValue(jsonString, ErrorDTO.class);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("error", "CategoryNotFoundException");
    }

    @Test
    void testUpdateCategoryWithNonExistingParentId_shouldReturnBadRequest() throws Exception {
        categoryRepository.save(Category.builder().id("1").name("Electronics").build());

        CategoryInputDTO updateDTO = new CategoryInputDTO("Changed Name", "777");

        String jsonString = mockMvc.perform(put("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        ErrorDTO result = objectMapper.readValue(jsonString, ErrorDTO.class);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("error", "CategoryNotFoundException");
    }

    @Test
    void testUpdateCategoryWithInvalidName_shouldReturnBadRequest() throws Exception {
        categoryRepository.save(Category.builder().id("3").name("Haushalt").build());

        CategoryInputDTO updateDTO = new CategoryInputDTO("", null);

        mockMvc.perform(put("/api/categories/3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteCategoryWithExistingId() throws Exception {
        categoryRepository.save(Category.builder().id("15").name("Bücher").build());

        mockMvc.perform(delete("/api/categories/15"))
                .andExpect(status().isNoContent());

        assertThat(categoryRepository.findById("15")).isEmpty();
    }

    @Test
    void testDeleteCategoryWithNonExistingId_shouldReturnBadRequest() throws Exception {
        String jsonString = mockMvc.perform(delete("/api/categories/654"))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        ErrorDTO result = objectMapper.readValue(jsonString, ErrorDTO.class);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("error", "CategoryNotFoundException");
    }

    @Test
    void testDeleteCategoryAndMoveChildren_shouldReturnBadRequest_whenMoveToCategoryIdIsEmptyAndProductsExist() throws Exception {
        categoryRepository.save(Category.builder().id("src").name("Quelle").build());
        productRepository.save(Product.builder().id("p1").name("Testprodukt").price(BigDecimal.TEN).categoryId("src").build());

        String jsonString = mockMvc.perform(delete("/api/categories/delete-and-move/src?moveToCategory="))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        ErrorDTO result = objectMapper.readValue(jsonString, ErrorDTO.class);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("error", "CategoryNotValidException")
                .hasFieldOrPropertyWithValue("message", "Bitte Produkte erst löschen oder verschieben!");
        assertThat(categoryRepository.findById("src")).isPresent();
    }

    @Test
    void testDeleteCategoryAndMoveChildren_shouldReturnBadRequest_whenMoveToCategoryIdDoesNotExist() throws Exception {
        categoryRepository.save(Category.builder().id("src2").name("Quelle2").build());
        productRepository.save(Product.builder().id("p2").name("Testprodukt2").price(BigDecimal.TEN).categoryId("src2").build());

        String jsonString = mockMvc.perform(delete("/api/categories/delete-and-move/src2?moveToCategory=doesNotExist"))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        ErrorDTO result = objectMapper.readValue(jsonString, ErrorDTO.class);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("error", "CategoryNotFoundException");
        assertThat(categoryRepository.findById("src2")).isPresent();
    }

    @Test
    void testDeleteCategoryAndMoveChildren_shouldSucceed_whenMoveToCategoryIdExistsAndProductsExistAndTargetIsEmpty() throws Exception {
        categoryRepository.save(Category.builder().id("src3").name("Quelle3").build());
        categoryRepository.save(Category.builder().id("tgt3").name("Ziel3").build());
        productRepository.save(Product.builder().id("p3").name("Testprodukt3").price(BigDecimal.TEN).categoryId("src3").build());
        // Zielkategorie ist leer

        mockMvc.perform(delete("/api/categories/delete-and-move/src3?moveToCategory=tgt3"))
                .andExpect(status().isNoContent());

        // Prüfung: Quell-Kategorie entfernt, Produkte verschoben
        assertThat(categoryRepository.findById("src3")).isEmpty();

        // Produkt wurde auf Zielkategorie verschoben
        Product movedProduct = productRepository.findAll().stream()
                .filter(p -> "p3".equals(p.getId()))
                .findFirst()
                .orElse(null);
        assertThat(movedProduct).isNotNull();
        assertThat(movedProduct.getCategoryId()).isEqualTo("tgt3");
    }

    @Test
    void testDeleteCategoryAndMoveChildren_shouldReturnBadRequest_whenSourceCategoryDoesNotExist() throws Exception {
        String jsonString = mockMvc.perform(delete("/api/categories/delete-and-move/unknown?moveToCategory=tgt"))
                .andExpect(status().isBadRequest())
                .andReturn().getResponse().getContentAsString();

        ErrorDTO result = objectMapper.readValue(jsonString, ErrorDTO.class);

        assertThat(result)
                .isNotNull()
                .hasFieldOrPropertyWithValue("error", "CategoryNotFoundException");
    }
}