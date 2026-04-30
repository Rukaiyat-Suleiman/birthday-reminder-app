import { sendMail } from '../utils/mailer.js';
import { getRegistrationTemplate, getBirthdayTemplate } from '../utils/email.templates.js';

/**
 * Service to handle sending the registration confirmation email.
 */
export const sendRegistrationEmail = async (email, username, formattedDob, websiteUrl) => {
    const subject = 'Registration Confirmation';
    const html = getRegistrationTemplate(username, formattedDob);
    
    return await sendMail(email, subject, html, websiteUrl);
};

/**
 * Service to handle sending the annual birthday notification email.
 */
export const sendBirthdayEmail = async (email, username, websiteUrl) => {
    const subject = 'Birthday Notification';
    const html = getBirthdayTemplate(username);
    
    return await sendMail(email, subject, html, websiteUrl);
};
