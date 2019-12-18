
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');


let dotEnv = require('dotenv');
dotEnv.config({
  encoding: 'utf8',
  debug: process.env.DEBUG,
  path: path.resolve(process.cwd(), '.env')
});

let app = express();

// 视图引擎配置
app.set('views', path.join(__dirname, 'views/ejs'));
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.query());

// morgan 日志中间件
require('./src/middlewares/morgan')(app);

// 中间件 路由规则
require('./src/middlewares/routeRule')(app);

// 中间件 处理微信公众号消息
require('./src/middlewares/wechat')(app);

// 中间件 捕获404，跳转到错误处理中间件
require('./src/middlewares/error404')(app);

// 中间件 错误处理
require('./src/middlewares/errorHandler')(app);

module.exports = app;
