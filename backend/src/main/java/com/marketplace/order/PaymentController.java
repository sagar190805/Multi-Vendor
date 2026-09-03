package com.marketplace.order;

import com.marketplace.product.Product;
import com.marketplace.product.ProductRepository;
import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final com.marketplace.notification.NotificationService notificationService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userRepository.findByEmail(email).orElseThrow();
        
        UUID orderId = UUID.fromString(req.get("orderId"));
        Order order = orderRepository.findById(orderId).orElseThrow();

        if (!order.getBuyer().getId().equals(buyer.getId())) {
            return ResponseEntity.status(403).body("Not your order");
        }

        if (!"PAYMENT_PENDING".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Order not awaiting payment");
        }

        try {
            int amountInPaise = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue();
            
            String rzpOrderIdStr;
            if ("rzp_test_replace_me".equals(keyId) || "replace_me".equals(keyId)) {
                // Mock Razorpay Order for testing
                rzpOrderIdStr = "order_test_" + UUID.randomUUID().toString().substring(0, 8);
            } else {
                JSONObject options = new JSONObject();
                options.put("amount", amountInPaise);
                options.put("currency", "INR");
                options.put("receipt", order.getId().toString());
    
                com.razorpay.Order rzpOrder = razorpayClient.orders.create(options);
                rzpOrderIdStr = rzpOrder.get("id");
            }

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setRazorpayOrderId(rzpOrderIdStr);
            payment.setAmount(order.getTotalAmount());
            payment.setCurrency("INR");
            payment.setStatus("PENDING");
            payment.setCreatedAt(Instant.now());
            paymentRepository.save(payment);

            return ResponseEntity.ok(Map.of(
                "razorpayOrderId", rzpOrderIdStr,
                "amount", amountInPaise,
                "currency", "INR",
                "keyId", keyId
            ));
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body("Failed to create payment order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> req) {
        // Fast client-side verify
        String rzpOrderId = req.get("razorpayOrderId");
        String rzpPaymentId = req.get("razorpayPaymentId");
        String rzpSignature = req.get("razorpaySignature");

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal((rzpOrderId + "|" + rzpPaymentId).getBytes());
            String generatedSignature = HexFormat.of().formatHex(hash);

            if (!generatedSignature.equals(rzpSignature)) {
                return ResponseEntity.badRequest().body("Signature mismatch");
            }

            // Fallback for Local Dev (No Ngrok webhook reachable)
            // If the user's environment doesn't reach the webhook, we flip it here so it doesn't get stuck.
            // In a strict production environment, we would rely ONLY on the webhook below.
            Payment payment = paymentRepository.findByRazorpayOrderId(rzpOrderId).orElse(null);
            if (payment != null && "PENDING".equals(payment.getStatus())) {
                payment.setStatus("CAPTURED");
                payment.setRazorpayPaymentId(rzpPaymentId);
                payment.setRazorpaySignature(rzpSignature);
                payment.setUpdatedAt(Instant.now());
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                if ("PAYMENT_PENDING".equals(order.getStatus())) {
                    order.setStatus("PAID");
                    orderRepository.save(order);
                    
                    notificationService.sendEmail(
                        order.getBuyer().getEmail(),
                        "Order Confirmed - Payment Received (Fallback)",
                        "We have received your payment for Order #" + order.getId() + ".\nTotal: Rs. " + order.getTotalAmount()
                    );
                    
                    order.getItems().stream().map(item -> item.getVendor()).distinct().forEach(vendor -> {
                        notificationService.sendEmail(
                            vendor.getUser().getEmail(),
                            "New Order Received!",
                            "A buyer has paid for a new order containing your products. Please log in to your dashboard to view Order #" + order.getId()
                        );
                    });
                }
            }

            return ResponseEntity.ok(Map.of("status", "verified"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Verification error");
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(webhookSecret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes());
            String generatedSignature = HexFormat.of().formatHex(hash);

            if (!generatedSignature.equals(signature)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
            }

            JSONObject event = new JSONObject(payload);
            String eventType = event.getString("event");
            JSONObject paymentEntity = event.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
            String razorpayOrderId = paymentEntity.getString("order_id");

            Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElse(null);
            if (payment == null) return ResponseEntity.ok("Payment not found");

            if ("payment.captured".equals(eventType)) {
                if ("CAPTURED".equals(payment.getStatus())) return ResponseEntity.ok("Already processed");

                payment.setRazorpayPaymentId(paymentEntity.getString("id"));
                payment.setStatus("CAPTURED");
                payment.setUpdatedAt(Instant.now());
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                order.setStatus("PAID");
                orderRepository.save(order);
                
                notificationService.sendEmail(
                    order.getBuyer().getEmail(),
                    "Order Confirmed - Payment Received",
                    "We have received your payment for Order #" + order.getId() + ".\nTotal: Rs. " + order.getTotalAmount()
                );
                
                // Notify sellers
                order.getItems().stream().map(item -> item.getVendor()).distinct().forEach(vendor -> {
                    notificationService.sendEmail(
                        vendor.getUser().getEmail(),
                        "New Order Received!",
                        "A buyer has paid for a new order containing your products. Please log in to your dashboard to view Order #" + order.getId()
                    );
                });

            } else if ("payment.failed".equals(eventType)) {
                payment.setStatus("FAILED");
                payment.setUpdatedAt(Instant.now());
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                if (!"CANCELLED".equals(order.getStatus())) {
                    order.setStatus("CANCELLED");
                    for (OrderItem item : order.getItems()) {
                        Product product = item.getProduct();
                        product.setStock(product.getStock() + item.getQuantity());
                        productRepository.save(product);
                    }
                    orderRepository.save(order);
                    
                    notificationService.sendEmail(
                        order.getBuyer().getEmail(),
                        "Payment Failed - Order Cancelled",
                        "Your payment for Order #" + order.getId() + " failed. The order has been cancelled."
                    );
                }
            }

            return ResponseEntity.ok("Processed");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Webhook processing error");
        }
    }
}
