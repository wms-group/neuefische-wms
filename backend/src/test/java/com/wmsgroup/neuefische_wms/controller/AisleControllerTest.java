package com.wmsgroup.neuefische_wms.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmsgroup.neuefische_wms.converter.ProductOutputDTOConverter;
import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.Stock;
import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import com.wmsgroup.neuefische_wms.repository.StockRepository;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AisleControllerTest {
	private final String uri = "/api/aisles";

	@Autowired
	private AisleRepository repo;

    @Autowired
    private StockRepository stockRepo;

    @Autowired
    private ProductRepository productRepo;

	@Autowired
	private MockMvc mvc;

	@Autowired
	private ObjectMapper mapper;

	@Test
	void getAisles_returnsAisles_whenCalled() throws Exception {
		Aisle aisle = new Aisle("A1", "New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
		List<Aisle> aisles = List.of(aisle, aisle.withId("A2"), aisle.withId("A3"));
		repo.saveAll(aisles);

		mvc.perform(get(uri))
				.andExpect(status().isOk())
				.andExpect(content().json(mapper.writeValueAsString(aisles)));
	}

	@Test
	void getAisleById_returnsAisle_withValidId() throws Exception {
		Aisle aisle = new Aisle("A1", "New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
		repo.save(aisle);

		mvc.perform(get(uri + "/" + aisle.id()))
				.andExpect(status().isOk())
				.andExpect(content().json(mapper.writeValueAsString(aisle)));
	}

	@Test
	void getAisleById_returnsNotFound_withInvalidId() throws Exception {
		String invalidId = "A1";

		mvc.perform(get(uri + "/" + invalidId))
				.andExpect(status().isNotFound());
	}

	@Test
	void createAisle_createsAisle_whenCalled() throws Exception {
		AisleCreationDTO creationDto = new AisleCreationDTO("New Aisle", List.of("C1", "C2"));

		String response = mvc.perform(post(uri)
				.contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(creationDto)))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();

		Aisle createdAisle = mapper.readValue(response, Aisle.class);

		assertThat(createdAisle)
				.usingRecursiveComparison()
				.ignoringFields("id")
				.isEqualTo(Aisle.of(creationDto));

		assertThat(createdAisle.id())
				.isNotEmpty()
				.isNotBlank();
	}

	@Test
	void updateAisle_updatesAisle_withValidAisle() throws Exception {
		Aisle validAisle = new Aisle("A1", "New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));

		repo.save(validAisle);
		validAisle = validAisle
				.withName("Other Name")
				.withCategoryIds(List.of("C1"));

		String response = mvc.perform(put(uri)
				.contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(validAisle)))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();

		assertThat(mapper.readValue(response, Aisle.class))
				.isEqualTo(validAisle);

		assertThat(repo.findById(validAisle.id()))
				.contains(validAisle);
	}

	@Test
	void updateAisle_throwsAisleNotFound_withInvalidAisle() throws Exception {
		Aisle invalidAisle = new Aisle("A1", "New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));

		mvc.perform(put(uri)
				.contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(invalidAisle)))
				.andExpect(status().isNotFound());

		assertThat(repo.findById(invalidAisle.id()))
				.isEmpty();
	}

    @Test
    void deleteAisle_deletes_withValidId() throws Exception {
        Aisle aisle = new Aisle("A1", "New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
        Product product1 = Product.builder()
                .id("P1")
                .name("Product 1")
                .categoryId("C1")
                .price(BigDecimal.ONE)
                .build();
        Product product2 = Product.builder()
                .id("P2")
                .name("Product 2")
                .categoryId("C2")
                .price(BigDecimal.TEN)
                .build();
        Stock stock1 = new Stock("S1", "P1", 10);
        Stock stock2 = new Stock("S2", "P2", 20);
        repo.save(aisle);
        productRepo.saveAll(List.of(product1, product2));
        stockRepo.saveAll(List.of(stock1, stock2));

        mvc.perform(delete(uri + "/" + aisle.id()))
                .andExpect(status().isNoContent());

        assertThat(repo.existsById(aisle.id())).isFalse();
        assertThat(stockRepo.existsById("S1")).isFalse();
        assertThat(stockRepo.existsById("S2")).isFalse();
        assertThat(productRepo.existsById("P1")).isTrue();
        assertThat(productRepo.existsById("P2")).isTrue();
    }

    @Test
    void deleteAisle_throwsAisleNotFound_withInvalidId() throws Exception {
        String invalidId = "A1";
        mvc.perform(delete(uri + "/" + invalidId))
                .andExpect(status().isNotFound());

        assertThat(repo.existsById(invalidId)).isFalse();
    }

	@Test
	void getAislesWithIds_returnsAisles_withValidIds() throws Exception {
		Aisle aisle = new Aisle("A1", "Aisle One", List.of("C1", "C2"), List.of("S1", "S2"));
		List<Aisle> aisles = List.of(aisle, aisle.withId("A2"), aisle.withId("A3"));
		repo.saveAll(aisles);

		String idsParam = aisles.stream()
				.map(Aisle::id)
				.collect(Collectors.joining(","));

		String response = mvc.perform(get(uri)
				.param("ids", idsParam)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();

		List<Aisle> result = mapper.readValue(response, new TypeReference<List<Aisle>>() {
		});
		assertThat(result).containsExactlyInAnyOrderElementsOf(aisles);

		assertThat(repo.findAllById(List.of("A1", "A2", "A3")))
				.containsExactlyInAnyOrderElementsOf(aisles);
	}

    @Test
    void getStock_returnsStockList_withValidAisleId() throws Exception {
        Aisle aisle = new Aisle("A1", "Test Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
        repo.save(aisle);
        Stock stock1 = new Stock("S1", "P1", 10);
        Stock stock2 = new Stock("S2", "P2", 20);
        stockRepo.saveAll(List.of(stock1, stock2));
        Product product1 = Product.builder()
            .id("P1")
            .categoryId("C1")
            .name("Product 1").
            price(BigDecimal.ONE)
            .build();
        Product product2 = product1.withId("P2").withCategoryId("C2");
        productRepo.saveAll(List.of(product1, product2));


        List<StockOutputDTO> expectedStocks = List.of(
            new StockOutputDTO("S1", ProductOutputDTOConverter.convert(product1), 10),
            new StockOutputDTO("S2", ProductOutputDTOConverter.convert(product2), 20)
        );

        String response = mvc.perform(get(uri + "/" + aisle.id() + "/stock"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<StockOutputDTO> result = mapper.readValue(response, new TypeReference<List<StockOutputDTO>>() {
        });
        assertThat(result).containsExactlyInAnyOrderElementsOf(expectedStocks);
    }

    @Test
    void getStock_throwsAisleNotFound_withInvalidAisleId() throws Exception {
        String invalidAisleId = "A1";

        mvc.perform(get(uri + "/" + invalidAisleId + "/stock"))
                .andExpect(status().isNotFound());
    }
}
