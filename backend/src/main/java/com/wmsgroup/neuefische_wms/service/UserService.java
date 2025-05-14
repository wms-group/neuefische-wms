package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.model.user.User;
import com.wmsgroup.neuefische_wms.model.user.UserNotFoundException;
import com.wmsgroup.neuefische_wms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;

  public void addUser(User user) {
    userRepository.save(user);
  }

  public void deleteUser(String id) {
    Optional<User> user = userRepository.findById(id);
    user.ifPresent(userRepository::delete);
  }

  public User updateUser(String id, User user) {
    User updatedUser = userRepository.findById(id).orElseThrow(
            () -> new UserNotFoundException("Could not update the user: " + user +
                    ". User with the id: " + id + " not found!")
    );

    userRepository.save(updatedUser);

    return updatedUser;
  }

  public List<User> getUsers() {
    return userRepository.findAll();
  }

  public Optional<User> getUserById(String id) {
    return userRepository.getUserById(id);
  }
}
