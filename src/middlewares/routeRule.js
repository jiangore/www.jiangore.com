/**
 * 路由中间件
 * @author tao
 * @date 2019-12-05 11:06:00
 * @version v1.0
 */


let indexRoute = require('../routes/index');

module.exports = function (app) {
    app.use('/', indexRoute);
};