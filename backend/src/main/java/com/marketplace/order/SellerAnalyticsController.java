package com.marketplace.order;

import com.marketplace.product.ProductRepository;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import com.marketplace.user.Vendor;
import com.marketplace.user.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller/analytics")
@RequiredArgsConstructor
public class SellerAnalyticsController {

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Vendor vendor = vendorRepository.findByUserId(user.getId()).orElse(null);
        
        if (vendor == null || !"APPROVED".equals(vendor.getKycStatus())) {
            return ResponseEntity.badRequest().body("Vendor not approved or not found.");
        }

        List<OrderItem> items = orderItemRepository.findByVendorId(vendor.getId());
        
        BigDecimal totalRevenue = BigDecimal.ZERO;
        int activeOrders = 0;
        int completedOrders = 0;

        for (OrderItem item : items) {
            String status = item.getOrder().getStatus();
            if ("DELIVERED".equals(status)) {
                totalRevenue = totalRevenue.add(item.getPriceAtTime().multiply(new BigDecimal(item.getQuantity())));
                completedOrders++;
            } else if (!"RETURN_REQUESTED".equals(status) && !"CANCELLED".equals(status)) {
                activeOrders++;
            }
        }

        long totalProducts = productRepository.countByVendorId(vendor.getId());

        long pendingOrders = activeOrders; // using activeOrders as pending fulfillment

        // Recent Orders
        List<Map<String, Object>> recentOrders = items.stream()
                .sorted((a, b) -> b.getOrder().getCreatedAt().compareTo(a.getOrder().getCreatedAt()))
                .limit(5)
                .map(item -> Map.of(
                        "id", "#ORD-" + item.getOrder().getId().toString().substring(0, 6),
                        "item", item.getProduct().getTitle(),
                        "amount", "Rs. " + item.getPriceAtTime().multiply(new BigDecimal(item.getQuantity())),
                        "status", item.getOrder().getStatus()
                ))
                .collect(java.util.stream.Collectors.toList());

        // Top Products
        Map<String, Long> productSales = items.stream()
                .filter(item -> !"CANCELLED".equals(item.getOrder().getStatus()))
                .collect(java.util.stream.Collectors.groupingBy(item -> item.getProduct().getTitle(), java.util.stream.Collectors.summingLong(OrderItem::getQuantity)));
        
        List<Map<String, Object>> topProducts = productSales.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(3)
                .map(e -> Map.of(
                        "name", e.getKey(),
                        "sales", e.getValue()
                ))
                .collect(java.util.stream.Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("activeOrders", activeOrders);
        stats.put("completedOrders", completedOrders);
        stats.put("totalProducts", totalProducts);
        stats.put("pendingOrders", pendingOrders);
        stats.put("recentOrders", recentOrders);
        stats.put("topProducts", topProducts);

        return ResponseEntity.ok(stats);
    }
}
