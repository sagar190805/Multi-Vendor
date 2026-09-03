package com.marketplace.order;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CheckoutRequest {
    private List<CheckoutItem> items;
    private String shippingAddress;
    
    @Data
    public static class CheckoutItem {
        private UUID productId;
        private Integer quantity;
    }
}
