
/**
 * 微信公众号视频消息处理器
 * @type {encode}
 */

let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':wx-videoMessage');

let redisUtil = require('../utils/redisUtil');
let wxMsgPrefix = 'wx:msg:';
let wxMsgExpire = 15;

function handler(message, req, resp, next) {
    if (message.MsgType === 'video') {
        echo(message);

        //第1步 获取当前场景值，进入对应的处理流程
        let wxScene = req.wxsession.wxScene || '',
            msgId = message.MsgId;

        redisUtil.get(wxMsgPrefix + message.MsgId, function (err, val) {
            if (val == null) {
                redisUtil.set(wxMsgPrefix + message.MsgId, message.FromUserName+'_'+message.CreateTime+'_image');
                redisUtil.expire(wxMsgPrefix + message.MsgId, wxMsgExpire);

                sleep(5000).then(value => {
                    res.reply({type: "text", content: 'Hello world!'});
                }).catch(err => {
                    res.reply({type: "text", content: '维护者~'});
                });

            } else {
                //不为null时, 已经有相同的消息的，进入微信消息排重机制
                //返回空字符，微信服务器不会对此作任何处理，并且不会发起重试
                //res.reply('');
            }
        });

    }


}

module.exports = {
    handler: handler
};