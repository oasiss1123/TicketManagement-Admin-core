const { env } = require("./src/env");

module.exports = {
    apps: [
        {
            name: `${env.name}:${env.port}`,
            namespace: "BENZ",
            script: 'npm',
            args: 'run start_prd',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G'
        },
    ],
};