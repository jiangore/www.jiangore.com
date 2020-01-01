/**
 * 微信公众号图片消息处理器
 * @type {encode}
 */

let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':wx-imageMessage');

let FaceValue = require('../wechat/faceValue');
let redisUtil = require('../utils/redisUtil');
let wxMsgPrefix = 'wx:msg:';
let wxMsgExpire = 15;
let wxConstant = require('./wxConstant');

function handler(message, req, resp, next) {
    if (message.MsgType === 'image') {
        //req.weixin == message
        //console.log(req.weixin);
        echo(message);

        //第1步 获取当前场景值，进入对应的处理流程
        let wxScene = req.wxsession.wxScene || '',
            picUrl = message.PicUrl,
            msgId = message.MsgId,
            mediaId = message.MediaId;

        echo('图片地址:' + picUrl);
        echo('当前场景:' + wxScene);

        //测颜值
        if (wxScene == wxConstant.FACE_VALUE_SCENE_CODE) {
            redisUtil.get(wxMsgPrefix + message.MsgId, function (err, val) {
                if (val == null) {
                    redisUtil.set(wxMsgPrefix + message.MsgId, message.FromUserName + '_' + message.CreateTime + '_image');
                    redisUtil.expire(wxMsgPrefix + message.MsgId, wxMsgExpire);
                    new FaceValue(picUrl, msgId);
                } else {
                    //不为null时, 已经有相同的消息的，进入微信消息排重机制
                    //返回空字符，微信服务器不会对此作任何处理，并且不会发起重试
                    let text = '打分中~\n回复以下数字查看结果\n'+ msgId;
                    resp.reply(text);
                    return resp;
                }
            });
        }
    }
}

module.exports = {
    handler: handler
};