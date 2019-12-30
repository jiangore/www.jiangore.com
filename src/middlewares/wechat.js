/**
 * 微信公众号 发送消息中间件
 * @author tao
 * @date 2019-12-05 11:06:00
 * @version v1.0
 */
let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':wx-middleware');

let weChat = require('wechat');
let params = require('../params');
const apiUrl = require('../apiUrl');

const urlEncode = require('urlencode');
const axios = require('axios');


module.exports = function (app) {
    app.use('/wx', weChat(params.wxConfig).text(function (message, req, res, next) {
        let xxx = req.weixin;
        console.log(message);

        let xb_url = apiUrl.AI_XB_URL;
        xb_url = xb_url.replace('{msg}', urlEncode(message.Content));
        axios
            .get(xb_url)
            .then(function (response) {
                let data = response.data;
                //console.log(urlEncode.decode(data.InstantMessage.ReplyText))
                res.reply(urlEncode.decode(data.InstantMessage.ReplyText));

            })
            .catch(function (error) {
                res.reply('不明白你的意思');
            });

        /*res.reply([
            {
                title: '你来我家接我吧',
                description: '这是女神与高富帅之间的对话',
                picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
                url: 'http://nodeapi.cloudfoundry.com/'
            }
        ]);*/
        //res.reply({type: "text", content: 'Hello world!'});

    }).image(function (message, req, res, next) {
        //console.log(message);
        res.reply({
            type: "image",
            content: {
                mediaId: message.MediaId
            }
        });
    }).voice(function (message, req, res, next) {
        //console.log(message);
        res.reply({
            type: "voice",
            content: {
                mediaId: message.MediaId
            }
        });

    }).video(function (message, req, res, next) {
        //console.log(message);
        res.reply({
            type: "video",
            content: {
                mediaId: message.MediaId,
                thumbMediaId: message.ThumbMediaId,
            }
        });
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