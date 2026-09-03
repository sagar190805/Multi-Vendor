package com.marketplace.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void sendEmail(String to, String subject, String message) {
        log.info("\n=======================================================");
        log.info("📧 MOCK EMAIL NOTIFICATION");
        log.info("To:      {}", to);
        log.info("Subject: {}", subject);
        log.info("Message: {}", message);
        log.info("=======================================================\n");
    }
}
