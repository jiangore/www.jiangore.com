
/**
 * 微信公众号事件处理器
 * @type {encode}
 */

let app_name = process.env.APP_NAME || 'app';
let echo = require('debug')(app_name+':wx-eventMessage');


function handler(message, req, resp, next) {
    console.log(message);
    if (message.MsgType === 'event') {
        if (message.Event == 'subscribe') {
            let text = '感谢关注爱吃的桃子 😀 \n';
            text += '想和智能机器人聊天吗？\n';
            text += '想给你的Ta颜值打分吗？\n';
            text += '想揪出合照里的CP吗？\n';
            text += '更多功能，等你来体验\n';
            text += '还在等什么，回复任意内容，开启一场奇妙的旅程~';
            resp.reply(text);
            return resp;
        }
        resp.reply('你好');
        return resp;
    }

}

module.exports = {
    handler: handler
};