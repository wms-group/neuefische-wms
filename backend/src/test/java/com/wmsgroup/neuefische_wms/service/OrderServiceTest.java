package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.OrderDto;
import com.wmsgroup.neuefische_wms.model.dto.OrderItemDto;
import com.wmsgroup.neuefische_wms.model.order.Order;
import com.wmsgroup.neuefische_wms.model.order.OrderStatus;
import com.wmsgroup.neuefische_wms.repository.OrderRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class OrderServiceTest {

  private final OrderRepository orderRepository = mock(OrderRepository.class);
  private final ProductRepository productRepository = mock(ProductRepository.class);
  private final IdService idService = mock(IdService.class);

  private final OrderService orderService = new OrderService(orderRepository, productRepository, idService);

  @Test
  void shouldCreateOrderFromDto() {
    // Given
    Product product = mock(Product.class);
    when(product.getId()).thenReturn("p1");
    when(product.getPrice()).thenReturn(new BigDecimal("99"));
    when(product.getName()).thenReturn("Test Product");
    when(product.getCategoryId()).thenReturn("cat1");

    OrderItemDto itemDto = new OrderItemDto("p1", 2);
    OrderDto dto = new OrderDto(List.of(itemDto), OrderStatus.PENDING, Instant.now(), Instant.now());

    when(productRepository.findById("p1")).thenReturn(Optional.of(product));
    when(idService.generateId()).thenReturn("order-123");
    when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

    // When
    Order result = orderService.createOrderFromDto(dto);

    // Then
    assertThat(result).isNotNull();  // Sicherstellen, dass kein NullPointer entsteht
    assertThat(result.id()).isEqualTo("order-123");
    assertThat(result.status()).isEqualTo(OrderStatus.PENDING);
    assertThat(result.wares()).hasSize(1);

    var ware = result.wares().getFirst();
    assertThat(ware.product()).isEqualTo(product);
    assertThat(ware.amount()).isEqualTo(2);

    verify(orderRepository).save(any(Order.class));
  }



  @Test
  void shouldUpdateOrderIfExists() {
    // Given
    Product product = mock(Product.class);
    when(product.getId()).thenReturn("p1");
    when(product.getPrice()).thenReturn(new BigDecimal("99"));
    when(product.getName()).thenReturn("Test Product");
    when(product.getCategoryId()).thenReturn("cat1");

    Order existing = new Order("order-1", List.of(), OrderStatus.PENDING, Instant.now(), Instant.now());
    OrderItemDto itemDto = new OrderItemDto("p1", 1);
    OrderDto dto = new OrderDto(List.of(itemDto), OrderStatus.SHIPPED, Instant.now(), Instant.now());

    when(orderRepository.findById("order-1")).thenReturn(Optional.of(existing));
    when(productRepository.findById("p1")).thenReturn(Optional.of(product));
    when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    Order result = orderService.updateOrder("order-1", dto);

    // Then
    assertThat(result.status()).isEqualTo(OrderStatus.SHIPPED);
    assertThat(result.wares()).hasSize(1);

    var ware = result.wares().getFirst();
    assertThat(ware.product().getId()).isEqualTo("p1");
    assertThat(ware.amount()).isEqualTo(1);

    verify(orderRepository).save(any(Order.class));
  }


  @Test
  void shouldReturnNullIfOrderToUpdateNotFound() {
    when(orderRepository.findById("not-found")).thenReturn(Optional.empty());

    OrderDto dto = new OrderDto(List.of(), OrderStatus.PENDING, Instant.now(), Instant.now());
    Order result = orderService.updateOrder("not-found", dto);

    assertThat(result).isNull();
  }
}
