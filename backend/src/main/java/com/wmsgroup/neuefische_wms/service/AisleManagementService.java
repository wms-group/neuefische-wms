package com.wmsgroup.neuefische_wms.service;

import java.util.List;
import java.util.Optional;

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

	public void deleteAisleById(String id) throws AisleNotFoundException {
		if (!repo.existsById(id)) {
			throw new AisleNotFoundException("Aisle with id: " + id + " was not found.");
		}

		repo.deleteById(id);
	}

	public Aisle getAisleById(String id) throws AisleNotFoundException {
		Optional<Aisle> aisle = repo.findById(id);
		if (aisle.isEmpty()) {
			throw new AisleNotFoundException("Aisle with id: " + id + " was not found.");
		}

		return aisle.get();
	}

	public List<Aisle> getAisles() {
		return repo.findAll();
	}

	public List<Aisle> getAislesWithIds(List<String> ids) {
		return repo.findAllById(ids);
	}

}
