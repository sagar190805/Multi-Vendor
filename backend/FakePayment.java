
    import java.sql.*;
    import java.util.UUID;
    public class FakePayment {
        public static void main(String[] args) {
            try (Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace", "postgres", "password");
                 PreparedStatement stmt = conn.prepareStatement("INSERT INTO payments (id, order_id, razorpay_order_id, amount, currency, status, created_at) VALUES (?, ?, ?, 500, 'INR', 'PENDING', NOW())")) {
                stmt.setObject(1, UUID.randomUUID());
                stmt.setObject(2, UUID.fromString("7d0a4c98-8a31-4d59-9bb4-6af000004b31"));
                stmt.setString(3, "order_test_fake_1788422393890");
                stmt.executeUpdate();
            } catch (Exception e) { e.printStackTrace(); }
        }
    }