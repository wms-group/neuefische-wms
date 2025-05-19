package com.wmsgroup.neuefische_wms.repository;

import com.wmsgroup.neuefische_wms.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findAllByParentId(String parentId);
    void deleteAllByParentId(String parentId);
}
