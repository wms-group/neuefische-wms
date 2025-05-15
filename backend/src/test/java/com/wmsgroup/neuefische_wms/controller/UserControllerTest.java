package com.wmsgroup.neuefische_wms.controller;

import com.wmsgroup.neuefische_wms.model.user.User;
import com.wmsgroup.neuefische_wms.model.user.UserRole;
import com.wmsgroup.neuefische_wms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @BeforeEach
  void cleanDb() {
    userRepository.deleteAll();
  }

  @Test
  void addUser_shouldAddUser_whenCalledWithValidData() throws Exception {
    mockMvc.perform(post("/api/wms-group")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                            {
                              "username": "j_doe",
                              "name": "Joe Doe",
                              "role": "ADMIN",
                              "password": "wms123!"
                            }
                        """)
            ).andExpect(status().isCreated())
            .andExpect(content().json("""
                    {
                        "username": "j_doe",
                        "name": "Joe Doe",
                        "role": "ADMIN"
                    }
                    """));
  }

  @Test
  void addUser_shouldReturnConflict_whenUserAlreadyExists() throws Exception {
    userRepository.save(new User("1", "j_doe","Jane Doe", UserRole.ADMIN, "1234"));

    mockMvc.perform(post("/api/wms-group")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                    {
                      "username": "j_doe",
                      "name": "Jane Doe",
                      "role": "ADMIN",
                      "password": "1234"
                    }
                    """)
            ).andExpect(status().isConflict())
            .andExpect(content().json("""
        {
          "error": "User with the username 'j_doe' already exists!"
        }
     """));
  }

  @Test
  void addUser_shouldReturnBadRequest_whenUserDataIsInvalid() throws Exception {
    mockMvc.perform(post("/api/wms-group")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                    {
                      "username": "j_doe",
                      "name": "Jane Doe",
                      "role": "INVALID_ROLE",
                      "password": "12345"
                    }
                    """)
    ).andExpect(status().isBadRequest());
  }

  @Test
  void updateUser_shouldUpdateAndReturnUpdatedUser_whenUserExists() throws Exception {
    // GIVEN
    User existingUser = userRepository.save(
            new User("1", "j_doe", "Joe Doe", UserRole.CLERK, "wms123!")
    );

    // WHEN & THEN
    mockMvc.perform(put("/api/wms-group/" + existingUser.id())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                            "username": "updated_user",
                            "name": "Updated Name",
                            "role": "CLERK",
                            "password": "wms123!"
                        }
                        """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("updated_user"))
            .andExpect(jsonPath("$.name").value("Updated Name"))
            .andExpect(jsonPath("$.role").value("CLERK"));
  }


  @Test
  void updateUser_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
    mockMvc.perform(put("/api/wms-group/non-existent-id")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                                {
                                    "username": "updated_user",
                                    "name": "Updated Name",
                                    "role": "ADMIN",
                                    "password": "newPassword123!"
                                }
                                """))
            .andExpect(status().isNotFound());
  }

  @Test
  void getUsers_shouldReturnAllUsers() throws Exception {
    // GIVEN
    userRepository.saveAll(List.of(
            new User("1", "user1", "User One", UserRole.CLERK, "pass1"),
            new User("2", "user2", "User Two", UserRole.ADMIN, "pass2")
    ));

    // WHEN & THEN
    mockMvc.perform(get("/api/wms-group"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].username").value("user1"))
            .andExpect(jsonPath("$[1].username").value("user2"));
  }

  @Test
  void getUserById_shouldReturnUser_whenUserExists() throws Exception {
    // GIVEN
    User user = userRepository.save(new User("1", "test_user", "Test User", UserRole.CLERK, "password"));

    // WHEN & THEN
    mockMvc.perform(get("/api/wms-group/{id}", user.id()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("1"))
            .andExpect(jsonPath("$.username").value("test_user"))
            .andExpect(jsonPath("$.name").value("Test User"))
            .andExpect(jsonPath("$.role").value("CLERK"));
  }

  @Test
  void getUserById_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
    mockMvc.perform(get("/api/wms-group/non-existent-id"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("Not Found"))
            .andExpect(jsonPath("$.message").value("User with the id:  not found!"));
  }
}