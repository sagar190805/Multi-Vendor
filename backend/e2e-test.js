const axios = require("axios");
const crypto = require("crypto");

const BASE_URL = "http://localhost:8080/api";

let results = [];
function log(testName, passed, detail) {
  results.push({ testName, passed, detail });
  console.log(`${passed ? "? PASS" : "? FAIL"} — ${testName}`);
  if (detail) console.log(`     ${detail}`);
}

async function api(method, path, token, body) {
  try {
    const res = await axios({
      method,
      url: `${BASE_URL}${path}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      data: body,
      validateStatus: () => true,
    });
    return res;
  } catch (err) {
    return { status: 0, data: err.message };
  }
}

async function registerAndLogin(email, password, role) {
  await api("POST", "/auth/register", null, { email, password, phone: "123", role }); 
  const loginRes = await api("POST", "/auth/login", null, { email, password });
  return loginRes.data.token;
}

async function runTests() {
  console.log("=== SETUP ===\n");

  const ts = Date.now();
  const buyerToken = await registerAndLogin(`buyer_e2e_${ts}@test.com`, "Test@1234", "CUSTOMER");
  const sellerToken = await registerAndLogin(`seller_e2e_${ts}@test.com`, "Test@1234", "SELLER");
  const rejectedSellerToken = await registerAndLogin(`seller_reject_e2e_${ts}@test.com`, "Test@1234", "SELLER");
  const adminToken = await registerAndLogin(`admin_e2e_${ts}@test.com`, "Test@1234", "ADMIN");

  await api("POST", "/seller/onboarding", sellerToken, {
    storeName: `E2E Test Store ${ts}`,
    description: "Store",
    businessDetails: "Details",
    bankDetails: "TEST-BANK-REF",
  }); 

  const pendingVendors = await api("GET", "/admin/vendors?status=PENDING", adminToken);
  const testVendor = pendingVendors.data.find(v => v.storeName === `E2E Test Store ${ts}`); 
  await api("PUT", `/admin/vendors/${testVendor.id}/approve`, adminToken);

  const productRes = await api("POST", "/seller/products", sellerToken, {
    title: "E2E Test Product",
    description: "Desc",
    price: 500,
    stock: 5,
    category: "Test",
    status: "ACTIVE",
    imageUrl: "test.jpg"
  }); 
  const productId = productRes.data.id;
  const webhookSecret = "replace_me"; // The dummy secret in application.properties

  console.log("\n=== TEST 1: Happy Path Order ? Payment ? Stock ? Fulfillment ===\n");
  {
    const stockBefore = (await api("GET", `/products/${productId}`, buyerToken)).data.stock;
    const orderRes = await api("POST", "/customer/orders/checkout", buyerToken, {
      items: [{ productId: productId, quantity: 1 }],
      shippingAddress: "TEST-ADDRESS", 
    });
    const orderId = orderRes.data.orderId;
    log("Order created", orderRes.status === 200 || orderRes.status === 201, `status=${orderRes.status}`);

    const paymentOrderRes = await api("POST", "/payments/create-order", buyerToken, { orderId: orderId });
    log("Razorpay order created", paymentOrderRes.status === 200,
        paymentOrderRes.status !== 200 ? "Payment gateway integration may be missing/deferred" : "");
        
    const rzpOrderId = paymentOrderRes.data.razorpayOrderId;

    const fakeWebhookPayload = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_test123", order_id: rzpOrderId, notes: { order_id: orderId } } } },
    });
    const validSignature = crypto.createHmac("sha256", webhookSecret).update(fakeWebhookPayload).digest("hex");

    const webhookRes = await axios.post(`${BASE_URL}/payments/webhook`, fakeWebhookPayload, {
      headers: { "X-Razorpay-Signature": validSignature, "Content-Type": "application/json" },
      validateStatus: () => true,
    });
    log("Webhook accepted valid signature", webhookRes.status === 200, `status=${webhookRes.status}`);

    const orderAfter = await api("GET", `/customer/orders/${orderId}`, buyerToken);
    log("Order status flipped to PAID", orderAfter.data.status === "PAID", `status=${orderAfter.data.status}`);

    const stockAfter = (await api("GET", `/products/${productId}`, buyerToken)).data.stock;
    log("Stock deducted by 1", stockAfter === stockBefore - 1, `before=${stockBefore}, after=${stockAfter}`);

    const sellerOrders = await api("GET", "/seller/orders", sellerToken);
    const orderItem = sellerOrders.data.find(o => o.orderId === orderId);
    
    if (orderItem) {
        const acceptRes = await api("POST", `/seller/orders/${orderItem.id}/status`, sellerToken, { status: "VENDOR_ACCEPTED" });
        log("Seller can accept PAID order", acceptRes.status === 200);

        const packRes = await api("POST", `/seller/orders/${orderItem.id}/status`, sellerToken, { status: "PACKED" });
        log("Seller can mark packed", packRes.status === 200);

        const shipRes = await api("POST", `/seller/orders/${orderItem.id}/status`, sellerToken, { status: "SHIPPED" });
        log("Seller can mark shipped", shipRes.status === 200);
    } else {
        log("Seller could not find order item", false);
    }
  }

  console.log("\n=== TEST 2: Failed Payment ? Order Cancelled ? Stock Released ===\n");
  {
    const stockBefore = (await api("GET", `/products/${productId}`, buyerToken)).data.stock;
    const orderRes = await api("POST", "/customer/orders/checkout", buyerToken, {
      items: [{ productId: productId, quantity: 1 }],
      shippingAddress: "TEST-ADDRESS-ID",
    });
    const orderId = orderRes.data.orderId;
    
    const paymentOrderRes = await api("POST", "/payments/create-order", buyerToken, { orderId: orderId });
    const rzpOrderId = paymentOrderRes.data.razorpayOrderId;

    const fakeFailedPayload = JSON.stringify({
      event: "payment.failed",
      payload: { payment: { entity: { order_id: rzpOrderId, notes: { order_id: orderId } } } },
    });
    const sig = crypto.createHmac("sha256", webhookSecret).update(fakeFailedPayload).digest("hex");
    await axios.post(`${BASE_URL}/payments/webhook`, fakeFailedPayload, {
      headers: { "X-Razorpay-Signature": sig, "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    const orderAfter = await api("GET", `/customer/orders/${orderId}`, buyerToken);
    log("Order status is CANCELLED after failed payment",
        orderAfter.data.status === "CANCELLED", `status=${orderAfter.data.status}`);

    const stockAfter = (await api("GET", `/products/${productId}`, buyerToken)).data.stock;
    log("Stock released back (unchanged from before)", stockAfter === stockBefore, `before=${stockBefore}, after=${stockAfter}`);
  }

  console.log("\n=== TEST 3: Abandoned Payment Doesn't Silently Become PAID ===\n");
  {
    const orderRes = await api("POST", "/customer/orders/checkout", buyerToken, {
      items: [{ productId: productId, quantity: 1 }],
      shippingAddress: "TEST-ADDRESS-ID",
    });
    const orderId = orderRes.data.orderId;
    
    const orderAfter = await api("GET", `/customer/orders/${orderId}`, buyerToken);
    log("Order stays PAYMENT_PENDING (not silently PAID)",
        orderAfter.data.status === "PAYMENT_PENDING",
        `status=${orderAfter.data.status}`);
  }

  console.log("\n=== TEST 4: Price Edit After Order Placed Doesn't Retroactively Change It ===\n");
  {
    const orderRes = await api("POST", "/customer/orders/checkout", buyerToken, {
      items: [{ productId: productId, quantity: 1 }],
      shippingAddress: "TEST-ADDRESS-ID",
    });
    const orderId = orderRes.data.orderId;
    
    const orderBefore = await api("GET", `/customer/orders/${orderId}`, buyerToken);
    const originalTotal = orderBefore.data.totalAmount;

    await api("PUT", `/seller/products/${productId}`, sellerToken, { title: "E2E Test Product", description: "Desc", price: 999999, stock: 5, category: "Test", status: "ACTIVE", imageUrl: "test.jpg" });

    const orderAfter = await api("GET", `/customer/orders/${orderId}`, buyerToken);
    log("Order total unchanged after seller edits product price",
        orderAfter.data.totalAmount === originalTotal,
        `original=${originalTotal}, after edit=${orderAfter.data.totalAmount}`);
  }

  console.log("\n=== TEST 5: Invalid State Transition Rejected ===\n");
  {
    const orderRes = await api("POST", "/customer/orders/checkout", buyerToken, {
      items: [{ productId: productId, quantity: 1 }],
      shippingAddress: "TEST-ADDRESS-ID",
    });
    const orderId = orderRes.data.orderId;

    const sellerOrders = await api("GET", "/seller/orders", sellerToken);
    const orderItem = sellerOrders.data.find(o => o.orderId === orderId);

    const skipRes = await api("POST", `/seller/orders/${orderItem.id}/status`, sellerToken, { status: "DELIVERED" }); 
    log("Cannot skip PAYMENT_PENDING ? DELIVERED directly",
        skipRes.status === 400 || skipRes.status === 409 || skipRes.status === 403, `status=${skipRes.status}`);
  }

  console.log("\n=== TEST 6: CANCELLED Is a Valid Transition Pre-Shipment ===\n");
  {
    const orderRes = await api("POST", "/customer/orders/checkout", buyerToken, {
      items: [{ productId: productId, quantity: 1 }],
      shippingAddress: "TEST-ADDRESS-ID",
    });
    const orderId = orderRes.data.orderId;

    const cancelRes = await api("PUT", `/customer/orders/${orderId}/cancel`, buyerToken); 
    log("Order can be cancelled pre-shipment", cancelRes.status === 200, `status=${cancelRes.status}`);
  }

  console.log("\n=== TEST 7: Vendor Rejection ? Resubmission Loop ===\n");
  {
    await api("POST", "/seller/onboarding", rejectedSellerToken, { storeName: `Reject Test Store ${ts}`, description: "D", businessDetails: "B", bankDetails: "B" });

    const pending = await api("GET", "/admin/vendors?status=PENDING", adminToken);
    const vendor = pending.data.find(v => v.storeName === `Reject Test Store ${ts}`);
    await api("PUT", `/admin/vendors/${vendor.id}/reject`, adminToken, { reason: "Incomplete documents" });

    const vendorStatus = await api("GET", "/seller/onboarding", rejectedSellerToken); 
    log("Seller sees rejection reason", vendorStatus.data.rejectionReason === "Incomplete documents",
        `reason returned="${vendorStatus.data.rejectionReason}"`);

    const resubmitRes = await api("POST", "/seller/onboarding", rejectedSellerToken, {
      storeName: `Reject Test Store ${ts}`, description: "D", businessDetails: "B", bankDetails: "FIXED-REF"
    });
    log("Seller can resubmit after rejection", resubmitRes.status === 200, `status=${resubmitRes.status}`);
  }

  console.log("\n=== TEST 8: Admin Order Oversight Is Read-Only ===\n");
  {
    const orderRes = await api("POST", "/customer/orders/checkout", buyerToken, {
      items: [{ productId: productId, quantity: 1 }],
      shippingAddress: "TEST-ADDRESS-ID",
    });
    const orderId = orderRes.data.orderId;

    const adminMutateAttempt = await api("PUT", `/admin/orders/${orderId}`, adminToken, { status: "DELIVERED" });
    log("Admin cannot directly mutate order status",
        adminMutateAttempt.status === 404 || adminMutateAttempt.status === 405 || adminMutateAttempt.status === 403,
        `status=${adminMutateAttempt.status} (expect 404/405/403)`);
  }

  console.log("\n=== TEST 9: Webhook Rejects Tampered Signature ===\n");
  {
    const fakePayload = JSON.stringify({ event: "payment.captured", payload: {} });
    const tamperedRes = await axios.post(`${BASE_URL}/payments/webhook`, fakePayload, {
      headers: { "X-Razorpay-Signature": "clearly-fake-signature", "Content-Type": "application/json" },
      validateStatus: () => true,
    });
    log("Webhook rejects invalid signature", tamperedRes.status === 400 || tamperedRes.status === 401 || tamperedRes.status === 500, `status=${tamperedRes.status}`);
  }

  console.log("\n=== SUMMARY ===\n");
  const passed = results.filter(r => r.passed).length;
  console.log(`${passed}/${results.length} tests passed`);
  results.filter(r => !r.passed).forEach(r => console.log(`  ? ${r.testName} — ${r.detail}`));
}

runTests().catch(console.error);
