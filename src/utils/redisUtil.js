
let echo = require("debug")('tao-website:redisClient');

const redis = require('redis');
const moment = require('moment');

let client = redis.createClient({
    host: '47.103.85.46',
    port: 6379,
    password: 'Tao#2020Ae',
    db: 0,
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

