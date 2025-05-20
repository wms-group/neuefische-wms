package com.wmsgroup.neuefische_wms.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.wmsgroup.neuefische_wms.converter.ProductOutputDTOConverter;
import com.wmsgroup.neuefische_wms.exception.AisleNotFoundException;
import com.wmsgroup.neuefische_wms.exception.StockNotFoundException;
import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.Stock;
import com.wmsgroup.neuefische_wms.model.dto.StockInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import com.wmsgroup.neuefische_wms.repository.StockRepository;

@Service
public class StockService {
    private final ProductRepository productRepo;
    private final AisleRepository aisleRepo;
    private final StockRepository stockRepo;
    private final IdService idService;

    public StockService(AisleRepository aisleRepo, IdService idService, ProductRepository productRepo, StockRepository stockRepo) {
        this.aisleRepo = aisleRepo;
        this.idService = idService;
        this.productRepo = productRepo;
        this.stockRepo = stockRepo;
    }

    public StockOutputDTO getProductCount(String productId) throws StockNotFoundException {
        List<String> stockIds = aisleRepo.findAll().stream()
            .flatMap(aisle -> aisle.stockIds().stream())
            .toList();
        int amount = stockRepo.findAllById(stockIds).stream()
            .filter(s -> s.productId().equals(productId))
            .mapToInt(Stock::amount)
            .sum();

        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new StockNotFoundException("Product with given id was not found."));

        return new StockOutputDTO(productId, ProductOutputDTOConverter.convert(product), amount);
    }

    public StockOutputDTO add(StockInputDTO toAdd) throws StockNotFoundException, AisleNotFoundException {
        Product product = productRepo.findById(toAdd.productId())
            .orElseThrow(() -> new StockNotFoundException("Product with given id was not found."));

        List<Aisle> aisles = aisleRepo.findAll();
        Optional<Aisle> aisle = aisles.stream()
            .filter(a -> a.categoryIds().contains(product.getCategoryId()))
            .findFirst();
        if(aisle.isEmpty()) {
            aisle = aisles.stream()
            .filter(a -> a.categoryIds().isEmpty())
            .findFirst();
        }

        Aisle foundAisle = aisle.orElseThrow(() -> new AisleNotFoundException("No Aisle with suited category found."));
        
        Stock stock = new Stock(idService.generateId(), toAdd.productId(), toAdd.amount());
        stockRepo.save(stock);

        List<String> updatedStockIds = new ArrayList<>(foundAisle.stockIds());
        updatedStockIds.add(stock.id());
        foundAisle = foundAisle.withStockIds(updatedStockIds);
        aisleRepo.save(foundAisle);

        return new StockOutputDTO(stock.id(), ProductOutputDTOConverter.convert(product), stock.amount());
    }

    public void remove(StockInputDTO toRemove) throws StockNotFoundException, AisleNotFoundException {
        List<Stock> stocks = stockRepo.findAll();
        List<Stock> potentialStock = stocks.stream()
            .filter(s -> s.productId().equals(toRemove.productId()))
            .toList();
        
        if(potentialStock.stream().mapToInt(Stock::amount).sum() < toRemove.amount()) {
            throw new StockNotFoundException("Could not find enough stock toList() remove.");
        }
        
        List<String> removingStockIds = List.of();
        int count = 0;
        for (Stock stock : stocks) {
            if(count + stock.amount() > toRemove.amount()) {
                stockRepo.save(stock.withAmount(count + stock.amount() - toRemove.amount()));
                count = toRemove.amount();
            } else {
                removingStockIds.add(stock.id());
                stockRepo.deleteById(stock.id());
                count += stock.amount();
            }

            if(count == toRemove.amount()) {
                break;
            }
        }

        aisleRepo.findAll().stream()
            .filter(a -> a.stockIds().stream().anyMatch(sid -> removingStockIds.contains(sid)))
            .forEach((a) -> {
                aisleRepo.save(a.withStockIds(a.stockIds().stream().filter(sid -> !removingStockIds.contains(sid)).toList()));
            });
    }
    
    public StockOutputDTO getStockById(String stockId) throws StockNotFoundException {
        Stock stock = stockRepo.findById(stockId)
            .orElseThrow(() -> new StockNotFoundException("Stock with given id was not found"));
        Product product = productRepo.findById(stock.productId())
            .orElseThrow(() -> new StockNotFoundException("Product with given id was not found."));

        return new StockOutputDTO(stock.id(), ProductOutputDTOConverter.convert(product), stock.amount());
    }
}
