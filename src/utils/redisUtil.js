
let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':redisClient');

const redis = require('redis');
const moment = require('moment');

let params = require('../params');
let redisConfig = params.redisConfig;

let client = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    db: redisConfig.database,
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 5) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    }
});
client.on('ready', () => {
    echo('Redis connected');
});

client.on('error', err => {
    echo('Redis failed: ' + err);
});

module.exports = client;

