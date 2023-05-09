const { env } = require("./src/env");
const path = require('path')
const moment = require('moment');

module.exports = {
    apps: [
        {
            name: env.name + ':' + env.port,
            script: 'npm',
            args: 'run start_prd',
            autorestart: true,
            max_memory_restart: '1G',
            out_file: path.join(__dirname, './src/logs/pm2/') + moment().format('YYYY-MM-DD') + '.log'
        },
    ],
};