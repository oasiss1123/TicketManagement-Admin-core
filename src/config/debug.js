const _debug = require('debug')('debugging:debug');
const _error = require('debug')('debugging:error');
const moment = require('moment')
const winston = require('winston');
const path = require('path');
const { env } = require('../env');
const { handleLogger } = require('../logs');

exports.debug = _debug;
exports.err = (message, url) => {
    if (`${env.node}`.toUpperCase() === 'PRODUCTION') {
        handleLogger(message, url)
    } else {
        _error('error with message %o', message)
    }
};