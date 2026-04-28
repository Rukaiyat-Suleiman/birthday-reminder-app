import { Router } from "express";
import { User } from "../db.js";
import Joi from "joi";
import { logger } from "../utils/logger.config.js";
import { sendMail } from "../utils/mailer.js";
import { ApiResponse } from "../utils/response.middleware.js";

const router = Router();

// Schema for validation
const userSchema = Joi.object({
    username: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    dob: Joi.date().iso().required()
});

router.get("/", (req, res) => {
    res.render("index");
});

router.post("/api/users", async (req, res) => {
    // 1. Validate input
    const { error, value } = userSchema.validate(req.body);
    if (error) {
        logger.error(`Validation error: ${error.details[0].message}`);
        return ApiResponse.error(res, error.details[0].message, 400);
    }

    try {
        // 2. Check if user already exists
        const existingUser = await User.findOne({ where: { email: value.email } });
        if (existingUser) {
            logger.warn(`Registration blocked: email already exists (${value.email})`);
            return ApiResponse.error(res, "Email already exists", 409);
        }

        // Format Date
        const dateObj = new Date(value.dob);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const formattedDob = `${yyyy}-${mm}-${dd}`;

        // 3. Attempt to send the email FIRST
        const subject = 'Registration Confirmation';
        const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #111111;">
                <div style="border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="font-size: 14px; font-weight: 500; margin: 0; color: #666666; text-transform: uppercase; letter-spacing: 1px;">Registration Status</h1>
                </div>
                <h2 style="font-size: 24px; font-weight: 400; margin: 0 0 20px 0; letter-spacing: -0.5px;">Welcome, ${value.username}.</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #444444; margin: 0 0 40px 0;">
                    Your profile has been successfully integrated into our network. You will receive an automated notification on ${formattedDob} every year.
                </p>
                <div style="border-top: 1px solid #eaeaea; padding-top: 20px;">
                    <p style="font-size: 12px; color: #888888; margin: 0;">This is an automated notification. No reply is necessary.</p>
                </div>
            </div>
        `;

        const emailSent = await sendMail(value.email, subject, html);

        if (!emailSent) {
            logger.warn(`Failed to send email to ${value.email}. User not added to database.`);
            return ApiResponse.error(res, "Failed to send confirmation email. Please check your email address.", 500);
        }

        // 4. Email succeeded, now add user to database
        const user = await User.create({
            username: value.username,
            email: value.email,
            dob: formattedDob
        });

        logger.info(`User successfully created: ${user.email}`);
        return ApiResponse.success(res, "User added successfully", user, 201);

    } catch (err) {
        logger.error(`Internal server error during registration: ${err.message}`);
        return ApiResponse.error(res, "Internal server error: " + err.message, 500);
    }
});

export default router;