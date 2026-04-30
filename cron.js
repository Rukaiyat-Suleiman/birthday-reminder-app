import cron from 'node-cron';
import { User, Op } from './db.js';
import { logger } from './utils/logger.config.js';
import { sendBirthdayEmail } from './services/sendEmail.js';

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
                const websiteUrl = process.env.RENDER_EXTERNAL_URL || "http://localhost:" + (process.env.PORT || 3000);
                await sendBirthdayEmail(user.email, user.username, websiteUrl);
            }

        } catch (error) {
            logger.error('Error during birthday check: ' + error.message);
        }
    });
    
    logger.info('Birthday cron job scheduled for 7:00 AM daily.');
};
