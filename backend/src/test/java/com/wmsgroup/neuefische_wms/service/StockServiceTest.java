package com.wmsgroup.neuefische_wms.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.wmsgroup.neuefische_wms.exception.AisleNotFoundException;
import com.wmsgroup.neuefische_wms.exception.StockNotFoundException;
import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.Stock;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import com.wmsgroup.neuefische_wms.repository.StockRepository;

class StockServiceTest {
    private StockService service;
    private AisleRepository aisleRepo;
    private ProductRepository productRepo;
    private StockRepository stockRepo;
    private CategoryService categoryService;
    private IdService idService;

    @BeforeEach
    @SuppressWarnings("unused")
    void setUp() {
        aisleRepo = mock(AisleRepository.class);
        productRepo = mock(ProductRepository.class);
        stockRepo = mock(StockRepository.class);
        idService = mock(IdService.class);
        categoryService = mock(CategoryService.class);
        service = new StockService(aisleRepo, idService, productRepo, stockRepo, categoryService);
    }

    @Test
    void getProductCount_returnsStock_withValidProductId() throws StockNotFoundException {
        String productId = "P1";
        Product product = Product.builder()
                .id(productId)
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        Aisle aisle = new Aisle("A1", "Test Aisle", List.of("C1"), List.of("S1", "S2"));
        Stock stock1 = new Stock("S1", productId, 10);
        Stock stock2 = new Stock("S2", productId, 5);
        StockOutputDTO expected = new StockOutputDTO(productId, new ProductOutputDTO(productId, "Item1", "C1", "10,00"), 15);

        when(aisleRepo.findAll()).thenReturn(List.of(aisle));
        when(stockRepo.findAllById(List.of("S1", "S2"))).thenReturn(List.of(stock1, stock2));
        when(productRepo.findById(productId)).thenReturn(Optional.of(product));

        assertThat(service.getProductCount(productId)).isEqualTo(expected);

        verify(aisleRepo, times(1)).findAll();
        verify(stockRepo, times(1)).findAllById(List.of("S1", "S2"));
        verify(productRepo, times(1)).findById(productId);
    }

