package com.wmsgroup.neuefische_wms.controller;

import com.wmsgroup.neuefische_wms.model.user.User;
import com.wmsgroup.neuefische_wms.model.user.UserRole;
import com.wmsgroup.neuefische_wms.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserRepository userRepository;

  @Test
  void addUser_shouldAddUser_whenCalledWithValidData() throws Exception {
    userRepository.deleteAll(); // Clean state

    mockMvc.perform(post("/api/wms-group")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                            {
                              "name": "Joe Doe",
                              "role": "ADMIN",
                              "password": "wms123!"
                            }
                        """)
            ).andExpect(status().isCreated()) // <- geändert von isOk()
            .andExpect(content().json("""
                    {
                        "name": "Joe Doe",
                        "role": "ADMIN"
                    }
                    """));
  }

  @Test
  void addUser_shouldReturnConflict_whenUserAlreadyExists() throws Exception {
    userRepository.deleteAll();
    userRepository.save(new User("1", "Jane Doe", UserRole.ADMIN, "1234"));

    mockMvc.perform(post("/api/wms-group")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                    {
                      "name": "Jane Doe",
                      "role": "ADMIN",
                      "password": "1234"
                    }
                    """)
            ).andExpect(status().isConflict())
            .andExpect(content().json("""
        {
          "error": "User with the name 'Jane Doe' already exists! Try another name."
        }
     """));
  }

  @Test
  void addUser_shouldReturnBadRequest_whenUserDataIsInvalid() throws Exception {
    mockMvc.perform(post("/api/wms-group")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                    {
                      "name": "Jane Doe",
                      "role": "INVALID_ROLE",
                      "password": "12345"
                    }
                    """)
    ).andExpect(status().isBadRequest());
  }

}