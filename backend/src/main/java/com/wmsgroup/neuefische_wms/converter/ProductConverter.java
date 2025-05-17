package com.wmsgroup.neuefische_wms.converter;

import com.wmsgroup.neuefische_wms.model.Product;
import com.wmsgroup.neuefische_wms.model.dto.ProductInputDTO;
import lombok.NonNull;

import java.math.BigDecimal;

public class ProductConverter {
    /**
     * Private constructor to prevent instantiation of this utility class.
     *
     * @throws UnsupportedOperationException always, because this is a utility class.
     */
    private ProductConverter() {
        // Utility class
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static Product convert(@NonNull ProductInputDTO productInputDTO) {
        return Product.builder()
                .name(productInputDTO.name())
                .categoryId(productInputDTO.categoryId())
                .price(new BigDecimal(productInputDTO.price().replace(',', '.')))
                .build();
    }
}
