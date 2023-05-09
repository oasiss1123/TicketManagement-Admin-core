
require("./config_env");
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const moment = require('moment');
const logMiddleware = require('express_stackdriver');
const { existsSync } = require("fs");
const client = require('prom-client');
const { createApi } = require('./src/api')
const { debug } = require('./src/config/debug');
const { env } = require("./src/env");
const logResponseTime = require("./src/middleware/response-times");

require('moment/locale/th');
require('dotenv').config();

const app = express();
/*###################### SETTING ######################*/
app.use(helmet());
app.use('/api/v1/static', express.static(path.join(__dirname, './public')));

const whitelist = [
    'http://localhost:8080',
    'http://192.168.2.61:8080',
    'https://lark.zetta-system.com:4468',
    'https://lark.zetta-system.com:2096',
    undefined
]

const corsOption = {
    origin: (origin, cb) => {
        origin && debug('origin %o', origin);
        if (whitelist.indexOf(origin) !== -1) {
            cb(null, true)
        } else {
            cb(new Error('Not allows by Cors'))
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(corsOption));
app.use(bodyparser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyparser.json({ limit: '50mb' }));

const limiter = ratelimit({
    windowsMs: 60 * 1000,
    max: 200
})

app.use(limiter)

/*###################### DEBUG ######################*/
app.use(logResponseTime)

/*###################### CONFIG MONITOR ######################*/
const register = new client.Registry();
client.collectDefaultMetrics({ register });
client.collectDefaultMetrics({
    app: env.name,
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

const httpRequestTimer = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
});

// Register the histogram
register.registerMetric(httpRequestTimer);
app.get('/metrics', async (req, res) => {
    const end = httpRequestTimer.startTimer();
    const route = req.route.path;
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
    end({ route, code: res.statusCode, method: req.method });
});

app.use(`/${env.prefix}${env.version_api}/health`, (req, res) => {
    const { from } = req.query;
    from && debug(`Check Health FROM ${from}`);
    res.status(200).json({ success: true, status: 'Available' });
})

// const credentialsPath = path.join(__dirname, "./config/google_credentials.json");
// if (!existsSync(credentialsPath)) {
//     debug(`!!! PLEASE GOOGLE LOG SUCCESS !!!`);
// } else {
//     debug(`### START GOOGLE LOG SUCCESS ###`)
//     app.use(
//         logMiddleware({
//             // local: `${env.node}`.toUpperCase() !== "PRODUCTION",
//             local: false,
//             keyFilename: credentialsPath,
//             ignoreRoute: ["/ignore/:data"],
//             ignoreBody: ["*"],
//             maxEntrySize: 500000
//         })
//     );
// }

/*###################### CREATE API ######################*/
createApi(app);
console.log(`${env.node}`.toUpperCase())
switch (`${env.node}`.toUpperCase()) {
    case 'DEVELOPMENT':
        app.listen(env.port, () => {
            debug(`[${env.node}] ::: Server is running port ${env.port}`)
        });
        console.log(`[${env.node}] ::: Server is running port ${env.port}`)
        break;
    case 'PRODUCTION':
        const cluster = require('cluster');
        const { length } = require('os').cpus()
        const numCPUs = length > 4 ? 4 : length;
        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            debug(`Server is running port (${numCPUs} CPUs) : ${env.port}`)
            cluster.on('exit', (worker) => console.log(`worker ${worker.process.pid} died`));
        } else {
            app.listen(env.port, () => debug(`Server is running port (${process.pid}): ${env.port}`))
        }
        break;
}