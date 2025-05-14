package com.wmsgroup.neuefische_wms.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.wmsgroup.neuefische_wms.model.Aisle;

@Repository
public interface AisleRepository extends MongoRepository<Aisle, String> {

}
