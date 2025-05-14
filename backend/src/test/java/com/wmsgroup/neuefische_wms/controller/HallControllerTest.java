package com.wmsgroup.neuefische_wms.controller;

import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wmsgroup.neuefische_wms.model.Hall;
import com.wmsgroup.neuefische_wms.model.dto.HallCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.HallUpdateDTO;
import com.wmsgroup.neuefische_wms.repository.HallRepository;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class HallControllerTest {
	private final String uri = "/api/halls";
	@Autowired
	private MockMvc mvc;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private HallRepository repo;

	@Test
	void getHalls_returnAllHalls_withNoIds() throws Exception {
		Hall hall = new Hall("H1", "New Hall", List.of("A1", "A2"));
		List<Hall> halls = List.of(hall, hall.withId("H2"), hall.withId("H3"));

		repo.saveAll(halls);

		mvc.perform(get(uri))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().json(mapper.writeValueAsString(halls)));
	}

	@Test
	void getHalls_returnsOnlyExpectedHalls_withIds() throws Exception {
		Hall hall = new Hall("H1", "New Hall", List.of("A1", "A2"));
		List<Hall> halls = List.of(hall, hall.withId("H2"), hall.withId("H3"));
		List<String> ids = halls.stream()
				.map(Hall::id)
				.limit(2)
				.toList();
		String idsParam = ids.stream()
				.collect(Collectors.joining(","));

		repo.saveAll(halls);

		String response = mvc.perform(get(uri)
				.param("ids", idsParam)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		List<Hall> result = mapper.readValue(response, new TypeReference<List<Hall>>() {
		});

		assertThat(result)
				.hasSize(ids.size())
				.allMatch(h -> ids.contains(h.id()))
				.containsAnyElementsOf(halls);
	}

	@Test
	void getHall_returnsHall_withValidId() throws Exception {
		Hall hall = new Hall("H1", "New Hall", List.of("A1", "A2"));
		repo.save(hall);

		mvc.perform(get(uri + "/" + hall.id())
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(content().json(mapper.writeValueAsString(hall)));
	}

	@Test
	void getHall_throwsHallNotFound_withInvalidId() throws Exception {
		String invalidId = "H1";

		mvc.perform(get(uri + "/" + invalidId)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound());
	}

	@Test
	void createHall_createsHall_whenCalled() throws Exception {
		HallCreationDTO dto = new HallCreationDTO("New Hall", List.of());

		String response = mvc.perform(post(uri)
				.contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(dto)))
				.andExpect(status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();

		Hall createdHall = mapper.readValue(response, Hall.class);

		assertThat(createdHall)
				.usingRecursiveComparison()
				.ignoringFields("id")
				.isEqualTo(Hall.of(dto));

		assertThat(createdHall.id())
				.isNotEmpty()
				.isNotBlank();
	}

	@Test
	void updateHall_updatesHall_withValidDto() throws Exception {
		HallUpdateDTO dto = new HallUpdateDTO("H1", "Updated Hall", List.of("A1"));
		Hall hall = Hall.of(dto).withName("Original Hall").withAisleIds(List.of());
		repo.save(hall);

		String response = mvc.perform(put(uri)
				.contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(dto)))
				.andExpect(status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();

		Hall updatedHall = mapper.readValue(response, Hall.class);

		assertThat(updatedHall)
				.isEqualTo(Hall.of(dto));
	}

	@Test
	void updateHall_throwsNotFound_withInvalidDto() throws Exception {
		HallUpdateDTO dto = new HallUpdateDTO("H1", "Updated Hall", List.of("A1"));

		mvc.perform(put(uri)
				.contentType(MediaType.APPLICATION_JSON)
				.content(mapper.writeValueAsString(dto)))
				.andExpect(status().isNotFound());
	}

	@Test
	void deleteHall_deletes_withValidId() throws Exception {
		Hall hall = new Hall("H1", "New Hall", List.of("A1", "A2"));

		repo.save(hall);

		mvc.perform(delete(uri + "/" + hall.id()))
				.andExpect(status().isNoContent());

		assertThat(repo.findById(hall.id()))
				.isEmpty();
	}

	@Test
	void deleteHall_throwsNotFound_withInalidId() throws Exception {
		String invalidId = "H1";

		mvc.perform(delete(uri + "/" + invalidId))
				.andExpect(status().isNotFound());
	}
}
