/**
 * 404 错误处理中间件
 * @author tao
 * @date 2019-12-05 11:06:00
 * @version v1.0
 */

let createError = require('http-errors');

let error404 = function (req, res, next) {
    next(createError(404));
};

module.exports = function (app) {
    app.use(error404);
};