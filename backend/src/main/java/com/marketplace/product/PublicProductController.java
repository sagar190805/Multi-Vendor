package com.marketplace.product;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final ProductRepository productRepository;

    private ProductDTO toDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setStock(p.getStock());
        dto.setCategory(p.getCategory());
        dto.setImageUrl(p.getImageUrl());
        return dto;
    }

    @GetMapping
    public List<ProductDTO> getProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category) {
            
        List<Product> products;
        
        if (q != null && !q.trim().isEmpty()) {
            products = productRepository.searchByTitleOrDescription(q.trim());
        } else if (category != null && !category.trim().isEmpty()) {
            products = productRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            products = productRepository.findAll();
        }
        
        return products.stream()
                .filter(p -> "ACTIVE".equals(p.getStatus()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
