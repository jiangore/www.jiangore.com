/**
 * 微信公众号 发送消息中间件
 * @author tao
 * @date 2019-12-05 11:06:00
 * @version v1.0
 */
let echo = require("debug")('tao-website:weChat-middleware');

let weChat = require('wechat');
let params = require('../params');

module.exports = function (app) {

    app.use('/wx', weChat(params.wxConfig).text(function (message, req, res, next) {
        let xxx = req.weixin;
        console.log(message);
        res.reply([
            {
                title: '你来我家接我吧',
                description: '这是女神与高富帅之间的对话',
                picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                url: 'http://nodeapi.cloudfoundry.com/'
            }
        ]);
    }).image(function (message, req, res, next) {
        console.log(message);
    }).voice(function (message, req, res, next) {
        console.log(message);
    }).video(function (message, req, res, next) {
        console.log(message);
    }).location(function (message, req, res, next) {
        console.log(message);
    }).link(function (message, req, res, next) {
        console.log(message);
    }).event(function (message, req, res, next) {
        console.log(message);
    }).device_text(function (message, req, res, next) {
        console.log(message);
    }).device_event(function (message, req, res, next) {
        console.log(message);
    }).middlewarify());
};