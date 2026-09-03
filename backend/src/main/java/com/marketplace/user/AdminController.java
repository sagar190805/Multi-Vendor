package com.marketplace.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final VendorRepository vendorRepository;
    private final com.marketplace.order.OrderRepository orderRepository;
    private final com.marketplace.product.ProductRepository productRepository;

    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getVendors(@RequestParam(required = false) String status) {
        if ("PENDING".equals(status)) {
            List<Vendor> pending = vendorRepository.findAll().stream()
                    .filter(v -> "PENDING".equals(v.getKycStatus()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(pending);
        }
        return ResponseEntity.ok(vendorRepository.findAll());
    }

    @GetMapping("/vendors/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable UUID id) {
        return ResponseEntity.ok(vendorRepository.findById(id).orElseThrow());
    }

    @PutMapping("/vendors/{id}/approve")
    public ResponseEntity<?> approveVendor(@PathVariable UUID id) {
        Vendor vendor = vendorRepository.findById(id).orElseThrow();
        if (!"PENDING".equals(vendor.getKycStatus())) return ResponseEntity.badRequest().body("Not pending");
        vendor.setKycStatus("APPROVED");
        vendor.setRejectionReason(null);
        vendorRepository.save(vendor);
        // publish vendor.approved event (notification to seller) - to be implemented
        return ResponseEntity.ok("Approved");
    }

    @PutMapping("/vendors/{id}/reject")
    public ResponseEntity<?> rejectVendor(@PathVariable UUID id, @RequestBody java.util.Map<String, String> body) {
        Vendor vendor = vendorRepository.findById(id).orElseThrow();
        if (!"PENDING".equals(vendor.getKycStatus())) return ResponseEntity.badRequest().body("Not pending");
        vendor.setKycStatus("REJECTED");
        vendor.setRejectionReason(body.get("reason"));
        vendorRepository.save(vendor);
        // publish vendor.rejected event - to be implemented
        return ResponseEntity.ok("Rejected");
    }

    @GetMapping("/orders")
    public ResponseEntity<List<com.marketplace.order.Order>> getAllOrders(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String vendorId,
        @RequestParam(required = false) String dateFrom,
        @RequestParam(required = false) String dateTo
    ) {
        // Keeping filtering simple in-memory for demo; in production use JPA Specifications
        List<com.marketplace.order.Order> orders = orderRepository.findAll();
        if (status != null && !status.isEmpty()) {
            orders = orders.stream().filter(o -> status.equals(o.getStatus())).collect(Collectors.toList());
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<com.marketplace.order.Order> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderRepository.findById(id).orElseThrow());
    }

    @GetMapping("/products")
    public ResponseEntity<List<com.marketplace.product.Product>> getAllProducts(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String vendorId,
        @RequestParam(required = false) String search
    ) {
        List<com.marketplace.product.Product> products = productRepository.findAll();
        if (status != null && !status.isEmpty()) {
            products = products.stream().filter(p -> status.equals(p.getStatus())).collect(Collectors.toList());
        }
        if (vendorId != null && !vendorId.isEmpty()) {
            products = products.stream().filter(p -> vendorId.equals(p.getVendor().getId().toString())).collect(Collectors.toList());
        }
        if (search != null && !search.isEmpty()) {
            products = products.stream().filter(p -> p.getTitle().toLowerCase().contains(search.toLowerCase())).collect(Collectors.toList());
        }
        return ResponseEntity.ok(products);
    }

    @PutMapping("/products/{id}/ban")
    public ResponseEntity<?> banProduct(@PathVariable UUID id, @RequestBody java.util.Map<String, String> body) {
        com.marketplace.product.Product product = productRepository.findById(id).orElseThrow();
        product.setStatus("BANNED");
        productRepository.save(product);
        return ResponseEntity.ok("Banned");
    }

    @PutMapping("/products/{id}/unban")
    public ResponseEntity<?> unbanProduct(@PathVariable UUID id) {
        com.marketplace.product.Product product = productRepository.findById(id).orElseThrow();
        product.setStatus("ACTIVE");
        productRepository.save(product);
        return ResponseEntity.ok("Unbanned");
    }

    @GetMapping("/analytics/overview")
    public ResponseEntity<java.util.Map<String, Object>> getAnalyticsOverview() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        
        long totalProducts = productRepository.count();
        long bannedProducts = productRepository.findAll().stream().filter(p -> "BANNED".equals(p.getStatus())).count();
        long activeVendors = vendorRepository.findAll().stream().filter(v -> "APPROVED".equals(v.getKycStatus())).count();
        long pendingVendors = vendorRepository.findAll().stream().filter(v -> "PENDING".equals(v.getKycStatus())).count();
        long totalOrders = orderRepository.count();
        java.math.BigDecimal totalGmv = orderRepository.findAll().stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .map(com.marketplace.order.Order::getTotalAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        stats.put("totalProducts", totalProducts);
        stats.put("bannedProducts", bannedProducts);
        stats.put("activeVendors", activeVendors);
        stats.put("pendingVendors", pendingVendors);
        stats.put("totalOrders", totalOrders);
        stats.put("totalGmv", totalGmv);
        
        return ResponseEntity.ok(stats);
    }
}
