package com.wmsgroup.neuefische_wms.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.wmsgroup.neuefische_wms.exceptions.AisleNotFoundException;
import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;

@Service
public class AisleManagementService {
	private final IdService idService;
	private final AisleRepository repo;

	public AisleManagementService(IdService idService, AisleRepository repo) {
		this.idService = idService;
		this.repo = repo;
	}

	public Aisle createAisle(AisleCreationDTO dto) {
		return repo.save(Aisle.of(dto).withId(idService.generateId()));
	}

	public Aisle updateAisle(Aisle dto) throws AisleNotFoundException {
		if (!repo.existsById(dto.id())) {
			throw new AisleNotFoundException("Aisle with id: " + dto.id() + " was not found.");
		}

		return repo.save(dto);
	}

	public void deleteAisleById(String id) {
		if (!repo.existsById(id)) {
			throw new AisleNotFoundException("Aisle with id: " + id + " was not found.");
		}

		repo.deleteById(id);
	}

	public Aisle getAisleWithId(String id) {
		return new Aisle("", "", List.of(), List.of());
	}

	public List<Aisle> getAisles() {
		return List.of();
	}
}
