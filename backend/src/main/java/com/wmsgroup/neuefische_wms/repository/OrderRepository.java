package com.wmsgroup.neuefische_wms.repository;

import com.wmsgroup.neuefische_wms.model.order.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderRepository extends MongoRepository<Order, String> {
}
