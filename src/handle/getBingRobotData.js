
const urlEncode = require('urlencode');
const params = require('../params');
const apiUrl = require('../apiUrl');

const request = require("superagent");
const axios = require('axios');

module.exports = (msg, res) => {
    let ai_url = apiUrl.AI_XB_URL;
    ai_url = ai_url.replace('{msg}', urlEncode(msg));

    axios
        .get(ai_url)
        .then(function (response) {
            let data = response.data;
            //console.log(data);
            //console.log(urlEncode.decode(data.InstantMessage.ReplyText))
            res.reply(urlEncode.decode(data.InstantMessage.ReplyText));

        })
        .catch(function (error) {
           // console.log(error.data);
            res.reply('小冰听不懂😄');
        });
};



