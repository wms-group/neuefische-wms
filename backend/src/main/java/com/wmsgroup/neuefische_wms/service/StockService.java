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
import com.wmsgroup.neuefische_wms.model.dto.CategoryOutputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import com.wmsgroup.neuefische_wms.repository.StockRepository;

@Service
public class StockService {
    public static final String PRODUCT_NOT_FOUND_MESSAGE ="Product was not found.";
    public static final String STOCK_NOT_FOUND_MESSAGE ="Stock was not found.";

    private final ProductRepository productRepo;
    private final AisleRepository aisleRepo;
    private final StockRepository stockRepo;
    private final CategoryService categoryService;
    private final IdService idService;

    public StockService(AisleRepository aisleRepo, IdService idService, ProductRepository productRepo, StockRepository stockRepo, CategoryService categoryService) {
        this.aisleRepo = aisleRepo;
        this.idService = idService;
        this.productRepo = productRepo;
        this.stockRepo = stockRepo;
        this.categoryService = categoryService;
    }

    public StockOutputDTO getProductCount(String productId) throws StockNotFoundException {

        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new StockNotFoundException(PRODUCT_NOT_FOUND_MESSAGE));
        
        List<String> stockIds = aisleRepo.findAll().stream()
            .flatMap(aisle -> aisle.stockIds().stream())
            .toList();

        int amount = stockRepo.findAllById(stockIds).stream()
            .filter(s -> s.productId().equals(productId))
            .mapToInt(Stock::amount)
            .sum();

        return new StockOutputDTO(productId, ProductOutputDTOConverter.convert(product), amount);
    }

    public StockOutputDTO add(StockInputDTO toAdd) throws StockNotFoundException, AisleNotFoundException {
        Product product = productRepo.findById(toAdd.productId())
            .orElseThrow(() -> new StockNotFoundException(PRODUCT_NOT_FOUND_MESSAGE));

        List<Aisle> aisles = aisleRepo.findAll();
        Optional<Aisle> aisle = aisles.stream()
            .filter(a -> a.categoryIds().contains(product.getCategoryId()))
            .findFirst();

        if (aisle.isEmpty()) {
            List<CategoryOutputDTO> categories = categoryService.getAllCategories();
            Optional<CategoryOutputDTO> current = categories.stream()
                .filter(c -> c.id().equals(product.getCategoryId()))
                .findFirst();
            
            while (current.isPresent()) {
                String parentId = current.get().parentId();
                if (parentId == null) {
                    current = Optional.empty();
                } else {
                    Optional<Aisle> parentAisle = aisles.stream()
                        .filter(a -> a.categoryIds().contains(parentId))
                        .findFirst();
                    if (parentAisle.isPresent()) {
                        aisle = parentAisle;
                        current = Optional.empty();
                    } else {
                        current = categories.stream()
                            .filter(c -> c.id().equals(parentId))
                            .findFirst();
                    }
                }
            }
        }

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
        if (!productRepo.existsById(toRemove.productId())) {
            throw new StockNotFoundException(PRODUCT_NOT_FOUND_MESSAGE);
        }
        
        List<Stock> stocks = stockRepo.findAll();
        List<Stock> potentialStock = stocks.stream()
            .filter(s -> s.productId().equals(toRemove.productId()))
            .toList();
        
        if(potentialStock.stream().mapToInt(Stock::amount).sum() < toRemove.amount()) {
            throw new StockNotFoundException("Could not find enough stock to remove.");
        }
        
        List<String> removingStockIds = new ArrayList<>();
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
            .filter(a -> a.stockIds().stream().anyMatch(removingStockIds::contains))
            .forEach(a -> aisleRepo.save(a
                .withStockIds(a.stockIds().stream()
                    .filter(sid -> !removingStockIds.contains(sid))
                    .toList()))
            );
    }
    
    public StockOutputDTO getStockById(String stockId) throws StockNotFoundException {
        Stock stock = stockRepo.findById(stockId)
            .orElseThrow(() -> new StockNotFoundException(STOCK_NOT_FOUND_MESSAGE));
        Product product = productRepo.findById(stock.productId())
            .orElseThrow(() -> new StockNotFoundException(PRODUCT_NOT_FOUND_MESSAGE));

        return new StockOutputDTO(stock.id(), ProductOutputDTOConverter.convert(product), stock.amount());
    }

    public void deleteStockById(String id) {
        stockRepo.deleteById(id);
    }

    public List<Stock> getStocks() {
        return stockRepo.findAll();
    }
}
