package com.wmsgroup.neuefische_wms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.wmsgroup.neuefische_wms.exceptions.AisleNotFoundException;
import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.ErrorDTO;
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

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteAisle(@PathVariable String id) {
		aisleService.deleteAisleById(id);
		return ResponseEntity.noContent().build();
	}

	@ExceptionHandler(AisleNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ErrorDTO handleRedoException(AisleNotFoundException e) {
		return new ErrorDTO(HttpStatus.BAD_REQUEST, e.getMessage());
	}
}
