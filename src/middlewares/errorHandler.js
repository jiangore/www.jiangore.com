/**
 * 错误处理中间件
 * @author tao
 * @date 2019-12-05 11:06:00
 * @version v1.0
 */

let logUtil = require('../utils/logUtil');

let errorHandler = function (err, req, res, next) {
    let meta = '[' + logUtil.now + '] '+req.method+' ' + req.url + '\r\n';
    logUtil.errorFile.write(meta + err.stack + '\r\n\r\n\r\n');

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
};

module.exports = function (app) {
    app.use(errorHandler);
};