package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.model.user.User;
import com.wmsgroup.neuefische_wms.model.user.UserRole;
import com.wmsgroup.neuefische_wms.model.user.dto.UserDto;
import com.wmsgroup.neuefische_wms.exception.UserAlreadyExistException;
import com.wmsgroup.neuefische_wms.exception.UserNotFoundException;
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
    if (userRepository.findByUsername(user.username()).isPresent()) {
      throw new UserAlreadyExistException(
              "User with the username '" + user.username() + "' already exists!"
      );
    }
    userRepository.save(user);
  }

  public void deleteUser(String id) {
    Optional<User> user = userRepository.findById(id);
    user.ifPresent(userRepository::delete);
  }

  public User updateUser(String id, UserDto userDto) {
    User existing = userRepository.findById(id).orElseThrow(
            () -> new UserNotFoundException("User with id " + id + " not found.")
    );

    String username = userDto.username() != null ? userDto.username() : existing.username();
    String name = userDto.name() != null ? userDto.name() : existing.name();
    UserRole role = userDto.role() != null ? userDto.role() : existing.role();

    User updatedUser = new User(
            existing.id(),
            username,
            name,
            role,
            existing.password()
    );

    return userRepository.save(updatedUser);
  }


  public List<User> getUsers() {
    return userRepository.findAll();
  }

  public Optional<User> getUserById(String id) {
    return userRepository.findById(id);
  }
}
