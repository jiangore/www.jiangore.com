/**
 * 主入口
 * @type {module:path}
 */
let echo = require("debug")('dandelion:main');

let path = require('path');

let dotEnv = require('dotenv');
dotEnv.config({
  encoding: 'utf8',
  debug: process.env.DEBUG,
  path: path.resolve(process.cwd(), '.env')
});


let express = require('express');
let favicon = require('serve-favicon');

let cookieParser = require('cookie-parser');
let session = require('express-session');

let redisUtil = require('./src/utils/redisUtil');
let RedisStore = require('connect-redis')(session);

let app = express();

// 视图引擎配置
app.set('views', path.join(__dirname, 'views/ejs'));
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.query());

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 86400000}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//session cookie设置
app.use(cookieParser());
app.use(session({
  store: new RedisStore({client: redisUtil}),
  name: 'sessionId',
  secret: process.env.EXPRESS_SESSION_SECRET || 'dandelion2020',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 30 * 60 * 1000, httpOnly: true, secure: false}
}));


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
