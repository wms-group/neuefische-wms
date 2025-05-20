package com.wmsgroup.neuefische_wms.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

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
import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.model.dto.AisleUpdateDTO;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.model.dto.StockOutputDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;

class AisleServiceTest {
	private AisleService service;
    private StockService stockService;

	private AisleRepository repo;
	private IdService idService;

	@BeforeEach
    @SuppressWarnings("unused")
	void setUp() {
		repo = mock(AisleRepository.class);
		idService = mock(IdService.class);
        stockService = mock(StockService.class);
		service = new AisleService(repo, idService, stockService);
	}

	@Test
	void createAisle_returnsAisle_withCorrectDTO() {
		String id = "A1";
		AisleCreationDTO dto = new AisleCreationDTO("New Aisle", List.of("C1", "C2"));
		Aisle expected = Aisle.of(dto).withId(id);

		when(idService.generateId()).thenReturn(id);
		when(repo.save(expected)).thenReturn(expected);

		assertThat(service.createAisle(dto)).isEqualTo(expected);

		verify(repo, times(1)).save(expected);
	}

	@Test
	void deleteAisle_deletes_withValidId() throws AisleNotFoundException {
		String validId = "A1";
		when(repo.existsById(validId)).thenReturn(true);

		service.deleteAisleById(validId);

		verify(repo, times(1)).deleteById(validId);
	}

	@Test
	void deleteAisle_throwsAisleNotFound_withInvalidId() {
		String invalidId = "A1";
		when(repo.existsById(invalidId)).thenReturn(false);

		assertThatThrownBy(() -> {
			service.deleteAisleById(invalidId);
		})
				.isInstanceOf(AisleNotFoundException.class)
				.hasMessage("Aisle with id: " + invalidId + " was not found.");

		verify(repo, never()).deleteById(any());
	}

	@Test
	void updateAisle_updatesAisle_withValidAisle() throws AisleNotFoundException {
		AisleUpdateDTO updatedAisle = new AisleUpdateDTO("A1", "Updated Name", List.of("C1", "C2"), List.of("S1", "S2"));
		Aisle validAisle = Aisle.of(updatedAisle).withName("Original Name");

		when(repo.existsById(validAisle.id())).thenReturn(true);

		service.updateAisle(updatedAisle);

		verify(repo, times(1)).save(Aisle.of(updatedAisle));
	}

	@Test
	void updateAisle_throwsAisleNotFound_withInvalidAisle() {
		AisleUpdateDTO updatedAisle = new AisleUpdateDTO("A1", "Updated Name", List.of("C1", "C2"), List.of("S1", "S2"));

		when(repo.existsById(updatedAisle.id())).thenReturn(false);

		assertThatThrownBy(() -> {
			service.updateAisle(updatedAisle);
		}).isInstanceOf(AisleNotFoundException.class)
				.hasMessage("Aisle with id: " + updatedAisle.id() + " was not found.");

		verify(repo, never()).save(any());
	}

	@Test
	void getAisleById_returnsAisle_withValidId() throws AisleNotFoundException {
		Aisle validAisle = new Aisle("A1", "New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
		when(repo.findById(validAisle.id())).thenReturn(Optional.of(validAisle));

		assertThat(service.getAisleById(validAisle.id())).isEqualTo(validAisle);
	}

	@Test
	void getAisleById_throwsAisleNotFound_withInvalidId() {
		String invalidId = "A1";
		when(repo.findById(invalidId)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> {
			service.getAisleById(invalidId);
		}).isInstanceOf(AisleNotFoundException.class)
				.hasMessage("Aisle with id: " + invalidId + " was not found.");
	}

	@Test
	void getAisles_returnsAisles_whenCalled() {
		Aisle aisle = new Aisle("A1", "New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
		List<Aisle> aisles = List.of(aisle, aisle.withId("A2"), aisle.withId("A3"));

		when(repo.findAll()).thenReturn(aisles);

		assertThat(service.getAisles())
				.containsExactlyInAnyOrderElementsOf(aisles);
	}

	@Test
	void getAislesWithIds_returnsAisle_whenCalled() {
		Aisle aisle = new Aisle("A1", "New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
		List<Aisle> aisles = List.of(aisle, aisle.withId("A2"), aisle.withId("A3"));
		List<String> ids = aisles.stream()
				.map(Aisle::id)
				.toList();

		when(repo.findAllById(ids)).thenAnswer(inv -> {
			Iterable<String> requestedIds = inv.getArgument(0);
			return aisles.stream()
					.filter(a -> StreamSupport.stream(requestedIds.spliterator(), false)
							.anyMatch(id -> id.equals(a.id())))
					.toList();
		});

		assertThat(service.getAislesWithIds(ids))
				.hasSize(ids.size())
				.containsExactlyElementsOf(aisles);
	}

    @Test
    void getStockFrom_returnsStockList_withValidAisleId() throws AisleNotFoundException, StockNotFoundException {
        String aisleId = "A1";
        Aisle aisle = new Aisle(aisleId, "Test Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
        StockOutputDTO stock1 = new StockOutputDTO("S1", mock(ProductOutputDTO.class), 10);
        StockOutputDTO stock2 = new StockOutputDTO("S2", mock(ProductOutputDTO.class), 20);
        List<StockOutputDTO> expectedStocks = List.of(stock1, stock2);

        when(repo.findById(aisleId)).thenReturn(Optional.of(aisle));
        when(stockService.getStockById("S1")).thenReturn(stock1);
        when(stockService.getStockById("S2")).thenReturn(stock2);

        assertThat(service.getStockFrom(aisleId))
                .hasSize(2)
                .containsExactlyElementsOf(expectedStocks);

        verify(repo, times(1)).findById(aisleId);
        verify(stockService, times(1)).getStockById("S1");
        verify(stockService, times(1)).getStockById("S2");
    }

    @Test
    void getStockFrom_throwsAisleNotFound_withInvalidAisleId() throws StockNotFoundException {
        String invalidAisleId = "A1";

        when(repo.findById(invalidAisleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> {
            service.getStockFrom(invalidAisleId);
        }).isInstanceOf(AisleNotFoundException.class)
                .hasMessage("Aisle with id: " + invalidAisleId + " was not found.");

        verify(repo, times(1)).findById(invalidAisleId);
        verify(stockService, never()).getStockById(any());
    }
}
