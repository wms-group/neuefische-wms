package com.wmsgroup.neuefische_wms.service;

import com.wmsgroup.neuefische_wms.converter.ProductConverter;
import com.wmsgroup.neuefische_wms.converter.ProductOutputDTOConverter;
import com.wmsgroup.neuefische_wms.exception.*;
import com.wmsgroup.neuefische_wms.model.dto.ProductInputDTO;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import com.wmsgroup.neuefische_wms.repository.CategoryRepository;
import com.wmsgroup.neuefische_wms.repository.ProductRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IdService idService;

    private static final String PRODUCT_NOT_FOUND_MESSAGE_FORMAT = "Produkt mit Id %s existiert nicht.";
    private static final String CATEGORY_NOT_FOUND_MESSAGE_FORMAT = "Kategorie für die Id %s existiert nicht.";
    private static final String NOT_BLANK_MESSAGE_FORMAT = "%s darf nicht leer sein!";
    private static final String NO_VALID_NUMBER_MESSAGE_FORMAT = "%s muss eine gültige Zahl sein!";

    private static final String PATH_FORMAT = "product/%s/%s";

    private void validateOrThrow(ProductInputDTO productInputDTO, String id, String item) {
        if (id != null && !productRepository.existsById(id)) {
            throw new ProductNotFoundException(
                    String.format(PRODUCT_NOT_FOUND_MESSAGE_FORMAT, id),
                    String.format(PATH_FORMAT, item, "")
            );
        }
        if (productInputDTO == null) {
            return;
        }
        if (productInputDTO.name().isBlank()) {
            throw new NotBlankException(
                    String.format(NOT_BLANK_MESSAGE_FORMAT, "Name"),
                    String.format(PATH_FORMAT, item, "name")
            );
        }
        if (productInputDTO.price().isBlank()) {
            throw new NotBlankException(
                    String.format(NOT_BLANK_MESSAGE_FORMAT, "Preis"),
                    String.format(PATH_FORMAT, item, "price")
            );
        }
        try {
            new BigDecimal(productInputDTO.price().replace(",", "."));
        } catch (NumberFormatException e) {
            throw new NoValidNumberException(
                    String.format(NO_VALID_NUMBER_MESSAGE_FORMAT, "Preis"),
                    String.format(PATH_FORMAT, item, "price")
            );
        }
        if (!categoryRepository.existsById(productInputDTO.categoryId())) {
            throw new CategoryNotFoundException(
                    String.format(CATEGORY_NOT_FOUND_MESSAGE_FORMAT, productInputDTO.categoryId()),
                    String.format(PATH_FORMAT, item, "categoryId")
            );
        }
    }

    public List<ProductOutputDTO> getAllProducts() {
        return ProductOutputDTOConverter.convert(productRepository.findAll(Sort.by(Sort.Direction.ASC, "name")));
    }

    public ProductOutputDTO addProduct(@NonNull ProductInputDTO productInputDTO) {
        validateOrThrow(productInputDTO, null, "new");
        return ProductOutputDTOConverter.convert(
                productRepository.save(
                        ProductConverter.convert(productInputDTO)
                                .withId(idService.generateId())
                )
        );
    }

    public ProductOutputDTO updateProduct(@NonNull String id, @NonNull ProductInputDTO productInputDTO) {
        validateOrThrow(productInputDTO, id, id);
        return ProductOutputDTOConverter.convert(
                productRepository.save(
                        ProductConverter.convert(productInputDTO)
                                .withId(id)
                )
        );
    }

    public void deleteProduct(@NonNull String id) {
        validateOrThrow(null, id, id);
        productRepository.deleteById(id);
    }

    public List<ProductOutputDTO> getProductsByCategoryId(@NonNull String categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new CategoryNotFoundException(
                    String.format(CATEGORY_NOT_FOUND_MESSAGE_FORMAT, categoryId),
                    String.format(PATH_FORMAT, "category", categoryId)
            );
        }
        return ProductOutputDTOConverter.convert(productRepository.findAllByCategoryId(categoryId, Sort.by(Sort.Direction.ASC, "name")));
    }
}