package com.wmsgroup.neuefische_wms.service;

import java.util.List;

import org.springframework.stereotype.Service;

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

}
