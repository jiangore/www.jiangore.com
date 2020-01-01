
/**
 * 微信公众号语音消息处理器
 * @type {encode}
 */

let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':wx-voiceMessage');

function handler(message, req, resp, next) {
    if (message.MsgType === 'voice') {
        echo(message);
        resp.reply({
            type: "voice",
            content: {
                mediaId: message.MediaId
            }
        });
        return resp;
    }
}

module.exports = {
    handler: handler
};