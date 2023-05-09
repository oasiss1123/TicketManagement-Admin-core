const { env } = require('../env');

require('dotenv').config();

module.exports = {
    production: {
        client: 'mssql',
        useNullAsDefault: true,
        connection: {
            host: env.db.prd.host,
            user: env.db.prd.username,
            password: env.db.prd.password,
            database: env.db.prd.database,
            port: env.db.prd.port,
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 5 * 1000,
            acquireTimeoutMillis: 60 * 1000,
        }
    },
    development: {
        client: 'mssql',
        useNullAsDefault: true,
        connection: {
            host: env.db.dev.host,
            user: env.db.dev.username,
            password: env.db.dev.password,
            database: env.db.dev.database,
            port: env.db.dev.port,
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 5 * 1000,
            acquireTimeoutMillis: 60 * 1000,
        }
    }
}