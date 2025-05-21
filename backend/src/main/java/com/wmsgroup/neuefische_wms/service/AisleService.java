package com.wmsgroup.neuefische_wms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.wmsgroup.neuefische_wms.exception.AisleNotFoundException;
import com.wmsgroup.neuefische_wms.exception.StockNotFoundException;
import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.AisleUpdateDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;

@Service
public class AisleService {
	private final IdService idService;
	private final AisleRepository aisleRepo;
    private final StockService stockService;

    public AisleService(AisleRepository aisleRepo, IdService idService, StockService stockService) {
        this.aisleRepo = aisleRepo;
        this.idService = idService;
        this.stockService = stockService;
    }

	
	public Aisle createAisle(AisleCreationDTO dto) {
		return aisleRepo.save(Aisle.of(dto).withId(idService.generateId()));
	}

	public Aisle updateAisle(AisleUpdateDTO dto) throws AisleNotFoundException {
		if (!aisleRepo.existsById(dto.id())) {
			throw new AisleNotFoundException("Aisle with id: " + dto.id() + " was not found.");
		}

		return aisleRepo.save(Aisle.of(dto));
	}

	public void deleteAisleById(String id) throws AisleNotFoundException {
        Aisle aisle = aisleRepo.findById(id).orElseThrow(() -> new AisleNotFoundException("Aisle with id: " + id + " was not found."));

		aisleRepo.deleteById(id);
        for (String stockId : aisle.stockIds()) {
            stockService.deleteStockById(stockId);
        }
	}

	public Aisle getAisleById(String id) throws AisleNotFoundException {
		Optional<Aisle> aisle = aisleRepo.findById(id);
		if (aisle.isEmpty()) {
			throw new AisleNotFoundException("Aisle with id: " + id + " was not found.");
		}

		return aisle.get();
	}

	public List<Aisle> getAisles() {
		return aisleRepo.findAll();
	}

	public List<Aisle> getAislesWithIds(List<String> ids) {
		return aisleRepo.findAllById(ids);
	}

	public List<StockOutputDTO> getStockFrom(String aisleId) throws AisleNotFoundException, StockNotFoundException {
		Aisle aisle = aisleRepo.findById(aisleId)
		.orElseThrow(() -> new AisleNotFoundException("Aisle with id: " + aisleId + " was not found."));

		List<StockOutputDTO> stockList = new ArrayList<>();
		for (String stockId : aisle.stockIds()) {
			stockList.add(stockService.getStockById(stockId));
		}
		return stockList;
	}

}
