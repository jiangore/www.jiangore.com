/**
 * 微信公众号 发送消息中间件
 * @author tao
 * @date 2019-12-05 11:06:00
 * @version v1.0
 */
let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':wx-middleware');

let wx = require('wechat');
let params = require('../params');

let textMessage = require('../wechat/textMessageHandler');
let imageMessage = require('../wechat/imageMessageHandler');
let voiceMessage = require('../wechat/voiceMessageHandler');
let videoMessage = require('../wechat/videoMessageHandler');
let eventMessage = require('../wechat/eventMessageHandler');

module.exports = function (app) {

    app.use('/wx', wx(params.wxConfig).text(function (message, req, res, next) {
        // 文本消息处理器
        textMessage.handler(message, req, res, next);
    }).image(function (message, req, res, next) {
        // 图片消息处理器
        imageMessage.handler(message, req, res, next);
    }).voice(function (message, req, res, next) {
        // 语音消息处理器
        voiceMessage.handler(message, req, res, next);
    }).video(function (message, req, res, next) {
        // 视频消息处理器
        videoMessage.handler(message, req, res, next);
    }).location(function (message, req, res, next) {
        console.log(message);
    }).link(function (message, req, res, next) {
        console.log(message);
    }).event(function (message, req, res, next) {

        // 事件消息处理器
        eventMessage.handler(message, req, res, next);

    }).device_text(function (message, req, res, next) {
        console.log(message);
    }).device_event(function (message, req, res, next) {
        console.log(message);
    }).middlewarify());
};
