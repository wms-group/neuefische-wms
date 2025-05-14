package com.wmsgroup.neuefische_wms.controller;

import com.wmsgroup.neuefische_wms.model.user.User;
import com.wmsgroup.neuefische_wms.model.user.UserNotFoundException;
import com.wmsgroup.neuefische_wms.model.user.dto.UserDto;
import com.wmsgroup.neuefische_wms.service.IdService;
import com.wmsgroup.neuefische_wms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wms-group")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final IdService idService;

  /*
   * adds user to db and return userDto with min infos
   * */
  @PostMapping
  public ResponseEntity<UserDto> addUser(@RequestBody User userReq) {
    User newUser = new User(
            idService.generateId(),
            userReq.name(),
            userReq.role(),
            userReq.password()
    );

    userService.addUser(newUser);

    UserDto createdUser = new UserDto(
            newUser.name(),
            newUser.role()
    );

    return ResponseEntity.status(HttpStatus.OK).body(createdUser);
  }

  /*
   * delete user by id
   * */
  @DeleteMapping("{id}")
  public void deleteUser(@PathVariable String id) {
    userService.deleteUser(id);
  }

  /*
   * updates user by id
   * */
  @PutMapping("{id}")
  public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user)
          throws UserNotFoundException {
    User userResponse;

    try {
      userResponse = userService.updateUser(id, user);
      return ResponseEntity.status(HttpStatus.OK).body(userResponse);
    } catch (UserNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
  }

  /*
   * get a list of all users
   * */
  @GetMapping
  public ResponseEntity<List<User>> getUsers() {
    return ResponseEntity.status(HttpStatus.OK).body(userService.getUsers());
  }

  /*
   * get single use by its id
   * */
  @GetMapping("{id}")
  public ResponseEntity<Optional<User>> getUserById(@PathVariable String id) {
    return ResponseEntity.status(HttpStatus.OK).body(Optional.ofNullable(userService.getUserById(id).orElseThrow(
            () -> new UserNotFoundException("User with the id: " + " not found!")
    )));
  }

}
