const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const LOGGER_PATH = 'src/logger';

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        printf(
            ({ level, message, timestamp }) =>
                `${timestamp} [${level}]: ${message}`
        )
    ),
    defaultMeta: {},
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({
            filename: `${LOGGER_PATH}/error.log`,
            level: 'error',
        }),
        new winston.transports.File({
            filename: `${LOGGER_PATH}/combined.log`,
        }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

module.exports = logger;
