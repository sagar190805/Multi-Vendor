import java.sql.*;
public class CheckUsers {
    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace", "postgres", "password");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT email, role FROM users ORDER BY created_at DESC LIMIT 5")) {
            while (rs.next()) {
                System.out.println(rs.getString("email") + " - " + rs.getString("role"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
