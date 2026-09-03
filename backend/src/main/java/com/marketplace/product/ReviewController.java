package com.marketplace.product;

import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<?> getReviews(@PathVariable UUID productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        List<Map<String, Object>> response = reviews.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("rating", r.getRating());
            map.put("comment", r.getComment());
            map.put("author", r.getUser().getEmail().split("@")[0]);
            map.put("date", r.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/customer/reviews")
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        UUID productId = UUID.fromString(payload.get("productId").toString());
        Product product = productRepository.findById(productId).orElseThrow();
        
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(Integer.parseInt(payload.get("rating").toString()));
        review.setComment(payload.getOrDefault("comment", "").toString());
        
        reviewRepository.save(review);
        return ResponseEntity.ok("Review added successfully");
    }
}
