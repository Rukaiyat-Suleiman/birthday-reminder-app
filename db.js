import { Sequelize, DataTypes, Op } from 'sequelize';
import { logger } from './utils/logger.config.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './database.sqlite',
    logging: msg => logger.info(msg) // Log Sequelize queries using our logger
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
