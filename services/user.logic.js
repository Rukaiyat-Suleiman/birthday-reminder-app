import { User } from "../db.js";
import { logger } from "../utils/logger.config.js";
import { ApiResponse } from "../utils/response.middleware.js";
import { userSchema } from "../validators/user.validator.js";
import { sendRegistrationEmail } from "./sendEmail.js";

export const renderHomePage = (req, res) => {
    res.render("index");
};

export const registerUser = async (req, res) => {
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

        // Format Date for database (YYYY-MM-DD)
        const dateObj = new Date(value.dob);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const formattedDob = `${yyyy}-${mm}-${dd}`;
        
        // Format Date for email display (Month Day)
        const displayDob = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

        // 3. Attempt to send the email FIRST
        const websiteUrl = req.protocol + '://' + req.get('host');
        const emailSent = await sendRegistrationEmail(value.email, value.username, displayDob, websiteUrl);

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
};
