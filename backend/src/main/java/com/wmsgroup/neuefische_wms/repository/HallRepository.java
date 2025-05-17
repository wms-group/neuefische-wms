package com.wmsgroup.neuefische_wms.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.wmsgroup.neuefische_wms.model.Hall;

@Repository
public interface HallRepository extends MongoRepository<Hall, String> {

}