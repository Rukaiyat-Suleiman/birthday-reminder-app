import cron from 'node-cron';
import { User, Op } from './db.js';
import { logger } from './utils/logger.config.js';
import { sendMail } from './utils/mailer.js';

// Create cron job to run every day at 7:00 AM
export const startCronJob = () => {
    // '0 7 * * *' means every day at 7:00 AM
    cron.schedule('0 7 * * *', async () => {
        logger.info('Running daily birthday check...');
        try {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const dateString = `-${month}-${day}`;

            const celebrants = await User.findAll({
                where: {
                    dob: {
                        [Op.like]: `%${dateString}`
                    }
                }
            });
            
            if (celebrants.length === 0) {
                logger.info('No birthdays today.');
                return;
            }

            logger.info(`Found ${celebrants.length} birthdays today!`);

            for (const user of celebrants) {
                const subject = 'Birthday Notification';
                const html = `
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #111111;">
                            <div style="border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 30px;">
                                <h1 style="font-size: 14px; font-weight: 500; margin: 0; color: #666666; text-transform: uppercase; letter-spacing: 1px;">Annual Notice</h1>
                            </div>
                            <h2 style="font-size: 24px; font-weight: 400; margin: 0 0 20px 0; letter-spacing: -0.5px;">Happy Birthday, ${user.username}.</h2>
                            <p style="font-size: 15px; line-height: 1.6; color: #444444; margin: 0 0 40px 0;">
                                Wishing you a seamless and remarkable year ahead. Thank you for being part of our network.
                            </p>
                            <div style="border-top: 1px solid #eaeaea; padding-top: 20px;">
                                <p style="font-size: 12px; color: #888888; margin: 0;">This is an automated notification. No reply is necessary.</p>
                            </div>
                        </div>
                    `;

                await sendMail(user.email, subject, html);
            }

        } catch (error) {
            logger.error('Error during birthday check: ' + error.message);
        }
    });
    
    logger.info('Birthday cron job scheduled for 7:00 AM daily.');
};
