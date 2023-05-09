const winston = require('winston');
const path = require('path');
const moment = require('moment');
const _error = require('debug')('debugging:error');
require('moment/locale/th');

const options = {
    file: {
        level: 'error',
        filename: path.join(__dirname, `../../src/`, `logs/${moment().format('YYYY-MM-DD')}/`, `error.log`),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        colorize: false,
    },
}

exports.handleLogger = (message, url) => {
    if (process.env.NODE_ENV !== 'production') {
        const logger = winston.createLogger({
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD' }),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            ),
            transports: [
                new winston.transports.File(options.file)
            ]
        })
        return logger.error(`${moment().format('HH:mm:ss')} ${url || ''} => ${message}`);
    } else {
        _error('error with message %o', message)
    }
};