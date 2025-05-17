package com.wmsgroup.neuefische_wms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmsgroup.neuefische_wms.converter.CategoryOutputDTOConverter;
import com.wmsgroup.neuefische_wms.model.Category;
import com.wmsgroup.neuefische_wms.model.dto.CategoryInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ErrorDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();
    }

    @Test
    void testAddCategoryWithValidInput() throws Exception {
        CategoryInputDTO inputDTO = new CategoryInputDTO("Electronics", null);
        CategoryOutputDTO expectedResult = new CategoryOutputDTO("2", "Electronics", null);

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
                .hasFieldOrPropertyWithValue("message", "name is marked non-null but is null");
    }

    @Test
    void testAddCategoryWithParentId_shouldReturnBadRequest_whenCalledWithNonExistentId() throws Exception {
        CategoryInputDTO inputDTO = new CategoryInputDTO("Smartphones", "2");

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("IllegalArgumentException"));
    }

    @Test
    void testAddCategoryWithParentId() throws Exception {
        categoryRepository.save(Category.builder().id("2").name("Smartphones").build());

        CategoryInputDTO inputDTO = new CategoryInputDTO("Smartphones with Android", "2");
        CategoryOutputDTO expectedResult = new CategoryOutputDTO("2", "Smartphones with Android", "2");

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
}