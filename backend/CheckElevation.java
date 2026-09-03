import java.sql.*;
public class CheckElevation {
    public static void main(String[] a) throws Exception {
        try (Connection c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace","postgres","password");
             PreparedStatement s = c.prepareStatement(
                 "SELECT u.email, u.role, v.store_name, v.kyc_status FROM users u LEFT JOIN vendors v ON v.user_id=u.id WHERE u.email=?")) {
            s.setString(1, a[0]);
            ResultSet rs = s.executeQuery();
            if (rs.next()) System.out.printf("email=%s | role=%s | store=%s | kyc=%s%n", rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4));
        }
    }
}
