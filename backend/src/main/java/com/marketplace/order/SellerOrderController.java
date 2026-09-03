package com.marketplace.order;

import com.marketplace.user.Vendor;
import com.marketplace.user.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
public class SellerOrderController {

    private final OrderItemRepository orderItemRepository;
    private final VendorRepository vendorRepository;
    private final com.marketplace.user.UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final com.marketplace.product.ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<?> getSellerOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        com.marketplace.user.User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.ok(List.of());
        
        Vendor vendor = vendorRepository.findByUserId(user.getId()).orElse(null);
        if (vendor == null) {
            return ResponseEntity.ok(List.of()); // No vendor profile yet
        }

        List<OrderItem> items = orderItemRepository.findByVendorId(vendor.getId());

        List<java.util.Map<String, Object>> response = items.stream().map(item -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", item.getId());
            map.put("orderId", item.getOrder().getId());
            map.put("productTitle", item.getProduct().getTitle());
            map.put("quantity", item.getQuantity());
            map.put("price", item.getPriceAtTime());
            map.put("status", item.getOrder().getStatus()); // Using parent order status for simplicity
            map.put("date", item.getOrder().getCreatedAt());
            map.put("customer", item.getOrder().getBuyer().getEmail());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{orderItemId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable java.util.UUID orderItemId, @RequestBody java.util.Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        com.marketplace.user.User user = userRepository.findByEmail(email).orElseThrow();
        Vendor vendor = vendorRepository.findByUserId(user.getId()).orElseThrow();

        String newStatus = body.get("status");
        
        OrderItem orderItem = orderItemRepository.findById(orderItemId).orElseThrow();
        
        // 1. Ownership Check (IDOR prevention)
        if (!orderItem.getVendor().getId().equals(vendor.getId())) {
            return ResponseEntity.status(403).body("Not authorized to update this order.");
        }

        Order order = orderItem.getOrder();
        String currentStatus = order.getStatus();
        
        // 2. Strict Order State Machine Transitions
        boolean validTransition = false;
        
        // Forward path
        if ("PLACED".equals(currentStatus) && "VENDOR_ACCEPTED".equals(newStatus)) validTransition = true;
        if ("VENDOR_ACCEPTED".equals(currentStatus) && "PACKED".equals(newStatus)) validTransition = true;
        if ("PACKED".equals(currentStatus) && "SHIPPED".equals(newStatus)) validTransition = true;
        if ("SHIPPED".equals(currentStatus) && "DELIVERED".equals(newStatus)) validTransition = true;
        
        // Exit ramps (Cancellation)
        if (("PLACED".equals(currentStatus) || "VENDOR_ACCEPTED".equals(currentStatus) || "PACKED".equals(currentStatus)) && "CANCELLED".equals(newStatus)) {
            validTransition = true;
        }
        
        if (!validTransition) {
            return ResponseEntity.badRequest().body("Invalid state transition from " + currentStatus + " to " + newStatus);
        }
            
        order.setStatus(newStatus);
        
        // Release stock if cancelled
        if ("CANCELLED".equals(newStatus)) {
            for (OrderItem item : order.getItems()) {
                com.marketplace.product.Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }
        
        orderRepository.save(order);
        return ResponseEntity.ok("Status updated to " + newStatus);
    }
}
