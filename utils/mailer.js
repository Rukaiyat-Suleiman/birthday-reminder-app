import 'dotenv/config';
import { logger } from './logger.config.js';

/*
// Cant use nodemailer because of render and all other hosting platform restrictions
import nodemailer from 'nodemailer';
let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    logger.info("Initializing Gmail SMTP transport (Forcing IPv4)...");
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.GOOGLE_APP_PASS
        },
        family: 4, // Completely disables IPv6 routing attempts
        // Force IPv4 to prevent ENETUNREACH errors on networks with broken IPv6 routing
        tls: {
            rejectUnauthorized: false
        }
    });

    return transporter;
};
*/

export const sendMail = async (to, subject, html, websiteUrl = "") => {
    // Skip sending emails if running tests
    if (process.env.JEST_WORKER_ID) {
        return true;
    }

    try {
        logger.info(`Dispatching email to ${to} via MikaTech API...`);

        const payload = {
            name: "Automated Reminder System",
            email: process.env.SMTP_USER || "noreply@reminder.com",
            message: `[SUBJECT: ${subject}]\n\n${html}`,
            recipient: to,
            website: websiteUrl
        };

        const response = await fetch(process.env.MAIL_API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authv1": process.env.MAIL_API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned status ${response.status}: ${errorText}`);
        }

        logger.info(`Email successfully dispatched via API to ${to}`);
        return true;
    } catch (error) {
        logger.error(`Failed to send email to ${to}: ${error.message}`);
        return false;
    }
};
