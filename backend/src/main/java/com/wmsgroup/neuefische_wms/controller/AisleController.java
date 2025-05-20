package com.wmsgroup.neuefische_wms.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wmsgroup.neuefische_wms.exception.AisleNotFoundException;
import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.AisleUpdateDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.service.AisleService;

@RestController
@RequestMapping("/api/aisles")
public class AisleController {
	private final AisleService aisleService;

	public AisleController(AisleService aisleService) {
		this.aisleService = aisleService;
	}

	@PostMapping
	public ResponseEntity<Aisle> postMethodName(@RequestBody AisleCreationDTO dto) {
		return ResponseEntity.ok(aisleService.createAisle(dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteAisle(@PathVariable String id) throws AisleNotFoundException {
		aisleService.deleteAisleById(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Aisle> getAisleById(@PathVariable String id) throws AisleNotFoundException {
		return ResponseEntity.ok(aisleService.getAisleById(id));
	}

	@GetMapping
	public ResponseEntity<List<Aisle>> getAisles(@RequestParam Optional<List<String>> ids) {
		List<Aisle> aisles = ids.isEmpty() || ids.get().isEmpty()
				? aisleService.getAisles()
				: aisleService.getAislesWithIds(ids.get());

		return ResponseEntity.ok(aisles);
	}

	@PutMapping
	public ResponseEntity<Aisle> updateAisle(@RequestBody AisleUpdateDTO aisle) throws AisleNotFoundException {
		return ResponseEntity.ok(aisleService.updateAisle(aisle));
	}

    @GetMapping("/{aisleId}/stock")
    public ResponseEntity<List<StockOutputDTO>> getStock(@PathVariable String aisleId) throws AisleNotFoundException {
        return ResponseEntity.ok(aisleService.getStockFrom(aisleId));
    }
}
