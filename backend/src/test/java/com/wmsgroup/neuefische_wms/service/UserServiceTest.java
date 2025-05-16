package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.model.user.User;
import com.wmsgroup.neuefische_wms.model.user.UserRole;
import com.wmsgroup.neuefische_wms.model.user.dto.UserDto;
import com.wmsgroup.neuefische_wms.exception.UserAlreadyExistException;
import com.wmsgroup.neuefische_wms.exception.UserNotFoundException;
import com.wmsgroup.neuefische_wms.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  private final User testUser = new User("1", "j_doe", "Joe Doe", UserRole.ADMIN, "pass123");

  @Test
  void addUser_shouldSaveUser_whenUsernameNotExists() {
    when(userRepository.findByUsername(testUser.username())).thenReturn(Optional.empty());
    when(userRepository.save(testUser)).thenReturn(testUser);

    userService.addUser(testUser);

    verify(userRepository).save(testUser);
  }

  @Test
  void addUser_shouldThrow_whenUsernameExists() {
    when(userRepository.findByUsername(testUser.username())).thenReturn(Optional.of(testUser));

    assertThrows(UserAlreadyExistException.class, () -> userService.addUser(testUser));
    verify(userRepository, never()).save(any());
  }

  @Test
  void deleteUser_shouldDelete_whenUserExists() {
    when(userRepository.findById(testUser.id())).thenReturn(Optional.of(testUser));

    userService.deleteUser(testUser.id());

    verify(userRepository).delete(testUser);
  }

  @Test
  void deleteUser_shouldDoNothing_whenUserNotFound() {
    when(userRepository.findById("unknown")).thenReturn(Optional.empty());

    userService.deleteUser("unknown");

    verify(userRepository, never()).delete(any());
  }

  @Test
  void updateUser_shouldUpdateAndReturnUpdatedUser() {
    UserDto dto = new UserDto("new_username", "New Name", UserRole.ADMIN);

    when(userRepository.findById(testUser.id())).thenReturn(Optional.of(testUser));
    ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    User updated = userService.updateUser(testUser.id(), dto);

    assertEquals(dto.username(), updated.username());
    assertEquals(dto.name(), updated.name());
    assertEquals(dto.role(), updated.role());
    assertEquals(testUser.password(), updated.password());

    verify(userRepository).save(captor.capture());
    User savedUser = captor.getValue();
    assertEquals(updated, savedUser);
  }

  @Test
  void updateUser_shouldThrow_whenUserNotFound() {
    when(userRepository.findById("unknown")).thenReturn(Optional.empty());

    UserDto dto = new UserDto("any", "any", UserRole.ADMIN);

    assertThrows(UserNotFoundException.class, () -> userService.updateUser("unknown", dto));
    verify(userRepository, never()).save(any());
  }

  @Test
  void getUsers_shouldReturnList() {
    List<User> users = List.of(testUser);
    when(userRepository.findAll()).thenReturn(users);

    List<User> result = userService.getUsers();

    assertEquals(1, result.size());
    assertEquals(testUser, result.getFirst());
  }

  @Test
  void getUserById_shouldReturnOptionalUser() {
    when(userRepository.findById(testUser.id())).thenReturn(Optional.of(testUser));

    Optional<User> result = userService.getUserById(testUser.id());

    assertTrue(result.isPresent());
    assertEquals(testUser, result.get());
  }

  @Test
  void getUserById_shouldReturnEmptyOptional_whenNotFound() {
    when(userRepository.findById("unknown")).thenReturn(Optional.empty());

    Optional<User> result = userService.getUserById("unknown");

    assertTrue(result.isEmpty());
  }
}
