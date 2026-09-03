import java.sql.*;
public class CleanStale {
    public static void main(String[] a) throws Exception {
        try (Connection c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace","postgres","password");
             Statement s = c.createStatement()) {
            s.executeUpdate("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE '%@test.com'))");
            s.executeUpdate("DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE '%@test.com'))");
            s.executeUpdate("DELETE FROM orders WHERE buyer_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')");
            s.executeUpdate("DELETE FROM products WHERE vendor_id IN (SELECT id FROM vendors WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com'))");
            s.executeUpdate("DELETE FROM vendors WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')");
            int deleted = s.executeUpdate("DELETE FROM users WHERE email LIKE '%@test.com'");
            System.out.println("Deleted " + deleted + " test accounts and their associated data.");

            ResultSet rs = s.executeQuery("SELECT email, role FROM users ORDER BY created_at DESC");
            System.out.println("\nRemaining accounts:");
            System.out.printf("%-40s %s%n", "email", "role");
            System.out.println("-".repeat(50));
            while (rs.next()) System.out.printf("%-40s %s%n", rs.getString(1), rs.getString(2));
        }
    }
}
