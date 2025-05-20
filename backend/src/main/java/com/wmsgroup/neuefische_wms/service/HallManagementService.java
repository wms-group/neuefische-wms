package com.wmsgroup.neuefische_wms.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wmsgroup.neuefische_wms.exception.HallNotFoundException;
import com.wmsgroup.neuefische_wms.model.Hall;
import com.wmsgroup.neuefische_wms.model.dto.HallCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.HallUpdateDTO;
import com.wmsgroup.neuefische_wms.repository.HallRepository;

@Service
public class HallManagementService {

	private final HallRepository hallRepo;
	private final IdService idService;

	public HallManagementService(HallRepository hallRepo, IdService idService) {
		this.hallRepo = hallRepo;
		this.idService = idService;
	}

	public List<Hall> getHalls() {
		return hallRepo.findAll();
	}

	public List<Hall> getHallsByIds(List<String> list) {
		return hallRepo.findAllById(list);
	}

	public Hall getHallById(String id) throws HallNotFoundException {
		Optional<Hall> foundHall = hallRepo.findById(id);
		if (foundHall.isEmpty()) {
			throw new HallNotFoundException("Hall with id: " + id + " could not be found.");
		}

		return foundHall.get();
	}

	public Hall createHall(HallCreationDTO dto) {
		if (dto == null) {
			throw new IllegalArgumentException("Hall creation data cannot be null.");
		}

		Hall createdHall = Hall.of(dto).withId(idService.generateId());

		throwIfNameIsNullOrEmpty(createdHall);
		throwIfHoldsUsedAisleIds(createdHall);

		return hallRepo.save(createdHall);
	}

	public Hall updateHall(HallUpdateDTO dto) throws HallNotFoundException {
		if (dto == null) {
			throw new IllegalArgumentException("Hall update data cannot be null.");
		}

		if (!hallRepo.existsById(dto.id())) {
			throw new HallNotFoundException("Hall with id: " + dto.id() + " could not be found.");
		}

		Hall updatedHall = Hall.of(dto);
		throwIfNameIsNullOrEmpty(updatedHall);
		throwIfHoldsUsedAisleIds(updatedHall);

		return hallRepo.save(Hall.of(dto));
	}

	public void deleteHall(String id) throws HallNotFoundException {
		if (!hallRepo.existsById(id)) {
			throw new HallNotFoundException("Hall with id: " + id + " could not be found.");
		}

		hallRepo.deleteById(id);
	}

	private void throwIfNameIsNullOrEmpty(Hall hall) {
		if (hall.name() == null || hall.name().isBlank()) {
			throw new IllegalArgumentException("Hall name cannot be null or empty.");
		}
	}

	private void throwIfHoldsUsedAisleIds(Hall hall) {
		if (containsAlreadyUsedAisleIds(hall)) {
			throw new IllegalArgumentException("Hall contains duplicate aisle IDs.");
		}
	}

	private boolean containsAlreadyUsedAisleIds(Hall hall) {
		Set<String> existingAisleIds = hallRepo.findAll()
				.stream()
				.filter(h -> !h.id().equals(hall.id()))
				.flatMap(h -> h.aisleIds().stream())
				.collect(Collectors.toSet());

		return hall.aisleIds().stream()
				.anyMatch(existingAisleIds::contains);
	}
}
