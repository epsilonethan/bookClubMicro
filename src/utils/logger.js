const { createLogger, transports, format } = require("winston");
const moment = require("moment-timezone")

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({format: () => moment().tz("America/Chicago").format()}),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [new transports.Console()],
});

/**
 * Middleware to log incoming requests with IP addresses.
 */
const requestLogger = (req, res, next) => {
    const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    logger.info(`Incoming request: ${req.method} ${req.url} from ${clientIp}`);
    next();
};

module.exports = { logger, requestLogger };
