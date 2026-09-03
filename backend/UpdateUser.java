import java.sql.*;
public class UpdateUser {
    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace", "postgres", "password");
             Statement stmt = conn.createStatement()) {
            int rows = stmt.executeUpdate("UPDATE users SET role = 'ADMIN' WHERE email = 'chandsagar496@gmail.com'");
            System.out.println("Updated " + rows + " rows.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
