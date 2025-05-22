package com.wmsgroup.neuefische_wms.controller;

import com.wmsgroup.neuefische_wms.model.Stock;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wmsgroup.neuefische_wms.exception.AisleNotFoundException;
import com.wmsgroup.neuefische_wms.exception.StockNotFoundException;
import com.wmsgroup.neuefische_wms.model.dto.StockInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.service.StockService;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/count/{productId}")
    public ResponseEntity<StockOutputDTO> getProductAmount(@PathVariable String productId) throws StockNotFoundException {
        return ResponseEntity.ok(stockService.getProductCount(productId));
    }

    @PostMapping()
    public ResponseEntity<StockOutputDTO> addStock(@RequestBody StockInputDTO toAdd) throws StockNotFoundException, AisleNotFoundException {
        return ResponseEntity.ok(stockService.add(toAdd));
    }

    @DeleteMapping()
    public ResponseEntity<StockOutputDTO> removeStock(@RequestBody StockInputDTO toRemove) throws StockNotFoundException, AisleNotFoundException {
        stockService.remove(toRemove);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(stockService.getStocks());
    }
}
