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

import com.wmsgroup.neuefische_wms.exception.HallNotFoundException;
import com.wmsgroup.neuefische_wms.model.Hall;
import com.wmsgroup.neuefische_wms.model.dto.HallCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.HallUpdateDTO;
import com.wmsgroup.neuefische_wms.service.HallService;

@RestController
@RequestMapping("/api/halls")
public class HallController {

	private final HallService service;

	public HallController(HallService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<List<Hall>> getHalls(@RequestParam Optional<List<String>> ids) {
		List<Hall> halls = ids.isEmpty() || ids.get().isEmpty()
				? service.getHalls()
				: service.getHallsByIds(ids.get());

		return ResponseEntity.ok(halls);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Hall> getHall(@PathVariable String id) throws HallNotFoundException {
		return ResponseEntity.ok(service.getHallById(id));
	}

	@PostMapping
	public ResponseEntity<Hall> createHall(@RequestBody HallCreationDTO dto) {
		return ResponseEntity.ok(service.createHall(dto));
	}

	@PutMapping
	public ResponseEntity<Hall> updateHall(@RequestBody HallUpdateDTO dto) throws HallNotFoundException {
		return ResponseEntity.ok(service.updateHall(dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteHall(@PathVariable String id) throws HallNotFoundException {
		service.deleteHall(id);
		return ResponseEntity.noContent().build();
	}

}
