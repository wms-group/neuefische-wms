package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.converter.ProductConverter;
import com.wmsgroup.neuefische_wms.converter.ProductOutputDTOConverter;
import com.wmsgroup.neuefische_wms.model.dto.ProductInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IdService idService;

    public List<ProductOutputDTO> getAllProducts() {
        return ProductOutputDTOConverter.convert(productRepository.findAll());
    }

    public ProductOutputDTO addProduct(@NonNull ProductInputDTO productInputDTO) {
        if (!categoryRepository.existsById(productInputDTO.categoryId())) {
            throw new IllegalArgumentException(String.format("Category for categoryId %s does not exist", productInputDTO.categoryId()));
        }
        if (productInputDTO.name().isBlank()) {
            throw new IllegalArgumentException("Name must not be blank");
        }
        return ProductOutputDTOConverter.convert(
                productRepository.save(
                        ProductConverter.convert(productInputDTO)
                                .withId(idService.generateId())
                )
        );
    }
}
