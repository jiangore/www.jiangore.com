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


function handler(message, req, resp, next) {
    if (message.MsgType === 'text') {
        //req.weixin == message
        //console.log(req.weixin);
        echo(message);

        //第1步 获取当前场景值，进入对应的处理流程
        let wxScene = req.wxsession.wxScene || '',
            content = message.Content || '';
        echo('输入内容:' + content);
        echo('当前场景:' + wxScene);

        //第2步 针对不同的关键词 设置不同的场景
        if (content == '0' || content == 'exit' || content == '退出') {
            //回到初始场景
            req.wxsession.wxScene = 1;
            wxScene = 1;
        }
        if (wxScene == '' && content == '小冰') {
            req.wxsession.wxScene = wxConstant.CHAT_ROBOT_SCENE_CODE;
            resp.reply('您想和我聊什么😍');
            return resp;
        }

        if (wxScene == '' && content == '颜值') {
            req.wxsession.wxScene = wxConstant.FACE_VALUE_SCENE_CODE;
            resp.reply('发一张你的靓照吧~');
            return resp;
        }
        if (wxScene == '' && content == '关系') {
            req.wxsession.wxScene = wxConstant.COUPLE_SCENE_CODE;
            resp.reply('发一张照片，至少有两人~');
            return resp;
        }
        if (wxScene == '' && content == '穿衣') {
            req.wxsession.wxScene = wxConstant.DRESS_SCENE_CODE;
            resp.reply('发一张你的靓照吧~');
            return resp;
        }
        if (wxScene == '' && content == '作诗') {
            req.wxsession.wxScene = wxConstant.POEM_SCENE_CODE
            resp.reply('发一张照片，喝口水的功夫作成一首诗~');
            return resp;
        }

        if (wxScene == '' && content == '音乐') {
            req.wxsession.wxScene = wxConstant.MUSIC_SCENE_CODE;

            let text = '回复[歌曲+歌曲名]\n';
            text += '回复[歌手+歌手名]\n';
            text += '关键词不带[]';
            resp.reply(text);
            return resp;
        }

        if (wxScene == '' && content == '格言') {
            req.wxsession.wxScene = wxConstant.MOTTO_SCENE_CODE;

            let text = '回复[a]：动画中的一段话\n';
            text += '回复[b]：漫画中的一段话\n';
            text += '回复[c]：游戏中的一段话\n';
            text += '回复[d]：小说中的一段话\n';
            text += '回复[e]：原创句子\n';
            text += '回复[f]：网络段子\n';
            text += '回复[g]：其他格言\n';
            text += '任意字符：随机一段话\n';
            text += '关键词不带[]';
            resp.reply(text);
            return resp;
        }

        if (wxScene == '' && content == '天气') {
            resp.reply([
                {
                    title: '天气预报',
                    description: '实况天气\n逐小时预报\n生活指数\n7天预报',
                    picUrl: 'https://mmbiz.qpic.cn/mmbiz_png/KP1N7xMkEdHicrywoTgEcqx2OM5ia0y58mtKznDvU475AxEZtTq3K6aYkrOXOhCHuDOtlgdKAuJEB0E0smxVZC6A/0?wx_fmt=png',
                    url: 'https://apip.weatherdt.com/h5.html?id=cdyLDqDf2v',
                }
            ]);
            return resp;
        }

        if (wxScene == '' && content == '翻译') {
            req.wxsession.wxScene = wxConstant.TRANSLATE_SCENE_CODE;
            let text = '';
            text += '回复[中英]：中文 -> 英语\n';
            text += '回复[中日]：中文 -> 日语\n';
            text += '回复[中韩]：中文 -> 韩语\n';
            text += '回复[中法]：中文 -> 法语\n';
            text += '回复[中俄]：中文 -> 俄语\n';
            text += '回复[英中]：英语 -> 中文\n';
            text += '回复[日中]：日语 -> 中文\n';
            text += '回复[韩中]：韩语 -> 中文\n';
            text += '回复[法中]：法语 -> 中文\n';
            text += '回复[俄中]：俄语 -> 中文\n';
            text += '关键词不带[]';
            resp.reply(text);
            return resp;
        }


        //第3步 针对不同的场景 进行不同的操作
        // 小冰聊天机器人
        if (wxScene == wxConstant.CHAT_ROBOT_SCENE_CODE) {
            chatRobot(message, req, resp);
        }

        // 颜值场景 (非文本消息 防止匹配不到 进行意外处理)
        if (wxScene == wxConstant.FACE_VALUE_SCENE_CODE) {
            // 获取颜值结果
            if (testMsgId(trim(content))) {
                let key = wxConstant.FACE_VALUE_REDIS_PREFIX + trim(content);
                redisUtil.get(key, (err, value) => {
                    if (err) {
                        resp.reply('😭 数据没找到，请确认您的识别码，或者再测一次~');
                        return resp;
                    }
                    let data = JSON.parse(value);
                    if (data.code == '1') {
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
        // CP场景 (非文本消息 防止匹配不到 进行意外处理)
        if (wxScene == wxConstant.COUPLE_SCENE_CODE) {
            // 获取颜值结果
            if (testMsgId(trim(content))) {
                let key = wxConstant.COUPLE_REDIS_PREFIX + trim(content);
                redisUtil.get(key, (err, value) => {
                    if (err) {
                        resp.reply('😭 数据没找到，请确认您的识别码，或者再测一次~');
                        return resp;
                    }
                    let data = JSON.parse(value);
                    if (data.code == '1') {
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
        // 穿衣场景 (非文本消息 防止匹配不到 进行意外处理)
        if (wxScene == wxConstant.DRESS_SCENE_CODE) {
            // 获取颜值结果
            if (testMsgId(trim(content))) {
                let key = wxConstant.DRESS_REDIS_PREFIX + trim(content);
                redisUtil.get(key, (err, value) => {
                    if (err) {
                        resp.reply('😭 数据没找到，请确认您的识别码，或者再测一次~');
                        return resp;
                    }
                    let data = JSON.parse(value);
                    if (data.code == '1') {
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
        // 作诗场景 (非文本消息 防止匹配不到 进行意外处理)
        if (wxScene == wxConstant.POEM_SCENE_CODE) {
            // 获取颜值结果
            if (testMsgId(trim(content))) {
                let key = wxConstant.POEM_REDIS_PREFIX + trim(content);
                redisUtil.get(key, (err, value) => {
                    if (err) {
                        resp.reply('😭 数据没找到，请确认您的识别码，或者再测一次~');
                        return resp;
                    }
                    let data = JSON.parse(value);
                    resp.reply(data.description);
                    return resp;
                });
            } else {
                // 意外处理
                wxScene = 1;
            }
        }

        //网易云音乐
        if (wxScene == wxConstant.MUSIC_SCENE_CODE) {
            getMusicList(message, req, resp);
        }

        //一言
        if (wxScene == wxConstant.MOTTO_SCENE_CODE) {
            motto(message, req, resp);
        }

        //翻译
        if (wxScene == wxConstant.TRANSLATE_SCENE_CODE) {
            //motto(message, req, resp);
            resp.reply('开发中~');
            return resp;
        }


        //第4步 当以上全部没有处理时 给予帮助提醒
        //需要把场景设为空, 等待匹配用户的下一个关键词
        if (wxScene == '' || wxScene == 1) {
            req.wxsession.wxScene = '';

            let text = '回复[小冰]：和智能机器人聊天~\n';
            text += '回复[颜值]：给你的Ta颜值评分~\n';
            text += '回复[关系]：合照里的CP秘密~\n';
            text += '回复[穿衣]：穿搭不能太任性~\n';
            text += '回复[作诗]：写诗，so easy~\n';
            text += '回复[天气]：实况天气&生活指数~\n';
            text += '回复[音乐]：发现你喜欢的音乐~\n';
            text += '回复[格言]：一句戳中你内心的话~\n';
            text += '回复[退出]：退出当前场景\n';
            text += '关键词不带[]';
            resp.reply(text);
            return resp;
        }


    }
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
function trim(str) {
    let trimLeft = /^\s+/,
        trimRight = /\s+$/;
    return str.replace(trimLeft, "").replace(trimRight, "");
}


/**
 * 微软小冰聊天机器人
 * @param message
 * @param req
 * @param resp
 */
function chatRobot(message, req, resp) {
    let xbUrl = 'https://www4.bing.com/socialagent/chat?q={msg}&anid=123456';
    let url = xbUrl.replace('{msg}', urlEncode(message.Content));

    axios
        .get(url)
        .then(function (response) {
            let data = response.data;
            //console.log(data))
            resp.reply(urlEncode.decode(data.InstantMessage.ReplyText));

        })
        .catch(function (error) {
            resp.reply('😭 服务维护中~');
        });
}

/**
 * 一言接口
 * @param message
 * @param req
 * @param resp
 */
function motto(message, req, resp) {
    let content = message.Content;
    let mottoUrl = 'https://v1.hitokoto.cn/?encode=json&charset=utf-8';
    if (content == 'a' || content == 'b' || content == 'c'
        || content == 'd' || content == 'e' || content == 'f' || content == 'g') {
        mottoUrl += '&c=' + content;
    }
    axios
        .get(mottoUrl)
        .then(function (response) {
            let data = response.data;
            resp.reply(data.hitokoto + '\n【' + data.from + '】');

        })
        .catch(function (error) {
            echo('一言接口调用失败');
            resp.reply('😭 服务维护中~');
        });
}

function getMusicList(message, req, resp) {
    let content = message.Content || '';
    let arr = content.split('+');
    if (content == '' || arr.length !=2 || (arr[0] != '歌曲' && arr[0] != '歌手') || arr[1] == '') {
        let text = '回复[歌曲+歌曲名]\n';
        text += '回复[歌手+歌手名]\n';
        text += '关键词不带[]';
        resp.reply(text);
        return resp;
    }

    let musicUrl = 'https://v1.hitokoto.cn/nm/search/'+urlEncode('大鱼')+'?type=SONG&offset=0&limit=8';
    if (arr[0] == '歌曲') {
        musicUrl = 'https://v1.hitokoto.cn/nm/search/'+urlEncode(arr[1])+'?type=SONG&offset=0&limit=8';
    }
    if (arr[0] == '歌手') {
        musicUrl = 'https://v1.hitokoto.cn/nm/search/'+urlEncode(arr[1])+'?type=ARTIST&offset=0&limit=8';
    }
    axios
        .get(musicUrl)
        .then(function (response) {
            let data = response.data;
            if (data.code == 200) {
                let list = data.result.songs;
                if (list.length == 0) {
                    resp.reply('😥 没有找到您要的歌曲~');
                } else {
                    let musics = [];
                    for (let i = 0; i < list.length; i++) {
                        let songName = list[i].name;
                        let artist = list[i].artists[0].name || '';
                        let album = list[i].album.name || '';
                        let image = list[i].artists[0].img1v1Url || '';
                        let url = 'https://v1.hitokoto.cn/nm/redirect/music/' + list[i].id;

                        musics.push({
                            title: songName,
                            description: '歌名: ' + songName + '\n歌手: ' + artist + '\n专辑: ' + album,
                            picUrl: image,
                            url: url,
                        });
                    }
                    resp.reply({type: 'news', content: musics});
                    return resp;
                }
            } else {
                resp.reply('😭 服务维护中~');
                return resp;
            }
        })
        .catch(function (error) {
            echo('网易云音乐接口调用失败');
            resp.reply('😭 服务维护中~');
            return resp;
        });
}


module.exports = {
    handler: handler
};