
let crypto = require("crypto");
let express = require('express');
let router = express.Router();

let config = {
    "appID": "wxfda049f90ac6b5f4",
    "appsecret": "f205f912a393cc2fe54d5c102a3c8a51",
    "token": "dandelionNote"
}

router.get('/validate', (req, res, next) => {
    //1. 获取微信服务器发送的数据
    let signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        echostr = req.query.echostr;

    /**
     * 2. 步骤
     * 1）将token、timestamp、nonce三个参数进行字典序排序
     * 2）将三个参数字符串拼接成一个字符串进行sha1加密
     * 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
     */
    let str = [config.token, timestamp, nonce].sort().join('');
    let newStr = sha1(str);

    /**
     * 3. 和微信返回签名比较
     */
    if (newStr == signature) {
        res.send(echostr);
    } else  {
        res.send('mismatch');
    }
});
let sha1 = function(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
};

module.exports = router;