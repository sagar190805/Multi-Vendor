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

    @GetMapping("/vendors/pending")
    public ResponseEntity<List<Vendor>> getPendingVendors() {
        // Normally we'd add findByKycStatus to the repo, let's just filter here for speed
        List<Vendor> pending = vendorRepository.findAll().stream()
                .filter(v -> "PENDING".equals(v.getKycStatus()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }
    
    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorRepository.findAll());
    }

    @PostMapping("/vendors/{id}/status")
    public ResponseEntity<?> updateVendorStatus(@PathVariable UUID id, @RequestBody java.util.Map<String, String> body) {
        Vendor vendor = vendorRepository.findById(id).orElseThrow();
        String currentStatus = vendor.getKycStatus();
        String newStatus = body.get("status");

        boolean validTransition = false;
        
        if ("PENDING".equals(currentStatus) && ("APPROVED".equals(newStatus) || "REJECTED".equals(newStatus))) {
            validTransition = true;
        }

        if (!validTransition) {
            return ResponseEntity.badRequest().body("Invalid state transition from " + currentStatus + " to " + newStatus);
        }

        vendor.setKycStatus(newStatus);
        vendorRepository.save(vendor);
        return ResponseEntity.ok("Vendor status updated to " + newStatus);
    }
}
