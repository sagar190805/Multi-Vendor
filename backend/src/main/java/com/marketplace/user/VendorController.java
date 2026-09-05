package com.marketplace.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class VendorController {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;

    @GetMapping("/onboarding")
    public ResponseEntity<?> getVendorStatus() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        Vendor vendor = vendorRepository.findByUserId(user.getId()).orElse(null);
        if (vendor == null) {
            Map<String, String> resp = new HashMap<>();
            resp.put("kycStatus", "NOT_STARTED");
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.ok(vendor);
    }

    @PostMapping("/onboarding")
    public ResponseEntity<?> submitOnboarding(@RequestBody Map<String, String> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        Vendor vendor = vendorRepository.findByUserId(user.getId()).orElse(new Vendor());
        vendor.setUser(user);
        vendor.setStoreName(request.get("storeName"));
        vendor.setStoreSlug(request.get("storeName").replaceAll("[^a-zA-Z0-9]", "-").toLowerCase() + "-" + System.currentTimeMillis());
        vendor.setDescription(request.get("description"));
        vendor.setBusinessDetails(request.get("businessDetails"));
        vendor.setBankAccountRef(request.get("bankDetails"));
        if (request.containsKey("kycDocumentUrl")) {
            vendor.setKycDocumentUrl(request.get("kycDocumentUrl"));
        }
        vendor.setKycStatus("PENDING");
        
        vendorRepository.save(vendor);
        return ResponseEntity.ok("Onboarding submitted successfully");
    }
}
