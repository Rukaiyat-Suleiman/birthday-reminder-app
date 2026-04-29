import 'dotenv/config';
import nodemailer from 'nodemailer';
import { logger } from './logger.config.js';

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

export const sendMail = async (to, subject, html) => {
    // Skip sending emails if running tests
    if (process.env.JEST_WORKER_ID) {
        return true;
    }

    const senderEmail = process.env.SMTP_USER;

    const mailOptions = {
        from: { name: "Notices", address: senderEmail },
        to,
        subject,
        html
    };

    try {
        const mailTransporter = getTransporter();
        await mailTransporter.sendMail(mailOptions);
        logger.info(`Email successfully sent to ${to}`);
        return true;
    } catch (error) {
        logger.error(`Failed to send email to ${to}: ${error.message}`);
        return false;
    }
};

export default transporter;
