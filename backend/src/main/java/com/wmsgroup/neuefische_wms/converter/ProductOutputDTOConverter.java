package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.ProductOutputDTO;
import lombok.NonNull;

import java.math.BigDecimal;
import java.util.List;

public class ProductOutputDTOConverter {
    /**
     * Private constructor to prevent instantiation of this utility class.
     *
     * @throws UnsupportedOperationException always, because this is a utility class.
     */
    private ProductOutputDTOConverter() {
        // Utility class
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static ProductOutputDTO convert(@NonNull Product product) {
        return new ProductOutputDTO(
                product.getId(),
                product.getName(),
                product.getCategoryId(),
                String.format("%.2f", product.getPrice())
        );
    }

    public static List<ProductOutputDTO> convert(@NonNull List<Product> categories) {
        return categories.stream().map(ProductOutputDTOConverter::convert).toList();
    }
}
