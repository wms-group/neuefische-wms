package com.wmsgroup.neuefische_wms.repository;

import com.wmsgroup.neuefische_wms.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findAllByCategoryId(String categoryId);
}
