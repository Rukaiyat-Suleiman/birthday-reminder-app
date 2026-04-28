import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { logger } from "./utils/logger.config.js";
import router from "./routes/mainRoute.js";

import { startCronJob } from "./cron.js";

const PORT = process.env.PORT || 3000;

const app = express();

const stream = {
    write: message => logger.info(message.trim())
};

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use (morgan("tiny", {stream}));
app.use("/", router);

// Only listen if not running in Jest
if (!process.env.JEST_WORKER_ID) {
    // Start the cron job
    startCronJob();
    
    app.listen(PORT, () => {
        try {
            logger.info(`Listening on http://localhost:${PORT}`);
        } catch (err) {
            logger.info (`Server failed to startup: \n${err}`)
        }
    });
}

export default app;