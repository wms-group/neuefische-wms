package com.wmsgroup.neuefische_wms.controller;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.order.Order;
import com.wmsgroup.neuefische_wms.model.order.OrderStatus;
import com.wmsgroup.neuefische_wms.repository.OrderRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import com.wmsgroup.neuefische_wms.service.IdService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class OrderControllerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private IdService idService;

  @BeforeEach
  void setup() {
    orderRepository.deleteAll();
    productRepository.deleteAll();
  }

  @AfterEach
  void teardown() {
    orderRepository.deleteAll();
    productRepository.deleteAll();
  }

  @Test
  void shouldCreateOrder() throws Exception {

    String generatedId = "p1";
    // Produkt speichern
    Product testProduct = Product.builder().id(generatedId).name("Test Product").categoryId("cat-1").price(BigDecimal.TEN).build();
    productRepository.save(testProduct);

    String orderJson = """
        {
          "wares": [
            { "productId": "p1", "amount": 2 }
          ],
          "status": "PENDING"
        }
        """;

    mockMvc.perform(post("/api/orders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(orderJson))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("PENDING"))
            .andExpect(jsonPath("$.wares.length()").value(1))
            .andExpect(jsonPath("$.wares[0].product.id").value("p1"))
            .andExpect(jsonPath("$.wares[0].amount").value(2));
  }

  @Test
  void shouldReturnAllOrders() throws Exception {
    Order order = new Order(idService.generateId(), List.of(), OrderStatus.PENDING, Instant.now(), Instant.now());
    orderRepository.save(order);

    mockMvc.perform(get("/api/orders"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].id").value(order.id()));
  }

  @Test
  void shouldUpdateOrder() throws Exception {
    String generatedId = "p1";
    // Produkt speichern
    Product testProduct = Product.builder().id(generatedId).name("Test Product").categoryId("cat-1").price(BigDecimal.TEN).build();
    productRepository.save(testProduct);

    Order order = new Order("order-1", List.of(), OrderStatus.PENDING, Instant.now(), Instant.now());
    orderRepository.save(order);

    String updateJson = """
        {
          "wares": [
            { "productId": "p1", "amount": 1 }
          ],
          "status": "SHIPPED"
        }
        """;

    mockMvc.perform(put("/api/orders/order-1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(updateJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("order-1"))
            .andExpect(jsonPath("$.status").value("SHIPPED"))
            .andExpect(jsonPath("$.wares[0].product.id").value("p1"));
  }


  @Test
  void shouldDeleteOrder() throws Exception {
    Order order = new Order("order-del", List.of(), OrderStatus.PENDING, Instant.now(), Instant.now());
    orderRepository.save(order);

    mockMvc.perform(delete("/api/orders/order-del"))
            .andExpect(status().isOk());

    assertThat(orderRepository.findById("order-del")).isEmpty();
  }


}
