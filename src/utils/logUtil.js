/**
 * 写日志文件
 * @type {module:path}
 */
const path = require('path');
const fs = require('fs');
const fileStreamRotate = require('file-stream-rotator');
const moment = require('moment');

let params = require('../params');

let logDir = params.log + '/' + moment().format('YYYYMM');
let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

//目录是否存在，不存在则创建
fs.existsSync(logDir) || fs.mkdirSync(logDir);

// create a rotating write stream
let accessFile = fileStreamRotate.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDir, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

let errorFile = fileStreamRotate.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDir, 'error-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

// 所有访问日志写到一个文件里  常常直接写在app.js里面
//let accessLogStream = fs.createWriteStream(params.log + '/access.log', {flags: 'a', encoding: 'utf8'});
//app.use(logger(process.env.APP_LOG_FORMAT, {stream: accessLogStream}));

module.exports = {
    now: now,
    accessFile: accessFile,
    errorFile: errorFile
};