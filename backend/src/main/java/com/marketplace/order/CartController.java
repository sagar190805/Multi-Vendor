package com.marketplace.order;

import com.marketplace.product.Product;
import com.marketplace.product.ProductRepository;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private Cart getOrCreateCart() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    @GetMapping
    public ResponseEntity<?> getCart() {
        Cart cart = getOrCreateCart();
        List<Map<String, Object>> items = cart.getItems().stream().map(ci -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", ci.getProduct().getId()); // ID of product for frontend
            map.put("cartItemId", ci.getId());
            map.put("title", ci.getProduct().getTitle());
            map.put("price", ci.getProduct().getPrice());
            map.put("image", ci.getProduct().getImageUrl());
            map.put("quantity", ci.getQuantity());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> payload) {
        Cart cart = getOrCreateCart();
        java.util.UUID productId = java.util.UUID.fromString(payload.get("productId").toString());
        Integer quantity = payload.containsKey("quantity") ? Integer.parseInt(payload.get("quantity").toString()) : 1;

        Product product = productRepository.findById(productId).orElseThrow();

        // Check if item exists in cart
        CartItem existing = cart.getItems().stream()
                .filter(ci -> ci.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            cart.getItems().add(item);
        }

        cartRepository.save(cart);
        return ResponseEntity.ok("Added to cart");
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestBody Map<String, Object> payload) {
        Cart cart = getOrCreateCart();
        java.util.UUID productId = java.util.UUID.fromString(payload.get("productId").toString());
        
        cart.getItems().removeIf(ci -> ci.getProduct().getId().equals(productId));
        cartRepository.save(cart);
        
        return ResponseEntity.ok("Removed from cart");
    }
}
