package com.wmsgroup.neuefische_wms.service;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.wmsgroup.neuefische_wms.model.Aisle;
import com.wmsgroup.neuefische_wms.model.dto.AisleCreationDTO;
import com.wmsgroup.neuefische_wms.repository.AisleRepository;

public class AisleManagementServiceTest {
	public AisleManagementService service;

	public AisleRepository repo;
	public IdService idService;

	@BeforeEach
	public void setUp() {
		repo = mock(AisleRepository.class);
		idService = mock(IdService.class);
		service = new AisleManagementService(idService, repo);
	}

	@Test
	void createAisle_returnsAisle_withCorrectDTO() {
		String id = "A1";
		AisleCreationDTO dto = new AisleCreationDTO("New Aisle", List.of("C1", "C2"), List.of("S1", "S2"));
		Aisle expected = Aisle.of(dto).withId(id);

		when(idService.generateId()).thenReturn(id);
		when(repo.save(expected)).thenReturn(expected);

		assertThat(service.createAisle(dto)).isEqualTo(expected);

		verify(repo, times(1)).save(expected);
	}
}
