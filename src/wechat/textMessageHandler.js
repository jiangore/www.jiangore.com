
/**
 * 微信公众号文本消息处理器
 * @type {encode}
 */

let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':wx-textMessage');

const urlEncode = require('urlencode');
const axios = require('axios');

let redisUtil = require('../utils/redisUtil');
let wxConstant = require('./wxConstant');

let xbUrl = 'https://www4.bing.com/socialagent/chat?q={msg}&anid=123456';

function handler(message, req, resp, next) {
    if (message.MsgType === 'text') {
        //req.weixin == message
        //console.log(req.weixin);
        echo(message);

        //第1步 获取当前场景值，进入对应的处理流程
        let wxScene= req.wxsession.wxScene || '',
            content = message.Content || '';
        echo('输入内容:'+content);
        echo('当前场景:'+wxScene);

        //第2步 针对不同的关键词 设置不同的场景
        if (content == '0' || content == 'exit' || content == '退出') {
            //回到初始场景
            req.wxsession.wxScene = 1;
            wxScene = 1;
        }
        if (wxScene == '' && message.Content == '小冰') {
            req.wxsession.wxScene = wxConstant.CHAT_ROBOT_SCENE_CODE;
            resp.reply('您想和我聊什么😍');
            return resp;
        }
        if (wxScene == '' && message.Content == '颜值') {
            req.wxsession.wxScene = wxConstant.FACE_VALUE_SCENE_CODE;
            resp.reply('发送一张你的靓照吧！');
            return resp;
        }

        //第3步 针对不同的场景 进行不同的操作
        if (wxScene == wxConstant.CHAT_ROBOT_SCENE_CODE) {
            chatRobot(message, req, resp);
        }

        // 颜值场景 (非文本消息 防止匹配不到 进行意外处理)
        if (wxScene == wxConstant.FACE_VALUE_SCENE_CODE) {
            // 获取颜值结果
            if (testMsgId(trim(content))) {
                let key = wxConstant.FACE_VALUE_REDIS_PREFIX + trim(content);
                redisUtil.get(key, (err, value) => {
                    if(err) {
                        resp.reply('😭 数据没找到，请确认您的识别码，或者再测一次~');
                        return resp;
                    }
                    let data = JSON.parse(value);
                    if(data.code == '1') {
                        resp.reply([
                            {
                                title: data.title,
                                description: data.description,
                                picUrl: data.picUrl,
                                url: data.url,
                            }
                        ]);
                        return resp;
                    } else {
                        resp.reply('😭 数据没找到，请确认您的识别码，或者再测一次~');
                        return resp;
                    }
                });
            } else {
                // 意外处理
                wxScene = 1;
            }
        }

        //第4步 当以上全部没有处理时 给予帮助提醒
        //需要把场景设为空, 等待匹配用户的下一个关键词
        if (wxScene == '' || wxScene == 1) {
            req.wxsession.wxScene = '';
            resp.reply('回复[小冰]：和智能机器人聊天\n回复[颜值]：给的颜值评分\n回复[退出]：退出当前场景\n关键词不带[]');
            return resp;
        }


    }
}

function handler2(message, req, resp, next) {
    let a = 2;
    if (a == 1) {
        resp.reply('第1条');
        return resp;
    }

    if (a == 2) {
        resp.reply('第2条');
        return resp;
    }

    if (a == 3) {
        resp.reply('第3条');
        return resp;
    }
}

/**
 * 微软小冰聊天机器人
 * @param message
 * @param req
 * @param resp
 */
function chatRobot(message, req, resp) {
    let url = xbUrl.replace('{msg}', urlEncode(message.Content));

    axios
        .get(url)
        .then(function (response) {
            let data = response.data;
            //console.log(data))
            resp.reply(urlEncode.decode(data.InstantMessage.ReplyText));

        })
        .catch(function (error) {
            resp.reply('休息中~');
        });
}


/**
 * 正则表达式 匹配微信消息id
 * @param msgId
 * @returns {boolean}
 */
function testMsgId(msgId) {
    let pattern = /^\d{16,18}$/;
    return pattern.test(msgId);
}

/**
 * 正则表达式 去掉字符串两侧空字符
 * @param str
 * @returns {string}
 */
function trim(str){
    let trimLeft = /^\s+/,
        trimRight = /\s+$/;
    return str.replace( trimLeft, "" ).replace( trimRight, "" );
}



module.exports = {
    handler: handler
};