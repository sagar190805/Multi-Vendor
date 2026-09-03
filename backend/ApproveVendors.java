import java.sql.*;
public class ApproveVendors {
    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace", "postgres", "password");
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate("UPDATE vendors SET kyc_status = 'APPROVED'");
            System.out.println("Vendors approved.");
        } catch (Exception e) { e.printStackTrace(); }
    }
}
