package com.wmsgroup.neuefische_wms.service;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.wmsgroup.neuefische_wms.exceptions.HallNotFoundException;
import com.wmsgroup.neuefische_wms.model.Hall;
import com.wmsgroup.neuefische_wms.model.dto.HallCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.HallUpdateDTO;
import com.wmsgroup.neuefische_wms.repository.HallRepository;

class HallManagementServiceTest {
	private HallManagementService service;
	private IdService idService;
	private HallRepository hallRepo;

	@BeforeEach
	void setup() {
		idService = mock(IdService.class);
		hallRepo = mock(HallRepository.class);
		service = new HallManagementService(hallRepo, idService);
	}

	@Test
	void getHalls_returnsAllHalls_whenCalled() {
		Hall hall1 = new Hall("H1", "Hall One", List.of());
		Hall hall2 = new Hall("H2", "Hall Two", List.of());
		List<Hall> expectedHalls = List.of(hall1, hall2);
		when(hallRepo.findAll())
				.thenReturn(expectedHalls);

		assertThat(service.getHalls())
				.containsExactlyInAnyOrderElementsOf(expectedHalls);
	}

	@Test
	void getHallsByIds_returnsHalls_whenIdsProvided() {
		Hall hall1 = new Hall("H1", "Hall One", List.of());
		Hall hall2 = new Hall("H2", "Hall Two", List.of());
		List<String> ids = List.of("H1", "H2");
		List<Hall> expectedHalls = List.of(hall1, hall2);
		when(hallRepo.findAllById(ids))
				.thenReturn(expectedHalls);

		assertThat(service.getHallsByIds(ids))
				.containsExactlyInAnyOrderElementsOf(expectedHalls);
	}

	@Test
	void getHallById_returnsHall_whenHallExists() throws HallNotFoundException {
		String id = "H1";
		Hall expectedHall = new Hall(id, "Hall One", List.of());
		when(hallRepo.findById(id))
				.thenReturn(Optional.of(expectedHall));

		assertThat(service.getHallById(id))
				.isEqualTo(expectedHall);
	}

	@Test
	void getHallById_throwsHallNotFoundException_whenHallDoesNotExist() {
		String id = "H1";
		when(hallRepo.findById(id))
				.thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.getHallById(id))
				.isInstanceOf(HallNotFoundException.class)
				.hasMessage("Hall with id: " + id + " could not be found.");
	}

	@Test
	void createHall_savesAndReturnsHall_whenCalledWithValidDto() {
		HallCreationDTO dto = new HallCreationDTO("Hall One", List.of());
		Hall hall = new Hall(null, "Hall One", List.of());
		Hall savedHall = new Hall("H1", "Hall One", List.of());
		when(idService.generateId()).thenReturn("H1");
		when(hallRepo.save(any(Hall.class))).thenReturn(savedHall);

		assertThat(service.createHall(dto))
				.isEqualTo(savedHall);
		verify(hallRepo).save(hall.withId("H1"));
	}

	@Test
	void updateHall_updatesAndReturnsHall_whenHallExists() throws HallNotFoundException {
		HallUpdateDTO dto = new HallUpdateDTO("H1", "Updated Hall", List.of());
		Hall updatedHall = new Hall("H1", "Updated Hall", List.of());
		when(hallRepo.existsById("H1")).thenReturn(true);
		when(hallRepo.save(any(Hall.class))).thenReturn(updatedHall);

		assertThat(service.updateHall(dto))
				.isEqualTo(updatedHall);
		verify(hallRepo).save(updatedHall);
	}

	@Test
	void updateHall_throwsHallNotFoundException_whenHallDoesNotExist() {
		HallUpdateDTO dto = new HallUpdateDTO("H1", "Updated Hall", List.of());
		when(hallRepo.existsById("H1")).thenReturn(false);

		assertThatThrownBy(() -> service.updateHall(dto))
				.isInstanceOf(HallNotFoundException.class)
				.hasMessage("Hall with id: " + dto.id() + " could not be found.");
	}

	@Test
	void deleteHall_deletesHall_whenHallExists() throws HallNotFoundException {
		String id = "H1";
		when(hallRepo.existsById(id)).thenReturn(true);

		service.deleteHall(id);
		verify(hallRepo).deleteById(id);
	}

	@Test
	void deleteHall_throwsHallNotFoundException_whenHallDoesNotExist() {
		String id = "H1";
		when(hallRepo.existsById(id)).thenReturn(false);

		assertThatThrownBy(() -> service.deleteHall(id))
				.isInstanceOf(HallNotFoundException.class)
				.hasMessage("Hall with id: " + id + " could not be found.");
	}
}