package com.marketplace.user;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "vendors")
public class Vendor {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "store_slug")
    private String storeSlug;

    @Column(name = "kyc_status")
    private String kycStatus;

    @Column(name = "commission_rate")
    private BigDecimal commissionRate = BigDecimal.ZERO;

    @Column(name = "bank_account_ref")
    private String bankAccountRef;

    @Column(name = "rating_avg")
    private Double ratingAvg = 0.0;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "business_details", columnDefinition = "TEXT")
    private String businessDetails;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "kyc_document_url", columnDefinition = "TEXT")
    private String kycDocumentUrl;
}
