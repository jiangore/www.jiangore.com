
let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':routeIndex');

let express = require('express');
let router = express.Router();


router.get('/', function (req, res, next) {
    echo('打开首页');
    echo(req.body);
    res.render('email/index', {title: 'Express'});
});
router.get('/blog', function (req, res, next) {
    echo('打开博客');
    res.render('email/index', {title: 'Express'});
});
router.get('/share', function (req, res, next) {
    echo('打开分享');
    res.render('email/index', {title: 'Express'});
});
router.get('/about', function (req, res, next) {
    echo('打开关于');
    res.render('email/index', {title: 'Express'});
});

module.exports = router;