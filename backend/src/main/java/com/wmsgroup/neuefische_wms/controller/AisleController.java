package com.wmsgroup.neuefische_wms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.service.AisleManagementService;

@RestController("/api/aisles")
public class AisleController {
	private final AisleManagementService aisleService;

	public AisleController(AisleManagementService aisleService) {
		this.aisleService = aisleService;
	}

	@PostMapping()
	public ResponseEntity<Aisle> postMethodName(@RequestBody AisleCreationDTO dto) {
		return ResponseEntity.ok(aisleService.createAisle(dto));
	}

}
