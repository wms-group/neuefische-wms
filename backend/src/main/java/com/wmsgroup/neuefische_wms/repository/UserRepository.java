package com.wmsgroup.neuefische_wms.repository;

import com.wmsgroup.neuefische_wms.model.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

  Optional<User> getUserById(String id);

  Optional<User> findByName(String name);
}
