import java.sql.*;
public class CheckRoles {
    public static void main(String[] a) throws Exception {
        try(Connection c=DriverManager.getConnection("jdbc:postgresql://localhost:5432/marketplace","postgres","password");
            Statement s=c.createStatement();
            ResultSet rs=s.executeQuery("SELECT email, role FROM users ORDER BY created_at DESC")) {
            System.out.printf("%-45s %s%n", "email", "role");
            System.out.println("-".repeat(55));
            while(rs.next()) System.out.printf("%-45s %s%n", rs.getString(1), rs.getString(2));
        }
    }
}
