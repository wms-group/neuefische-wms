package com.wmsgroup.neuefische_wms.repository;

import com.wmsgroup.neuefische_wms.model.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
  /*
  * used for checking if user already  exist in db
  * */
  Optional<User> findByUsername(String username);
}
