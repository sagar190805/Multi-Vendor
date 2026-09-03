package com.marketplace.product;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductDTO {
    private UUID id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;
    private String imageUrl;
}
