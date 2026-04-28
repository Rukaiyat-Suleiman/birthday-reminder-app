import 'dotenv/config';
import nodemailer from 'nodemailer';
import { logger } from './logger.config.js';

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    logger.info("Initializing Gmail SMTP transport...");
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.GOOGLE_APP_PASS // Using Google App Password
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
