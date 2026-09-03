import java.sql.*;
public class DiagCheck {
    public static void main(String[] args) throws Exception {
        try (Connection c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace","postgres","password");
             Statement s = c.createStatement();
             ResultSet rs = s.executeQuery("SELECT u.email, u.role, v.store_name, v.kyc_status FROM users u LEFT JOIN vendors v ON v.user_id = u.id WHERE u.email LIKE 'roletest_%' ORDER BY u.created_at DESC LIMIT 5")) {
            System.out.println("email | role | store_name | kyc_status");
            while (rs.next()) {
                System.out.println(rs.getString(1) + " | " + rs.getString(2) + " | " + rs.getString(3) + " | " + rs.getString(4));
            }
        }
    }
}
