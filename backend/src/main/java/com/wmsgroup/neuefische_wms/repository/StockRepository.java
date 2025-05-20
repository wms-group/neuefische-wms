package com.wmsgroup.neuefische_wms.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.wmsgroup.neuefische_wms.model.Stock;

public interface StockRepository extends MongoRepository<Stock, String> {
}
