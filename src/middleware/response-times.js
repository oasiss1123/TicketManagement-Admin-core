
const moment = require('moment');
const { debug } = require('../config/debug');
function logResponseTime(req, res, next) {
    const startHrTime = process.hrtime();
    res.on("finish", () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        debug(`%s origin (${process.pid}) %o %s`,
            moment().format('YYYY-MM-DD HH:mm:ss'),
            req.originalUrl,
            '\u001b[' + 31 + 'm' + parseFloat(elapsedTimeInMs).toFixed(2) + 'ms' + '\u001b[0m'
        );
    });

    next();
}

module.exports = logResponseTime;