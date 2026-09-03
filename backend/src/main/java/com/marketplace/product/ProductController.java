package com.marketplace.product;

import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import com.marketplace.user.Vendor;
import com.marketplace.user.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;

    private Vendor getAuthenticatedVendor() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Vendor vendor = vendorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found. Please complete onboarding."));
        
        if (!"APPROVED".equals(vendor.getKycStatus())) {
            throw new RuntimeException("Vendor KYC is not approved. Current status: " + vendor.getKycStatus());
        }
        
        return vendor;
    }

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
    public List<ProductDTO> getMyProducts() {
        Vendor vendor = getAuthenticatedVendor();
        return productRepository.findByVendorId(vendor.getId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO dto) {
        Vendor vendor = getAuthenticatedVendor();
        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setStock(dto.getStock());
        product.setVendor(vendor);

        Product saved = productRepository.save(product);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable UUID id, @RequestBody ProductDTO dto) {
        Vendor vendor = getAuthenticatedVendor();
        Product product = productRepository.findById(id).orElseThrow();
        
        if (!product.getVendor().getId().equals(vendor.getId())) {
            return ResponseEntity.status(403).body("Not authorized to edit this product");
        }

        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setStock(dto.getStock());

        Product saved = productRepository.save(product);
        return ResponseEntity.ok(toDTO(saved));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable java.util.UUID id) {
        Vendor vendor = getAuthenticatedVendor();
        Product product = productRepository.findById(id).orElseThrow();
        if (product.getVendor().getId().equals(vendor.getId())) {
            productRepository.delete(product);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).build();
    }
}
