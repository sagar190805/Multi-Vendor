package com.marketplace.config;

import com.marketplace.user.User;
import com.marketplace.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@platform.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@platform.com");
            admin.setPasswordHash(passwordEncoder.encode("adminpassword"));
            admin.setPhone("9999999999");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Seeded default ADMIN user!");
        }
    }
}

