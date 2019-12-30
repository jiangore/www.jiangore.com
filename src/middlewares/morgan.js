/**
 * morgan 日志中间件
 * @type {morgan}
 * @author tao
 * @date 2019-12-05 11:06:00
 * @version v1.0
 */

const logger = require('morgan');
let logUtil = require('../utils/logUtil');

// 自定义token
logger.token('from', function (req, res) {
    return JSON.stringify(req.query) || '-';
});

logger.token('time', function (req, res) {
    return logUtil.now;
});

logger.token('nextROw', function (req, res) {
    return "\r\n";
});

// 自定义format，其中包含自定义的token
logger.format('myLogger', '[appLog] [:time] :remote-addr :remote-user :method :url :from :status :referrer :response-time ms :user-agent :nextROw');

//跳过不需要记录的请求
function skip(req) {
    return (req.url).indexOf('stylesheets') != -1
}

module.exports = function (app) {
    app.use(logger(process.env.APP_LOG_FORMAT));
    // 使用自定义的format
    app.use(logger('myLogger'));
    //打印到日志文件中
    app.use(logger('myLogger',{skip: skip, stream: logUtil.accessFile }));
};

