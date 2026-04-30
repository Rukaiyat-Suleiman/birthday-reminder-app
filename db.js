import { Sequelize, DataTypes, Op } from 'sequelize';
import { logger } from './utils/logger.config.js';

let sequelize;

if (process.env.JEST_WORKER_ID) {
    // Use an in-memory SQLite database for fast isolated testing
    sequelize = new Sequelize('sqlite::memory:', {
        logging: false
    });
} else {
    if (!process.env.DATABASE_URL) {
        logger.error("CRITICAL: DATABASE_URL is missing. Please set your PostgreSQL connection string in the .env file.");
        process.exit(1);
    }

    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: msg => logger.info(msg),
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
}

export const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

// Sync database
sequelize.sync().then(() => {
    logger.info('Database & tables synced via Sequelize!');
}).catch(err => {
    logger.error('Error syncing database: ' + err.message);
});

export { sequelize, Op };
