package com.wmsgroup.neuefische_wms.controller;

import java.math.BigDecimal;
import java.util.List;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.Stock;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import com.wmsgroup.neuefische_wms.repository.StockRepository;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class StockControllerTest {
    private final String uri = "/api/stock";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private AisleRepository aisleRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private StockRepository stockRepo;

    @Test
    void getProductAmount_returnsStock_withValidProductId() throws Exception {
        Product product = Product.builder()
                .id("P1")
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        productRepo.save(product);

        Aisle aisle = new Aisle("A1", "Test Aisle", List.of("C1"), List.of("S1"));
        aisleRepo.save(aisle);

        Stock stock = new Stock("S1", "P1", 10);
        stockRepo.save(stock);

        StockOutputDTO expected = new StockOutputDTO("P1", new ProductOutputDTO("P1", "Item1", "C1", "10,00"), 10);
        
        mvc.perform(get(uri + "/count/P1"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected)));
    }

    @Test
    void getProductAmount_throwsNotFound_withInvalidProductId() throws Exception {
        String invalidProductId = "P1";

        mvc.perform(get(uri + "/count/" + invalidProductId))
                .andExpect(status().isNotFound());
    }

    @Test
    void addStock_addsStock_withValidInput() throws Exception {
        Product product = Product.builder()
                .id("P1")
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        productRepo.save(product);

        Aisle aisle = new Aisle("A1", "Test Aisle", List.of("C1"), List.of());
        aisleRepo.save(aisle);

        StockInputDTO input = new StockInputDTO("P1", 15);

        String response = mvc.perform(post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        StockOutputDTO result = mapper.readValue(response, StockOutputDTO.class);

        assertThat(result.product().id()).isEqualTo("P1");
        assertThat(result.product().name()).isEqualTo("Item1");
        assertThat(result.product().categoryId()).isEqualTo("C1");
        assertThat(result.product().price()).isEqualTo("10,00");
        assertThat(result.amount()).isEqualTo(15);
        assertThat(result.id()).isNotEmpty().isNotBlank();

        assertThat(aisleRepo.findById("A1").get().stockIds()).contains(result.id());
    }

    @Test
    void addStock_throwsNotFound_withInvalidProductId() throws Exception {
        StockInputDTO input = new StockInputDTO("P1", 15);

        mvc.perform(post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input)))
                .andExpect(status().isNotFound());
    }

    @Test
    void addStock_throwsNotFound_withNoSuitableAisle() throws Exception {
        Product product = Product.builder()
                .id("P1")
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        productRepo.save(product);

        StockInputDTO input = new StockInputDTO("P1", 15);

        mvc.perform(post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input)))
                .andExpect(status().isNotFound());
    }

    @Test
    void removeStock_removesStock_withValidInput() throws Exception {
        Product product = Product.builder()
                .id("P1")
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        productRepo.save(product);

        Aisle aisle = new Aisle("A1", "Test Aisle", List.of("C1"), List.of("S1"));
        aisleRepo.save(aisle);

        Stock stock = new Stock("S1", "P1", 20);
        stockRepo.save(stock);

        StockInputDTO input = new StockInputDTO("P1", 15);

        mvc.perform(delete(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input)))
                .andExpect(status().isOk());

        assertThat(stockRepo.findById("S1").get().amount()).isEqualTo(5);
        assertThat(aisleRepo.findById("A1").get().stockIds()).contains("S1");
    }

    @Test
    void removeStock_throwsNotFound_withInsufficientStock() throws Exception {
        Product product = Product.builder()
                .id("P1")
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        productRepo.save(product);

        Aisle aisle = new Aisle("A1", "Test Aisle", List.of("C1"), List.of("S1"));
        aisleRepo.save(aisle);

        Stock stock = new Stock("S1", "P1", 10);
        stockRepo.save(stock);

        StockInputDTO input = new StockInputDTO("P1", 15);

        mvc.perform(delete(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input)))
                .andExpect(status().isNotFound());
    }

    @Test
    void removeStock_throwsNotFound_withInvalidProductId() throws Exception {
        StockInputDTO input = new StockInputDTO("P1", 15);

        mvc.perform(delete(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input)))
                .andExpect(status().isNotFound());
    }
}
