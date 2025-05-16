package com.wmsgroup.neuefische_wms.repository;

import com.wmsgroup.neuefische_wms.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
}