    @Test
    void getProductCount_throwsStockNotFound_withInvalidProductId() {
        String invalidProductId = "P1";

        when(aisleRepo.findAll()).thenReturn(List.of());
        when(productRepo.findById(invalidProductId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getProductCount(invalidProductId))
                .isInstanceOf(StockNotFoundException.class)
                .hasMessage("Product was not found.");

        verify(productRepo, times(1)).findById(invalidProductId);
        verify(aisleRepo, never()).findAll();
        verify(stockRepo, never()).findAllById(any());
    }

    @Test
    void add_addsStock_withValidInput() throws StockNotFoundException, AisleNotFoundException {
        String productId = "P1";
        String stockId = "S1";
        Product product = Product.builder()
                .id(productId)
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        Aisle aisle = new Aisle("A1", "Test Aisle", List.of("C1"), List.of());
        StockInputDTO input = new StockInputDTO(productId, 15);
        Stock stock = new Stock(stockId, productId, 15);
        Aisle updatedAisle = aisle.withStockIds(List.of(stockId));
        StockOutputDTO expected = new StockOutputDTO(stockId, new ProductOutputDTO(productId, "Item1", "C1", "10,00"), 15);

        when(productRepo.findById(productId)).thenReturn(Optional.of(product));
        when(aisleRepo.findAll()).thenReturn(List.of(aisle));
        when(idService.generateId()).thenReturn(stockId);
        when(stockRepo.save(stock)).thenReturn(stock);
        when(aisleRepo.save(updatedAisle)).thenReturn(updatedAisle);

        assertThat(service.add(input)).isEqualTo(expected);

        verify(productRepo, times(1)).findById(productId);
        verify(aisleRepo, times(1)).findAll();
        verify(idService, times(1)).generateId();
        verify(stockRepo, times(1)).save(stock);
        verify(aisleRepo, times(1)).save(updatedAisle);
    }

    @Test
    void add_throwsStockNotFound_withInvalidProductId() {
        StockInputDTO input = new StockInputDTO("P1", 15);

        when(productRepo.findById("P1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.add(input))
                .isInstanceOf(StockNotFoundException.class)
                .hasMessage("Product was not found.");

        verify(productRepo, times(1)).findById("P1");
        verify(aisleRepo, never()).findAll();
        verify(stockRepo, never()).save(any());
        verify(aisleRepo, never()).save(any());
    }

    @Test
    void add_throwsAisleNotFound_withNoSuitableAisle() {
        String productId = "P1";
        Product product = Product.builder()
                .id(productId)
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        StockInputDTO input = new StockInputDTO(productId, 15);

        when(productRepo.findById(productId)).thenReturn(Optional.of(product));
        when(aisleRepo.findAll()).thenReturn(List.of());

        assertThatThrownBy(() -> service.add(input))
                .isInstanceOf(AisleNotFoundException.class)
                .hasMessage("No Aisle with suited category found.");

        verify(productRepo, times(1)).findById(productId);
        verify(aisleRepo, times(1)).findAll();
        verify(stockRepo, never()).save(any());
        verify(aisleRepo, never()).save(any());
    }

    @Test
    void remove_removesStock_withSufficientStock() throws StockNotFoundException, AisleNotFoundException {
        String productId = "P1";
        StockInputDTO input = new StockInputDTO(productId, 15);
        Stock stock1 = new Stock("S1", productId, 10);
        Stock stock2 = new Stock("S2", productId, 10);
        Aisle aisle = new Aisle("A1", "Test Aisle", List.of("C1"), List.of("S1", "S2"));
        Aisle updatedAisle = aisle.withStockIds(List.of("S2"));

        when(productRepo.existsById(productId)).thenReturn(true);
        when(stockRepo.findAll()).thenReturn(List.of(stock1, stock2));
        when(stockRepo.save(stock2.withAmount(5))).thenReturn(stock2.withAmount(5));
        when(aisleRepo.findAll()).thenReturn(List.of(aisle));
        when(aisleRepo.save(updatedAisle)).thenReturn(updatedAisle);

        service.remove(input);

        verify(stockRepo, times(1)).findAll();
        verify(stockRepo, times(1)).deleteById("S1");
        verify(stockRepo, times(1)).save(stock2.withAmount(5));
        verify(aisleRepo, times(1)).findAll();
        verify(aisleRepo, times(1)).save(updatedAisle);
    }

    @Test
    void remove_throwsStockNotFound_withInsufficientStock() {
        String productId = "P1";
        StockInputDTO input = new StockInputDTO(productId, 15);
        Stock stock = new Stock("S1", productId, 10);

        when(productRepo.existsById(productId)).thenReturn(true);
        when(stockRepo.findAll()).thenReturn(List.of(stock));

        assertThatThrownBy(() -> service.remove(input))
                .isInstanceOf(StockNotFoundException.class)
                .hasMessage("Could not find enough stock to remove.");

        verify(stockRepo, times(1)).findAll();
        verify(stockRepo, never()).deleteById(any());
        verify(stockRepo, never()).save(any());
        verify(aisleRepo, never()).findAll();
    }

    @Test
    void remove_throwsStockNotFound_withInvalidProductId() {
        StockInputDTO input = new StockInputDTO("P1", 15);
        when(productRepo.existsById("P1")).thenReturn(false);

        assertThatThrownBy(() -> service.remove(input))
                .isInstanceOf(StockNotFoundException.class)
                .hasMessage("Product was not found.");

        verify(stockRepo, never()).findAll();
        verify(stockRepo, never()).deleteById(any());
        verify(stockRepo, never()).save(any());
        verify(aisleRepo, never()).findAll();
    }

    @Test
    void getStockById_returnsStock_withValidStockId() throws StockNotFoundException {
        String stockId = "S1";
        String productId = "P1";
        Product product = Product.builder()
                .id(productId)
                .name("Item1")
                .categoryId("C1")
                .price(new BigDecimal("10.00"))
                .build();
        Stock stock = new Stock(stockId, productId, 10);
        StockOutputDTO expected = new StockOutputDTO(stockId, new ProductOutputDTO(productId, "Item1", "C1", "10,00"), 10);

        when(stockRepo.findById(stockId)).thenReturn(Optional.of(stock));
        when(productRepo.findById(productId)).thenReturn(Optional.of(product));

        assertThat(service.getStockById(stockId)).isEqualTo(expected);

        verify(stockRepo, times(1)).findById(stockId);
        verify(productRepo, times(1)).findById(productId);
    }

    @Test
    void getStockById_throwsStockNotFound_withInvalidStockId() {
        String invalidStockId = "S1";

        when(stockRepo.findById(invalidStockId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getStockById(invalidStockId))
                .isInstanceOf(StockNotFoundException.class)
                .hasMessage("Stock was not found.");

        verify(stockRepo, times(1)).findById(invalidStockId);
        verify(productRepo, never()).findById(any());
    }

    @Test
    void deleteStockById_deletesStock_withValidId() {
        String stockId = "S1";

        service.deleteStockById(stockId);

        verify(stockRepo, times(1)).deleteById(stockId);
    }
}