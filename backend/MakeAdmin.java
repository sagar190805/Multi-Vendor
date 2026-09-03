import java.sql.*;
public class MakeAdmin {
    public static void main(String[] args) throws Exception {
        try (Connection c = DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace","postgres","password");
             PreparedStatement s = c.prepareStatement("UPDATE users SET role='ADMIN' WHERE email=?")) {
            s.setString(1, args[0]);
            int rows = s.executeUpdate();
            System.out.println("Rows updated: " + rows);
        }
    }
}
