package com.marketplace.order;

import com.marketplace.product.Product;
import com.marketplace.product.ProductRepository;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customer/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByEmail(email).orElseThrow();

        Order order = new Order();
        order.setBuyer(buyer);
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("PAYMENT_PENDING");
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CheckoutRequest.CheckoutItem item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId()).orElseThrow();
            
            // Deduct stock (Reservation)
            if (product.getStock() < item.getQuantity()) {
                return ResponseEntity.badRequest().body("Not enough stock for " + product.getTitle());
            }
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product); // Optimistic locking will catch concurrent modifications here

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setVendor(product.getVendor());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPriceAtTime(product.getPrice());
            
            orderItems.add(orderItem);
            
            BigDecimal lineTotal = product.getPrice().multiply(new BigDecimal(item.getQuantity()));
            total = total.add(lineTotal);
        }

        order.setTotalAmount(total);
        order.setItems(orderItems);
        order = orderRepository.save(order);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "Order reserved, pending payment");
        response.put("orderId", order.getId());

        return ResponseEntity.ok(response);
    }



    @GetMapping
    public ResponseEntity<?> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByEmail(email).orElseThrow();
        
        List<Order> orders = orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyer.getId());
        
        // Simple map to DTOs for the frontend
        List<java.util.Map<String, Object>> response = orders.stream().map(o -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", o.getId());
            map.put("totalAmount", o.getTotalAmount());
            map.put("status", o.getStatus());
            map.put("createdAt", o.getCreatedAt());
            map.put("shippingAddress", o.getShippingAddress());
            
            List<java.util.Map<String, Object>> itemsList = o.getItems().stream().map(i -> {
                java.util.Map<String, Object> iMap = new java.util.HashMap<>();
                iMap.put("id", i.getId());
                iMap.put("productId", i.getProduct().getId());
                iMap.put("productTitle", i.getProduct().getTitle());
                iMap.put("quantity", i.getQuantity());
                iMap.put("price", i.getPriceAtTime());
                return iMap;
            }).collect(Collectors.toList());
            map.put("items", itemsList);
            
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{orderId}/return")
    public ResponseEntity<?> requestReturn(@PathVariable java.util.UUID orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (!"DELIVERED".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Only delivered orders can be returned.");
        }
        order.setStatus("RETURN_REQUESTED");
        orderRepository.save(order);
        return ResponseEntity.ok("Return requested successfully");
    }
}
