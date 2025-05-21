package com.wmsgroup.neuefische_wms.controller;

import com.wmsgroup.neuefische_wms.model.order.Order;
import com.wmsgroup.neuefische_wms.model.dto.OrderDto;
import com.wmsgroup.neuefische_wms.model.order.OrderItem;
import com.wmsgroup.neuefische_wms.service.IdService;
import com.wmsgroup.neuefische_wms.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @PostMapping
  public ResponseEntity<Order> addOrder(@RequestBody OrderDto orderDto) {
    Order newOrder = orderService.createOrderFromDto(orderDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
  }

  @DeleteMapping("{id}")
  public void deleteOrder(@PathVariable String id) {
    orderService.deleteOrder(id);
  }

  @PutMapping("{id}")
  public ResponseEntity<Order> updateOrder(@PathVariable String id, @RequestBody OrderDto orderDto) {
    Order updatedOrder = orderService.updateOrder(id, orderDto);
    if (updatedOrder != null) {
      return ResponseEntity.ok(updatedOrder);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping
  public ResponseEntity<List<Order>> getAllOrders() {
    return ResponseEntity.ok(orderService.getAllOrders());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Optional<Order>> getOrderById(@PathVariable String id) {
    return ResponseEntity.ok(orderService.getOrderById(id));
  }
}
