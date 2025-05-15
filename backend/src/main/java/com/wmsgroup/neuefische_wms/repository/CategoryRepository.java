package com.wmsgroup.neuefische_wms.repository;

import com.wmsgroup.neuefische_wms.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
}
