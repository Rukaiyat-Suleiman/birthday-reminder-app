import { Sequelize, DataTypes, Op } from 'sequelize';
import { logger } from './utils/logger.config.js';

if (!process.env.DATABASE_URL) {
    logger.error("CRITICAL: DATABASE_URL is missing. Please set your PostgreSQL connection string in the .env file.");
    process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: msg => logger.info(msg),
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for many managed Postgres services like Neon or Render
        }
    }
});

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
