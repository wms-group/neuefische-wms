package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.order.Order;
import com.wmsgroup.neuefische_wms.model.order.OrderItem;
import com.wmsgroup.neuefische_wms.model.dto.OrderDto;
import com.wmsgroup.neuefische_wms.model.dto.OrderItemDto;
import com.wmsgroup.neuefische_wms.repository.OrderRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

  private final OrderRepository orderRepository;
  private final ProductRepository productRepository;
  private final IdService idService;

  public Order createOrderFromDto(OrderDto dto) {
    List<OrderItem> wares = mapDtoItemsToOrderItems(dto.wares());
    return orderRepository.save(new Order(idService.generateId(), wares, dto.status(), Instant.now(), Instant.now()));
  }

  public void deleteOrder(String id) {
    orderRepository.deleteById(id);
  }

  public Order updateOrder(String id, OrderDto orderDto) {
    Optional<Order> existingOpt = orderRepository.findById(id);
    if (existingOpt.isEmpty()) return null;

    Order existing = existingOpt.get();
    List<OrderItem> items = mapDtoItemsToOrderItems(orderDto.wares());

    Order updatedOrder = new Order(
            id,
            items,
            orderDto.status(),
            existing.createdAt(),
            Instant.now()
    );

    return orderRepository.save(updatedOrder);
  }

  public List<Order> getAllOrders() {
    return orderRepository.findAll();
  }

  public Optional<Order> getOrderById(String id) {
    return orderRepository.findById(id);
  }

  private List<OrderItem> mapDtoItemsToOrderItems(List<OrderItemDto> itemDtos) {
    return itemDtos.stream()
            .map(dto -> {
              Product product = productRepository.findById(dto.productId()).orElseThrow();
              return new OrderItem(product, dto.amount(), product.getPrice().doubleValue());
            })
            .collect(Collectors.toList());
  }
}
