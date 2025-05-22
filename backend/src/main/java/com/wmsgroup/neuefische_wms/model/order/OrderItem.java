package com.wmsgroup.neuefische_wms.model.order;

import com.wmsgroup.neuefische_wms.model.Product;

public record OrderItem(
        Product product,
        int amount,
        double price
) {}