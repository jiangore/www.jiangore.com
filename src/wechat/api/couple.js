/**
 * 测cp接口
 * @type {module:fs}
 */
let echo = require("debug")('app:testCoupleApi');


const fs = require("fs");
const path = require("path");
const uPath = require('upath');
const urlEncode = require('urlencode');

const request = require('superagent');
const agent = request.agent();
const axios = require('axios');
const http = require('http');

const HOME_API = 'http://kan.msxiaobing.com/ImageGame/Portal?task=guanxi';
const FACE_API = 'http://kan.msxiaobing.com/Api/ImageAnalyze/Process?service=guanxi';
const IMAGE_API = 'http://kan.msxiaobing.com/Api/Image/UploadBase64';

let redisUtil = require('../../utils/redisUtil');
let wxConstant = require('../wxConstant');

class Couple {
    constructor(image, msgId) {
        this.image = image;
        this.msgId = msgId;
        this.init();
    }

    init() {
        image2Base64(this.image).then(data => {
            //console.log(data);
            return visitHome(data);
        }).then(data => {
            //console.log(data);
            return uploadImage(data);
        }).then(image => {
            //console.log(image);
            return getTestResult(image);
        }).then(content => {
            echo(content);
            let data = {
                code: '1',
                title: '小样儿，你的眼睛藏着秘密',
                description: content.text,
                picUrl: this.image,
                url: content.imageUrl
            };
            saveData(data, this.msgId);
        }).catch(error => {
            let data = {
                code: '0',
                title: '小样儿，你的眼睛藏着秘密',
                description: error
            };
            saveData(data, this.msgId);
        });
    }
}

/**
 * 保存CP数据
 * @param data
 */
function saveData(data, msgId) {
    let key = wxConstant.COUPLE_REDIS_PREFIX + msgId;
    let expire = wxConstant.COUPLE_REDIS_EXPIRE;

    redisUtil.set(key, JSON.stringify(data), (err) => {
        if (err) {
            echo('redis存储[key=' + key + ']CP数据失败。');
        }
        echo('redis存储[key=' + key + ']CP数据成功。');
    });
    redisUtil.expire(key, expire);
}




/**
 * 网络图片转base64
 * @param url
 * @returns {Promise<unknown>}
 */
function image2Base64(url) {
    return new Promise(function (resolve, reject) {
        let req = http.get(url, function (res) {
            //用于保存网络请求不断加载传输的缓冲数据
            let chunks = [];
            //保存缓冲数据的总长度
            let size = 0;
            res.on('data', function (chunk) {
                //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，
                chunks.push(chunk);
                //node会把接收到的数据片段逐段的保存在缓冲区（Buffer），
                //这些数据片段会形成一个个缓冲对象（即Buffer对象），
                //而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），
                //如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，
                //直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中，
                //利用下面的node.js内置的Buffer.concat()方法进行拼接

                //累加缓冲数据的长度
                size += chunk.length;
            });
            res.on('end', function (err) {
                //Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
                let data = Buffer.concat(chunks, size);
                //可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
                //console.log(Buffer.isBuffer(data));
                //将Buffer对象转换为字符串并以base64编码格式显示
                let base64Img = data.toString('base64');

                //进入终端terminal,然后进入index.js所在的目录，
                //console.log(base64Img);　　
                resolve(base64Img);
            });
        });
        req.on('error', function (e) {
            reject('维护中~');
        });
    });
}

/**
 * 访问首页，check接口是否可用
 * @param url
 * @returns {Promise<unknown>}
 */
function visitHome(data) {
    return new Promise(function (resolve, reject) {
        agent
            .get(HOME_API).end(function (err, res) {
            if (err) {
                reject('维护中~');
            }
            if (res.statusCode != 200) {
                reject('维护中~');
            }

            resolve(data);
        });
    });
}

/**
 * 上传2进制图片到微软小冰
 * @param url
 * @param binary
 * @returns {Promise<unknown>}
 */
function uploadImage(binary) {
    return new Promise(function (resolve, reject) {
        agent
            .post(IMAGE_API)
            .set('Content-Type', 'multipart/form-data')
            .send(binary)
            .end(function (err, res) {
                if (err) {
                    reject('维护中~');
                }
                if (res.statusCode != 200) {
                    reject('维护中~');
                }

                resolve(res.body.Host + res.body.Url);
            });
    });
}

/**
 * 测试结果
 * @param data
 * @returns {Promise<unknown>}
 */
function getTestResult(data) {
    return new Promise(function (resolve, reject) {
        agent
            .post(FACE_API)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Referer', HOME_API)
            .set('User-Agent', 'Python-urllib/2.7')
            .set('Connection', 'close')
            .send('MsgId=' + (new Date()).getTime())
            .send('CreateTime=' + (new Date()).getTime())
            .send('Content[imageUrl]=' + data)
            .end((err, res) => {
                if (err) {
                    reject(err);
                }
                if (res.statusCode != 200) {
                    reject('维护中~');
                }
                //封装返回的数据
                //console.log(res);
                resolve(res.body.content);
            });
    });
}

module.exports = Couple;

