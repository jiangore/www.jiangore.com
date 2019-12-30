
const request = require("superagent");
const cheerio = require("cheerio");


request
    .get('http://wufazhuce.com/')
    .then(resp => {

        let $ = cheerio.load(resp.text);
        let selectItem = $('#carousel-one .carousel-inner .item');
        let todayOne = selectItem[0];
        let todayOneData = {
            imgUrl: $(todayOne).find('.fp-one-imagen').attr('src'),
            type: $(todayOne).find('.fp-one-imagen-footer').text().replace(/(^\s*)|(\s*$)/g, ""),
            text: $(todayOne).find('.fp-one-cita').text().replace(/(^\s*)|(\s*$)/g, "")
        }
        console.log(todayOneData)
    })
    .catch(err => {
        console.error(err);
    });


